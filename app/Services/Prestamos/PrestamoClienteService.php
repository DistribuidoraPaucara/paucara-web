<?php

namespace App\Services\Prestamos;

use App\Models\PrestamoCliente;
use App\Models\PrestamoClienteDetalle;
use App\Models\PrestamoClienteAlmacen;
use App\Models\DevolucionCliente;
use App\Models\DevolucionClienteDetalle;
use App\Models\DevolucionClienteDetalleAlmacen;
use App\Models\PrestableCondicion;
use App\Models\PrestableStock;
use App\Models\AlmacenPrestable;
use App\Services\Prestamos\PrestableStockAdvancedService;
use App\Services\MovimientoPrestableService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * PrestamoClienteService
 *
 * Gestiona préstamos y devoluciones de canastillas/embases a clientes
 */
class PrestamoClienteService
{
    private PrestableStockService $stockService;
    private PrestableStockAdvancedService $stockAdvancedService;
    private MovimientoPrestableService $movimientoService;

    public function __construct(
        PrestableStockService $stockService,
        PrestableStockAdvancedService $stockAdvancedService,
        MovimientoPrestableService $movimientoService
    )
    {
        $this->stockService = $stockService;
        $this->stockAdvancedService = $stockAdvancedService;
        $this->movimientoService = $movimientoService;
    }

    /**
     * ✅ NUEVO: Validar que no se devuelve más de lo prestado POR CADA ALMACÉN
     * Consulta PrestamoClienteAlmacen (prestado) vs DevolucionClienteDetalleAlmacen (devuelto)
     *
     * @param PrestamoClienteDetalle $detalle Detalle del préstamo
     * @param array $devolucionesAlmacenes Array con las devoluciones por almacén
     * @throws \Exception Si algún almacén excede lo prestado
     */
    private function validarDevolucionPorAlmacen(PrestamoClienteDetalle $detalle, array $devolucionesAlmacenes): void
    {
        foreach ($devolucionesAlmacenes as $almacenDev) {
            $almacenId = (int) $almacenDev['almacenes_prestables_id'];
            $cantDevAlmacen = (int) ($almacenDev['cantidad_devuelta'] ?? 0);
            $cantDanAlmacen = (int) ($almacenDev['cantidad_dañada_total'] ?? 0);
            $cantTotalAlmacen = $cantDevAlmacen + $cantDanAlmacen;

            // Cantidad prestada de ESTE almacén específico
            $cantidadPrestadaAlmacen = (int) PrestamoClienteAlmacen::where('prestamo_cliente_detalle_id', $detalle->id)
                ->where('almacenes_prestables_id', $almacenId)
                ->value('cantidad') ?? 0;

            if ($cantidadPrestadaAlmacen === 0) {
                throw new \Exception(
                    "❌ Almacén {$almacenId} no fue usado para prestar el detalle {$detalle->id}. " .
                    "No se puede devolver de un almacén del cual no se prestó."
                );
            }

            // Cantidad DEVUELTA de ESTE almacén específico (en devoluciones anteriores)
            $cantidadDevueltaAlmacen = (int) DB::table('devolucion_cliente_detalle_almacenes as dcda')
                ->join('devolucion_cliente_detalle as dcd', 'dcda.devolucion_cliente_detalle_id', '=', 'dcd.id')
                ->where('dcd.prestamo_cliente_detalle_id', $detalle->id)
                ->where('dcda.almacenes_prestables_id', $almacenId)
                ->sum(DB::raw('dcda.cantidad_devuelta + dcda.cantidad_dañada_total'));

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

            \Log::info('✅ Validación por almacén correcta', [
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
     * @param PrestamoCliente $prestamo Préstamo asociado
     * @return array Array de almacenes con cantidades calculadas
     */
    private function calcularDevolucionesAutomaticas(array $detalleData, PrestamoCliente $prestamo): array
    {
        // ✅ SIEMPRE calcular automáticamente basado en PrestamoClienteAlmacen
        // Ignorar lo que venga del frontend para asegurar correcta distribución FIFO

        $cantidadDevuelta = (int) ($detalleData['cantidad_devuelta'] ?? 0);
        $cantidadDañadaTotal = (int) ($detalleData['cantidad_dañada_total'] ?? 0);
        $detalleId = (int) ($detalleData['prestamo_cliente_detalle_id'] ?? null);

        if (!$detalleId) {
            return [];
        }

        // ✅ OBTENER ALMACENES EN ORDEN FIFO (del histórico de lo que se prestó)
        $almacenesHistoricos = \DB::table('prestamo_cliente_almacenes')
            ->where('prestamo_cliente_detalle_id', $detalleId)
            ->orderBy('id', 'asc') // FIFO: primeros registrados primero
            ->get(['almacenes_prestables_id', 'cantidad']);

        if ($almacenesHistoricos->isEmpty()) {
            return [];
        }

        $devolucionesAlmacenes = [];
        $cantidadRestante = $cantidadDevuelta;

        // ✅ ITERAR EN ORDEN Y CALCULAR CUÁNTO FALTA DEVOLVER DE CADA UNO
        foreach ($almacenesHistoricos as $almacenHistorico) {
            if ($cantidadRestante <= 0) break;

            $almacenId = $almacenHistorico->almacenes_prestables_id;
            $cantidadPrestada = (int) $almacenHistorico->cantidad;

            // Calcular cuánto ya fue devuelto de ESTE almacén
            $cantidadDevueltaDelAlmacen = (int) \DB::table('devolucion_cliente_detalle_almacenes as dcda')
                ->join('devolucion_cliente_detalle as dcd', 'dcda.devolucion_cliente_detalle_id', '=', 'dcd.id')
                ->where('dcd.prestamo_cliente_detalle_id', $detalleId)
                ->where('dcda.almacenes_prestables_id', $almacenId)
                ->sum('dcda.cantidad_devuelta');

            $faltaPorDevolver = $cantidadPrestada - $cantidadDevueltaDelAlmacen;

            \Log::info('📊 Análisis de devolución por almacén', [
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

            $devolucionesAlmacenes[] = [
                'almacenes_prestables_id' => $almacenId,
                'cantidad_devuelta' => $aDevolverDeEste,
                'cantidad_dañada_total' => 0,
                'es_proveedor' => false, // Se obtendrá después si es necesario
            ];

            $cantidadRestante -= $aDevolverDeEste;
        }

        // Si aún hay cantidad que distribuir pero no hay más almacenes, registrar error
        if ($cantidadRestante > 0) {
            \Log::warning('❌ No se pudo distribuir toda la devolución - excede lo prestado', [
                'detalle_id' => $detalleId,
                'cantidad_solicitada' => $cantidadDevuelta,
                'cantidad_prestada_total' => $almacenesHistoricos->sum('cantidad'),
                'cantidad_ya_devuelta_total' => $cantidadDevuelta - $cantidadRestante,
                'cantidad_excedente' => $cantidadRestante,
            ]);

            throw new \Exception(
                "Cantidad a devolver ({$cantidadDevuelta}) excede total prestado (" .
                $almacenesHistoricos->sum('cantidad') . "). Ya devuelto: " .
                ($cantidadDevuelta - $cantidadRestante)
            );
        }

        // Distribuir cantidad dañada al último almacén procesado
        if ($cantidadDañadaTotal > 0 && !empty($devolucionesAlmacenes)) {
            $devolucionesAlmacenes[count($devolucionesAlmacenes) - 1]['cantidad_dañada_total'] = $cantidadDañadaTotal;
        }

        return $devolucionesAlmacenes;
    }

    /**
     * Crear préstamo a cliente con múltiples detalles desde UN SOLO almacén
     *
     * @param array $datos
     * {
     *   'cliente_id': int,
     *   'almacenes_prestables_id': int,
     *   'venta_id': ?int,
     *   'chofer_id': ?int,
     *   'vehiculo_id': ?int,
     *   'tipo_prestamo': 'canastillas'|'embases'|'canastillas_embases',
     *   'es_venta': bool,
     *   'es_evento': ?bool,
     *   'monto_garantia': ?float,
     *   'fecha_prestamo': date,
     *   'fecha_esperada_devolucion': ?date,
     *   'observaciones': ?string,
     *   'detalles': [
     *     {
     *       'prestable_id': int,
     *       'cantidad': int,
     *       'precio_unitario': ?float,
     *       'precio_prestamo': ?float,
     *     },
     *     ...
     *   ]
     * }
     */
    public function crearPrestamo(array $datos): PrestamoCliente|false
    {
        try {
            return DB::transaction(function () use ($datos) {
                // Usar monto de garantía enviado por el usuario
                $montoGarantia = (float) ($datos['monto_garantia'] ?? 0);
                $almacenId = (int) $datos['almacenes_prestables_id'];

                // Crear registro encabezado de préstamo
                $prestamo = PrestamoCliente::create([
                    'cliente_id' => $datos['cliente_id'],
                    'almacenes_prestables_id' => $almacenId,
                    'venta_id' => $datos['venta_id'] ?? null,
                    'chofer_id' => $datos['chofer_id'] ?? null,
                    'vehiculo_id' => $datos['vehiculo_id'] ?? null,
                    'telefono_cliente_1' => $datos['telefono_cliente_1'] ?? null,
                    'telefono_cliente_2' => $datos['telefono_cliente_2'] ?? null,
                    'tipo_prestamo' => $datos['tipo_prestamo'] ?? 'canastillas_embases',
                    'es_venta' => $datos['es_venta'],
                    'es_evento' => $datos['es_evento'] ?? false,
                    'monto_garantia' => $montoGarantia,
                    'fecha_prestamo' => $datos['fecha_prestamo'],
                    'fecha_esperada_devolucion' => $datos['fecha_esperada_devolucion'] ?? null,
                    'observaciones' => $datos['observaciones'] ?? null,
                    'estado' => 'ACTIVO',
                    'created_by' => auth()->id(), // ✅ Registrar quién creó el préstamo
                ]);

                // Crear ubicación si viene en los datos
                if (isset($datos['ubicacion'])) {
                    $datosUbicacion = $datos['ubicacion'];

                    // Si es ubicación manual, validar que tenga localidad_id o dirección
                    if (isset($datosUbicacion['es_ubicacion_manual']) && $datosUbicacion['es_ubicacion_manual']) {
                        if (!isset($datosUbicacion['localidad_id'])) {
                            throw new \Exception('Ubicación manual requiere localidad_id');
                        }
                    }

                    // ✅ Agregar observaciones de la dirección principal del cliente
                    if (!isset($datosUbicacion['observaciones'])) {
                        $cliente = Cliente::find($clienteId);
                        if ($cliente && $cliente->direcciones) {
                            $direccionPrincipal = $cliente->direcciones->firstWhere('es_principal', true)
                                ?? $cliente->direcciones->first();
                            if ($direccionPrincipal && isset($direccionPrincipal->observaciones)) {
                                $datosUbicacion['observaciones'] = $direccionPrincipal->observaciones;
                            }
                        }
                    }

                    $prestamo->ubicacion()->create($datosUbicacion);

                    Log::info('✅ Ubicación del préstamo creada', [
                        'prestamo_id' => $prestamo->id,
                        'ubicacion_data' => $datosUbicacion
                    ]);
                }

                $detalles = $datos['detalles'] ?? [];

                foreach ($detalles as $detalle) {
                    $detalleCreado = PrestamoClienteDetalle::create([
                        'prestamo_cliente_id' => $prestamo->id,
                        'prestable_id' => $detalle['prestable_id'],
                        'cantidad_prestada' => $detalle['cantidad'],
                        'con_liquido' => $detalle['con_liquido'] ?? 0,
                        'sin_liquido' => $detalle['sin_liquido'] ?? 0,
                        'precio_unitario' => $detalle['precio_unitario'] ?? null,
                        'precio_prestamo' => $detalle['precio_prestamo'] ?? null,
                        'estado' => 'ACTIVO',
                    ]);

                    // Determinar almacenes a consumir
                    $almacenesAConsumir = [];
                    if (!empty($detalle['almacenes']) && is_array($detalle['almacenes'])) {
                        // Múltiples almacenes: consumir de cada uno específico
                        $almacenesAConsumir = $detalle['almacenes'];
                    } elseif ($almacenId) {
                        // Solo cabecera: consumir de cabecera
                        $almacenesAConsumir = [
                            ['almacenes_prestables_id' => $almacenId, 'cantidad' => (int) $detalle['cantidad']]
                        ];
                    }

                    // Consumir stock de cada almacén
                    foreach ($almacenesAConsumir as $almacenData) {
                        $almacenId = (int) $almacenData['almacenes_prestables_id'];

                        // ✅ CORREGIDO: Obtener el valor real de es_proveedor del almacén
                        $almacenObj = AlmacenPrestable::find($almacenId);
                        if (!$almacenObj) {
                            throw new \Exception("Almacén no encontrado: {$almacenId}");
                        }

                        $resultadoConsumo = $this->consumirStockDelAlmacen(
                            (int) $detalle['prestable_id'],
                            (int) $almacenData['cantidad'],
                            $almacenId,
                            (bool) $datos['es_venta']
                        );

                        if (!($resultadoConsumo['exito'] ?? false)) {
                            throw new \Exception($resultadoConsumo['mensaje'] ?? 'Error consumiendo stock');
                        }

                        // Crear registro en PrestamoClienteAlmacen
                        PrestamoClienteAlmacen::create([
                            'prestamo_cliente_detalle_id' => $detalleCreado->id,
                            'almacenes_prestables_id' => $almacenId,
                            'cantidad' => (int) $almacenData['cantidad'],
                            'es_proveedor' => (bool) $almacenObj->es_proveedor,  // ✅ CORREGIDO: Usar valor real
                        ]);

                        // Registrar movimientos para ESTE almacén
                        foreach (($resultadoConsumo['detalles_por_almacen'] ?? []) as $detalleAlmacen) {
                            $stock = PrestableStock::where('prestable_id', (int) $detalle['prestable_id'])
                                ->where('almacenes_prestables_id', (int) $detalleAlmacen['almacen_id'])
                                ->firstOrFail();

                            $cantidadMovida = (int) $detalleAlmacen['cantidad'];
                            $disponiblePosterior = $stock->cantidad_disponible;
                            $sinLiquidoPosterior = $stock->cantidad_sin_liquido;
                            $prestamoClientePosterior = $stock->cantidad_cliente_deudor;
                            $prestamoEventoPosterior = $stock->cantidad_evento_deudor ?? 0;
                            $prestamoProveedorPosterior = $stock->cantidad_proveedor_acreedor;

                            if ($datos['es_venta']) {
                                // Para ventas: disponible disminuye
                                $this->movimientoService->registrarMovimiento([
                                    'prestable_stock_id' => $stock->id,
                                    'almacenes_prestables_id' => $detalleAlmacen['almacen_id'],
                                    'usuario_id' => auth()->id(),
                                    'tipo' => 'SALIDA',
                                    'cantidad' => -$cantidadMovida,
                                    'disponible_anterior' => $disponiblePosterior + $cantidadMovida,
                                    'disponible_posterior' => $disponiblePosterior,
                                    'cantidad_sin_liquido_anterior' => $sinLiquidoPosterior,
                                    'cantidad_sin_liquido_posterior' => $sinLiquidoPosterior,
                                    'prestamo_cliente_anterior' => $prestamoClientePosterior,
                                    'prestamo_cliente_posterior' => $prestamoClientePosterior,
                                    'prestamo_evento_anterior' => $prestamoEventoPosterior,
                                    'prestamo_evento_posterior' => $prestamoEventoPosterior,
                                    'prestamo_proveedor_anterior' => $prestamoProveedorPosterior,
                                    'prestamo_proveedor_posterior' => $prestamoProveedorPosterior,
                                    'categoria_afectada' => 'vendida',
                                    'motivo' => 'Venta a cliente',
                                    'numero_referencia' => $prestamo->id,
                                    'referencia_tipo' => 'PRESTAMO_CLIENTE',
                                    'referencia_id' => $prestamo->id,
                                    'tipo_prestamo' => $datos['tipo_prestamo'] ?? 'canastillas_embases',
                                ]);
                            } else {
                                // Para préstamos: sin_liquido disminuye, cliente_deudor incrementa, disponible NO cambia
                                $this->movimientoService->registrarMovimiento([
                                    'prestable_stock_id' => $stock->id,
                                    'almacenes_prestables_id' => $detalleAlmacen['almacen_id'],
                                    'usuario_id' => auth()->id(),
                                    'tipo' => 'CONSUMO_RESERVA',
                                    'cantidad' => -$cantidadMovida,
                                    'disponible_anterior' => $disponiblePosterior,
                                    'disponible_posterior' => $disponiblePosterior,
                                    'cantidad_sin_liquido_anterior' => $sinLiquidoPosterior + $cantidadMovida,
                                    'cantidad_sin_liquido_posterior' => $sinLiquidoPosterior,
                                    'prestamo_cliente_anterior' => $prestamoClientePosterior - $cantidadMovida,
                                    'prestamo_cliente_posterior' => $prestamoClientePosterior,
                                    'prestamo_evento_anterior' => $prestamoEventoPosterior,
                                    'prestamo_evento_posterior' => $prestamoEventoPosterior,
                                    'prestamo_proveedor_anterior' => $prestamoProveedorPosterior,
                                    'prestamo_proveedor_posterior' => $prestamoProveedorPosterior,
                                    'categoria_afectada' => 'prestamo_cliente',
                                    'motivo' => 'Préstamo a cliente',
                                    'numero_referencia' => $prestamo->id,
                                    'referencia_tipo' => 'PRESTAMO_CLIENTE',
                                    'referencia_id' => $prestamo->id,
                                    'tipo_prestamo' => $datos['tipo_prestamo'] ?? 'canastillas_embases',
                                ]);
                            }
                        }
                    }
                }

                Log::info('✅ Préstamo creado', [
                    'prestamo_id' => $prestamo->id,
                    'cliente_id' => $datos['cliente_id'],
                    'tipo_prestamo' => $datos['tipo_prestamo'] ?? 'canastillas_embases',
                    'cantidad_detalles' => count($detalles),
                    'es_venta' => $datos['es_venta'],
                ]);

                return $prestamo;
            });
        } catch (\Exception $e) {
            Log::error('❌ Error creando préstamo', [
                'error' => $e->getMessage(),
                'datos' => $datos,
            ]);
            return false;
        }
    }

    /**
     * Consumir stock de UN SOLO almacén específico.
     * ✅ MODIFICADO: Para préstamos, disminuye cantidad_sin_liquido e incrementa cantidad_cliente_deudor
     */
    private function consumirStockDelAlmacen(
        int $prestableId,
        int $cantidad,
        int $almacenId,
        bool $esVenta
    ): array {
        try {
            return DB::transaction(function () use ($prestableId, $cantidad, $almacenId, $esVenta) {
                $stock = PrestableStock::where('prestable_id', $prestableId)
                    ->where('almacenes_prestables_id', $almacenId)
                    ->firstOrFail();

                if ($esVenta) {
                    // Para ventas, validar cantidad_disponible
                    if ((int) $stock->cantidad_disponible < $cantidad) {
                        throw new \Exception("Stock insuficiente en el almacén. Disponible: {$stock->cantidad_disponible}, solicitado: {$cantidad}");
                    }

                    \Log::info('📦 VENTA - Stock ANTES', [
                        'prestable_id' => $prestableId,
                        'almacen_id' => $almacenId,
                        'cantidad_disponible' => $stock->cantidad_disponible,
                        'cantidad_sin_liquido' => $stock->cantidad_sin_liquido,
                        'cantidad_cliente_deudor' => $stock->cantidad_cliente_deudor,
                    ]);

                    $stock->update([
                        'cantidad_disponible' => $stock->cantidad_disponible - $cantidad,
                    ]);

                    \Log::info('📦 VENTA - Stock DESPUÉS', [
                        'prestable_id' => $prestableId,
                        'almacen_id' => $almacenId,
                        'cantidad_disponible' => $stock->cantidad_disponible - $cantidad,
                        'cantidad_sin_liquido' => $stock->cantidad_sin_liquido,
                        'cantidad_cliente_deudor' => $stock->cantidad_cliente_deudor,
                    ]);
                } else {
                    // ✅ MODIFICADO: Para préstamos a clientes, disminuir cantidad_sin_liquido
                    // e incrementar cantidad_cliente_deudor
                    if ((int) $stock->cantidad_sin_liquido < $cantidad) {
                        throw new \Exception("Stock sin líquido insuficiente en el almacén. Disponible: {$stock->cantidad_sin_liquido}, solicitado: {$cantidad}");
                    }

                    \Log::info('🏦 PRÉSTAMO - Stock ANTES', [
                        'prestable_id' => $prestableId,
                        'almacen_id' => $almacenId,
                        'cantidad_a_consumir' => $cantidad,
                        'cantidad_disponible' => $stock->cantidad_disponible,
                        'cantidad_sin_liquido' => $stock->cantidad_sin_liquido,
                        'cantidad_cliente_deudor' => $stock->cantidad_cliente_deudor,
                    ]);

                    $stock->update([
                        'cantidad_sin_liquido' => $stock->cantidad_sin_liquido - $cantidad,
                        'cantidad_cliente_deudor' => $stock->cantidad_cliente_deudor + $cantidad,
                    ]);

                    \Log::info('🏦 PRÉSTAMO - Stock DESPUÉS', [
                        'prestable_id' => $prestableId,
                        'almacen_id' => $almacenId,
                        'cantidad_disponible' => $stock->cantidad_disponible,
                        'cantidad_sin_liquido' => $stock->cantidad_sin_liquido - $cantidad,
                        'cantidad_cliente_deudor' => $stock->cantidad_cliente_deudor + $cantidad,
                    ]);
                }

                $almacen = AlmacenPrestable::find($almacenId);
                return [
                    'exito' => true,
                    'cantidad_consumida' => $cantidad,
                    'detalles_por_almacen' => [
                        [
                            'almacen_id' => $almacenId,
                            'almacen_nombre' => $almacen?->nombre ?? ('Almacén #' . $almacenId),
                            'cantidad' => $cantidad,
                        ]
                    ],
                    'advertencias' => [],
                    'mensaje' => 'Consumo completado desde almacén específico',
                ];
            });
        } catch (\Exception $e) {
            return [
                'exito' => false,
                'mensaje' => $e->getMessage(),
                'advertencias' => [],
            ];
        }
    }

    /**
     * Registrar devolución (parcial o total) con múltiples detalles
     *
     * @param array $datos
     * {
     *   'prestamo_cliente_id': int,
     *   'fecha_devolucion': date,
     *   'monto_cobrado_daño_total': ?float = 0,
     *   'observaciones': ?string,
     *   'chofer_id': ?int,
     *   'detalles': [
     *     {
     *       'prestamo_cliente_detalle_id': int,
     *       'cantidad_devuelta': int,
     *       'cantidad_dañada_parcial': ?int = 0,
     *       'cantidad_dañada_total': ?int = 0,
     *     },
     *     ...
     *   ]
     * }
     */
    public function registrarDevolucion(array $datos): DevolucionCliente|false
    {
        try {
            return DB::transaction(function () use ($datos) {
                // Validar que prestamo_cliente_id existe
                $prestamo = PrestamoCliente::find($datos['prestamo_cliente_id']);
                if (!$prestamo) {
                    throw new \Exception('Préstamo no encontrado');
                }

                // Crear encabezado de devolución
                $devolucion = DevolucionCliente::create([
                    'prestamo_cliente_id' => $datos['prestamo_cliente_id'],
                    'fecha_devolucion' => $datos['fecha_devolucion'],
                    'monto_cobrado_daño_total' => (float) ($datos['monto_cobrado_daño_total'] ?? 0),
                    'monto_garantia_devuelta_total' => 0, // Se calculará de los detalles
                    'observaciones' => $datos['observaciones'] ?? null,
                    'chofer_id' => $datos['chofer_id'] ?? null,
                    'estado' => 'ACTIVA',
                    'created_by' => $datos['created_by'] ?? auth()->id(), // ✅ Usuario que creó la devolución
                ]);

                $montoGarantiaTotal = 0;
                $detalles = $datos['detalles'] ?? [];

                // Procesar cada detalle de devolución
                foreach ($detalles as &$detalleData) {
                    $detalle = PrestamoClienteDetalle::find($detalleData['prestamo_cliente_detalle_id']);

                    if (!$detalle) {
                        throw new \Exception('Detalle de préstamo no encontrado: ' . $detalleData['prestamo_cliente_detalle_id']);
                    }

                    $cantidadDevuelta = $detalleData['cantidad_devuelta'] ?? 0;
                    $cantidadDañadaTotal = $detalleData['cantidad_dañada_total'] ?? 0;
                    $cantidadTotal = $cantidadDevuelta + $cantidadDañadaTotal;
                    // Regla de negocio: lo dañado se registra para auditoría/cobro, pero NO mueve stock
                    $cantidadParaStock = $cantidadDevuelta;

                    // Calcular cuánto ya ha sido devuelto previamente
                    $cantidadYaDevuelta = $detalle->devolucionDetalles()
                        ->whereHas('devolucion', function ($q) {
                            // Solo contar devoluciones confirmadas (creadas antes de esta)
                            $q->where('created_at', '<', now());
                        })
                        ->sum(DB::raw('cantidad_devuelta + cantidad_dañada_total'));

                    $cantidadRestante = $detalle->cantidad_prestada - $cantidadYaDevuelta;

                    // Validar que no devuelve más de lo que queda por devolver
                    if ($cantidadTotal > $cantidadRestante) {
                        throw new \Exception("Cantidad a devolver ({$cantidadTotal}) excede cantidad restante ({$cantidadRestante}) para detalle {$detalleData['prestamo_cliente_detalle_id']}. Ya devuelto: {$cantidadYaDevuelta}");
                    }

                    // Obtener condiciones para calcular garantía devuelta
                    $condicion = PrestableCondicion::where('prestable_id', $detalle->prestable_id)->first();
                    $montoGarantiaTotal += ($cantidadDevuelta * ($condicion->monto_garantia ?? 0));

                    // Calcular TOTAL DEVUELTO HISTÓRICO ANTES de crear el nuevo registro
                    $totalDevueltoHistorico = $detalle->devolucionDetalles()
                        ->sum(DB::raw('cantidad_devuelta + cantidad_dañada_total'));
                    $totalDevueltoAhora = $totalDevueltoHistorico + $cantidadTotal;

                    // Crear detalle de devolución
                    $detalleDevolucion = DevolucionClienteDetalle::create([
                        'devolucion_cliente_id' => $devolucion->id,
                        'prestamo_cliente_detalle_id' => $detalleData['prestamo_cliente_detalle_id'],
                        'cantidad_devuelta' => $cantidadDevuelta,
                        'cantidad_dañada_total' => $cantidadDañadaTotal,
                        'monto_cobrado_daño' => 0,
                        'monto_garantia_devuelta' => $cantidadDevuelta * ($condicion->monto_garantia ?? 0),
                    ]);

                    // ✅ CENTRALIZADO: Calcular devolucionesAlmacenes (automático o manual)
                    $devolucionesAlmacenes = $this->calcularDevolucionesAutomaticas($detalleData, $prestamo);

                    if (!empty($devolucionesAlmacenes)) {
                        // ✅ NUEVO: Validar que los valores de almacenes sumen correctamente
                        $sumaCantidadDevuelta = array_sum(array_map(fn($a) => (int) ($a['cantidad_devuelta'] ?? 0), $devolucionesAlmacenes));
                        $sumaCantidadDanada = array_sum(array_map(fn($a) => (int) ($a['cantidad_dañada_total'] ?? 0), $devolucionesAlmacenes));

                        if ($sumaCantidadDevuelta !== $cantidadDevuelta) {
                            throw new \Exception(
                                "❌ Inconsistencia de cantidades devueltas para detalle {$detalleData['prestamo_cliente_detalle_id']}: " .
                                "suma de almacenes ({$sumaCantidadDevuelta}) ≠ cantidad total ({$cantidadDevuelta})"
                            );
                        }

                        if ($sumaCantidadDanada !== $cantidadDañadaTotal) {
                            throw new \Exception(
                                "❌ Inconsistencia de cantidades dañadas para detalle {$detalleData['prestamo_cliente_detalle_id']}: " .
                                "suma de almacenes ({$sumaCantidadDanada}) ≠ cantidad total ({$cantidadDañadaTotal})"
                            );
                        }

                        // ✅ NUEVO: Validar que NO se devuelve más de lo prestado POR CADA ALMACÉN
                        $this->validarDevolucionPorAlmacen($detalle, $devolucionesAlmacenes);

                        // El usuario especificó almacenes en la devolución
                        \Log::info('🔍 Devolución por almacenes especificados', [
                            'prestable_id' => $detalle->prestable_id,
                            'cantidad_almacenes' => count($devolucionesAlmacenes),
                            'suma_cantidad_devuelta' => $sumaCantidadDevuelta,
                            'suma_cantidad_danada' => $sumaCantidadDanada,
                        ]);

                        foreach ($devolucionesAlmacenes as $almacenDev) {
                            $almacenId = $almacenDev['almacenes_prestables_id'];
                            $cantDevAlmacen = $almacenDev['cantidad_devuelta'] ?? 0;
                            $cantDanAlmacen = $almacenDev['cantidad_dañada_total'] ?? 0;
                            // ✅ CRÍTICO: Usar es_proveedor del array calculado, no buscar de nuevo en BD
                            $esProveedor = $almacenDev['es_proveedor'] ?? false;

                            // Crear registro en DevolucionClienteDetalleAlmacen
                            if ($cantDevAlmacen > 0 || $cantDanAlmacen > 0) {
                                DevolucionClienteDetalleAlmacen::create([
                                    'devolucion_cliente_detalle_id' => $detalleDevolucion->id,
                                    'almacenes_prestables_id' => $almacenId,
                                    'cantidad_devuelta' => $cantDevAlmacen,
                                    'cantidad_dañada_total' => $cantDanAlmacen,
                                    'monto_garantia_devuelta' => $cantDevAlmacen * ($condicion->monto_garantia ?? 0),
                                    'es_proveedor' => $esProveedor,
                                ]);
                            }

                            // Obtener stock ANTES de devolver
                            $stock = PrestableStock::where('prestable_id', $detalle->prestable_id)
                                ->where('almacenes_prestables_id', $almacenId)
                                ->firstOrFail();
                            $disponibleAntes = $stock->cantidad_disponible;
                            $sinLiquidoAntes = $stock->cantidad_sin_liquido;
                            $prestamoClienteActivoAntes = $stock->cantidad_cliente_deudor;
                            $prestamoProveedorActivoAntes = $stock->cantidad_proveedor_acreedor;
                            $prestamoEventoActivoAntes = $stock->cantidad_evento_deudor;
                            $clienteDañadaAntes = $stock->cantidad_cliente_dañada;
                            $proveedorDañadaAntes = $stock->cantidad_proveedor_dañada;
                            $eventoDañadaAntes = $stock->cantidad_evento_dañada ?? 0;

                            // ✅ Actualizar stock con cantidad devuelta Y dañada
                            if ($cantDevAlmacen > 0 || $cantDanAlmacen > 0) {
                                // ✅ CORRECTO: SIEMPRE devolverDelCliente()
                                // porque este servicio es EXCLUSIVAMENTE para devoluciones de CLIENTES
                                // sin importar el tipo de almacén
                                // ✅ Actualizar stock directamente
                                $stock->update([
                                    'cantidad_disponible' => $stock->cantidad_disponible + $cantDevAlmacen,
                                    'cantidad_cliente_deudor' => max(0, $stock->cantidad_cliente_deudor - $cantDevAlmacen - $cantDanAlmacen),
                                    'cantidad_cliente_dañada' => $stock->cantidad_cliente_dañada + $cantDanAlmacen,
                                ]);
                            }

                            // Obtener stock DESPUÉS de devolver
                            $stock->refresh();

                            // Registrar movimiento de devolución POR ALMACÉN
                            if ($cantDevAlmacen > 0 || $cantDanAlmacen > 0) {
                                $this->movimientoService->registrarMovimiento([
                                    'prestable_stock_id' => $stock->id,
                                    'almacenes_prestables_id' => $almacenId,
                                    'usuario_id' => auth()->id(),
                                    'tipo' => 'ENTRADA',
                                    'cantidad' => $cantDevAlmacen,
                                    'cantidad_dañada_registrada' => $cantDanAlmacen,
                                    'disponible_anterior' => $disponibleAntes,
                                    'disponible_posterior' => $stock->cantidad_disponible,
                                    'cantidad_sin_liquido_anterior' => $sinLiquidoAntes,
                                    'cantidad_sin_liquido_posterior' => $stock->cantidad_sin_liquido,
                                    'prestamo_cliente_anterior' => $prestamoClienteActivoAntes,
                                    'prestamo_cliente_posterior' => $stock->cantidad_cliente_deudor,
                                    'prestamo_evento_anterior' => $prestamoEventoActivoAntes,
                                    'prestamo_evento_posterior' => $stock->cantidad_evento_deudor,
                                    'prestamo_proveedor_anterior' => $prestamoProveedorActivoAntes,
                                    'prestamo_proveedor_posterior' => $stock->cantidad_proveedor_acreedor,
                                    'cantidad_cliente_dañada_anterior' => $clienteDañadaAntes,
                                    'cantidad_cliente_dañada_posterior' => $stock->cantidad_cliente_dañada,
                                    'cantidad_proveedor_dañada_anterior' => $proveedorDañadaAntes,
                                    'cantidad_proveedor_dañada_posterior' => $stock->cantidad_proveedor_dañada,
                                    'cantidad_evento_dañada_anterior' => $eventoDañadaAntes,
                                    'cantidad_evento_dañada_posterior' => $stock->cantidad_evento_dañada ?? 0,
                                    'categoria_afectada' => 'prestamo_cliente',
                                    'motivo' => 'Devolución de préstamo a cliente (Almacén especificado)',
                                    'numero_referencia' => $prestamo->id,
                                    'referencia_tipo' => 'DEVOLUCIO_CLIENTE',
                                    'referencia_id' => $devolucion->id,
                                    'observaciones' => $datos['observaciones'] ?? null,
                                ]);
                            }

                            \Log::info('✅ Devolución procesada por almacén', [
                                'almacen_id' => $almacenId,
                                'cantidad_devuelta' => $cantDevAlmacen,
                                'cantidad_dañada' => $cantDanAlmacen,
                                'stock_disponible_posterior' => $stock->cantidad_disponible,
                                'cantidad_cliente_deudor_posterior' => $stock->cantidad_cliente_deudor,
                            ]);
                        }
                    } else {
                        \Log::error('❌ CRÍTICO: Array de devoluciones vacío', [
                            'detalleData' => $detalleData,
                            'prestamo_id' => $prestamo->id,
                            'detalle_id' => $detalleData['prestamo_cliente_detalle_id'],
                            'devolucionesAlmacenes_result' => $devolucionesAlmacenes,
                            'is_empty' => empty($devolucionesAlmacenes),
                        ]);
                        throw new \Exception('No se pudo determinar almacén para la devolución. Contacte soporte.');
                    }

                    // ✅ NUEVO: Actualizar embases automáticos solo si NO fueron enviados por el frontend
                    // Si el embase ya está en los detalles del frontend, se procesó en el loop principal con sus dañados
                    $prestable = \App\Models\Prestable::find($detalle->prestable_id);
                    if ($prestable && $prestable->tipo === 'CANASTILLA' && $prestable->embasesRelacionados()->count() > 0) {
                        foreach ($prestable->embasesRelacionados()->get() as $embase) {
                            // Buscar el detalle de EMBASE en el préstamo
                            $detalleEmbase = $prestamo->detalles()
                                ->whereHas('prestable', function ($q) use ($embase) {
                                    $q->where('id', $embase->id);
                                })
                                ->first();

                            // ⚠️ SKIP si el EMBASE ya está siendo procesado en los detalles del frontend
                            // En ese caso, fue procesado en el loop principal con sus dañados correctos
                            $embaseYaProcesado = in_array($detalleEmbase?->id, array_column($detalles, 'prestamo_cliente_detalle_id'));
                            if ($embaseYaProcesado) {
                                \Log::info('ℹ️ Embase ya procesado en frontend, omitiendo lógica automática', [
                                    'embase_id' => $embase->id,
                                    'embase_nombre' => $embase->nombre,
                                ]);
                                continue;
                            }

                            // ✅ SOLO para embases NO enviados por el frontend: calcular automáticamente
                            // Calcular cambio en embases: cantidad_devuelta × capacidad
                            $cambioEmbasesTotal = $cantidadDevuelta * ($prestable->capacidad ?? 1);

                            // Para embases automáticos, NO hay dañados especificados
                            $embasesDanados = 0;
                            $embasesADevolver = $cambioEmbasesTotal;

                            // Calcular TOTAL DEVUELTO HISTÓRICO para embases ANTES de crear el nuevo registro
                            $totalEmbasesHistorico = 0;
                            if ($detalleEmbase) {
                                $totalEmbasesHistorico = $detalleEmbase->devolucionDetalles()
                                    ->sum(DB::raw('cantidad_devuelta + cantidad_dañada_total'));
                            }
                            $totalEmbasesDevueltosAhora = $totalEmbasesHistorico + $embasesADevolver + $embasesDanados;

                            // Crear detalle de devolución para el EMBASE si existe
                            if ($detalleEmbase) {
                                DevolucionClienteDetalle::create([
                                    'devolucion_cliente_id' => $devolucion->id,
                                    'prestamo_cliente_detalle_id' => $detalleEmbase->id,
                                    'cantidad_devuelta' => $embasesADevolver,
                                    'cantidad_dañada_total' => $detalleData['embases_danados_total'] ?? 0,
                                    'monto_cobrado_daño' => 0,
                                    'monto_garantia_devuelta' => 0,
                                ]);
                            }

                            // Obtener stock del embase ANTES (usar el mismo almacén de la cabecera)
                            $almacenIdEmbase = $almacenId;
                            $stockEmbase = PrestableStock::where('prestable_id', $embase->id)
                                ->where('almacenes_prestables_id', $almacenIdEmbase)
                                ->first();
                            $disponibleEmbaseAntes = $stockEmbase->cantidad_disponible ?? 0;
                            $prestamoClienteEmbaseAntes = $stockEmbase->cantidad_cliente_deudor ?? 0;
                            $prestamoProveedorEmbaseAntes = $stockEmbase->cantidad_proveedor_acreedor ?? 0;
                            $prestamoEventoEmbaseAntes = $stockEmbase->cantidad_evento_deudor ?? 0;
                            $clienteDañadaEmbaseAntes = $stockEmbase->cantidad_cliente_dañada ?? 0;
                            $proveedorDañadaEmbaseAntes = $stockEmbase->cantidad_proveedor_dañada ?? 0;

                            // ✅ Actualizar stock del embase (con dañados)
                            if (($embasesADevolver > 0 || $embasesDanados > 0) && $stockEmbase) {
                                $stockEmbase->update([
                                    'cantidad_disponible' => $stockEmbase->cantidad_disponible + $embasesADevolver,
                                    'cantidad_cliente_deudor' => max(0, $stockEmbase->cantidad_cliente_deudor - $embasesADevolver),
                                    'cantidad_cliente_dañada' => $stockEmbase->cantidad_cliente_dañada + $embasesDanados,
                                ]);
                            }

                            // Registrar movimiento del embase (devueltos en buen estado)
                            if ($embasesADevolver > 0 || $embasesDanados > 0) {
                                $this->movimientoService->registrarMovimiento([
                                    'prestable_stock_id' => $stockEmbase->id,
                                    'almacenes_prestables_id' => $almacenIdEmbase,
                                    'usuario_id' => auth()->id(),
                                    'tipo' => 'ENTRADA',
                                    'cantidad' => $embasesADevolver,
                                    'cantidad_dañada_registrada' => $embasesDanados,
                                    'disponible_anterior' => $disponibleEmbaseAntes,
                                    'prestamo_cliente_anterior' => $prestamoClienteEmbaseAntes,
                                    'prestamo_proveedor_anterior' => $prestamoProveedorEmbaseAntes,
                                    'disponible_posterior' => $stockEmbase->cantidad_disponible,
                                    'prestamo_cliente_posterior' => $stockEmbase->cantidad_cliente_deudor,
                                    'prestamo_proveedor_posterior' => $stockEmbase->cantidad_proveedor_acreedor,
                                    'cantidad_cliente_dañada_anterior' => $clienteDañadaEmbaseAntes,
                                    'cantidad_cliente_dañada_posterior' => $stockEmbase->cantidad_cliente_dañada,
                                    'cantidad_proveedor_dañada_anterior' => $proveedorDañadaEmbaseAntes,
                                    'cantidad_proveedor_dañada_posterior' => $stockEmbase->cantidad_proveedor_dañada,
                                    'cantidad_evento_dañada_anterior' => $stockEmbase->cantidad_evento_dañada ?? 0,  // ✅ AGREGADO
                                    'cantidad_evento_dañada_posterior' => $stockEmbase->cantidad_evento_dañada ?? 0,  // ✅ AGREGADO
                                    'categoria_afectada' => 'prestamo_cliente',
                                    'motivo' => 'Devolución de embase (asociado a canastilla)',
                                    'numero_referencia' => $prestamo->id,
                                    'referencia_tipo' => 'DEVOLUCIO_CLIENTE_EMBASE',
                                    'referencia_id' => $devolucion->id,
                                    'observaciones' => "Embase: {$embase->nombre}. Devueltos: {$embasesADevolver}/{$cambioEmbasesTotal}. Dañados: {$embasesDanados}",
                                ]);
                            }

                            // Registrar movimiento por embases dañados (pérdida)
                            if ($embasesDanados > 0) {
                                $this->movimientoService->registrarMovimiento([
                                    'prestable_stock_id' => $stockEmbase->id,
                                    'almacenes_prestables_id' => $almacenIdEmbase,
                                    'usuario_id' => auth()->id(),
                                    'tipo' => 'SALIDA',
                                    'cantidad' => -$embasesDanados,
                                    'disponible_anterior' => $disponibleEmbaseAntes,
                                    'prestamo_cliente_anterior' => $prestamoClienteEmbaseAntes,
                                    'prestamo_proveedor_anterior' => $prestamoProveedorEmbaseAntes,
                                    'disponible_posterior' => $stockEmbase->cantidad_disponible,
                                    'prestamo_cliente_posterior' => $stockEmbase->cantidad_cliente_deudor,
                                    'prestamo_proveedor_posterior' => $stockEmbase->cantidad_proveedor_acreedor,
                                    'categoria_afectada' => 'prestamo_cliente',
                                    'motivo' => 'Pérdida de embases en devolución',
                                    'numero_referencia' => $prestamo->id,
                                    'referencia_tipo' => 'DEVOLUCIO_CLIENTE_EMBASE_DANADO',
                                    'referencia_id' => $devolucion->id,
                                    'observaciones' => "Embase: {$embase->nombre}. Dañados parciales: {$detalleData['embases_danados_parcial']}. Dañados totales: {$detalleData['embases_danados_total']}",
                                ]);
                            }

                            // Actualizar estado del detalle de EMBASE basado en el total calculado arriba
                            if ($detalleEmbase) {
                                // Total de embases que se supone fueron prestados (canastillas × capacidad)
                                $totalEmbasesPrestados = $detalleEmbase->cantidad_prestada;

                                if ($totalEmbasesDevueltosAhora >= $totalEmbasesPrestados) {
                                    $detalleEmbase->update(['estado' => 'COMPLETAMENTE_DEVUELTO']);
                                } else {
                                    $detalleEmbase->update(['estado' => 'PARCIALMENTE_DEVUELTO']);
                                }
                            }

                            Log::info('✅ Stock de embase actualizado en devolución', [
                                'embase_id' => $embase->id,
                                'embase_nombre' => $embase->nombre,
                                'embases_calculados' => $cambioEmbasesTotal,
                                'embases_danados' => $embasesDanados,
                                'embases_a_devolver' => $embasesADevolver,
                                'capacidad_canastilla' => $prestable->capacidad,
                                'cantidad_canastilla' => $cantidadDevuelta,
                            ]);
                        }
                    }

                    // Actualizar estado del detalle basado en el total calculado arriba
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

                Log::info('✅ Devolución registrada', [
                    'devolucion_id' => $devolucion->id,
                    'prestamo_cliente_id' => $datos['prestamo_cliente_id'],
                    'cantidad_detalles' => count($detalles),
                    'monto_cobrado_daño_total' => $datos['monto_cobrado_daño_total'] ?? 0,
                    'monto_garantia_devuelta_total' => $montoGarantiaTotal,
                ]);

                return $devolucion->load('detalles');
            });
        } catch (\Exception $e) {
            Log::error('❌ Error registrando devolución', [
                'error' => $e->getMessage(),
                'datos' => $datos,
            ]);
            return false;
        }
    }

    /**
     * Obtener préstamos activos de un cliente
     */
    public function obtenerPrestamosActivos(int $clienteId): array
    {
        return PrestamoCliente::where('cliente_id', $clienteId)
            ->where('estado', 'ACTIVO')
            ->with(['detalles.prestable', 'devoluciones'])
            ->get()
            ->toArray();
    }

    /**
     * Obtener devoluciones pendientes (sin registrar completamente)
     */
    public function obtenerPrestamosParaDevolver(int $choferId): array
    {
        return PrestamoCliente::where('chofer_id', $choferId)
            ->whereIn('estado', ['ACTIVO', 'PARCIALMENTE_DEVUELTO'])
            ->with(['cliente', 'detalles.prestable', 'devoluciones'])
            ->orderBy('fecha_esperada_devolucion')
            ->get()
            ->toArray();
    }

    /**
     * Obtener resumen de préstamo (por detalle)
     */
    public function obtenerResumenDetalle(int $detalleId): array|false
    {
        $detalle = PrestamoClienteDetalle::find($detalleId);

        if (!$detalle) {
            return false;
        }

        $cantidadDevuelta = $detalle->devoluciones()
            ->sum('cantidad_devuelta');

        $cantidadPendiente = $detalle->cantidad_prestada - $cantidadDevuelta;

        return [
            'detalle' => $detalle,
            'cantidad_original' => $detalle->cantidad_prestada,
            'cantidad_devuelta' => $cantidadDevuelta,
            'cantidad_pendiente' => $cantidadPendiente,
            'devoluciones' => $detalle->devoluciones,
            'estado' => $detalle->estado,
        ];
    }

    /**
     * Obtener resumen de préstamo (encabezado, con todos sus detalles)
     */
    public function obtenerResumenPrestamo(int $prestamoId): array|false
    {
        $prestamo = PrestamoCliente::with(['detalles.devoluciones'])->find($prestamoId);

        if (!$prestamo) {
            return false;
        }

        $cantidadTotalOriginal = 0;
        $cantidadTotalDevuelta = 0;
        $detallesResumen = [];

        foreach ($prestamo->detalles as $detalle) {
            $cantidadDevueltaDetalle = $detalle->devoluciones->sum('cantidad_devuelta');
            $cantidadTotalOriginal += $detalle->cantidad_prestada;
            $cantidadTotalDevuelta += $cantidadDevueltaDetalle;

            $detallesResumen[] = [
                'detalle' => $detalle,
                'cantidad_devuelta' => $cantidadDevueltaDetalle,
                'cantidad_pendiente' => $detalle->cantidad_prestada - $cantidadDevueltaDetalle,
                'devoluciones' => $detalle->devoluciones,
            ];
        }

        return [
            'prestamo' => $prestamo,
            'cantidad_total_original' => $cantidadTotalOriginal,
            'cantidad_total_devuelta' => $cantidadTotalDevuelta,
            'cantidad_total_pendiente' => $cantidadTotalOriginal - $cantidadTotalDevuelta,
            'detalles_resumen' => $detallesResumen,
            'estado' => $prestamo->estado,
        ];
    }

    /**
     * Anular préstamo - cancela y devuelve stock al almacén
     * ✅ CORREGIDO: Itera por PrestamoClienteAlmacen (como al crear)
     * Genera 1 movimiento por almacén del detalle, NO movimientos extras de embases
     *
     * @param int $prestamoId
     * @param ?string $razonAnulacion
     */
    public function anularPrestamo(int $prestamoId, ?string $razonAnulacion = null): PrestamoCliente|false
    {
        try {
            return DB::transaction(function () use ($prestamoId, $razonAnulacion) {
                $prestamo = PrestamoCliente::with(['detalles.almacenes'])->find($prestamoId);

                if (!$prestamo) {
                    throw new \Exception('Préstamo no encontrado');
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
                    $almacenesDetalle = PrestamoClienteAlmacen::where(
                        'prestamo_cliente_detalle_id',
                        $detalle->id
                    )->get();

                    foreach ($almacenesDetalle as $almacenDetalle) {
                        // Calcular cantidad ya devuelta de ESTE almacén específico
                        $cantidadDevueltaDelAlmacen = (int) DB::table('devolucion_cliente_detalle_almacenes as dcda')
                            ->join('devolucion_cliente_detalle as dcd', 'dcda.devolucion_cliente_detalle_id', '=', 'dcd.id')
                            ->where('dcd.prestamo_cliente_detalle_id', $detalle->id)
                            ->where('dcda.almacenes_prestables_id', $almacenDetalle->almacenes_prestables_id)
                            ->sum(DB::raw('dcda.cantidad_devuelta + dcda.cantidad_dañada_total'));

                        $cantidadPendienteDelAlmacen = $almacenDetalle->cantidad - $cantidadDevueltaDelAlmacen;

                        if ($cantidadPendienteDelAlmacen > 0) {
                            // Obtener stock ANTES de devolver
                            $stock = PrestableStock::where('prestable_id', $detalle->prestable_id)
                                ->where('almacenes_prestables_id', $almacenDetalle->almacenes_prestables_id)
                                ->firstOrFail();

                            $disponibleAntes = $stock->cantidad_disponible;
                            $prestamoClienteAntes = $stock->cantidad_cliente_deudor;
                            $prestamoProveedorAntes = $stock->cantidad_proveedor_acreedor;

                            // Devolver
                            $stock->update([
                                'cantidad_disponible' => $stock->cantidad_disponible + $cantidadPendienteDelAlmacen,
                                'cantidad_cliente_deudor' => max(0, $stock->cantidad_cliente_deudor - $cantidadPendienteDelAlmacen),
                            ]);

                            // ✅ 1 MOVIMIENTO POR ALMACÉN (espejo del proceso de creación)
                            $this->movimientoService->registrarMovimiento([
                                'prestable_stock_id' => $stock->id,
                                'almacenes_prestables_id' => $almacenDetalle->almacenes_prestables_id,
                                'usuario_id' => auth()->id(),
                                'tipo' => 'ENTRADA',
                                'cantidad' => $cantidadPendienteDelAlmacen,
                                'disponible_anterior' => $disponibleAntes,
                                'prestamo_cliente_anterior' => $prestamoClienteAntes,
                                'prestamo_proveedor_anterior' => $prestamoProveedorAntes,
                                'disponible_posterior' => $stock->cantidad_disponible,
                                'prestamo_cliente_posterior' => $stock->cantidad_cliente_deudor,
                                'prestamo_proveedor_posterior' => $stock->cantidad_proveedor_acreedor,
                                'categoria_afectada' => 'prestamo_cliente',
                                'motivo' => 'Devolución por anulación de préstamo',
                                'numero_referencia' => $prestamo->id,
                                'referencia_tipo' => 'PRESTAMO_CLIENTE_ANULADO',
                                'referencia_id' => $prestamo->id,
                                'observaciones' => $razonAnulacion,
                            ]);

                            Log::info('✅ Stock devuelto por anulación (almacén específico)', [
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

                Log::info('✅ Préstamo anulado correctamente', [
                    'prestamo_id' => $prestamo->id,
                    'cliente_id' => $prestamo->cliente_id,
                    'cantidad_detalles' => count($prestamo->detalles),
                    'razon_anulacion' => $razonAnulacion,
                ]);

                return $prestamo;
            });
        } catch (\Exception $e) {
            Log::error('❌ Error anulando préstamo', [
                'error' => $e->getMessage(),
                'prestamo_id' => $prestamoId,
            ]);
            return false;
        }
    }

    /**
     * Anular devolución - revierte movimientos y devuelve stock al estado anterior
     * ✅ Itera por DevolucionClienteDetalleAlmacen (como se creó)
     * Genera 1 movimiento de reversión por almacén
     *
     * @param int $prestamoId ID del préstamo
     * @param int $devolucionId ID de la devolución a anular
     * @param ?string $razonAnulacion Razón de la anulación
     */
    public function anularDevolucion(int $prestamoId, int $devolucionId, ?string $razonAnulacion = null): DevolucionCliente|false
    {
        try {
            return DB::transaction(function () use ($prestamoId, $devolucionId, $razonAnulacion) {
                $prestamo = PrestamoCliente::find($prestamoId);
                if (!$prestamo) {
                    throw new \Exception('Préstamo no encontrado');
                }

                $devolucion = DevolucionCliente::with(['detalles.devolucionesAlmacenes'])->find($devolucionId);
                if (!$devolucion) {
                    throw new \Exception('Devolución no encontrada');
                }

                if ($devolucion->prestamo_cliente_id !== $prestamoId) {
                    throw new \Exception('La devolución no pertenece a este préstamo');
                }

                if ($devolucion->estado === 'ANULADA') {
                    throw new \Exception('La devolución ya está anulada');
                }

                // ✅ ITERAR POR CADA DETALLE DE LA DEVOLUCIÓN
                foreach ($devolucion->detalles as $detalleDevolucion) {
                    // ✅ ITERAR POR CADA ALMACÉN (como se creó)
                    foreach ($detalleDevolucion->devolucionesAlmacenes as $almacenDevolucion) {
                        $almacenId = $almacenDevolucion->almacenes_prestables_id;
                        $cantidadDevuelta = (int) $almacenDevolucion->cantidad_devuelta;
                        $cantidadDañada = (int) $almacenDevolucion->cantidad_dañada_total;

                        // Obtener stock ANTES de revertir
                        $stock = PrestableStock::where('prestable_id', $detalleDevolucion->detallePrestamoCliente->prestable_id)
                            ->where('almacenes_prestables_id', $almacenId)
                            ->firstOrFail();

                        $disponibleAntes = $stock->cantidad_disponible;
                        $prestamoClienteAntes = $stock->cantidad_cliente_deudor;
                        $prestamoProveedorAntes = $stock->cantidad_proveedor_acreedor;
                        $clienteDañadaAntes = $stock->cantidad_cliente_dañada;

                        if ($cantidadDevuelta > 0 || $cantidadDañada > 0) {
                            // Revertir: lo que se devolvió vuelve a ser deuda, lo dañado se quita de dañada
                            $stock->update([
                                'cantidad_disponible' => $stock->cantidad_disponible - $cantidadDevuelta,
                                'cantidad_cliente_deudor' => $stock->cantidad_cliente_deudor + $cantidadDevuelta + $cantidadDañada,
                                'cantidad_cliente_dañada' => max(0, $stock->cantidad_cliente_dañada - $cantidadDañada),
                            ]);

                            // ✅ 1 MOVIMIENTO DE REVERSIÓN POR ALMACÉN
                            $this->movimientoService->registrarMovimiento([
                                'prestable_stock_id' => $stock->id,
                                'almacenes_prestables_id' => $almacenId,
                                'usuario_id' => auth()->id(),
                                'tipo' => 'SALIDA',
                                'cantidad' => -$cantidadDevuelta,
                                'cantidad_dañada_registrada' => -$cantidadDañada,
                                'disponible_anterior' => $disponibleAntes,
                                'prestamo_cliente_anterior' => $prestamoClienteAntes,
                                'prestamo_proveedor_anterior' => $prestamoProveedorAntes,
                                'disponible_posterior' => $stock->cantidad_disponible,
                                'prestamo_cliente_posterior' => $stock->cantidad_cliente_deudor,
                                'prestamo_proveedor_posterior' => $stock->cantidad_proveedor_acreedor,
                                'cantidad_cliente_dañada_anterior' => $clienteDañadaAntes,
                                'cantidad_cliente_dañada_posterior' => $stock->cantidad_cliente_dañada,
                                'categoria_afectada' => 'prestamo_cliente',
                                'motivo' => 'Reversión por anulación de devolución',
                                'numero_referencia' => $prestamo->id,
                                'referencia_tipo' => 'DEVOLUCIO_CLIENTE_ANULADA',
                                'referencia_id' => $devolucion->id,
                                'observaciones' => $razonAnulacion,
                            ]);

                            Log::info('✅ Stock revertido por anulación de devolución (almacén específico)', [
                                'prestamo_id' => $prestamo->id,
                                'devolucion_id' => $devolucion->id,
                                'almacen_id' => $almacenId,
                                'cantidad_devuelta_revertida' => $cantidadDevuelta,
                                'cantidad_dañada_revertida' => $cantidadDañada,
                                'disponible_posterior' => $stock->cantidad_disponible,
                            ]);
                        }
                    }
                }

                // Marcar devolución como ANULADA
                $devolucion->update([
                    'estado' => 'ANULADA',
                    'razon_anulacion' => $razonAnulacion,
                    'anulada_por' => auth()->id(), // ✅ Registrar quién anuló
                    'fecha_anulacion' => now(), // ✅ Registrar cuándo se anuló
                ]);

                // Actualizar estado del préstamo si todas las devoluciones están anuladas
                $devolucionesActivas = DevolucionCliente::where('prestamo_cliente_id', $prestamoId)
                    ->where('estado', 'ACTIVA')
                    ->count();

                if ($devolucionesActivas === 0) {
                    // Si no hay devoluciones activas, volver el préstamo a ACTIVO
                    $prestamo->update(['estado' => 'ACTIVO']);
                }

                Log::info('✅ Devolución anulada correctamente', [
                    'prestamo_id' => $prestamo->id,
                    'devolucion_id' => $devolucion->id,
                    'razon_anulacion' => $razonAnulacion,
                ]);

                return $devolucion;
            });
        } catch (\Exception $e) {
            Log::error('❌ Error anulando devolución', [
                'error' => $e->getMessage(),
                'prestamo_id' => $prestamoId,
                'devolucion_id' => $devolucionId,
            ]);
            return false;
        }
    }

    /**
     * Resolver almacén válido para operar un prestable en devoluciones/anulaciones.
     * Prioridad:
     * 1) Almacén donde actualmente hay préstamo cliente activo.
     * 2) Cualquier almacén con stock registrado para el prestable.
     * 3) Primer almacén activo de distribuidora.
     */
    private function resolverAlmacenIdParaPrestable(int $prestableId): int
    {
        $stockConPrestamoActivo = PrestableStock::where('prestable_id', $prestableId)
            ->where('cantidad_cliente_deudor', '>', 0)
            ->orderByDesc('cantidad_cliente_deudor')
            ->first();

        if ($stockConPrestamoActivo) {
            return (int) $stockConPrestamoActivo->almacenes_prestables_id;
        }

        $stockExistente = PrestableStock::where('prestable_id', $prestableId)
            ->orderByDesc('cantidad_disponible')
            ->first();

        if ($stockExistente) {
            return (int) $stockExistente->almacenes_prestables_id;
        }

        $almacenActivo = AlmacenPrestable::where('activo', true)
            ->where('es_proveedor', false)
            ->orderBy('id')
            ->first();

        if (!$almacenActivo) {
            throw new \Exception('No hay almacenes prestables activos de distribuidora para registrar devoluciones.');
        }

        return (int) $almacenActivo->id;
    }

}
