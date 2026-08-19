<?php

namespace App\Services\Prestamos;

use App\Models\AlmacenPrestable;
use App\Models\PrestamoProveedor;
use App\Models\PrestamoProveedorDetalle;
use App\Models\PrestamoProveedorAlmacen;
use App\Models\DevolucionProveedor;
use App\Models\DevolucionProveedorDetalle;
use App\Models\PrestableStock;
use App\Services\MovimientoPrestableService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * PrestamoProveedorService
 *
 * Gestiona préstamos y compras de canastillas/embases de proveedores
 */
class PrestamoProveedorService
{
    private PrestableStockService $stockService;
    private MovimientoPrestableService $movimientoService;

    public function __construct(PrestableStockService $stockService, MovimientoPrestableService $movimientoService)
    {
        $this->stockService = $stockService;
        $this->movimientoService = $movimientoService;
    }

    /**
     * ✅ NUEVO: Validar que no se devuelve más de lo prestado POR CADA ALMACÉN
     * Consulta PrestamoProveedorAlmacen (prestado) vs DevolucionProveedorDetalleAlmacen (devuelto)
     *
     * @param PrestamoProveedorDetalle $detalle Detalle del préstamo
     * @param array $devolucionesAlmacenes Array con las devoluciones por almacén
     * @throws \Exception Si algún almacén excede lo prestado
     */
    private function validarDevolucionPorAlmacen(PrestamoProveedorDetalle $detalle, array $devolucionesAlmacenes): void
    {
        foreach ($devolucionesAlmacenes as $almacenDev) {
            $almacenId = (int) $almacenDev['almacenes_prestables_id'];
            $cantDevAlmacen = (int) ($almacenDev['cantidad_devuelta'] ?? 0);
            $cantDanAlmacen = (int) ($almacenDev['cantidad_dañada_total'] ?? 0);
            $cantTotalAlmacen = $cantDevAlmacen + $cantDanAlmacen;

            // Cantidad prestada de ESTE almacén específico
            $cantidadPrestadaAlmacen = (int) PrestamoProveedorAlmacen::where('prestamo_proveedor_detalle_id', $detalle->id)
                ->where('almacenes_prestables_id', $almacenId)
                ->value('cantidad') ?? 0;

            if ($cantidadPrestadaAlmacen === 0) {
                throw new \Exception(
                    "❌ Almacén {$almacenId} no fue usado para prestar el detalle {$detalle->id}. " .
                    "No se puede devolver de un almacén del cual no se prestó."
                );
            }

            // Cantidad DEVUELTA de ESTE almacén específico (en devoluciones anteriores)
            $cantidadDevueltaAlmacen = (int) DB::table('devolucion_proveedor_detalle_almacen as dpda')
                ->join('devolucion_proveedor_detalle as dpd', 'dpda.devolucion_proveedor_detalle_id', '=', 'dpd.id')
                ->where('dpd.prestamo_proveedor_detalle_id', $detalle->id)
                ->where('dpda.almacenes_prestables_id', $almacenId)
                ->sum(DB::raw('dpda.cantidad_devuelta + dpda.cantidad_dañada_total'));

            // Cantidad que FALTA devolver de este almacén
            $faltaPorDevolverAlmacen = $cantidadPrestadaAlmacen - $cantidadDevueltaAlmacen;

            // Validar que NO se devuelve más de lo que falta
            if ($cantTotalAlmacen > $faltaPorDevolverAlmacen) {
                throw new \Exception(
                    "❌ Devolución excede lo faltante para almacén {$almacenId} en detalle {$detalle->id}: " .
                    "Prestado: {$cantidadPrestadaAlmacen}, " .
                    "Ya devuelto: {$cantidadDevueltaAlmacen}, " .
                    "Falta: {$faltaPorDevolverAlmacen}, " .
                    "Intenta devolver ahora: {$cantTotalAlmacen}"
                );
            }

            \Log::info('✅ Validación por almacén correcta (Proveedor)', [
                'detalle_id' => $detalle->id,
                'almacen_id' => $almacenId,
                'cantidad_prestada_almacen' => $cantidadPrestadaAlmacen,
                'cantidad_ya_devuelta_almacen' => $cantidadDevueltaAlmacen,
                'cantidad_falta_devolver' => $faltaPorDevolverAlmacen,
                'cantidad_devolviendo_ahora' => $cantTotalAlmacen,
            ]);
        }
    }

    /**
     * Calcular devoluciones automáticas por almacén si devolucion_automatica = true
     * Distribuye secuencialmente: termina un almacén antes de pasar al siguiente
     *
     * @param array $detalleData Datos del detalle de devolución
     * @param PrestamoProveedor $prestamo Préstamo asociado
     * @return array Array de almacenes con cantidades calculadas
     */
    private function calcularDevolucionesAutomaticas(array $detalleData, PrestamoProveedor $prestamo): array
    {
        // ✅ SIEMPRE calcular automáticamente basado en PrestamoProveedorAlmacen
        // Ignorar lo que venga del frontend para asegurar correcta distribución FIFO

        $cantidadDevuelta = $detalleData['cantidad_devuelta'] ?? 0;
        $cantidadDañadaTotal = $detalleData['cantidad_dañada_total'] ?? 0;
        $detalleId = $detalleData['prestamo_proveedor_detalle_id'];

        // ✅ CORREGIDO: Obtener almacenes correctamente desde PrestamoProveedorAlmacen
        $almacenesPrestados = PrestamoProveedorAlmacen::where(
            'prestamo_proveedor_detalle_id',
            $detalleId
        )->orderBy('id')->get();

        if ($almacenesPrestados->isEmpty()) {
            // Fallback: usar almacén de cabecera si no hay registro de almacenes
            \Log::warning('⚠️ No hay almacenes específicos para detalle proveedor, usando cabecera', [
                'detalle_id' => $detalleId,
                'almacen_cabecera_id' => $prestamo->almacenes_prestables_id,
            ]);

            return [[
                'almacenes_prestables_id' => $prestamo->almacenes_prestables_id,
                'cantidad_devuelta' => $cantidadDevuelta,
                'cantidad_dañada_total' => $cantidadDañadaTotal,
            ]];
        }

        $devolucionesAlmacenes = [];
        $cantidadRestante = $cantidadDevuelta;

        // Devolver secuencialmente: termina un almacén antes de pasar al siguiente
        foreach ($almacenesPrestados as $almacenPrestado) {
            if ($cantidadRestante <= 0) break;

            $cantidadDispuesta = $almacenPrestado->cantidad;
            $aDevolverDeEste = min($cantidadRestante, $cantidadDispuesta);

            // ✅ CRÍTICO: Incluir es_proveedor para saber qué columna de stock actualizar
            $devolucionesAlmacenes[] = [
                'almacenes_prestables_id' => $almacenPrestado->almacenes_prestables_id,
                'cantidad_devuelta' => $aDevolverDeEste,
                'cantidad_dañada_total' => 0,
                'es_proveedor' => $almacenPrestado->es_proveedor, // ← CRÍTICO
            ];

            $cantidadRestante -= $aDevolverDeEste;
        }

        // Distribuir cantidad dañada al último almacén procesado
        if ($cantidadDañadaTotal > 0 && !empty($devolucionesAlmacenes)) {
            $devolucionesAlmacenes[count($devolucionesAlmacenes) - 1]['cantidad_dañada_total'] = $cantidadDañadaTotal;
        }

        \Log::info('✅ Devoluciones automáticas calculadas (Proveedor)', [
            'detalle_id' => $detalleId,
            'cantidad_devuelta_total' => $cantidadDevuelta,
            'almacenes_encontrados' => count($almacenesPrestados),
            'almacenes_devolucion' => count($devolucionesAlmacenes),
            'distribucion' => $devolucionesAlmacenes,
        ]);

        return $devolucionesAlmacenes;
    }

    /**
     * Obtener un almacén de proveedor activo para operar con stock de prestables.
     */
    private function obtenerAlmacenProveedorId(): int
    {
        $almacenId = AlmacenPrestable::proveedores()
            ->where('activo', true)
            ->orderBy('id')
            ->value('id');

        if (!$almacenId) {
            throw new \RuntimeException('No existe un almacén de proveedores activo para registrar el movimiento.');
        }

        return (int) $almacenId;
    }

    /**
     * Recibir stock de proveedor en múltiples almacenes seleccionados
     * Distribuye la cantidad entre los almacenes especificados y registra movimientos
     */
    private function recibirStockEnAlmacenesSeleccionados(
        int $prestableId,
        int $cantidad,
        array $almacenesIds,
        bool $esCompra,
        int $prestamoId
    ): array {
        try {
            return DB::transaction(function () use ($prestableId, $cantidad, $almacenesIds, $esCompra, $prestamoId) {
                $cantidadRestante = $cantidad;
                $detallesPorAlmacen = [];

                foreach ($almacenesIds as $almacenId) {
                    if ($cantidadRestante <= 0) break;

                    $stock = PrestableStock::where('prestable_id', $prestableId)
                        ->where('almacenes_prestables_id', $almacenId)
                        ->first();

                    // Registrar cantidad en este almacén (los detalles simplemente registran la entrada)
                    $cantidadARegistrar = min($cantidadRestante, $cantidad);

                    // Obtener valores ANTES de actualizar
                    $disponibleAntes = $stock->cantidad_disponible ?? 0;
                    $prestamoClienteAntes = $stock->cantidad_cliente_deudor ?? 0;
                    $prestamoProveedorAntes = $stock->cantidad_proveedor_acreedor ?? 0;
                    $vendidaAntes = 0;

                    // Actualizar stock según tipo de operación
                    if ($stock && ($esCompra || !$esCompra)) {
                        $updateData = [
                            'cantidad_disponible' => $stock->cantidad_disponible + $cantidadARegistrar,
                        ];
                        if ($esCompra) {
                            // Compra: solo incrementa disponible
                        } else {
                            // Préstamo de proveedor
                            $updateData['cantidad_proveedor_acreedor'] = $stock->cantidad_proveedor_acreedor + $cantidadARegistrar;
                        }
                        $stock->update($updateData);
                    }

                    // Registrar movimiento
                    $this->movimientoService->registrarMovimiento([
                        'prestable_stock_id' => $stock->id,
                        'almacenes_prestables_id' => $almacenId,
                        'usuario_id' => Auth::id(),
                        'tipo' => 'ENTRADA',
                        'cantidad' => $cantidadARegistrar,
                        'disponible_anterior' => $disponibleAntes,
                        'prestamo_cliente_anterior' => $prestamoClienteAntes,
                        'prestamo_proveedor_anterior' => $prestamoProveedorAntes,
                        'vendida_anterior' => $vendidaAntes,
                        'disponible_posterior' => $stock->cantidad_disponible,
                        'prestamo_cliente_posterior' => $stock->cantidad_cliente_deudor,
                        'prestamo_proveedor_posterior' => $stock->cantidad_proveedor_acreedor,
                        'vendida_posterior' => 0,
                        'categoria_afectada' => 'prestamo_proveedor',
                        'motivo' => $esCompra ? 'Compra de prestable' : 'Préstamo de proveedor',
                        'numero_referencia' => $prestamoId,
                        'referencia_tipo' => 'PRESTAMO_PROVEEDOR',
                        'referencia_id' => $prestamoId,
                    ]);

                    $detallesPorAlmacen[] = [
                        'almacen_id' => $almacenId,
                        'cantidad' => $cantidadARegistrar,
                    ];

                    $cantidadRestante -= $cantidadARegistrar;
                }

                return [
                    'exito' => true,
                    'cantidad_recibida' => $cantidad,
                    'detalles_por_almacen' => $detallesPorAlmacen,
                ];
            });
        } catch (\Exception $e) {
            Log::error('Error recibiendo stock en almacenes para préstamo proveedor', [
                'prestable_id' => $prestableId,
                'cantidad' => $cantidad,
                'almacenes_ids' => $almacenesIds,
                'error' => $e->getMessage(),
            ]);
            return ['exito' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Registrar préstamo/compra de proveedor
     *
     * @param array $datos
     * {
     *   'prestable_id': int,
     *   'proveedor_id': int,
     *   'cantidad': int,
     *   'es_compra': bool,
     *   'precio_unitario': ?float,
     *   'numero_documento': ?string,
     *   'fecha_prestamo': date,
     *   'fecha_esperada_devolucion': ?date,
     * }
     */
    public function crearPrestamo(array $datos): PrestamoProveedor|false
    {
        try {
            Log::info('📝 Iniciando creación de préstamo de proveedor', [
                'datos_recibidos' => $datos,
            ]);

            return DB::transaction(function () use ($datos) {
                // ✅ NUEVO: Crear registro encabezado de préstamo (sin prestable_id ni cantidad)
                $prestamo = PrestamoProveedor::create([
                    'proveedor_id' => $datos['proveedor_id'],
                    'almacenes_prestables_id' => $datos['almacenes_prestables_id'],
                    'chofer_id' => $datos['chofer_id'] ?? null,
                    'vehiculo_asignado' => $datos['vehiculo_asignado'] ?? null,
                    'compra_id' => $datos['compra_id'] ?? null,
                    'es_compra' => $datos['es_compra'],
                    'monto_garantia' => $datos['monto_garantia'] ?? 0,
                    'fecha_prestamo' => $datos['fecha_prestamo'],
                    'fecha_esperada_devolucion' => $datos['fecha_esperada_devolucion'] ?? null,
                    'observaciones' => $datos['observaciones'] ?? null,
                    'estado' => 'ACTIVO',
                    'created_by' => auth()->id(),
                ]);

                Log::info('✅ Cabecera de préstamo creada', [
                    'prestamo_id' => $prestamo->id,
                    'almacenes_prestables_id' => $prestamo->almacenes_prestables_id,
                    'chofer_id' => $prestamo->chofer_id,
                    'vehiculo_asignado' => $prestamo->vehiculo_asignado,
                ]);

                // ✅ Procesar detalles (múltiples prestables, múltiples almacenes por detalle)
                $almacenIdCabecera = $datos['almacenes_prestables_id'];
                $detalles = $datos['detalles'] ?? [];

                foreach ($detalles as $detalle) {
                    // Crear detalle del préstamo
                    $detalleCreado = PrestamoProveedorDetalle::create([
                        'prestamo_proveedor_id' => $prestamo->id,
                        'prestable_id' => $detalle['prestable_id'],
                        'cantidad_prestada' => $detalle['cantidad'],
                        'estado' => 'ACTIVO',
                    ]);

                    // Determinar almacenes a procesar
                    $almacenesAProcesar = [];
                    if (!empty($detalle['almacenes']) && is_array($detalle['almacenes'])) {
                        // Múltiples almacenes: procesar cada uno específico
                        $almacenesAProcesar = $detalle['almacenes'];
                    } elseif ($almacenIdCabecera) {
                        // Solo cabecera: procesar cabecera
                        $almacenesAProcesar = [
                            ['almacenes_prestables_id' => $almacenIdCabecera, 'cantidad' => (int) $detalle['cantidad']]
                        ];
                    }

                    // Procesar stock de cada almacén
                    foreach ($almacenesAProcesar as $almacenData) {
                        $almacenId = (int) $almacenData['almacenes_prestables_id'];
                        $cantidad = (int) $almacenData['cantidad'];

                        // Obtener stock ANTES de actualizar
                        $stock = PrestableStock::where('prestable_id', $detalle['prestable_id'])
                            ->where('almacenes_prestables_id', $almacenId)
                            ->first();
                        $disponibleAntes = $stock->cantidad_disponible ?? 0;
                        $sinLiquidoAntes = $stock->cantidad_sin_liquido ?? 0;
                        $prestamoClienteAntes = $stock->cantidad_cliente_deudor ?? 0;
                        $prestamoProveedorAntes = $stock->cantidad_proveedor_acreedor ?? 0;
                        $vendidaAntes = 0;

                        // ✅ MODIFICADO:
                        // - Incrementar cantidad_proveedor_acreedor (deuda)
                        // - Decrementar cantidad_sin_liquido (vienen llenos del proveedor)
                        if ($stock && !$datos['es_compra']) {
                            // PRÉSTAMO: incrementa deuda + disminuye sin_liquido
                            $stock->update([
                                'cantidad_proveedor_acreedor' => $stock->cantidad_proveedor_acreedor + $cantidad,
                                'cantidad_sin_liquido' => max(0, $stock->cantidad_sin_liquido - $cantidad),
                            ]);
                            // Recargar para obtener valores posteriores actualizados
                            $stock->refresh();
                        }

                        // Crear registro en PrestamoProveedorAlmacen
                        PrestamoProveedorAlmacen::create([
                            'prestamo_proveedor_detalle_id' => $detalleCreado->id,
                            'almacenes_prestables_id' => $almacenId,
                            'cantidad' => $cantidad,
                            'es_proveedor' => true,
                        ]);

                        // Registrar movimiento de entrada
                        $movimiento = $this->movimientoService->registrarMovimiento([
                            'prestable_stock_id' => $stock->id,
                            'almacenes_prestables_id' => $almacenId,
                            'usuario_id' => Auth::id(),
                            'tipo' => 'ENTRADA',
                            'cantidad' => $cantidad,
                            'disponible_anterior' => $disponibleAntes,
                            'cantidad_sin_liquido_anterior' => $sinLiquidoAntes,
                            'prestamo_cliente_anterior' => $prestamoClienteAntes,
                            'prestamo_proveedor_anterior' => $prestamoProveedorAntes,
                            'vendida_anterior' => $vendidaAntes,
                            'disponible_posterior' => $disponibleAntes, // ✅ No cambia
                            'cantidad_sin_liquido_posterior' => $stock->cantidad_sin_liquido,
                            'prestamo_cliente_posterior' => $stock->cantidad_cliente_deudor,
                            'prestamo_proveedor_posterior' => $stock->cantidad_proveedor_acreedor,
                            'vendida_posterior' => 0,
                            'categoria_afectada' => 'prestamo_proveedor',
                            'motivo' => $datos['es_compra'] ? 'Compra de prestable' : 'Préstamo de proveedor',
                            'numero_referencia' => $prestamo->id,
                            'referencia_tipo' => 'PRESTAMO_PROVEEDOR',
                            'referencia_id' => $prestamo->id,
                        ]);

                        Log::info('✅ Movimiento de prestable PROVEEDOR registrado', [
                            'movimiento_id' => $movimiento->id,
                            'prestamo_id' => $prestamo->id,
                            'prestable_id' => $detalle['prestable_id'],
                            'almacen_id' => $almacenId,
                            'cantidad_prestable' => $cantidad,
                            'disponible_anterior' => $disponibleAntes,
                            'disponible_posterior' => $disponibleAntes,
                            'sin_liquido_anterior' => $sinLiquidoAntes,
                            'sin_liquido_posterior' => $stock->cantidad_sin_liquido,
                            'proveedor_acreedor_anterior' => $prestamoProveedorAntes,
                            'proveedor_acreedor_posterior' => $stock->cantidad_proveedor_acreedor,
                        ]);
                    }

                    Log::info('✅ Detalle de préstamo de proveedor registrado', [
                        'prestamo_id' => $prestamo->id,
                        'prestable_id' => $detalle['prestable_id'],
                        'cantidad_total' => $detalle['cantidad'],
                        'cantidad_almacenes' => count($almacenesAProcesar),
                    ]);
                }

                Log::info('✅ Préstamo de proveedor registrado', [
                    'prestamo_id' => $prestamo->id,
                    'proveedor_id' => $datos['proveedor_id'],
                    'cantidad_detalles' => count($detalles),
                    'es_compra' => $datos['es_compra'],
                ]);

                return $prestamo;
            });
        } catch (\Exception $e) {
            Log::error('❌ Error registrando préstamo de proveedor', [
                'error' => $e->getMessage(),
                'datos' => $datos,
            ]);
            return false;
        }
    }

    /**
     * Registrar devolución al proveedor (parcial o total)
     *
     * @param array $datos
     * {
     *   'prestamo_proveedor_detalle_id': int,
     *   'cantidad_devuelta': int,
     *   'observaciones': ?string,
     *   'fecha_devolucion': date,
     * }
     */
    /**
     * Registrar devolución de proveedor con múltiples detalles
     * Estructura: devolucion_proveedor (cabecera) → devolucion_proveedor_detalle (detalles)
     */
    public function registrarDevolucion(array $datos): DevolucionProveedor|false
    {
        try {
            return DB::transaction(function () use ($datos) {
                // Validar que prestamo existe
                $prestamo = PrestamoProveedor::find($datos['prestamo_proveedor_id']);
                if (!$prestamo) {
                    throw new \Exception('Préstamo de proveedor no encontrado');
                }

                // ✅ CORREGIDO: Usar el almacén del payload si viene especificado, sino usar el de la cabecera
                $almacenId = $datos['almacenes_prestables_id'] ?? $prestamo->almacenes_prestables_id ?? $this->obtenerAlmacenProveedorId();

                // Crear encabezado de devolución
                $devolucion = DevolucionProveedor::create([
                    'prestamo_proveedor_id' => $datos['prestamo_proveedor_id'],
                    'fecha_devolucion' => $datos['fecha_devolucion'],
                    'monto_cobrado_daño_total' => (float) ($datos['monto_cobrado_daño_total'] ?? 0),
                    'monto_garantia_devuelta_total' => 0, // Se calculará de los detalles
                    'observaciones' => $datos['observaciones'] ?? null,
                    'created_by' => $datos['created_by'] ?? null, // ✅ Usuario que creó la devolución
                ]);

                $detalles = $datos['detalles'] ?? [];
                $montoGarantiaTotal = 0;

                // Procesar cada detalle de devolución
                foreach ($detalles as &$detalleData) {
                    $detalle = PrestamoProveedorDetalle::find($detalleData['prestamo_proveedor_detalle_id']);

                    if (!$detalle) {
                        throw new \Exception('Detalle de préstamo no encontrado: ' . $detalleData['prestamo_proveedor_detalle_id']);
                    }

                    $cantidadDevuelta = $detalleData['cantidad_devuelta'] ?? 0;
                    $cantidadDañadaTotal = $detalleData['cantidad_dañada_total'] ?? 0;

                    // ✅ SIMPLIFICADO: cantidad_devuelta es el TOTAL, cantidad_dañada_total es información dentro de ese total
                    // Calcular cuánto ya ha sido devuelto previamente
                    $cantidadYaDevuelta = $detalle->devolucionDetalles()
                        ->sum('cantidad_devuelta');

                    $cantidadRestante = $detalle->cantidad_prestada - $cantidadYaDevuelta;

                    // Validar que no devuelve más de lo que queda
                    if ($cantidadDevuelta > $cantidadRestante) {
                        throw new \Exception("Cantidad a devolver ({$cantidadDevuelta}) excede cantidad restante ({$cantidadRestante})");
                    }

                    // Crear detalle de devolución
                    DevolucionProveedorDetalle::create([
                        'devolucion_proveedor_id' => $devolucion->id,
                        'prestamo_proveedor_detalle_id' => $detalle->id,
                        'fecha_devolucion' => $datos['fecha_devolucion'],
                        'cantidad_devuelta' => $cantidadDevuelta,
                        'cantidad_dañada_parcial' => 0,
                        'cantidad_dañada_total' => $cantidadDañadaTotal,
                        'monto_cobrado_daño' => 0,
                        'monto_garantia_devuelta' => 0,
                    ]);

                    // ✅ Registrar movimiento si hay cantidad devuelta
                    if ($cantidadDevuelta > 0 || $cantidadDañadaTotal > 0) {
                        $stockAntes = PrestableStock::where('prestable_id', $detalle->prestable_id)
                            ->where('almacenes_prestables_id', $almacenId)
                            ->first();
                        $disponibleAntes = $stockAntes->cantidad_disponible ?? 0;
                        $sinLiquidoAntes = $stockAntes->cantidad_sin_liquido ?? 0;
                        $prestamoClienteAntes = $stockAntes->cantidad_cliente_deudor ?? 0;
                        $prestamoProveedorAntes = $stockAntes->cantidad_proveedor_acreedor ?? 0;
                        $proveedorDañadaAntes = $stockAntes->cantidad_proveedor_dañada ?? 0;
                        $vendidaAntes = 0;

                        // Procesar devolución en stock
                        if ($stockAntes) {
                            $stockAntes->update([
                                'cantidad_disponible' => $stockAntes->cantidad_disponible, // ✅ No cambia
                                'cantidad_sin_liquido' => $stockAntes->cantidad_sin_liquido + $cantidadDevuelta,  // ✅ Devueltos llegan vacíos
                                'cantidad_proveedor_acreedor' => max(0, $stockAntes->cantidad_proveedor_acreedor - $cantidadDevuelta),
                                'cantidad_proveedor_dañada' => $stockAntes->cantidad_proveedor_dañada + $cantidadDañadaTotal,
                            ]);
                        }

                        // Registrar movimiento
                        $movimiento = $this->movimientoService->registrarMovimiento([
                            'prestable_stock_id' => $stockAntes->id,
                            'almacenes_prestables_id' => $almacenId,
                            'usuario_id' => Auth::id(),
                            'tipo' => 'SALIDA',
                            'cantidad' => -$cantidadDevuelta,
                            'cantidad_dañada_registrada' => $cantidadDañadaTotal,
                            'cantidad_dañada_total' => $cantidadDañadaTotal,
                            'disponible_anterior' => $disponibleAntes,
                            'cantidad_sin_liquido_anterior' => $sinLiquidoAntes,
                            'prestamo_cliente_anterior' => $prestamoClienteAntes,
                            'prestamo_proveedor_anterior' => $prestamoProveedorAntes,
                            'vendida_anterior' => $vendidaAntes,
                            'disponible_posterior' => $disponibleAntes, // ✅ NO cambia
                            'cantidad_sin_liquido_posterior' => $stockAntes->cantidad_sin_liquido,
                            'prestamo_cliente_posterior' => $stockAntes->cantidad_cliente_deudor,
                            'prestamo_proveedor_posterior' => $stockAntes->cantidad_proveedor_acreedor,
                            'vendida_posterior' => 0,
                            'cantidad_proveedor_dañada_anterior' => $proveedorDañadaAntes,
                            'cantidad_proveedor_dañada_posterior' => $stockAntes->cantidad_proveedor_dañada ?? 0,
                            'categoria_afectada' => 'prestamo_proveedor',
                            'motivo' => 'Devolución a proveedor',
                            'numero_referencia' => $prestamo->id,
                            'referencia_tipo' => 'DEVOLUCION_PROVEEDOR',
                            'referencia_id' => $devolucion->id,
                            'observaciones' => trim(
                                'Devueltas: ' . $cantidadDevuelta .
                                ($cantidadDañadaTotal > 0 ? ' | Información daño: ' . $cantidadDañadaTotal : '') .
                                (!empty($datos['observaciones']) ? ' | ' . $datos['observaciones'] : '')
                            ),
                        ]);

                        Log::info('✅ Movimiento de DEVOLUCIÓN PROVEEDOR registrado', [
                            'movimiento_id' => $movimiento->id,
                            'prestamo_id' => $prestamo->id,
                            'prestable_id' => $detalle->prestable_id,
                            'cantidad_devuelta' => $cantidadDevuelta,
                            'cantidad_dañada' => $cantidadDañadaTotal,
                            'disponible_anterior' => $disponibleAntes,
                            'disponible_posterior' => $disponibleAntes,
                            'sin_liquido_anterior' => $sinLiquidoAntes,
                            'sin_liquido_posterior' => $stockAntes->cantidad_sin_liquido,
                            'proveedor_acreedor_anterior' => $prestamoProveedorAntes,
                            'proveedor_acreedor_posterior' => $stockAntes->cantidad_proveedor_acreedor,
                        ]);
                    }

                    // Calcular TOTAL DEVUELTO para actualizar estado
                    // IMPORTANTE: Incluir TANTO cantidad_devuelta como cantidad_dañada_total
                    $totalDevueltoAhora = $detalle->devolucionDetalles()
                        ->sum(\DB::raw('cantidad_devuelta + cantidad_dañada_total'));

                    // Actualizar estado del detalle
                    if ($totalDevueltoAhora >= $detalle->cantidad_prestada) {
                        $detalle->update(['estado' => 'COMPLETAMENTE_DEVUELTO']);
                    } else {
                        $detalle->update(['estado' => 'PARCIALMENTE_DEVUELTO']);
                    }
                }

                // Actualizar monto_garantia_devuelta_total en la cabecera
                $devolucion->update(['monto_garantia_devuelta_total' => $montoGarantiaTotal]);

                // Actualizar estado del encabezado si todos los detalles están devueltos
                $todosDevueltos = $prestamo->detalles()
                    ->where('estado', '!=', 'COMPLETAMENTE_DEVUELTO')
                    ->count() === 0;

                if ($todosDevueltos) {
                    $prestamo->update(['estado' => 'COMPLETAMENTE_DEVUELTO']);
                } else {
                    $prestamo->update(['estado' => 'PARCIALMENTE_DEVUELTO']);
                }

                Log::info('✅ Devolución a proveedor registrada', [
                    'devolucion_id' => $devolucion->id,
                    'prestamo_proveedor_id' => $datos['prestamo_proveedor_id'],
                    'cantidad_detalles' => count($detalles),
                ]);

                return $devolucion->load('detalles');
            });
        } catch (\Exception $e) {
            Log::error('❌ Error registrando devolución a proveedor', [
                'error' => $e->getMessage(),
                'datos' => $datos,
            ]);
            return false;
        }
    }

    /**
     * Obtener préstamos activos de un proveedor
     */
    public function obtenerPrestamosActivos(int $proveedorId): array
    {
        return PrestamoProveedor::where('proveedor_id', $proveedorId)
            ->where('estado', 'ACTIVO')
            ->with(['detalles.prestable', 'detalles.devolucionDetalles'])
            ->get()
            ->toArray();
    }

    /**
     * Obtener deuda total a un proveedor
     */
    public function obtenerDeudaTotal(int $proveedorId): float
    {
        $prestamosActivos = PrestamoProveedor::where('proveedor_id', $proveedorId)
            ->whereIn('estado', ['ACTIVO', 'PARCIALMENTE_DEVUELTO'])
            ->with(['detalles.devolucionDetalles'])
            ->get();

        $deudaTotal = 0;

        foreach ($prestamosActivos as $prestamo) {
            // ✅ NUEVO: Iterar detalles para calcular deuda
            foreach ($prestamo->detalles as $detalle) {
                // Cantidad aún pendiente de devolver en este detalle
                $totalDevueltoDetalle = $detalle->devolucionDetalles->sum('cantidad_devuelta');
                $pendiente = $detalle->cantidad_prestada - $totalDevueltoDetalle;

                // Si es compra, se cobra por cada canastilla
                if ($prestamo->es_compra && $detalle->precio_unitario) {
                    $deudaTotal += $pendiente * $detalle->precio_unitario;
                }
            }
        }

        return $deudaTotal;
    }

    /**
     * Obtener resumen de préstamo
     */
    public function obtenerResumen(int $prestamoId): array|false
    {
        $prestamo = PrestamoProveedor::with(['detalles.devolucionDetalles', 'detalles.prestable'])->find($prestamoId);

        if (!$prestamo) {
            return false;
        }

        // ✅ NUEVO: Calcular totales de todos los detalles
        $cantidadTotal = 0;
        $totalDevuelto = 0;
        $montoDeuda = 0;

        foreach ($prestamo->detalles as $detalle) {
            $cantidadTotal += $detalle->cantidad_prestada;
            $totalDevueltoDetalle = $detalle->devolucionDetalles->sum('cantidad_devuelta');
            $totalDevuelto += $totalDevueltoDetalle;
            $pendiente = $detalle->cantidad_prestada - $totalDevueltoDetalle;

            if ($prestamo->es_compra && $detalle->precio_unitario) {
                $montoDeuda += $pendiente * $detalle->precio_unitario;
            }
        }

        $pendiente = $cantidadTotal - $totalDevuelto;

        return [
            'prestamo' => $prestamo,
            'cantidad_original' => $cantidadTotal,
            'cantidad_devuelta' => $totalDevuelto,
            'cantidad_pendiente' => $pendiente,
            'devoluciones' => $prestamo->detalles->flatMap(fn($d) => $d->devoluciones),
            'estado' => $prestamo->estado,
            'monto_deuda' => $montoDeuda,
        ];
    }

    /**
     * Anular préstamo a proveedor
     * Devuelve automáticamente el stock al almacén
     */
    /**
     * Anular préstamo a proveedor - cancela y devuelve stock al almacén
     * ✅ CORREGIDO: Itera por PrestamoProveedorAlmacen (como al crear)
     * Genera 1 movimiento por almacén del detalle, NO movimientos extras
     *
     * @param int $prestamoId ID del préstamo
     * @param ?string $razonAnulacion Razón de la anulación
     */
    public function anularPrestamo(int $prestamoId, ?string $razonAnulacion = null): PrestamoProveedor|false
    {
        try {
            return DB::transaction(function () use ($prestamoId, $razonAnulacion) {
                $prestamo = PrestamoProveedor::with(['detalles.almacenes'])->find($prestamoId);

                if (!$prestamo) {
                    throw new \Exception('Préstamo a proveedor no encontrado');
                }

                if ($prestamo->estado === 'ANULADO') {
                    throw new \Exception('El préstamo ya está anulado');
                }

                // ✅ ITERAR POR CADA DETALLE
                foreach ($prestamo->detalles as $detalle) {
                    // Si el detalle ya está completamente devuelto, solo cambiar estado
                    if ($detalle->estado === 'COMPLETAMENTE_DEVUELTO') {
                        $detalle->update(['estado' => 'ANULADO']);
                        continue;
                    }

                    // ✅ ITERAR POR CADA ALMACÉN DEL DETALLE (como se creó)
                    $almacenesDetalle = PrestamoProveedorAlmacen::where(
                        'prestamo_proveedor_detalle_id',
                        $detalle->id
                    )->get();

                    foreach ($almacenesDetalle as $almacenDetalle) {
                        // Calcular cantidad ya devuelta de ESTE almacén específico
                        $cantidadDevueltaDelAlmacen = (int) DB::table('devolucion_proveedor_detalle_almacenes as dpda')
                            ->join('devolucion_proveedor_detalle as dpd', 'dpda.devolucion_proveedor_detalle_id', '=', 'dpd.id')
                            ->where('dpd.prestamo_proveedor_detalle_id', $detalle->id)
                            ->where('dpda.almacenes_prestables_id', $almacenDetalle->almacenes_prestables_id)
                            ->sum(DB::raw('dpda.cantidad_devuelta + dpda.cantidad_dañada_total'));

                        $cantidadPendienteDelAlmacen = $almacenDetalle->cantidad - $cantidadDevueltaDelAlmacen;

                        if ($cantidadPendienteDelAlmacen > 0) {
                            // Obtener stock ANTES de devolver
                            $stock = PrestableStock::where('prestable_id', $detalle->prestable_id)
                                ->where('almacenes_prestables_id', $almacenDetalle->almacenes_prestables_id)
                                ->firstOrFail();

                            $disponibleAntes = $stock->cantidad_disponible;
                            $sinLiquidoAntes = $stock->cantidad_sin_liquido;
                            $proveedorAcreedorAntes = $stock->cantidad_proveedor_acreedor;

                            // Devolver (inverso de crear: incrementa sin_liquido, disminuye acreedor)
                            $stock->update([
                                'cantidad_disponible' => $stock->cantidad_disponible, // ✅ No cambia
                                'cantidad_sin_liquido' => $stock->cantidad_sin_liquido + $cantidadPendienteDelAlmacen,
                                'cantidad_proveedor_acreedor' => max(0, $stock->cantidad_proveedor_acreedor - $cantidadPendienteDelAlmacen),
                            ]);

                            // ✅ 1 MOVIMIENTO POR ALMACÉN (espejo del proceso de creación)
                            $movimiento = $this->movimientoService->registrarMovimiento([
                                'prestable_stock_id' => $stock->id,
                                'almacenes_prestables_id' => $almacenDetalle->almacenes_prestables_id,
                                'usuario_id' => Auth::id(),
                                'tipo' => 'ENTRADA',
                                'cantidad' => $cantidadPendienteDelAlmacen,
                                'disponible_anterior' => $disponibleAntes,
                                'cantidad_sin_liquido_anterior' => $sinLiquidoAntes,
                                'prestamo_proveedor_anterior' => $proveedorAcreedorAntes,
                                'disponible_posterior' => $disponibleAntes, // ✅ NO cambia
                                'cantidad_sin_liquido_posterior' => $stock->cantidad_sin_liquido,
                                'prestamo_proveedor_posterior' => $stock->cantidad_proveedor_acreedor,
                                'categoria_afectada' => 'prestamo_proveedor',
                                'motivo' => 'Devolución por anulación de préstamo',
                                'numero_referencia' => $prestamo->id,
                                'referencia_tipo' => 'PRESTAMO_PROVEEDOR_ANULADO',
                                'referencia_id' => $prestamo->id,
                                'observaciones' => $razonAnulacion,
                            ]);

                            Log::info('✅ Movimiento de ANULACIÓN PRÉSTAMO PROVEEDOR registrado', [
                                'movimiento_id' => $movimiento->id,
                                'prestamo_id' => $prestamo->id,
                                'detalle_id' => $detalle->id,
                                'almacen_id' => $almacenDetalle->almacenes_prestables_id,
                                'cantidad_anulada' => $cantidadPendienteDelAlmacen,
                                'disponible_anterior' => $disponibleAntes,
                                'disponible_posterior' => $disponibleAntes,
                                'sin_liquido_anterior' => $sinLiquidoAntes,
                                'sin_liquido_posterior' => $stock->cantidad_sin_liquido,
                                'proveedor_acreedor_anterior' => $proveedorAcreedorAntes,
                                'proveedor_acreedor_posterior' => $stock->cantidad_proveedor_acreedor,
                            ]);
                        }
                    }

                    // Cambiar estado del detalle a ANULADO
                    $detalle->update(['estado' => 'ANULADO']);
                }

                // Actualizar estado del préstamo
                $prestamo->update([
                    'estado' => 'ANULADO',
                    'anulada_por' => auth()->id(),
                    'fecha_anulacion' => now(),
                    'razon_anulacion' => $razonAnulacion,
                ]);

                Log::info('✅ Préstamo a proveedor anulado correctamente', [
                    'prestamo_id' => $prestamo->id,
                    'cantidad_detalles' => count($prestamo->detalles),
                    'razon_anulacion' => $razonAnulacion,
                ]);

                return $prestamo;
            });
        } catch (\Exception $e) {
            Log::error('❌ Error anulando préstamo a proveedor', [
                'error' => $e->getMessage(),
                'prestamo_id' => $prestamoId,
            ]);
            return false;
        }
    }

    /**
     * Anular una devolución de proveedor con auditoría
     * Genera movimiento inverso
     */
    public function anularDevolucion(int $prestamoProveedorId, int $devolucionId, string $razonAnulacion): DevolucionProveedor|false
    {
        try {
            return DB::transaction(function () use ($prestamoProveedorId, $devolucionId, $razonAnulacion) {
                $prestamo = PrestamoProveedor::findOrFail($prestamoProveedorId);
                $devolucion = DevolucionProveedor::findOrFail($devolucionId);

                // Validar que pertenece al préstamo y está ACTIVA
                if ($devolucion->prestamo_proveedor_id !== $prestamoProveedorId) {
                    throw new \Exception('La devolución no pertenece a este préstamo');
                }

                if ($devolucion->estado === 'ANULADA') {
                    throw new \Exception('Esta devolución ya está anulada');
                }

                Log::info('🔄 INICIANDO ANULACIÓN DE DEVOLUCIÓN PROVEEDOR', [
                    'prestamo_proveedor_id' => $prestamoProveedorId,
                    'devolucion_proveedor_id' => $devolucionId,
                    'razon' => $razonAnulacion,
                ]);

                $almacenId = $prestamo->almacenes_prestables_id ?? $this->obtenerAlmacenProveedorId();

                // Iterar sobre detalles de la devolución
                $detalles = $devolucion->detalles()->with('detallePrestamoProveedor')->get();

                foreach ($detalles as $detalleDevolucion) {
                    $detallePrestamoProveedor = $detalleDevolucion->detallePrestamoProveedor;

                    $cantidadDevuelta = $detalleDevolucion->cantidad_devuelta;
                    $cantidadDañada = $detalleDevolucion->cantidad_dañada_total;

                    // Obtener stock actual
                    $stock = PrestableStock::where('prestable_id', $detallePrestamoProveedor->prestable_id)
                        ->where('almacenes_prestables_id', $almacenId)
                        ->first();

                    if (!$stock) {
                        throw new \Exception("Stock no encontrado para prestable {$detallePrestamoProveedor->prestable_id} en almacén {$almacenId}");
                    }

                    $disponibleAntes = $stock->cantidad_disponible ?? 0;
                    $sinLiquidoAntes = $stock->cantidad_sin_liquido ?? 0;
                    $prestamoProveedorAntes = $stock->cantidad_proveedor_acreedor ?? 0;
                    $proveedorDañadaAntes = $stock->cantidad_proveedor_dañada ?? 0;

                    // Invertir cambios de stock (deshacer la devolución)
                    // Inverso: cantidad_disponible no cambia, sin_liquido disminuye, acreedor aumenta
                    $stock->update([
                        'cantidad_disponible' => $stock->cantidad_disponible, // ✅ No cambia
                        'cantidad_sin_liquido' => max(0, $stock->cantidad_sin_liquido - $cantidadDevuelta), // ✅ Vuelven a estar en préstamo
                        'cantidad_proveedor_acreedor' => $stock->cantidad_proveedor_acreedor + $cantidadDevuelta, // Vuelve a estar acreedor
                        'cantidad_proveedor_dañada' => max(0, $stock->cantidad_proveedor_dañada - $cantidadDañada),
                    ]);

                    // Registrar movimiento INVERSO por anulación
                    $movimiento = $this->movimientoService->registrarMovimiento([
                        'prestable_stock_id' => $stock->id,
                        'almacenes_prestables_id' => $almacenId,
                        'usuario_id' => auth()->id(),
                        'tipo' => 'ENTRADA',
                        'cantidad' => -$cantidadDevuelta,
                        'cantidad_dañada_registrada' => -$cantidadDañada,
                        'cantidad_dañada_total' => -$cantidadDañada,
                        'disponible_anterior' => $disponibleAntes,
                        'cantidad_sin_liquido_anterior' => $sinLiquidoAntes,
                        'prestamo_proveedor_anterior' => $prestamoProveedorAntes,
                        'disponible_posterior' => $disponibleAntes, // ✅ NO cambia
                        'cantidad_sin_liquido_posterior' => $stock->cantidad_sin_liquido,
                        'prestamo_proveedor_posterior' => $stock->cantidad_proveedor_acreedor,
                        'cantidad_proveedor_dañada_anterior' => $proveedorDañadaAntes,
                        'cantidad_proveedor_dañada_posterior' => $stock->cantidad_proveedor_dañada ?? 0,
                        'categoria_afectada' => 'prestamo_proveedor_anulacion',
                        'motivo' => 'Anulación de devolución a proveedor',
                        'numero_referencia' => $prestamo->id,
                        'referencia_tipo' => 'ANULACION_DEVOLUCION_PROVEEDOR',
                        'referencia_id' => $devolucionId,
                        'observaciones' => "Proveedor: {$prestamo->proveedor?->nombre}, Razón: {$razonAnulacion}",
                    ]);

                    Log::info('✅ Movimiento de ANULACIÓN DEVOLUCIÓN PROVEEDOR registrado', [
                        'movimiento_id' => $movimiento->id,
                        'prestable_id' => $detallePrestamoProveedor->prestable_id,
                        'almacen_id' => $almacenId,
                        'cantidad_devuelta_anulada' => $cantidadDevuelta,
                        'cantidad_dañada_anulada' => $cantidadDañada,
                        'disponible_anterior' => $disponibleAntes,
                        'disponible_posterior' => $disponibleAntes,
                        'sin_liquido_anterior' => $sinLiquidoAntes,
                        'sin_liquido_posterior' => $stock->cantidad_sin_liquido,
                        'proveedor_acreedor_anterior' => $prestamoProveedorAntes,
                        'proveedor_acreedor_posterior' => $stock->cantidad_proveedor_acreedor,
                    ]);
                }

                // Actualizar devolución como anulada
                $devolucion->update([
                    'estado' => 'ANULADA',
                    'anulada_por' => auth()->id(),
                    'fecha_anulacion' => now(),
                    'razon_anulacion' => $razonAnulacion,
                ]);

                Log::info('✅ DEVOLUCIÓN PROVEEDOR ANULADA CORRECTAMENTE', [
                    'prestamo_proveedor_id' => $prestamoProveedorId,
                    'devolucion_proveedor_id' => $devolucionId,
                ]);

                return $devolucion->refresh();
            });
        } catch (\Exception $e) {
            Log::error('❌ Error anulando devolución proveedor', [
                'error' => $e->getMessage(),
                'prestamo_proveedor_id' => $prestamoProveedorId,
                'devolucion_proveedor_id' => $devolucionId,
            ]);

            return false;
        }
    }
}
