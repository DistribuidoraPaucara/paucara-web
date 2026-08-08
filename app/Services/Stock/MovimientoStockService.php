<?php

namespace App\Services\Stock;

use App\Models\StockProducto;
use App\Models\MovimientoInventario;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use Exception;

/**
 * Servicio de movimiento de stock - ORQUESTACIÓN CENTRAL
 *
 * Este es el ÚNICO lugar donde se modifica stock_productos
 * Garantiza que:
 * 1. Movimientos y stock se actualizan ATÓMICAMENTE (Transacción)
 * 2. Se previenen race conditions (lockForUpdate)
 * 3. Se validan todas las reglas antes de ejecutar
 * 4. Se registra auditoría completa
 */
class MovimientoStockService
{
    public function __construct(
        private StockValidationService $validacion
    ) {}

    /**
     * Registrar movimiento Y actualizar stock (ATÓMICO)
     *
     * Este método SIEMPRE actualiza stock_productos cuando registra un MovimientoInventario
     * Las dos operaciones son inseparables para mantener consistencia
     *
     * @param int $stockProductoId
     * @param int $cantidad Positivo: suma, Negativo: resta
     * @param string $tipo Tipo de movimiento (PROFORMA, VENTA_DIRECTA, etc)
     * @param string $referencia_tipo Qué originó el movimiento (proforma, venta, etc)
     * @param int $referencia_id ID de la proforma, venta, etc
     * @param array $metadataAdicional Datos adicionales para auditoría
     * @throws InvalidArgumentException Si no hay suficiente stock
     * @throws Exception Si hay inconsistencia en datos
     */
    public function registrarMovimientoYActualizar(
        int $stockProductoId,
        int $cantidad,
        string $tipo,
        string $referencia_tipo,
        int $referencia_id,
        array $metadataAdicional = [],
        ?string $numeroDocumento = null  // ✅ NUEVO (2026-06-09): Número del documento para auditoría
    ): MovimientoInventario {
        try {
            return DB::transaction(function () use (
                $stockProductoId,
                $cantidad,
                $tipo,
                $referencia_tipo,
                $referencia_id,
                $metadataAdicional,
                $numeroDocumento
            ) {
                // 1️⃣ Obtener stock actual CON LOCK (evita race conditions)
                $stock = StockProducto::lockForUpdate()->find($stockProductoId);

                if (!$stock) {
                    throw new Exception("Stock no encontrado: {$stockProductoId}");
                }

                // 2️⃣ Validar que la operación es posible ANTES de ejecutar
                $this->validacion->validarOperacionPosible($stock, $cantidad, $tipo);

                // 3️⃣ Guardar estado ANTERIOR (para auditoría)
                $cantidadAnterior = (int)$stock->cantidad;
                $reservadaAnterior = (int)$stock->cantidad_reservada;
                $disponibleAnterior = (int)$stock->cantidad_disponible;

                // ✅ NUEVO (2026-06-28): Capturar TOTALES del producto ANTES (centralizado)
                $totalesAntes = $this->capturarTotalesDelProducto($stock->producto_id, $stock->almacen_id);

                // 4️⃣ Calcular nuevo estado según TIPO DE TRANSACCIÓN
                $nuevoTotal = $cantidadAnterior;
                $nuevaReservada = $reservadaAnterior;
                $nuevaDisponible = $disponibleAnterior;

                // ⚠️ LÓGICA POR TIPO (AQUÍ ESTÁ EL CORE)
                match ($tipo) {
                    MovimientoInventario::TIPO_RESERVA_PROFORMA => $this->aplicarReservaProforma(
                        $cantidad,
                        $nuevoTotal,
                        $nuevaReservada,
                        $nuevaDisponible
                    ),

                    MovimientoInventario::TIPO_LIBERACION_RESERVA => $this->aplicarLiberacionReserva(
                        $cantidad,
                        $nuevoTotal,
                        $nuevaReservada,
                        $nuevaDisponible
                    ),

                    MovimientoInventario::TIPO_SALIDA_VENTA => $this->aplicarVentaDirecta(
                        $cantidad,
                        $nuevoTotal,
                        $nuevaReservada,
                        $nuevaDisponible
                    ),

                    MovimientoInventario::TIPO_CONSUMO_RESERVA => $this->aplicarVentaConsumo(
                        $cantidad,
                        $nuevoTotal,
                        $nuevaReservada,
                        $nuevaDisponible
                    ),

                    // ✅ NUEVO: Comidas - Solo seguimiento, NO descuentan stock
                    MovimientoInventario::TIPO_SALIDA_COMIDA,
                    MovimientoInventario::TIPO_SALIDA_COMIDA_SIN_STOCK => $this->aplicarSeguimientoComida(
                        $cantidad,
                        $nuevoTotal,
                        $nuevaReservada,
                        $nuevaDisponible
                    ),

                    // ✅ ENTRADAS: Aumentan el stock total
                    MovimientoInventario::TIPO_ENTRADA_AJUSTE,
                    MovimientoInventario::TIPO_ENTRADA_COMPRA,
                    MovimientoInventario::TIPO_ENTRADA_DEVOLUCION,
                    MovimientoInventario::TIPO_AJUSTE_MASIVO => $this->aplicarEntrada(  // ✅ NUEVO (2026-08-07): Ajuste masivo
                        $cantidad,
                        $nuevoTotal,
                        $nuevaReservada,
                        $nuevaDisponible
                    ),

                    default => throw new Exception("Tipo de movimiento desconocido: {$tipo}"),
                };

                // 5️⃣ VALIDAR ANTES y DESPUÉS para asegurar integridad en ambos estados
                // ✅ NUEVO (2026-06-09): Validar estado anterior también
                $this->validacion->validarStock((object) [
                    'id' => $stock->id,
                    'cantidad' => $cantidadAnterior,
                    'cantidad_reservada' => $reservadaAnterior,
                    'cantidad_disponible' => $disponibleAnterior,
                ]);

                // Validar estado posterior
                $this->validacion->validarStock((object) [
                    'id' => $stock->id,
                    'cantidad' => $nuevoTotal,
                    'cantidad_reservada' => $nuevaReservada,
                    'cantidad_disponible' => $nuevaDisponible,
                ]);

                // 6️⃣ ACTUALIZAR stock_productos
                $stock->update([
                    'cantidad' => $nuevoTotal,
                    'cantidad_reservada' => $nuevaReservada,
                    'cantidad_disponible' => $nuevaDisponible,
                ]);

                // ✅ NUEVO (2026-06-09): Verificar que los valores se actualizaron correctamente
                // Re-leer desde BD para confirmar que la actualización fue exitosa
                $stockActualizado = StockProducto::findOrFail($stockProductoId);

                // ✅ NUEVO (2026-06-28): Capturar TOTALES del producto DESPUÉS (centralizado)
                $totalesDespues = $this->capturarTotalesDelProducto($stock->producto_id, $stock->almacen_id);

                if (
                    (int) $stockActualizado->cantidad !== $nuevoTotal ||
                    (int) $stockActualizado->cantidad_reservada !== $nuevaReservada ||
                    (int) $stockActualizado->cantidad_disponible !== $nuevaDisponible
                ) {
                    throw new Exception(
                        "❌ INCONSISTENCIA CRÍTICA: Valores calculados NO coinciden con BD después de actualizar. " .
                        "Esperado: total={$nuevoTotal}, res={$nuevaReservada}, disp={$nuevaDisponible}. " .
                        "Obtenido: total={$stockActualizado->cantidad}, res={$stockActualizado->cantidad_reservada}, disp={$stockActualizado->cantidad_disponible}"
                    );
                }

                Log::info("✅ Stock actualizado y VERIFICADO", [
                    'stock_id' => $stock->id,
                    'tipo' => $tipo,
                    'antes' => [
                        'total' => $cantidadAnterior,
                        'reservada' => $reservadaAnterior,
                        'disponible' => $disponibleAnterior,
                    ],
                    'después' => [
                        'total' => $nuevoTotal,
                        'reservada' => $nuevaReservada,
                        'disponible' => $nuevaDisponible,
                    ],
                    'verificacion' => [
                        'total_coincide' => (int) $stockActualizado->cantidad === $nuevoTotal,
                        'reservada_coincide' => (int) $stockActualizado->cantidad_reservada === $nuevaReservada,
                        'disponible_coincide' => (int) $stockActualizado->cantidad_disponible === $nuevaDisponible,
                    ],
                    'cambio' => $cantidad,
                ]);

                // 7️⃣ REGISTRAR movimiento con estados ANTES y DESPUÉS

                // ✅ NUEVO (2026-06-09): Validar que los datos ANTES cumplan la invariante
                // Verificar: cantidad_anterior = disponible_anterior + reservada_anterior
                if ($cantidadAnterior !== ($disponibleAnterior + $reservadaAnterior)) {
                    throw new Exception(
                        "❌ INCONSISTENCIA EN DATOS ANTERIORES: " .
                        "cantidad_anterior({$cantidadAnterior}) ≠ disponible_anterior({$disponibleAnterior}) + reservada_anterior({$reservadaAnterior})"
                    );
                }

                // ✅ NUEVO (2026-06-09): Validar que los datos DESPUÉS cumplan la invariante
                // Verificar: cantidad_posterior = disponible_posterior + reservada_posterior
                if ($nuevoTotal !== ($nuevaDisponible + $nuevaReservada)) {
                    throw new Exception(
                        "❌ INCONSISTENCIA EN DATOS POSTERIORES: " .
                        "cantidad_posterior({$nuevoTotal}) ≠ disponible_posterior({$nuevaDisponible}) + reservada_posterior({$nuevaReservada})"
                    );
                }

                // ✅ NUEVO (2026-06-09): Construir observación descriptiva
                $observacion = $this->construirObservacion(
                    $tipo,
                    $referencia_tipo,
                    $referencia_id,
                    $cantidad,
                    $cantidadAnterior,
                    $nuevoTotal,
                    $reservadaAnterior,
                    $nuevaReservada,
                    $metadataAdicional
                );

                $movimiento = MovimientoInventario::create([
                    'stock_producto_id' => $stockProductoId,
                    'cantidad' => $cantidad,
                    // ✅ LOTE ESPECÍFICO (valores del lote individual)
                    'cantidad_anterior' => $cantidadAnterior,
                    'cantidad_posterior' => $nuevoTotal,
                    'cantidad_disponible_anterior' => $disponibleAnterior,
                    'cantidad_disponible_posterior' => $nuevaDisponible,
                    'cantidad_reservada_anterior' => $reservadaAnterior,
                    'cantidad_reservada_posterior' => $nuevaReservada,
                    // ✅ NUEVO (2026-06-28): TOTALES de TODOS los lotes (centralizado)
                    'cantidad_total_anterior' => $totalesAntes['cantidad_total'],
                    'cantidad_total_posterior' => $totalesDespues['cantidad_total'],
                    'disponible_total_anterior' => $totalesAntes['disponible_total'],
                    'disponible_total_posterior' => $totalesDespues['disponible_total'],
                    'reservada_total_anterior' => $totalesAntes['reservada_total'],
                    'reservada_total_posterior' => $totalesDespues['reservada_total'],
                    // ✅ Metadatos de auditoría
                    'tipo' => $tipo,
                    'numero_documento' => $numeroDocumento,
                    'referencia_tipo' => $referencia_tipo,
                    'referencia_id' => $referencia_id,
                    'user_id' => Auth::id(),
                    'observacion' => $observacion,
                    'metadata' => !empty($metadataAdicional) ? json_encode($metadataAdicional) : null,
                ]);

                Log::info("✅ Movimiento registrado", [
                    'stock_id' => $stockProductoId,
                    'tipo' => $tipo,
                    'referencia' => "{$referencia_tipo}:{$referencia_id}",
                    'cantidad' => $cantidad,
                ]);

                return $movimiento;
            });

        } catch (InvalidArgumentException $e) {
            Log::warning("⚠️ Validación rechazada", [
                'stock_id' => $stockProductoId,
                'tipo' => $tipo,
                'error' => $e->getMessage(),
            ]);
            throw $e;

        } catch (Exception $e) {
            Log::error("❌ Error registrando movimiento", [
                'stock_id' => $stockProductoId,
                'tipo' => $tipo,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * ✅ NUEVO (2026-06-28): Capturar TOTALES de todos los lotes (centralizado)
     *
     * Este método calcula la suma de cantidad, disponible y reservada de TODOS los lotes
     * del producto en el almacén. Se usa antes y después de cada operación.
     *
     * @param int $productoId ID del producto
     * @param int $almacenId ID del almacén
     * @return array [
     *   'cantidad_total' => float,
     *   'disponible_total' => float,
     *   'reservada_total' => float,
     * ]
     */
    public function capturarTotalesDelProducto(int $productoId, int $almacenId): array
    {
        try {
            // ✅ NUEVO (2026-06-28): Usar raw query con SUM para obtener totales de TODOS los lotes
            $totales = DB::table('stock_productos')
                ->where('producto_id', $productoId)
                ->where('almacen_id', $almacenId)
                ->where('deleted_at', null)
                ->selectRaw('
                    SUM(CAST(cantidad AS DECIMAL(15,6))) as cantidad_total,
                    SUM(CAST(cantidad_disponible AS DECIMAL(15,6))) as disponible_total,
                    SUM(CAST(cantidad_reservada AS DECIMAL(15,6))) as reservada_total
                ')
                ->first();

            // Log detallado para debugging
            Log::debug('📊 [capturarTotalesDelProducto] Totales capturados', [
                'producto_id' => $productoId,
                'almacen_id' => $almacenId,
                'totales_objeto' => $totales,
                'cantidad_total' => $totales?->cantidad_total,
                'disponible_total' => $totales?->disponible_total,
                'reservada_total' => $totales?->reservada_total,
                'stock_count' => StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacenId)
                    ->count(),
            ]);

            return [
                'cantidad_total' => (float) ($totales?->cantidad_total ?? 0),
                'disponible_total' => (float) ($totales?->disponible_total ?? 0),
                'reservada_total' => (float) ($totales?->reservada_total ?? 0),
            ];
        } catch (\Exception $e) {
            Log::error('❌ Error capturando totales del producto', [
                'producto_id' => $productoId,
                'almacen_id' => $almacenId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'cantidad_total' => 0,
                'disponible_total' => 0,
                'reservada_total' => 0,
            ];
        }
    }

    /**
     * Validar si hay suficiente stock para una operación
     *
     * @param int $stockProductoId
     * @param int $cantidad Cantidad a mover
     * @param string $tipo Tipo de movimiento
     * @return bool
     */
    public function validarDisponibilidad(
        int $stockProductoId,
        int $cantidad,
        string $tipo
    ): bool {
        $stock = StockProducto::find($stockProductoId);

        if (!$stock) {
            return false;
        }

        try {
            $this->validacion->validarOperacionPosible($stock, $cantidad, $tipo);
            return true;
        } catch (InvalidArgumentException) {
            return false;
        }
    }

    /**
     * Obtener estado actual del stock
     *
     * @param int $stockProductoId
     * @return array|null
     */
    public function obtenerEstadoActual(int $stockProductoId): ?array
    {
        $stock = StockProducto::find($stockProductoId);

        if (!$stock) {
            return null;
        }

        return [
            'id' => $stock->id,
            'producto_id' => $stock->producto_id,
            'almacen_id' => $stock->almacen_id,
            'cantidad_total' => $stock->cantidad,
            'cantidad_reservada' => $stock->cantidad_reservada,
            'cantidad_disponible' => $stock->cantidad_disponible,
            'suma_check' => ($stock->cantidad_reservada + $stock->cantidad_disponible) === (int)$stock->cantidad,
        ];
    }

    /**
     * Obtener historial de movimientos de un stock
     *
     * @param int $stockProductoId
     * @param int $limit
     * @return mixed
     */
    public function obtenerHistorial(int $stockProductoId, int $limit = 50)
    {
        return MovimientoInventario::where('stock_producto_id', $stockProductoId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    // ==================== MÉTODOS PRIVADOS DE LÓGICA ====================

    /**
     * Aplicar lógica de Reserva para Proforma
     * Reduce disponible, aumenta reservada (total no cambia)
     */
    private function aplicarReservaProforma(
        int $cantidad,
        int &$nuevoTotal,
        int &$nuevaReservada,
        int &$nuevaDisponible
    ): void {
        $cantidadAReservar = abs($cantidad);
        $nuevaReservada += $cantidadAReservar;
        $nuevaDisponible -= $cantidadAReservar;
        // Total NO cambia
    }

    /**
     * Aplicar lógica de Liberación de Reserva
     * Aumenta disponible, reduce reservada (total no cambia)
     */
    private function aplicarLiberacionReserva(
        int $cantidad,
        int &$nuevoTotal,
        int &$nuevaReservada,
        int &$nuevaDisponible
    ): void {
        $cantidadALiberar = abs($cantidad);
        $nuevaReservada -= $cantidadALiberar;
        $nuevaDisponible += $cantidadALiberar;
        // Total NO cambia
    }

    /**
     * Aplicar lógica de Venta Directa
     * Reduce total y disponible (reservado no cambia)
     */
    private function aplicarVentaDirecta(
        int $cantidad,
        int &$nuevoTotal,
        int &$nuevaReservada,
        int &$nuevaDisponible
    ): void {
        $cantidadAVender = abs($cantidad);
        $nuevoTotal -= $cantidadAVender;
        $nuevaDisponible -= $cantidadAVender;
        // Reservado NO cambia
    }

    /**
     * Aplicar lógica de Venta por Consumo
     * Reduce total y reservado (disponible no cambia)
     */
    private function aplicarVentaConsumo(
        int $cantidad,
        int &$nuevoTotal,
        int &$nuevaReservada,
        int &$nuevaDisponible
    ): void {
        $cantidadAConsumir = abs($cantidad);
        $nuevoTotal -= $cantidadAConsumir;
        $nuevaReservada -= $cantidadAConsumir;
        // Disponible NO cambia
    }

    /**
     * ✅ NUEVO (2026-06-09): Aplicar lógica de Entrada (Compra/Ajuste/Devolución)
     * Aumenta total y disponible (reservado no cambia)
     */
    private function aplicarEntrada(
        int $cantidad,
        int &$nuevoTotal,
        int &$nuevaReservada,
        int &$nuevaDisponible
    ): void {
        $cantidadAEntrar = abs($cantidad);
        $nuevoTotal += $cantidadAEntrar;
        $nuevaDisponible += $cantidadAEntrar;
        // Reservado NO cambia
    }

    /**
     * ✅ NUEVO (2026-06-09): Construir observación descriptiva para el movimiento
     * Genera un JSON con información clara sobre qué ocurrió
     */
    private function construirObservacion(
        string $tipo,
        string $referencia_tipo,
        int $referencia_id,
        int $cantidad,
        int $cantidadAnterior,
        int $cantidadPosterior,
        int $reservadaAnterior,
        int $reservadaPosterior,
        array $metadataAdicional = []
    ): string {
        $observacion = [
            'evento' => $this->obtenerDescripcionTipo($tipo),
            'tipo_movimiento' => $tipo,
            'referencia_tipo' => $referencia_tipo,
            'referencia_id' => $referencia_id,
            'cantidad_cambio' => $cantidad,
            'totales' => [
                'cantidad_anterior' => $cantidadAnterior,
                'cantidad_posterior' => $cantidadPosterior,
                'reservada_anterior' => $reservadaAnterior,
                'reservada_posterior' => $reservadaPosterior,
            ],
            'timestamp' => now()->toIso8601String(),
        ];

        // Agregar metadatos personalizados
        if (!empty($metadataAdicional)) {
            $observacion['metadata'] = $metadataAdicional;
        }

        return json_encode($observacion, JSON_UNESCAPED_UNICODE);
    }

    /**
     * ✅ NUEVO: Aplicar seguimiento de comida - NO modifica stock
     * Solo registra auditoría sin cambiar cantidades
     */
    private function aplicarSeguimientoComida(
        int $cantidad,
        int &$nuevoTotal,
        int &$nuevaReservada,
        int &$nuevaDisponible
    ): void {
        // ✅ NO hacer nada: mantener valores anteriores
        // La cantidad se registra en metadatos para auditoría
        // pero no modifica stock_productos
    }

    /**
     * ✅ NUEVO (2026-06-09): Obtener descripción legible del tipo de movimiento
     */
    private function obtenerDescripcionTipo(string $tipo): string
    {
        return match ($tipo) {
            MovimientoInventario::TIPO_RESERVA_PROFORMA => 'Reserva de proforma',
            MovimientoInventario::TIPO_LIBERACION_RESERVA => 'Liberación de reserva',
            MovimientoInventario::TIPO_SALIDA_VENTA => 'Venta directa (sin proforma)',
            MovimientoInventario::TIPO_CONSUMO_RESERVA => 'Consumo de reserva (conversión a venta)',
            MovimientoInventario::TIPO_SALIDA_COMIDA => 'Venta de comida (sin descuento de stock)',
            MovimientoInventario::TIPO_SALIDA_COMIDA_SIN_STOCK => 'Venta de comida sin stock disponible',
            MovimientoInventario::TIPO_AJUSTE_MASIVO => 'Ajuste masivo de stock (carga CSV)', // ✅ NUEVO (2026-08-07)
            default => $tipo,
        };
    }
}
