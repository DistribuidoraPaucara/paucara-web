<?php

namespace App\Services\Reservas;

use App\Models\Proforma;
use App\Models\Producto;
use App\Models\ReservaProforma;
use App\Models\MovimientoInventario;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * Servicio de Distribución de Reservas
 *
 * Implementa algoritmo FIFO (First-In-First-Out) para distribuir reservas
 * entre múltiples lotes del mismo producto
 */
class ReservaDistribucionService
{
    /**
     * Distribuir cantidad entre lotes disponibles (FIFO)
     *
     * @param Proforma $proforma
     * @param int $producto_id
     * @param int $cantidad_solicitada
     * @param $fecha_vencimiento Fecha de vencimiento de la reserva (de la proforma)
     *
     * @return array ['success' => bool, 'reservas' => [...], 'error' => string|null, 'distribucion' => [...]]
     */
    public function distribuirReserva(
        Proforma $proforma,
        int $producto_id,
        int $cantidad_solicitada,
        $fecha_vencimiento  // ✅ CORREGIDO (2026-04-05): Ahora recibe fecha completa, no días
    ) {
        try {
            // 🔧 Obtener el almacén de la empresa del usuario autenticado
            $user = auth()->user();
            if (!$user || !$user->empresa) {
                return [
                    'success' => false,
                    'reservas' => [],
                    'error' => 'No se encontró empresa para el usuario autenticado',
                    'distribucion' => [],
                ];
            }

            $almacen_id = $user->empresa->almacen_id;
            if (!$almacen_id) {
                return [
                    'success' => false,
                    'reservas' => [],
                    'error' => 'La empresa no tiene almacén definido',
                    'distribucion' => [],
                ];
            }

            // Obtener producto
            $producto = Producto::findOrFail($producto_id);

            // Obtener todos los lotes disponibles (FIFO: ordenado por ID ASC para seguir creación)
            $lotes = $producto->stock()
                ->where('almacen_id', $almacen_id)
                ->whereRaw('cantidad_disponible > 0')  // Solo lotes con stock disponible
                ->orderBy('id', 'ASC')  // FIFO: más antiguo primero (por ID)
                ->get();

            // Validar que hay stock disponible
            $total_disponible = $lotes->sum('cantidad_disponible');
            if ($total_disponible < $cantidad_solicitada) {
                return [
                    'success' => false,
                    'reservas' => [],
                    'error' => "Stock insuficiente. Disponible: {$total_disponible}, Solicitado: {$cantidad_solicitada}",
                    'distribucion' => [],
                ];
            }

            // Distribuir entre lotes
            $reservas_creadas = [];
            $distribucion = [];
            $detallesLotes = [];
            $cantidad_pendiente = $cantidad_solicitada;

            DB::transaction(function () use (
                &$reservas_creadas,
                &$distribucion,
                &$detallesLotes,
                &$cantidad_pendiente,
                $lotes,
                $proforma,
                $producto,
                $almacen_id,
                $fecha_vencimiento,  // ✅ CORREGIDO (2026-04-05): Cambiar de $dias_vencimiento a $fecha_vencimiento
                $producto_id,
                $cantidad_solicitada
            ) {
                // 📊 Capturar ANTES de todas las actualizaciones
                // ✅ CORREGIDO (2026-04-05): Capturar totales del PRODUCTO ANTES de cualquier cambio
                $totalProductoAntes = (float) $producto->stock()
                    ->where('almacen_id', $almacen_id)
                    ->sum('cantidad');

                $totalDisponibleAntes = (float) $producto->stock()
                    ->where('almacen_id', $almacen_id)
                    ->sum('cantidad_disponible');

                $totalReservadoAntes = (float) $producto->stock()
                    ->where('almacen_id', $almacen_id)
                    ->sum('cantidad_reservada');

                foreach ($lotes as $stock_producto) {
                    if ($cantidad_pendiente <= 0) {
                        break;  // Ya se distribuyó todo
                    }

                    // Calcular cuánto se puede tomar de este lote
                    $cantidad_a_reservar = (int) min($cantidad_pendiente, $stock_producto->cantidad_disponible);

                    // ✅ Capturar valores ANTES de actualizar
                    $cantidadTotalAntes = (float) $stock_producto->cantidad;
                    $cantidadDisponibleAntes = (float) $stock_producto->cantidad_disponible;
                    $cantidadReservadaAntes = (float) $stock_producto->cantidad_reservada;

                    // Actualizar cantidades en stock
                    $stock_producto->decrement('cantidad_disponible', $cantidad_a_reservar);
                    $stock_producto->increment('cantidad_reservada', $cantidad_a_reservar);

                    // ✅ Capturar DESPUÉS de actualizar
                    $stock_producto->refresh();
                    $cantidadTotalDespues = (float) $stock_producto->cantidad;
                    $cantidadDisponibleDespues = (float) $stock_producto->cantidad_disponible;
                    $cantidadReservadaDespues = (float) $stock_producto->cantidad_reservada;

                    // Crear reserva para este lote
                    $reserva = ReservaProforma::create([
                        'proforma_id' => $proforma->id,
                        'stock_producto_id' => $stock_producto->id,
                        'cantidad_reservada' => $cantidad_a_reservar,
                        'fecha_reserva' => now(),
                        'fecha_expiracion' => $fecha_vencimiento,  // ✅ CORREGIDO (2026-04-05): Usar fecha de vencimiento de proforma
                        'estado' => ReservaProforma::ACTIVA,
                    ]);

                    // Registrar detalle por lote para el movimiento agrupado
                    $detallesLotes[] = [
                        'stock_producto_id' => $stock_producto->id,
                        'lote' => $stock_producto->lote,
                        'cantidad' => -$cantidad_a_reservar,  // Negativo para reserva
                        'cantidad_total_anterior' => $cantidadTotalAntes,
                        'cantidad_total_posterior' => $cantidadTotalDespues,
                        'cantidad_disponible_anterior' => $cantidadDisponibleAntes,
                        'cantidad_disponible_posterior' => $cantidadDisponibleDespues,
                        'cantidad_reservada_anterior' => $cantidadReservadaAntes,
                        'cantidad_reservada_posterior' => $cantidadReservadaDespues,
                    ];

                    // Registrar en array de respuesta
                    $reservas_creadas[] = $reserva;
                    $distribucion[] = [
                        'reserva_id' => $reserva->id,
                        'stock_producto_id' => $stock_producto->id,
                        'lote' => $stock_producto->lote,
                        'cantidad_reservada' => $cantidad_a_reservar,
                        'cantidad_disponible_antes' => $stock_producto->cantidad_disponible + $cantidad_a_reservar,
                        'cantidad_disponible_ahora' => $stock_producto->cantidad_disponible,
                    ];

                    $cantidad_pendiente -= $cantidad_a_reservar;

                    Log::info('✅ Reserva distribuida de lote', [
                        'reserva_id' => $reserva->id,
                        'proforma_id' => $proforma->id,
                        'producto_id' => $producto->id,
                        'lote' => $stock_producto->lote,
                        'cantidad' => $cantidad_a_reservar,
                    ]);
                }

                // ✅ CORREGIDO (2026-04-05): Capturar totales del PRODUCTO DESPUÉS de todas las actualizaciones
                $totalProductoDespues = (float) $producto->stock()
                    ->where('almacen_id', $almacen_id)
                    ->sum('cantidad');

                $totalDisponibleDespues = (float) $producto->stock()
                    ->where('almacen_id', $almacen_id)
                    ->sum('cantidad_disponible');

                $totalReservadoDespues = (float) $producto->stock()
                    ->where('almacen_id', $almacen_id)
                    ->sum('cantidad_reservada');

                // ✅ NUEVO (2026-03-27): Registrar UN SOLO movimiento AGRUPADO con detalles por lote
                $movimientoService = new \App\Services\Stock\MovimientoInventarioService();
                // ✅ CORREGIDO (2026-04-05): Convertir a float para evitar type error
                $movimientoService->registrarMovimientoAgrupado(
                    $producto_id,
                    $almacen_id,
                    MovimientoInventario::TIPO_RESERVA_PROFORMA,
                    'proforma',
                    -(float)($cantidad_solicitada - $cantidad_pendiente),  // Negativo: reserva, convertir a float
                    $proforma->numero,
                    $detallesLotes,
                    [
                        'referencia_tipo' => 'proforma',
                        'referencia_id' => $proforma->id,
                        // ✅ CORREGIDO (2026-04-05): Pasar totales del PRODUCTO COMPLETO (usar variables, no sum() directo)
                        'totales_previos' => [
                            'cantidad_total_anterior' => $totalProductoAntes,
                            'cantidad_disponible_anterior' => $totalDisponibleAntes,
                            'cantidad_reservada_anterior' => $totalReservadoAntes,
                        ],
                        'totales_posteriores' => [
                            'cantidad_total_posterior' => $totalProductoDespues,
                            'cantidad_disponible_posterior' => $totalDisponibleDespues,
                            'cantidad_reservada_posterior' => $totalReservadoDespues,
                        ],
                        'observacion_extra' => [
                            'proforma_numero' => $proforma->numero,
                            'fecha_vencimiento' => $fecha_vencimiento,  // ✅ CORREGIDO (2026-04-05): Usar fecha en lugar de días
                        ]
                    ]
                );
            });

            return [
                'success' => true,
                'reservas' => $reservas_creadas,
                'error' => null,
                'distribucion' => $distribucion,
                'resumen' => [
                    'cantidad_solicitada' => $cantidad_solicitada,
                    'cantidad_reservada' => $cantidad_solicitada - $cantidad_pendiente,
                    'cantidad_lotes' => count($distribucion),
                    'fecha_vencimiento' => $fecha_vencimiento,  // ✅ CORREGIDO (2026-04-05): Usar fecha en lugar de días
                ],
            ];
        } catch (\Exception $e) {
            Log::error('❌ Error distribuiendo reserva', [
                'proforma_id' => $proforma->id,
                'producto_id' => $producto_id,
                'cantidad' => $cantidad_solicitada,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'reservas' => [],
                'error' => $e->getMessage(),
                'distribucion' => [],
            ];
        }
    }

    /**
     * Liberar todas las reservas de un producto en una proforma
     *
     * @param Proforma $proforma
     * @param int $producto_id
     * @param string $motivo
     *
     * @return array ['success' => bool, 'cantidad_liberada' => int, 'reservas_liberadas' => int]
     */
    public function liberarReservasPorProducto(Proforma $proforma, int $producto_id, string $motivo = 'Producto removido')
    {
        try {
            $cantidad_liberada = 0;
            $reservas_liberadas = 0;

            DB::transaction(function () use (
                &$cantidad_liberada,
                &$reservas_liberadas,
                $proforma,
                $producto_id,
                $motivo
            ) {
                // Obtener todas las reservas activas de este producto en la proforma
                $reservas = ReservaProforma::whereHas('stockProducto', function ($q) use ($producto_id) {
                    $q->where('producto_id', $producto_id);
                })
                    ->where('proforma_id', $proforma->id)
                    ->where('estado', ReservaProforma::ACTIVA)
                    ->get();

                foreach ($reservas as $reserva) {
                    $cantidad = $reserva->cantidad_reservada;
                    $stock = $reserva->stockProducto;

                    // ✅ NUEVO (2026-03-26): Capturar valores ANTES de actualizar
                    $cantidadTotalAntes = (float) $stock->cantidad;
                    $cantidadDisponibleAntes = (float) $stock->cantidad_disponible;
                    $cantidadReservadaAntes = (float) $stock->cantidad_reservada;

                    // Restaurar stock
                    $stock->increment('cantidad_disponible', $cantidad);
                    $stock->decrement('cantidad_reservada', $cantidad);

                    // ✅ NUEVO (2026-03-26): Capturar valores DESPUÉS de actualizar
                    $stock->refresh();
                    $cantidadTotalDespues = (float) $stock->cantidad;
                    $cantidadDisponibleDespues = (float) $stock->cantidad_disponible;
                    $cantidadReservadaDespues = (float) $stock->cantidad_reservada;

                    // Registrar movimiento
                    MovimientoInventario::create([
                        'stock_producto_id' => $stock->id,
                        'cantidad' => $cantidad,  // Positivo: liberar
                        'cantidad_anterior' => 0,  // Compatibilidad con sistema antiguo
                        'cantidad_posterior' => 0,  // Compatibilidad
                        // ✅ NUEVO (2026-03-26): Registrar en columnas específicas
                        'cantidad_total_anterior' => $cantidadTotalAntes,
                        'cantidad_total_posterior' => $cantidadTotalDespues,
                        'cantidad_disponible_anterior' => $cantidadDisponibleAntes,
                        'cantidad_disponible_posterior' => $cantidadDisponibleDespues,
                        'cantidad_reservada_anterior' => $cantidadReservadaAntes,
                        'cantidad_reservada_posterior' => $cantidadReservadaDespues,
                        'tipo' => MovimientoInventario::TIPO_LIBERACION_RESERVA,
                        'numero_documento' => $proforma->numero,
                        'referencia_tipo' => 'proforma',
                        'referencia_id' => $proforma->id,
                        'observacion' => json_encode([
                            'motivo' => $motivo,
                            'lote' => $stock->lote,
                            'cantidad_liberada' => $cantidad,
                            'cantidad_disponible_anterior' => $cantidadDisponibleAntes,
                            'cantidad_disponible_posterior' => $cantidadDisponibleDespues,
                            'cantidad_reservada_anterior' => $cantidadReservadaAntes,
                            'cantidad_reservada_posterior' => $cantidadReservadaDespues,
                        ]),
                        'user_id' => Auth::id() ?? 1,
                        'fecha' => now(),
                    ]);

                    // Marcar reserva como liberada
                    $reserva->update(['estado' => ReservaProforma::LIBERADA]);

                    $cantidad_liberada += $cantidad;
                    $reservas_liberadas++;

                    Log::info('✅ Reserva liberada', [
                        'reserva_id' => $reserva->id,
                        'proforma_id' => $proforma->id,
                        'producto_id' => $producto_id,
                        'cantidad' => $cantidad,
                        'motivo' => $motivo,
                    ]);
                }
            });

            return [
                'success' => true,
                'cantidad_liberada' => $cantidad_liberada,
                'reservas_liberadas' => $reservas_liberadas,
            ];
        } catch (\Exception $e) {
            Log::error('❌ Error liberando reservas', [
                'proforma_id' => $proforma->id,
                'producto_id' => $producto_id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'cantidad_liberada' => 0,
                'reservas_liberadas' => 0,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Liberar TODAS las reservas de una proforma
     *
     * Se ejecuta cuando la proforma es rechazada o se requiere liberar todas las reservas
     *
     * @param Proforma $proforma
     * @param string $motivo (ej: "Proforma rechazada", "Cambio de cliente", etc.)
     *
     * @return array ['success' => bool, 'cantidad_liberada' => int, 'reservas_liberadas' => int, 'error' => string|null]
     */
    public function liberarTodasLasReservas(Proforma $proforma, string $motivo = 'Rechazo de proforma')
    {
        try {
            $cantidad_liberada = 0;
            $reservas_liberadas = 0;

            DB::transaction(function () use (
                &$cantidad_liberada,
                &$reservas_liberadas,
                $proforma,
                $motivo
            ) {
                // Obtener TODAS las reservas activas de esta proforma
                $reservas = ReservaProforma::where('proforma_id', $proforma->id)
                    ->where('estado', ReservaProforma::ACTIVA)
                    ->with('stockProducto.producto')
                    ->orderBy('stock_producto_id')
                    ->get();

                // Agrupar por producto para movimiento agrupado
                $reservasPorProducto = $reservas->groupBy(function ($reserva) {
                    return $reserva->stockProducto->producto_id;
                });

                foreach ($reservasPorProducto as $producto_id => $reservasProducto) {
                    // Procesar cada producto (puede tener múltiples lotes)
                    $detallesLotes = [];
                    $cantidad_total_producto = 0;
                    $almacen_id = null;
                    $producto = null;

                    // ✅ CORREGIDO (2026-04-05): Capturar totales del PRODUCTO ANTES de hacer cualquier cambio
                    $totalProductoAntes = null;
                    $totalDisponibleAntes = null;
                    $totalReservadoAntes = null;

                    // Procesar todas las reservas de este producto
                    foreach ($reservasProducto as $reserva) {
                        $cantidad = $reserva->cantidad_reservada;
                        $stock = $reserva->stockProducto;
                        $producto = $stock->producto;
                        $almacen_id = $stock->almacen_id;

                        // ✅ CORREGIDO (2026-04-05): Capturar totales del PRODUCTO en la PRIMERA iteración
                        if ($totalProductoAntes === null) {
                            $totalProductoAntes = (float) $producto->stock()
                                ->where('almacen_id', $almacen_id)
                                ->sum('cantidad');

                            $totalDisponibleAntes = (float) $producto->stock()
                                ->where('almacen_id', $almacen_id)
                                ->sum('cantidad_disponible');

                            $totalReservadoAntes = (float) $producto->stock()
                                ->where('almacen_id', $almacen_id)
                                ->sum('cantidad_reservada');
                        }

                        // ✅ Capturar ANTES de actualizar (por lote)
                        $cantidadTotalAntes = (float) $stock->cantidad;
                        $cantidadDisponibleAntes = (float) $stock->cantidad_disponible;
                        $cantidadReservadaAntes = (float) $stock->cantidad_reservada;

                        // Restaurar stock
                        $stock->increment('cantidad_disponible', $cantidad);
                        $stock->decrement('cantidad_reservada', $cantidad);

                        // ✅ Capturar DESPUÉS de actualizar
                        $stock->refresh();
                        $cantidadTotalDespues = (float) $stock->cantidad;
                        $cantidadDisponibleDespues = (float) $stock->cantidad_disponible;
                        $cantidadReservadaDespues = (float) $stock->cantidad_reservada;

                        // Guardar detalle por lote
                        $detallesLotes[] = [
                            'stock_producto_id' => $stock->id,
                            'lote' => $stock->lote,
                            'cantidad' => $cantidad,  // Positivo: liberar
                            'cantidad_total_anterior' => $cantidadTotalAntes,
                            'cantidad_total_posterior' => $cantidadTotalDespues,
                            'cantidad_disponible_anterior' => $cantidadDisponibleAntes,
                            'cantidad_disponible_posterior' => $cantidadDisponibleDespues,
                            'cantidad_reservada_anterior' => $cantidadReservadaAntes,
                            'cantidad_reservada_posterior' => $cantidadReservadaDespues,
                        ];

                        // Marcar reserva como liberada
                        $reserva->update(['estado' => ReservaProforma::LIBERADA]);

                        $cantidad_liberada += $cantidad;
                        $cantidad_total_producto += $cantidad;
                        $reservas_liberadas++;

                        Log::info('✅ Reserva liberada por rechazo de proforma', [
                            'reserva_id' => $reserva->id,
                            'proforma_id' => $proforma->id,
                            'stock_producto_id' => $stock->id,
                            'cantidad' => $cantidad,
                            'motivo' => $motivo,
                        ]);
                    }

                    // ✅ NUEVO (2026-03-27): Registrar UN SOLO movimiento AGRUPADO con detalles por lote
                    if ($cantidad_total_producto > 0 && $producto && $almacen_id) {
                        // ✅ CORREGIDO (2026-04-05): Obtener totales del PRODUCTO COMPLETO DESPUÉS (ahora)
                        $totalProductoDespues = (float) $producto->stock()
                            ->where('almacen_id', $almacen_id)
                            ->sum('cantidad');

                        $totalDisponibleDespues = (float) $producto->stock()
                            ->where('almacen_id', $almacen_id)
                            ->sum('cantidad_disponible');

                        $totalReservadoDespues = (float) $producto->stock()
                            ->where('almacen_id', $almacen_id)
                            ->sum('cantidad_reservada');

                        $movimientoService = new \App\Services\Stock\MovimientoInventarioService();
                        // ✅ CORREGIDO (2026-04-05): Convertir a float y pasar referencia_tipo correctamente
                        $movimientoService->registrarMovimientoAgrupado(
                            $producto->id,
                            $almacen_id,
                            MovimientoInventario::TIPO_LIBERACION_RESERVA,
                            'proforma',
                            (float)$cantidad_total_producto,  // Positivo: liberar, convertir a float
                            $proforma->numero,
                            $detallesLotes,
                            [
                                'referencia_tipo' => 'proforma',
                                'referencia_id' => $proforma->id,
                                // ✅ CORREGIDO (2026-04-05): Usar valores REALES capturados de la BD
                                'totales_previos' => [
                                    'cantidad_total_anterior' => $totalProductoAntes,
                                    'cantidad_disponible_anterior' => $totalDisponibleAntes,
                                    'cantidad_reservada_anterior' => $totalReservadoAntes,
                                ],
                                'totales_posteriores' => [
                                    'cantidad_total_posterior' => $totalProductoDespues,
                                    'cantidad_disponible_posterior' => $totalDisponibleDespues,
                                    'cantidad_reservada_posterior' => $totalReservadoDespues,
                                ],
                                'observacion_extra' => [
                                    'motivo' => $motivo,
                                    'motivo_liberacion' => "Liberación de reserva: {$motivo}",
                                ]
                            ]
                        );
                    }
                }
            });

            return [
                'success' => true,
                'cantidad_liberada' => $cantidad_liberada,
                'reservas_liberadas' => $reservas_liberadas,
                'error' => null,
            ];
        } catch (\Exception $e) {
            Log::error('❌ Error liberando todas las reservas de proforma', [
                'proforma_id' => $proforma->id,
                'motivo' => $motivo,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'cantidad_liberada' => 0,
                'reservas_liberadas' => 0,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * ✅ NUEVO (2026-03-27): Consumir reservas AGRUPADAS por producto
     *
     * FLUJO:
     * 1. Obtener todas las reservas activas de la proforma
     * 2. Agrupar por producto_id
     * 3. Para cada producto:
     *    a. Recolectar detalles de todos los lotes reservados
     *    b. Actualizar cantidad en cada StockProducto
     *    c. Registrar UN SOLO movimiento CONSUMO_RESERVA agrupado con detalles de lotes en JSON
     * 4. Marcar todas las reservas como CONSUMIDA
     * 5. Retornar resultado
     *
     * ✅ MEJORADO (2026-03-28): Sin DB::transaction() para evitar transacciones anidadas
     * Este método es llamado desde dentro de convertirAVenta() que ya tiene su propia transacción.
     * Crear una transacción anidada causa problemas de rollback inconsistente cuando fallan movimientos.
     *
     * @param Proforma $proforma Proforma a consumir reservas
     * @param string $numeroVenta Número de venta para referencia
     * @return array Resultado de consumo: ['success' => bool, 'cantidad_consumida' => float, 'reservas_consumidas' => int, 'error' => string|null]
     * @throws \Exception Si hay error en proceso
     */
    public function consumirReservasAgrupadas(Proforma $proforma, string $numeroVenta): array
    {
        try {
            $cantidad_consumida = 0;
            $reservas_consumidas = 0;

            // Obtener TODAS las reservas activas de esta proforma
            $reservas = ReservaProforma::where('proforma_id', $proforma->id)
                ->where('estado', ReservaProforma::ACTIVA)
                ->with('stockProducto.producto')
                ->orderBy('stock_producto_id')
                ->lockForUpdate()
                ->get();

            if ($reservas->isEmpty()) {
                Log::warning('⚠️ No hay reservas activas para consumir', [
                    'proforma_id' => $proforma->id,
                    'numero_venta' => $numeroVenta,
                ]);

                return [
                    'success' => true,
                    'cantidad_consumida' => 0,
                    'reservas_consumidas' => 0,
                    'error' => null,
                ];
            }

            // Agrupar por producto para movimiento agrupado
            $reservasPorProducto = $reservas->groupBy(function ($reserva) {
                return $reserva->stockProducto->producto_id;
            });

            Log::info('🔄 [ReservaDistribucionService::consumirReservasAgrupadas] Iniciando consumo de reservas', [
                'proforma_id' => $proforma->id,
                'numero_venta' => $numeroVenta,
                'cantidad_productos' => $reservasPorProducto->count(),
            ]);

            foreach ($reservasPorProducto as $producto_id => $reservasProducto) {
                // Procesar cada producto (puede tener múltiples lotes)
                $detallesLotes = [];
                $cantidad_total_producto = 0;
                $almacen_id = null;
                $producto = null;

                // ✅ CORREGIDO (2026-04-05): Capturar totales del PRODUCTO ANTES de hacer cualquier decrement
                // Se obtiene en la primera iteración del lote
                $totalProductoAntes = null;
                $totalDisponibleAntes = null;
                $totalReservadoAntes = null;

                // Procesar todas las reservas de este producto
                foreach ($reservasProducto as $reserva) {
                    $cantidad = $reserva->cantidad_reservada;
                    $stock = $reserva->stockProducto;
                    $producto = $stock->producto;
                    $almacen_id = $stock->almacen_id;

                    // ✅ CORREGIDO (2026-04-05): Capturar totales del PRODUCTO en la PRIMERA iteración
                    if ($totalProductoAntes === null) {
                        $totalProductoAntes = (float) $producto->stock()
                            ->where('almacen_id', $almacen_id)
                            ->sum('cantidad');

                        $totalDisponibleAntes = (float) $producto->stock()
                            ->where('almacen_id', $almacen_id)
                            ->sum('cantidad_disponible');

                        $totalReservadoAntes = (float) $producto->stock()
                            ->where('almacen_id', $almacen_id)
                            ->sum('cantidad_reservada');
                    }

                    // ✅ Capturar ANTES de actualizar (por lote)
                    $cantidadTotalAntes = (float) $stock->cantidad;
                    $cantidadDisponibleAntes = (float) $stock->cantidad_disponible;
                    $cantidadReservadaAntes = (float) $stock->cantidad_reservada;

                    // Consumir stock: decrementar cantidad y cantidad_reservada
                    $stock->decrement('cantidad', $cantidad);
                    $stock->decrement('cantidad_reservada', $cantidad);
                    // cantidad_disponible se mantiene igual (ya estaba descontada en reserva)

                    // ✅ Capturar DESPUÉS de actualizar
                    $stock->refresh();
                    $cantidadTotalDespues = (float) $stock->cantidad;
                    $cantidadDisponibleDespues = (float) $stock->cantidad_disponible;
                    $cantidadReservadaDespues = (float) $stock->cantidad_reservada;

                    // Guardar detalle por lote
                    $detallesLotes[] = [
                        'stock_producto_id' => $stock->id,
                        'lote' => $stock->lote,
                        'cantidad' => -$cantidad,  // Negativo: consumo (salida)
                        'cantidad_total_anterior' => $cantidadTotalAntes,
                        'cantidad_total_posterior' => $cantidadTotalDespues,
                        'cantidad_disponible_anterior' => $cantidadDisponibleAntes,
                        'cantidad_disponible_posterior' => $cantidadDisponibleDespues,
                        'cantidad_reservada_anterior' => $cantidadReservadaAntes,
                        'cantidad_reservada_posterior' => $cantidadReservadaDespues,
                    ];

                    // Marcar reserva como consumida
                    $reserva->update(['estado' => ReservaProforma::CONSUMIDA]);

                    $cantidad_consumida += $cantidad;
                    $cantidad_total_producto += $cantidad;
                    $reservas_consumidas++;

                    Log::debug('📦 [ReservaDistribucionService] Lote consumido', [
                        'reserva_id' => $reserva->id,
                        'proforma_id' => $proforma->id,
                        'stock_producto_id' => $stock->id,
                        'cantidad_consumida' => $cantidad,
                        'numero_venta' => $numeroVenta,
                    ]);
                }

                // ✅ NUEVO (2026-03-27): Registrar UN SOLO movimiento AGRUPADO con detalles por lote
                if ($cantidad_total_producto > 0 && $producto && $almacen_id) {
                    // ✅ CORREGIDO (2026-04-05): Obtener totales del PRODUCTO COMPLETO DESPUÉS (ahora)
                    $totalProductoDespues = (float) $producto->stock()
                        ->where('almacen_id', $almacen_id)
                        ->sum('cantidad');

                    $totalDisponibleDespues = (float) $producto->stock()
                        ->where('almacen_id', $almacen_id)
                        ->sum('cantidad_disponible');

                    $totalReservadoDespues = (float) $producto->stock()
                        ->where('almacen_id', $almacen_id)
                        ->sum('cantidad_reservada');

                    $movimientoService = new \App\Services\Stock\MovimientoInventarioService();
                    // ✅ CORREGIDO (2026-04-05): Convertir a float explícitamente para evitar type error
                    // $cantidad_total_producto puede ser string si viene de acumulación de strings
                    $movimiento = $movimientoService->registrarMovimientoAgrupado(
                        $producto->id,
                        $almacen_id,
                        MovimientoInventario::TIPO_CONSUMO_RESERVA,
                        'proforma',
                        -(float)$cantidad_total_producto,  // Negativo: consumo (salida), convertir a float
                        $numeroVenta,
                        $detallesLotes,
                        [
                            'referencia_tipo' => 'proforma',
                            'referencia_id' => $proforma->id,
                            // ✅ NUEVO (2026-04-05): Pasar totales del PRODUCTO COMPLETO
                            'totales_previos' => [
                                'cantidad_total_anterior' => $totalProductoAntes,
                                'cantidad_disponible_anterior' => $totalDisponibleAntes,
                                'cantidad_reservada_anterior' => $totalReservadoAntes,
                            ],
                            'totales_posteriores' => [
                                'cantidad_total_posterior' => $totalProductoDespues,
                                'cantidad_disponible_posterior' => $totalDisponibleDespues,
                                'cantidad_reservada_posterior' => $totalReservadoDespues,
                            ],
                            'observacion_extra' => [
                                'proforma_numero' => $proforma->numero,
                                'venta_numero' => $numeroVenta,
                                'motivo' => 'Consumo de reserva - Convertida a Venta',
                            ]
                        ]
                    );

                    Log::info('✅ [ReservaDistribucionService] Movimiento agrupado registrado', [
                        'proforma_id' => $proforma->id,
                        'numero_venta' => $numeroVenta,
                        'producto_id' => $producto->id,
                        'movimiento_id' => $movimiento->id,
                        'cantidad_lotes' => count($detallesLotes),
                        'cantidad_total' => $cantidad_total_producto,
                    ]);
                }
            }

            Log::info('✅ [ReservaDistribucionService::consumirReservasAgrupadas] Consumo de reservas completado', [
                'proforma_id' => $proforma->id,
                'numero_venta' => $numeroVenta,
                'cantidad_total_consumida' => $cantidad_consumida,
                'reservas_consumidas' => $reservas_consumidas,
            ]);

            return [
                'success' => true,
                'cantidad_consumida' => $cantidad_consumida,
                'reservas_consumidas' => $reservas_consumidas,
                'error' => null,
            ];

        } catch (\Exception $e) {
            Log::error('❌ [ReservaDistribucionService::consumirReservasAgrupadas] Error al consumir reservas', [
                'proforma_id' => $proforma->id,
                'numero_venta' => $numeroVenta,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'cantidad_consumida' => 0,
                'reservas_consumidas' => 0,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Obtener información de disponibilidad de un producto en el almacén de la empresa
     *
     * @param int $producto_id
     *
     * @return array ['total_cantidad' => int, 'total_disponible' => int, 'lotes' => [...]]
     */
    public function obtenerDisponibilidad(int $producto_id)
    {
        // 🔧 Obtener el almacén de la empresa del usuario autenticado
        $user = auth()->user();
        if (!$user || !$user->empresa) {
            return [
                'producto_id' => $producto_id,
                'almacen_id' => null,
                'total_cantidad' => 0,
                'total_disponible' => 0,
                'total_reservado' => 0,
                'lotes' => [],
                'error' => 'No se encontró empresa para el usuario autenticado',
            ];
        }

        $almacen_id = $user->empresa->almacen_id;
        if (!$almacen_id) {
            return [
                'producto_id' => $producto_id,
                'almacen_id' => null,
                'total_cantidad' => 0,
                'total_disponible' => 0,
                'total_reservado' => 0,
                'lotes' => [],
                'error' => 'La empresa no tiene almacén definido',
            ];
        }

        $lotes = Producto::findOrFail($producto_id)
            ->stock()
            ->where('almacen_id', $almacen_id)
            ->orderBy('id', 'ASC')
            ->get()
            ->map(function ($stock) {
                return [
                    'stock_producto_id' => $stock->id,
                    'lote' => $stock->lote,
                    'cantidad_total' => $stock->cantidad,
                    'cantidad_disponible' => $stock->cantidad_disponible,
                    'cantidad_reservada' => $stock->cantidad_reservada,
                    'porcentaje_disponible' => $stock->cantidad > 0
                        ? round(($stock->cantidad_disponible / $stock->cantidad) * 100, 2)
                        : 0,
                ];
            });

        return [
            'producto_id' => $producto_id,
            'almacen_id' => $almacen_id,
            'total_cantidad' => $lotes->sum('cantidad_total'),
            'total_disponible' => $lotes->sum('cantidad_disponible'),
            'total_reservado' => $lotes->sum('cantidad_reservada'),
            'lotes' => $lotes->all(),
        ];
    }
}
