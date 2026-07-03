<?php

namespace App\Services\Prestamos;

use App\Models\Cliente;
use App\Models\PrestamoEvento;
use App\Models\PrestamoEventoDetalle;
use App\Models\PrestamoEventoAlmacen;
use App\Models\DevolucionEvento;
use App\Models\DevolucionEventoDetalle;
use App\Models\DevolucionEventoDetalleAlmacen;
use App\Models\PrestableStock;
use App\Models\AlmacenPrestable;
use App\Models\PrestableCondicion;
use App\Services\MovimientoPrestableService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * PrestamoEventoService
 *
 * Gestiona préstamos y devoluciones de canastillas/embases a eventos
 * Similar a PrestamoClienteService pero con tablas separadas
 */
class PrestamoEventoService
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
     * Consulta PrestamoEventoAlmacen (prestado) vs DevolucionEventoDetalleAlmacen (devuelto)
     *
     * @param PrestamoEventoDetalle $detalle Detalle del préstamo
     * @param array $devolucionesAlmacenes Array con las devoluciones por almacén
     * @throws \Exception Si algún almacén excede lo prestado
     */
    private function validarDevolucionPorAlmacen(PrestamoEventoDetalle $detalle, array $devolucionesAlmacenes): void
    {
        foreach ($devolucionesAlmacenes as $almacenDev) {
            $almacenId = (int) $almacenDev['almacenes_prestables_id'];
            $cantDevAlmacen = (int) ($almacenDev['cantidad_devuelta'] ?? 0);
            $cantDanAlmacen = (int) ($almacenDev['cantidad_dañada_total'] ?? 0);
            $cantTotalAlmacen = $cantDevAlmacen + $cantDanAlmacen;

            // Cantidad prestada de ESTE almacén específico
            $cantidadPrestadaAlmacen = (int) PrestamoEventoAlmacen::where('prestamo_evento_detalle_id', $detalle->id)
                ->where('almacenes_prestables_id', $almacenId)
                ->value('cantidad') ?? 0;

            if ($cantidadPrestadaAlmacen === 0) {
                throw new \Exception(
                    "❌ Almacén {$almacenId} no fue usado para prestar el detalle {$detalle->id}. " .
                    "No se puede devolver de un almacén del cual no se prestó."
                );
            }

            // Cantidad DEVUELTA de ESTE almacén específico (en devoluciones anteriores)
            $cantidadDevueltaAlmacen = (int) DB::table('devolucion_evento_detalle_almacenes as deda')
                ->join('devolucion_evento_detalle as ded', 'deda.devolucion_evento_detalle_id', '=', 'ded.id')
                ->where('ded.prestamo_evento_detalle_id', $detalle->id)
                ->where('deda.almacenes_prestables_id', $almacenId)
                ->sum(DB::raw('deda.cantidad_devuelta + deda.cantidad_dañada_total'));

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

            \Log::info('✅ Validación por almacén correcta (Evento)', [
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
     * @param PrestamoEvento $prestamo Préstamo asociado
     * @return array Array de almacenes con cantidades calculadas
     */
    private function calcularDevolucionesAutomaticas(array $detalleData, PrestamoEvento $prestamo): array
    {
        // ✅ SIEMPRE calcular automáticamente basado en PrestamoEventoAlmacen
        // Ignorar lo que venga del frontend para asegurar correcta distribución FIFO

        $cantidadDevuelta = $detalleData['cantidad_devuelta'] ?? 0;
        $cantidadDañadaTotal = $detalleData['cantidad_dañada_total'] ?? 0;
        $detalleId = $detalleData['prestamo_evento_detalle_id'];

        // ✅ CORREGIDO: Obtener almacenes correctamente desde PrestamoEventoAlmacen
        $almacenesPrestados = PrestamoEventoAlmacen::where(
            'prestamo_evento_detalle_id',
            $detalleId
        )->orderBy('id')->get();

        if ($almacenesPrestados->isEmpty()) {
            // Fallback: usar almacén de cabecera si no hay registro de almacenes
            \Log::warning('⚠️ No hay almacenes específicos para detalle evento, usando cabecera', [
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

            $almacenId = $almacenPrestado->almacenes_prestables_id;
            $cantidadPrestada = (int) $almacenPrestado->cantidad;

            // ✅ NUEVO: Calcular cuánto ya fue devuelto de ESTE almacén
            $cantidadDevueltaDelAlmacen = (int) \DB::table('devolucion_evento_detalle_almacenes as deda')
                ->join('devolucion_evento_detalle as ded', 'deda.devolucion_evento_detalle_id', '=', 'ded.id')
                ->where('ded.prestamo_evento_detalle_id', $detalleId)
                ->where('deda.almacenes_prestables_id', $almacenId)
                ->sum('deda.cantidad_devuelta');

            $faltaPorDevolver = $cantidadPrestada - $cantidadDevueltaDelAlmacen;

            \Log::info('📊 Análisis de devolución por almacén (Evento)', [
                'almacen_id' => $almacenId,
                'cantidad_prestada' => $cantidadPrestada,
                'cantidad_ya_devuelta' => $cantidadDevueltaDelAlmacen,
                'falta_por_devolver' => $faltaPorDevolver,
                'cantidad_restante_a_distribuir' => $cantidadRestante,
            ]);

            if ($faltaPorDevolver <= 0) {
                // Este almacén ya está completamente devuelto, pasar al siguiente
                continue;
            }

            // Devolver lo que falta de este almacén, sin exceder lo restante
            $aDevolverDeEste = min($cantidadRestante, $faltaPorDevolver);

            // ✅ CRÍTICO: Incluir es_proveedor para saber qué columna de stock actualizar
            $devolucionesAlmacenes[] = [
                'almacenes_prestables_id' => $almacenId,
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

        \Log::info('✅ Devoluciones automáticas calculadas (Evento)', [
            'detalle_id' => $detalleId,
            'cantidad_devuelta_total' => $cantidadDevuelta,
            'almacenes_encontrados' => count($almacenesPrestados),
            'almacenes_devolucion' => count($devolucionesAlmacenes),
            'distribucion' => $devolucionesAlmacenes,
        ]);

        return $devolucionesAlmacenes;
    }

    /**
     * Crear préstamo a evento con múltiples detalles
     *
     * @param array $datos
     * {
     *   'evento_id': ?int,
     *   'venta_id': ?int,
     *   'nombre_evento': string,
     *   'encargado_evento': ?string,
     *   'vehiculo_asignado': ?string,
     *   'direccion_evento': ?string,
     *   'telefono_uno': ?string,
     *   'telefono_dos': ?string,
     *   'chofer_id': ?int,
     *   'monto_garantia': ?float,
     *   'fecha_prestamo': date,
     *   'fecha_entrega': ?date,
     *   'fecha_esperada_devolucion': ?date,
     *   'detalles': [
     *     {
     *       'prestable_id': int,
     *       'cantidad': int,
     *       'almacenes_ids': [int, ...]
     *     },
     *     ...
     *   ]
     * }
     */
    public function crearPrestamo(array $datos): PrestamoEvento|false
    {
        try {
            return DB::transaction(function () use ($datos) {
                $montoGarantia = (float) ($datos['monto_garantia'] ?? 0);
                $cantidadTotal = 0;

                // Cliente fijo para eventos: id=51
                $clienteEventosId = 51;
                $almacenCabecera = !empty($datos['almacenes_prestables_id']) ? (int) $datos['almacenes_prestables_id'] : null;

                // Crear registro encabezado de préstamo
                $prestamo = PrestamoEvento::create([
                    'evento_id' => $datos['evento_id'] ?? null,
                    'cliente_id' => $clienteEventosId,
                    'almacenes_prestables_id' => $almacenCabecera,
                    'nombre_evento' => $datos['nombre_evento'],
                    'encargado_evento' => $datos['encargado_evento'] ?? null,
                    'vehiculo_asignado' => $datos['vehiculo_asignado'] ?? null,
                    'direccion_evento' => $datos['direccion_evento'] ?? null,
                    'telefono_uno' => $datos['telefono_uno'] ?? null,
                    'telefono_dos' => $datos['telefono_dos'] ?? null,
                    'chofer_id' => $datos['chofer_id'] ?? null,
                    'cantidad' => 0,
                    'monto_garantia' => $montoGarantia,
                    'fecha_prestamo' => $datos['fecha_prestamo'],
                    'fecha_entrega' => $datos['fecha_entrega'] ?? null,
                    'fecha_esperada_devolucion' => $datos['fecha_esperada_devolucion'] ?? null,
                    'estado' => 'ACTIVO',
                    'created_by' => auth()->id(), // ✅ Usuario que creó el préstamo
                ]);

                // ✅ Asociar múltiples ventas (relación many-to-many)
                if (!empty($datos['ventas_ids']) && is_array($datos['ventas_ids'])) {
                    $prestamo->ventas()->attach(array_filter($datos['ventas_ids']));
                    Log::info('✅ Ventas asociadas al préstamo', [
                        'prestamo_evento_id' => $prestamo->id,
                        'ventas_ids' => $datos['ventas_ids'],
                    ]);
                }

                // Crear ubicación si viene en los datos
                if (isset($datos['ubicacion'])) {
                    $datosUbicacion = $datos['ubicacion'];

                    // Si es ubicación manual, validar que tenga localidad_id
                    if (isset($datosUbicacion['es_ubicacion_manual']) && $datosUbicacion['es_ubicacion_manual']) {
                        if (!isset($datosUbicacion['localidad_id'])) {
                            throw new \Exception('Ubicación manual requiere localidad_id');
                        }
                    }

                    $prestamo->ubicacion()->create($datosUbicacion);

                    Log::info('✅ Ubicación del préstamo de evento creada', [
                        'prestamo_evento_id' => $prestamo->id,
                        'ubicacion_data' => $datosUbicacion
                    ]);
                }

                Log::info('✅ Cliente EVENTOS asignado automáticamente', [
                    'prestamo_evento_id' => $prestamo->id,
                    'cliente_id' => $clienteEventosId,
                ]);

                // Crear detalles y actualizar stock
                $detalles = $datos['detalles'] ?? [];

                foreach ($detalles as $detalle) {
                    $cantidadTotal_detalle = (int) $detalle['cantidad'];

                    // Crear detalle de préstamo
                    $prestamoDetalle = PrestamoEventoDetalle::create([
                        'prestamo_evento_id' => $prestamo->id,
                        'prestable_id' => $detalle['prestable_id'],
                        'cantidad_prestada' => $cantidadTotal_detalle,
                        'monto_garantia' => 0,
                        'estado' => 'ACTIVO',
                    ]);

                    $cantidadTotal += $cantidadTotal_detalle;

                    // Determinar almacenes a usar
                    $almacenesAUsar = [];

                    // CASO 1: Detalle especifica múltiples almacenes (NUEVO)
                    if (!empty($detalle['almacenes']) && is_array($detalle['almacenes'])) {
                        $almacenesAUsar = $detalle['almacenes'];
                    }
                    // CASO 2: Usar almacén de cabecera (ANTIGUO - compatibilidad)
                    elseif (!empty($detalle['almacenes_ids']) && is_array($detalle['almacenes_ids'])) {
                        foreach (array_filter(array_map('intval', $detalle['almacenes_ids'])) as $almacenId) {
                            $almacenesAUsar[] = ['almacenes_prestables_id' => $almacenId, 'cantidad' => null];
                        }
                    }
                    elseif ($almacenCabecera) {
                        $almacenesAUsar = [
                            ['almacenes_prestables_id' => $almacenCabecera, 'cantidad' => null]
                        ];
                    }
                    else {
                        throw new \Exception("Debe especificar almacenes_prestables_id en cabecera o detalles.almacenes");
                    }

                    // Procesar cada almacén
                    $cantidadDistribuida = 0;
                    foreach ($almacenesAUsar as $index => $almacenData) {
                        $almacenId = (int) $almacenData['almacenes_prestables_id'];

                        // Si hay cantidad específica, usarla; sino, distribuir proporcionalmente
                        if (!empty($almacenData['cantidad']) && is_numeric($almacenData['cantidad'])) {
                            $cantidadAlmacen = (int) $almacenData['cantidad'];
                        } else {
                            // Distribuir cantidad restante entre almacenes sin cantidad específica
                            $almacenesSinCantidad = count(array_filter($almacenesAUsar, fn($a) => empty($a['cantidad'])));
                            $cantidadRestante = $cantidadTotal_detalle - $cantidadDistribuida;
                            $cantidadAlmacen = $almacenesSinCantidad > 0 ? floor($cantidadRestante / $almacenesSinCantidad) : $cantidadRestante;

                            // El último almacén toma el resto
                            if ($index === count($almacenesAUsar) - 1) {
                                $cantidadAlmacen = $cantidadRestante;
                            }
                        }

                        if ($cantidadAlmacen <= 0) {
                            continue;
                        }

                        // Obtener info del almacén
                        $almacen = AlmacenPrestable::findOrFail($almacenId);

                        // Registrar en tabla pivot PrestamoEventoAlmacen
                        PrestamoEventoAlmacen::create([
                            'prestamo_evento_detalle_id' => $prestamoDetalle->id,
                            'almacenes_prestables_id' => $almacenId,
                            'cantidad' => $cantidadAlmacen,
                            'es_proveedor' => (bool) $almacen->es_proveedor,
                        ]);

                        // Consumir stock del almacén
                        $stock = PrestableStock::where('prestable_id', $detalle['prestable_id'])
                            ->where('almacenes_prestables_id', $almacenId)
                            ->firstOrFail();

                        if ((int) $stock->cantidad_disponible < $cantidadAlmacen) {
                            throw new \Exception("Stock insuficiente en almacén {$almacen->nombre}. Disponible: {$stock->cantidad_disponible}, solicitado: {$cantidadAlmacen}");
                        }

                        $disponibleAntes = $stock->cantidad_disponible;

                        // Actualizar stock
                        $stock->update([
                            'cantidad_disponible' => $stock->cantidad_disponible - $cantidadAlmacen,
                            'cantidad_evento_deudor' => $stock->cantidad_evento_deudor + $cantidadAlmacen,
                        ]);

                        $stock->refresh();
                        $cantidadDistribuida += $cantidadAlmacen;

                        // Registrar movimiento
                        $this->movimientoService->registrarMovimiento([
                            'prestable_stock_id' => $stock->id,
                            'almacenes_prestables_id' => $almacenId,
                            'tipo' => 'CONSUMO_RESERVA',
                            'cantidad' => -$cantidadAlmacen,
                            'disponible_anterior' => $disponibleAntes,
                            'disponible_posterior' => $stock->cantidad_disponible,
                            'categoria_afectada' => 'prestamo_evento',
                            'motivo' => 'Préstamo a evento',
                            'observaciones' => "Evento: {$datos['nombre_evento']}",
                            'referencia_tipo' => 'PRESTAMO_EVENTO',
                            'referencia_id' => $prestamo->id,
                        ]);

                        Log::info('✅ Stock consumido para evento', [
                            'prestamo_evento_id' => $prestamo->id,
                            'prestable_id' => $detalle['prestable_id'],
                            'almacen_id' => $almacenId,
                            'cantidad' => $cantidadAlmacen,
                        ]);
                    }
                }

                // Actualizar cantidad total en encabezado
                $prestamo->update(['cantidad' => $cantidadTotal]);

                Log::info('✅ Préstamo a evento creado (con soporte de múltiples almacenes)', [
                    'prestamo_evento_id' => $prestamo->id,
                    'nombre_evento' => $datos['nombre_evento'],
                    'cantidad_total' => $cantidadTotal,
                ]);

                return $prestamo;
            });
        } catch (\Exception $e) {
            Log::error('❌ Error creando préstamo a evento', [
                'error' => $e->getMessage(),
                'datos' => $datos,
            ]);

            return false;
        }
    }

    /**
     * Registrar devolución de evento
     *
     * @param array $datos
     * {
     *   'prestamo_evento_id': int,
     *   'fecha_devolucion': date,
     *   'chofer_id': ?int,
     *   'monto_cobrado_daño_total': float,
     *   'monto_garantia_devuelta_total': float,
     *   'observaciones': ?string,
     *   'almacen_id': int,
     *   'detalles': [
     *     {
     *       'prestamo_evento_detalle_id': int,
     *       'cantidad_devuelta': int,
     *       'cantidad_dañada_parcial': int,
     *       'cantidad_dañada_total': int,
     *       'monto_cobrado_daño': float,
     *       'monto_garantia_devuelta': float,
     *     },
     *     ...
     *   ]
     * }
     */
    public function registrarDevolucion(array $datos): DevolucionEvento|false
    {
        try {
            return DB::transaction(function () use ($datos) {
                // ✅ DEBUG: Verificar qué recibe el servicio
                Log::info('🔧 SERVICIO EVENTO - DATOS RECIBIDOS', [
                    'tiene_prestamo_evento_id' => isset($datos['prestamo_evento_id']),
                    'prestamo_evento_id' => $datos['prestamo_evento_id'] ?? 'NO EXISTE',
                    'detalles_count' => count($datos['detalles'] ?? []),
                    'todas_las_keys' => array_keys($datos),
                ]);

                $prestamo = PrestamoEvento::findOrFail($datos['prestamo_evento_id']);

                Log::info('📦 Procesando devolución evento', [
                    'prestamo_evento_id' => $prestamo->id,
                    'monto_cobrado_daño_total_header' => $datos['monto_cobrado_daño_total'] ?? 0,
                    'cantidad_detalles' => count($datos['detalles'] ?? []),
                ]);

                // Crear encabezado de devolución
                $devolucion = DevolucionEvento::create([
                    'prestamo_evento_id' => $prestamo->id,
                    'fecha_devolucion' => $datos['fecha_devolucion'],
                    'cantidad_total_devuelta' => 0, // Se calcula
                    'monto_cobrado_daño_total' => (float) ($datos['monto_cobrado_daño_total'] ?? 0),
                    'monto_garantia_devuelta_total' => (float) ($datos['monto_garantia_devuelta_total'] ?? 0),
                    'observaciones' => $datos['observaciones'] ?? null,
                    'chofer_id' => $datos['chofer_id'] ?? null,
                ]);

                $almacenId = $datos['almacen_id'] ?? 1;
                $cantidadDevueltaTotal = 0;

                // Procesar detalles de devolución
                foreach ($datos['detalles'] ?? [] as &$detalleData) {
                    $detallePrestamoEvento = PrestamoEventoDetalle::findOrFail($detalleData['prestamo_evento_detalle_id']);
                    $cantidadDevuelta = (int) ($detalleData['cantidad_devuelta'] ?? 0);
                    $cantidadDañadaTotal = (int) ($detalleData['cantidad_dañada_total'] ?? 0);

                    // Registrar detalle de devolución
                    $detalleDevolucion = DevolucionEventoDetalle::create([
                        'devolucion_evento_id' => $devolucion->id,
                        'prestamo_evento_detalle_id' => $detallePrestamoEvento->id,
                        'cantidad_devuelta' => $cantidadDevuelta,
                        'cantidad_dañada_parcial' => 0,
                        'cantidad_dañada_total' => $cantidadDañadaTotal,
                        'monto_cobrado_daño' => (float) ($detalleData['monto_cobrado_daño'] ?? 0),
                        'monto_garantia_devuelta' => (float) ($detalleData['monto_garantia_devuelta'] ?? 0),
                    ]);

                    // ✅ CENTRALIZADO: Calcular devolucionesAlmacenes (automático o manual)
                    $devolucionesAlmacenes = $this->calcularDevolucionesAutomaticas($detalleData, $prestamo);
                    $condicion = PrestableCondicion::where('prestable_id', $detallePrestamoEvento->prestable_id)->first();

                    if (!empty($devolucionesAlmacenes)) {
                        // ✅ NUEVO: Validar que los valores de almacenes sumen correctamente
                        $sumaCantidadDevuelta = array_sum(array_map(fn($a) => (int) ($a['cantidad_devuelta'] ?? 0), $devolucionesAlmacenes));
                        $sumaCantidadDanada = array_sum(array_map(fn($a) => (int) ($a['cantidad_dañada_total'] ?? 0), $devolucionesAlmacenes));

                        if ($sumaCantidadDevuelta !== $cantidadDevuelta) {
                            throw new \Exception(
                                "❌ Inconsistencia de cantidades devueltas para detalle {$detalleData['prestamo_evento_detalle_id']}: " .
                                "suma de almacenes ({$sumaCantidadDevuelta}) ≠ cantidad total ({$cantidadDevuelta})"
                            );
                        }

                        if ($sumaCantidadDanada !== $cantidadDañadaTotal) {
                            throw new \Exception(
                                "❌ Inconsistencia de cantidades dañadas para detalle {$detalleData['prestamo_evento_detalle_id']}: " .
                                "suma de almacenes ({$sumaCantidadDanada}) ≠ cantidad total ({$cantidadDañadaTotal})"
                            );
                        }

                        // ✅ NUEVO: Validar que NO se devuelve más de lo prestado POR CADA ALMACÉN
                        $this->validarDevolucionPorAlmacen($detallePrestamoEvento, $devolucionesAlmacenes);

                        // ✅ El usuario especificó almacenes en la devolución
                        Log::info('🔍 Devolución evento por almacenes especificados', [
                            'prestable_id' => $detallePrestamoEvento->prestable_id,
                            'cantidad_almacenes' => count($devolucionesAlmacenes),
                            'suma_cantidad_devuelta' => $sumaCantidadDevuelta,
                            'suma_cantidad_danada' => $sumaCantidadDanada,
                        ]);

                        // ✅ Procesar cada almacén especificado
                        foreach ($devolucionesAlmacenes as $almacenDev) {
                            $almacenIdDev = $almacenDev['almacenes_prestables_id'];
                            $cantDevAlmacen = (int) ($almacenDev['cantidad_devuelta'] ?? 0);
                            $cantDanAlmacen = (int) ($almacenDev['cantidad_dañada_total'] ?? 0);
                            // ✅ CRÍTICO: Usar es_proveedor del array calculado, no buscar de nuevo en BD
                            $esProveedor = (bool) ($almacenDev['es_proveedor'] ?? false);

                            // ✅ NUEVO: Obtener nombre del almacén para el log
                            $almacenObj = AlmacenPrestable::find($almacenIdDev);
                            $almacenNombre = $almacenObj?->nombre ?? "Almacén #{$almacenIdDev}";

                            // Crear registro en DevolucionEventoDetalleAlmacen
                            if ($cantDevAlmacen > 0 || $cantDanAlmacen > 0) {
                                DevolucionEventoDetalleAlmacen::create([
                                    'devolucion_evento_detalle_id' => $detalleDevolucion->id,
                                    'almacenes_prestables_id' => $almacenIdDev,
                                    'cantidad_devuelta' => $cantDevAlmacen,
                                    'cantidad_dañada_parcial' => 0,
                                    'cantidad_dañada_total' => $cantDanAlmacen,
                                    'monto_cobrado_daño' => $cantDanAlmacen * ($condicion->monto_daño_total ?? 0),
                                    'monto_garantia_devuelta' => $cantDevAlmacen * ($condicion->monto_garantia ?? 0),
                                    'es_proveedor' => $esProveedor,
                                ]);

                                // Obtener stock ANTES de devolver
                                $stock = PrestableStock::where('prestable_id', $detallePrestamoEvento->prestable_id)
                                    ->where('almacenes_prestables_id', $almacenIdDev)
                                    ->first();
                                $disponibleAntes = $stock->cantidad_disponible ?? 0;
                                $eventoDeudorAntes = $stock->cantidad_evento_deudor ?? 0;
                                $eventoDañadaAntes = $stock->cantidad_evento_dañada ?? 0;

                                // ✅ Actualizar stock con devolución de evento
                                if ($stock) {
                                    $stock->update([
                                        'cantidad_disponible' => $stock->cantidad_disponible + $cantDevAlmacen,
                                        'cantidad_evento_deudor' => max(0, $stock->cantidad_evento_deudor - $cantDevAlmacen),
                                        'cantidad_evento_dañada' => $stock->cantidad_evento_dañada + $cantDanAlmacen,
                                    ]);
                                }

                                // Registrar movimiento de devolución POR ALMACÉN
                                $this->movimientoService->registrarMovimiento([
                                    'prestable_stock_id' => $stock->id,
                                    'almacenes_prestables_id' => $almacenIdDev,
                                    'usuario_id' => auth()->id(),
                                    'tipo' => 'ENTRADA',
                                    'cantidad' => $cantDevAlmacen,
                                    'cantidad_dañada_registrada' => $cantDanAlmacen,
                                    'disponible_anterior' => $disponibleAntes,
                                    'disponible_posterior' => $stock->cantidad_disponible,
                                    'cantidad_evento_dañada_anterior' => $eventoDañadaAntes,
                                    'cantidad_evento_dañada_posterior' => $stock->cantidad_evento_dañada,
                                    'categoria_afectada' => 'evento_devolucion',
                                    'motivo' => 'Devolución de evento',
                                    'observaciones' => "Evento: {$prestamo->nombre_evento}, Almacén: {$almacenNombre}",
                                    'numero_referencia' => $prestamo->id,
                                    'referencia_tipo' => 'DEVOLUCION_EVENTO',
                                    'referencia_id' => $devolucion->id,
                                ]);

                                Log::info('✅ Devolución evento procesada por almacén', [
                                    'prestable_id' => $detallePrestamoEvento->prestable_id,
                                    'almacen_id' => $almacenIdDev,
                                    'cantidad_devuelta' => $cantDevAlmacen,
                                    'cantidad_dañada' => $cantDanAlmacen,
                                ]);
                            }
                        }
                    } else {
                        throw new \Exception('No se pudo determinar almacén para la devolución. Contacte soporte.');
                    }

                    Log::info('💰 Detalle de devolución evento procesado', [
                        'prestable_id' => $detallePrestamoEvento->prestable_id,
                        'cantidad_dañada' => $cantidadDañadaTotal,
                        'monto_desde_frontend' => $detalleData['monto_cobrado_daño'] ?? 0,
                        'monto_final_usado' => (float) ($detalleData['monto_cobrado_daño'] ?? 0),
                    ]);

                    // ✅ NUEVO: Calcular TOTAL DEVUELTO para este detalle y actualizar estado
                    // IMPORTANTE: Incluir TANTO cantidad_devuelta (buen estado) COMO cantidad_dañada_total
                    // porque ambos se "devolvieron" (ya no hay que devolverlos)
                    // CRÍTICO: Sumar lo que YA se había devuelto ANTES + lo que se acaba de devolver AHORA
                    $totalDevueltoAntes = $detallePrestamoEvento->devolucionDetalles()
                        ->where('id', '!=', $detalleDevolucion->id)  // Excluir la que acabamos de crear
                        ->sum(\DB::raw('cantidad_devuelta + cantidad_dañada_total'));
                    $totalDevueltoAhora = $totalDevueltoAntes + $cantidadDevuelta + $cantidadDañadaTotal;

                    // 🔍 DEBUG: Log detallado del cálculo
                    Log::info('🔍 DEBUG - Cálculo de estado del detalle evento', [
                        'detalle_id' => $detallePrestamoEvento->id,
                        'prestable_nombre' => $detallePrestamoEvento->prestable?->nombre,
                        'cantidad_prestada' => $detallePrestamoEvento->cantidad_prestada,
                        'cantidad_devuelta_antes' => $totalDevueltoAntes,
                        'cantidad_devuelta_ahora_en_esta_devolución' => $cantidadDevuelta,
                        'total_devuelto_acumulado' => $totalDevueltoAhora,
                        'comparacion' => "{$totalDevueltoAhora} >= {$detallePrestamoEvento->cantidad_prestada}? = " . ($totalDevueltoAhora >= $detallePrestamoEvento->cantidad_prestada ? 'YES (COMPLETAMENTE)' : 'NO (PARCIALMENTE)'),
                    ]);

                    // Actualizar estado del detalle basado en lo completamente devuelto
                    if ($totalDevueltoAhora >= $detallePrestamoEvento->cantidad_prestada) {
                        $detallePrestamoEvento->update(['estado' => 'COMPLETAMENTE_DEVUELTO']);
                    } else {
                        $detallePrestamoEvento->update(['estado' => 'PARCIALMENTE_DEVUELTO']);
                    }

                    Log::info('✅ Estado del detalle evento actualizado', [
                        'detalle_id' => $detallePrestamoEvento->id,
                        'cantidad_prestada' => $detallePrestamoEvento->cantidad_prestada,
                        'cantidad_total_devuelta' => $totalDevueltoAhora,
                        'nuevo_estado' => $detallePrestamoEvento->estado,
                    ]);

                    $cantidadDevueltaTotal += $cantidadDevuelta;
                }

                // Actualizar cantidad total
                $devolucion->update(['cantidad_total_devuelta' => $cantidadDevueltaTotal]);

                // Actualizar estado del préstamo si es completamente devuelto
                // IMPORTANTE: Contar detalles que NO sean completamente devueltos
                $detallesPendientes = PrestamoEventoDetalle::where('prestamo_evento_id', $prestamo->id)
                    ->where('estado', '!=', 'COMPLETAMENTE_DEVUELTO')
                    ->count();

                if ($detallesPendientes === 0) {
                    $prestamo->update(['estado' => 'COMPLETAMENTE_DEVUELTO']);
                } else {
                    $prestamo->update(['estado' => 'PARCIALMENTE_DEVUELTO']);
                }

                return $devolucion;
            });
        } catch (\Exception $e) {
            Log::error('❌ Error registrando devolución de evento', [
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Obtener resumen de un préstamo a evento
     */
    public function obtenerResumen(int $prestamoEventoId): array|null
    {
        $prestamo = PrestamoEvento::with('detalles.prestable', 'devoluciones.detalles')
            ->find($prestamoEventoId);

        if (!$prestamo) {
            return null;
        }

        $detalles = [];
        $totalPrestado = 0;
        $totalDevuelto = 0;
        $totalEnCampo = 0;

        foreach ($prestamo->detalles as $detalle) {
            $cantidadPrestada = $detalle->cantidad_prestada;
            $cantidadDevuelta = $detalle->devoluciones->sum('cantidad_devuelta');
            $cantidadEnCampo = $cantidadPrestada - $cantidadDevuelta;

            $totalPrestado += $cantidadPrestada;
            $totalDevuelto += $cantidadDevuelta;
            $totalEnCampo += $cantidadEnCampo;

            $detalles[] = [
                'prestable_id' => $detalle->prestable_id,
                'prestable_nombre' => $detalle->prestable->nombre,
                'cantidad_prestada' => $cantidadPrestada,
                'cantidad_devuelta' => $cantidadDevuelta,
                'cantidad_en_campo' => $cantidadEnCampo,
            ];
        }

        return [
            'prestamo_evento_id' => $prestamo->id,
            'nombre_evento' => $prestamo->nombre_evento,
            'fecha_prestamo' => $prestamo->fecha_prestamo,
            'fecha_esperada_devolucion' => $prestamo->fecha_esperada_devolucion,
            'estado' => $prestamo->estado,
            'cantidad_total_prestada' => $totalPrestado,
            'cantidad_total_devuelta' => $totalDevuelto,
            'cantidad_en_campo' => $totalEnCampo,
            'detalles' => $detalles,
        ];
    }

    /**
     * Anular préstamo a evento
     *
     * Devuelve automáticamente todos los prestables al almacén de origen
     */
    /**
     * Anular préstamo a evento - cancela y devuelve stock al almacén
     * ✅ CORREGIDO: Itera por PrestamoEventoAlmacen (como al crear)
     * Genera 1 movimiento por almacén del detalle, NO movimientos extras
     *
     * @param int $prestamoEventoId ID del préstamo
     * @param ?string $razonAnulacion Razón de la anulación
     */
    public function anularPrestamo(int $prestamoEventoId, ?string $razonAnulacion = null): PrestamoEvento|false
    {
        try {
            return DB::transaction(function () use ($prestamoEventoId, $razonAnulacion) {
                $prestamo = PrestamoEvento::with(['detalles.almacenes'])->find($prestamoEventoId);

                if (!$prestamo) {
                    throw new \Exception('Préstamo a evento no encontrado');
                }

                if ($prestamo->estado === 'CANCELADO') {
                    throw new \Exception('El préstamo ya está cancelado');
                }

                // ✅ ITERAR POR CADA DETALLE
                foreach ($prestamo->detalles as $detalle) {
                    // Si el detalle ya está completamente devuelto, solo cambiar estado
                    if ($detalle->estado === 'COMPLETAMENTE_DEVUELTO') {
                        $detalle->update(['estado' => 'CANCELADO']);
                        continue;
                    }

                    // ✅ ITERAR POR CADA ALMACÉN DEL DETALLE (como se creó)
                    $almacenesDetalle = PrestamoEventoAlmacen::where(
                        'prestamo_evento_detalle_id',
                        $detalle->id
                    )->get();

                    foreach ($almacenesDetalle as $almacenDetalle) {
                        // Calcular cantidad ya devuelta de ESTE almacén específico
                        $cantidadDevueltaDelAlmacen = (int) DB::table('devolucion_evento_detalle_almacenes as deda')
                            ->join('devolucion_evento_detalle as ded', 'deda.devolucion_evento_detalle_id', '=', 'ded.id')
                            ->where('ded.prestamo_evento_detalle_id', $detalle->id)
                            ->where('deda.almacenes_prestables_id', $almacenDetalle->almacenes_prestables_id)
                            ->sum(DB::raw('deda.cantidad_devuelta + deda.cantidad_dañada_total'));

                        $cantidadPendienteDelAlmacen = $almacenDetalle->cantidad - $cantidadDevueltaDelAlmacen;

                        if ($cantidadPendienteDelAlmacen > 0) {
                            // Obtener stock ANTES de devolver
                            $stock = PrestableStock::where('prestable_id', $detalle->prestable_id)
                                ->where('almacenes_prestables_id', $almacenDetalle->almacenes_prestables_id)
                                ->firstOrFail();

                            $disponibleAntes = $stock->cantidad_disponible;
                            $eventoDeudorAntes = $stock->cantidad_evento_deudor;

                            // Devolver
                            $stock->update([
                                'cantidad_disponible' => $stock->cantidad_disponible + $cantidadPendienteDelAlmacen,
                                'cantidad_evento_deudor' => max(0, $stock->cantidad_evento_deudor - $cantidadPendienteDelAlmacen),
                            ]);

                            // ✅ 1 MOVIMIENTO POR ALMACÉN (espejo del proceso de creación)
                            $this->movimientoService->registrarMovimiento([
                                'prestable_stock_id' => $stock->id,
                                'almacenes_prestables_id' => $almacenDetalle->almacenes_prestables_id,
                                'usuario_id' => auth()->id(),
                                'tipo' => 'ENTRADA',
                                'cantidad' => $cantidadPendienteDelAlmacen,
                                'disponible_anterior' => $disponibleAntes,
                                'evento_deudor_anterior' => $eventoDeudorAntes,
                                'disponible_posterior' => $stock->cantidad_disponible,
                                'evento_deudor_posterior' => $stock->cantidad_evento_deudor,
                                'categoria_afectada' => 'prestamo_evento',
                                'motivo' => 'Devolución por anulación de préstamo a evento',
                                'numero_referencia' => $prestamo->id,
                                'referencia_tipo' => 'PRESTAMO_EVENTO_ANULADO',
                                'referencia_id' => $prestamo->id,
                                'observaciones' => $razonAnulacion,
                            ]);

                            Log::info('✅ Stock devuelto por anulación de evento (almacén específico)', [
                                'prestamo_id' => $prestamo->id,
                                'detalle_id' => $detalle->id,
                                'almacen_id' => $almacenDetalle->almacenes_prestables_id,
                                'cantidad_pendiente_almacen' => $cantidadPendienteDelAlmacen,
                                'disponible_posterior' => $stock->cantidad_disponible,
                            ]);
                        }
                    }

                    // Cambiar estado del detalle a CANCELADO
                    $detalle->update(['estado' => 'CANCELADO']);
                }

                // Actualizar estado y observaciones del préstamo
                $prestamo->update([
                    'estado' => 'CANCELADO',
                    'observaciones' => $razonAnulacion ?
                        trim(($prestamo->observaciones ?? '') . " [ANULADO: $razonAnulacion]") :
                        $prestamo->observaciones,
                ]);

                Log::info('✅ Préstamo a evento anulado correctamente', [
                    'prestamo_evento_id' => $prestamo->id,
                    'cantidad_detalles' => count($prestamo->detalles),
                    'razon_anulacion' => $razonAnulacion,
                ]);

                return $prestamo;
            });
        } catch (\Exception $e) {
            Log::error('❌ Error anulando préstamo a evento', [
                'error' => $e->getMessage(),
                'prestamo_evento_id' => $prestamoEventoId,
            ]);

            return false;
        }
    }
}
