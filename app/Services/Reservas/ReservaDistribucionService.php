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
            // ✅ NUEVO (2026-06-09): Validar que fecha_vencimiento sea válida
            // Convertir a Carbon si es string, y asegurar que sea una fecha futura
            if (is_string($fecha_vencimiento)) {
                $fecha_vencimiento = \Carbon\Carbon::parse($fecha_vencimiento);
            } elseif (!$fecha_vencimiento instanceof \Carbon\Carbon) {
                $fecha_vencimiento = \Carbon\Carbon::parse($fecha_vencimiento);
            }

            // ✅ VALIDACIÓN: La fecha de vencimiento debe ser en el futuro o hoy
            if ($fecha_vencimiento->isPast()) {
                Log::warning('⚠️ Fecha de vencimiento está en el pasado', [
                    'proforma_id' => $proforma->id,
                    'producto_id' => $producto_id,
                    'fecha_vencimiento' => $fecha_vencimiento->format('Y-m-d H:i:s'),
                    'hoy' => now()->format('Y-m-d H:i:s'),
                ]);

                return [
                    'success' => false,
                    'reservas' => [],
                    'error' => 'La fecha de vencimiento no puede estar en el pasado: ' . $fecha_vencimiento->format('Y-m-d H:i:s'),
                    'distribucion' => [],
                ];
            }

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

            Log::info('✅ Fecha de vencimiento validada', [
                'proforma_id' => $proforma->id,
                'producto_id' => $producto_id,
                'fecha_vencimiento' => $fecha_vencimiento->format('Y-m-d H:i:s'),
                'es_datetime' => $fecha_vencimiento instanceof \Carbon\Carbon,
            ]);

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

                // ✅ NUEVO (2026-06-09): Usar MovimientoStockService centralizado
                $movimientoService = app(\App\Services\Stock\MovimientoStockService::class);

                foreach ($lotes as $stock_producto) {
                    if ($cantidad_pendiente <= 0) {
                        break;  // Ya se distribuyó todo
                    }

                    // Calcular cuánto se puede tomar de este lote
                    $cantidad_a_reservar = (int) min($cantidad_pendiente, $stock_producto->cantidad_disponible);

                    // ✅ REFACTORIZADO (2026-06-09): Usar MovimientoStockService en lugar de actualizar directamente
                    // MovimientoStockService se encarga de:
                    // 1. lockForUpdate() + validación pre
                    // 2. Cálculo correcto según tipo
                    // 3. Validación post
                    // 4. Verificación BD post-actualización ✅ NUEVO
                    // 5. Registrar movimiento con auditoría

                    try {
                        $movimientoService->registrarMovimientoYActualizar(
                            stockProductoId: $stock_producto->id,
                            cantidad: -$cantidad_a_reservar,  // Negativo = reserva (reduce disponible)
                            tipo: \App\Models\MovimientoInventario::TIPO_RESERVA_PROFORMA,
                            referencia_tipo: 'proforma',
                            referencia_id: $proforma->id,
                            metadataAdicional: [
                                'lote' => $stock_producto->lote,
                                'proforma_numero' => $proforma->numero,
                            ],
                            numeroDocumento: $proforma->numero  // ✅ NUEVO (2026-06-09)
                        );

                        Log::info('✅ Reserva registrada con MovimientoStockService', [
                            'stock_id' => $stock_producto->id,
                            'lote' => $stock_producto->lote,
                            'cantidad_reservada' => $cantidad_a_reservar,
                            'proforma_id' => $proforma->id,
                        ]);

                    } catch (\Exception $e) {
                        throw new \Exception(
                            "Error registrando movimiento de reserva para lote {$stock_producto->lote}: " . $e->getMessage()
                        );
                    }

                    // Re-obtener stock actualizado desde BD
                    $stock_producto = \App\Models\StockProducto::find($stock_producto->id);
                    $cantidadTotalAntes = null;  // Ya no lo usamos directamente
                    $cantidadDisponibleAntes = null;
                    $cantidadReservadaAntes = null;
                    $cantidadTotalDespues = (float) $stock_producto->cantidad;
                    $cantidadDisponibleDespues = (float) $stock_producto->cantidad_disponible;
                    $cantidadReservadaDespues = (float) $stock_producto->cantidad_reservada;

                    // Crear reserva para este lote
                    // ✅ NUEVO (2026-07-22): fecha_reserva = fecha_entrega_solicitada de la proforma
                    $fechaReserva = $proforma->fecha_entrega_solicitada
                        ? \Carbon\Carbon::parse($proforma->fecha_entrega_solicitada)->startOfDay()
                        : now();

                    $reserva = ReservaProforma::create([
                        'proforma_id' => $proforma->id,
                        'stock_producto_id' => $stock_producto->id,
                        'cantidad_reservada' => $cantidad_a_reservar,
                        'fecha_reserva' => $fechaReserva,
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
                        'cantidad_disponible_antes' => $cantidadDisponibleAntes,
                        'cantidad_disponible_ahora' => $cantidadDisponibleDespues,
                    ];

                    $cantidad_pendiente -= $cantidad_a_reservar;

                    Log::info('✅ Reserva distribuida de lote', [
                        'reserva_id' => $reserva->id,
                        'proforma_id' => $proforma->id,
                        'producto_id' => $producto->id,
                        'lote' => $stock_producto->lote,
                        'cantidad_reservada' => $cantidad_a_reservar,
                        'validacion_exitosa' => true,
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

                // ✅ REFACTORIZADO (2026-06-09): Ya NO registrar movimiento agrupado
                // MovimientoStockService ya registró movimientos individuales con auditoría completa
                // Cada reserva tiene su propio movimiento con antes/después + verificación BD
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

                // ✅ NUEVO (2026-06-09): Usar MovimientoStockService centralizado
                $movimientoService = app(\App\Services\Stock\MovimientoStockService::class);

                foreach ($reservas as $reserva) {
                    $cantidad = $reserva->cantidad_reservada;

                    // ✅ REFACTORIZADO (2026-06-09): Usar MovimientoStockService en lugar de actualizar directamente
                    // MovimientoStockService se encarga de:
                    // 1. lockForUpdate() + validación pre
                    // 2. Cálculo correcto según tipo
                    // 3. Validación post
                    // 4. Verificación BD post-actualización ✅ NUEVO
                    // 5. Registrar movimiento con auditoría

                    try {
                        $movimientoService->registrarMovimientoYActualizar(
                            stockProductoId: $reserva->stock_producto_id,
                            cantidad: $cantidad,  // Positivo = liberar (aumenta disponible)
                            tipo: \App\Models\MovimientoInventario::TIPO_LIBERACION_RESERVA,
                            referencia_tipo: 'proforma',
                            referencia_id: $proforma->id,
                            metadataAdicional: [
                                'motivo' => $motivo,
                                'reserva_id' => $reserva->id,
                                'proforma_numero' => $proforma->numero,
                            ],
                            numeroDocumento: $proforma->numero  // ✅ NUEVO (2026-06-09)
                        );

                        Log::info('✅ Liberación de reserva registrada con MovimientoStockService', [
                            'reserva_id' => $reserva->id,
                            'stock_id' => $reserva->stock_producto_id,
                            'cantidad' => $cantidad,
                            'motivo' => $motivo,
                            'proforma_id' => $proforma->id,
                        ]);

                    } catch (\Exception $e) {
                        throw new \Exception(
                            "Error registrando movimiento de liberación: " . $e->getMessage()
                        );
                    }

                    // Re-obtener stock actualizado desde BD
                    $stock = \App\Models\StockProducto::find($reserva->stock_producto_id);
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
    public function consumirReservasAgrupadas(Proforma $proforma, string $numeroVenta, ?int $ventaId = null): array
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
                // ✅ REFACTORIZADO: Procesar cada reserva individualmente con MovimientoStockService
                $cantidad_total_producto = 0;

                foreach ($reservasProducto as $reserva) {
                    $cantidad = $reserva->cantidad_reservada;
                    $stock = $reserva->stockProducto;

                    // ✅ NUEVO: MovimientoStockService maneja la actualización y validación
                    // Ya no necesitamos hacer decrement manual ni capturar antes/después

                    // Marcar reserva como consumida
                    $reserva->update(['estado' => ReservaProforma::CONSUMIDA]);

                    $cantidad_consumida += $cantidad;
                    $cantidad_total_producto += $cantidad;
                    $reservas_consumidas++;

                    Log::debug('📦 [ReservaDistribucionService] Reserva marcada como consumida', [
                        'reserva_id' => $reserva->id,
                        'proforma_id' => $proforma->id,
                        'stock_producto_id' => $stock->id,
                        'cantidad_consumida' => $cantidad,
                        'numero_venta' => $numeroVenta,
                    ]);
                }

                // ✅ REFACTORIZADO (2026-06-08): Usar MovimientoStockService para cada lote con validaciones
                // Iteramos por cada lote porque cada uno es un stock_producto único
                if ($cantidad_total_producto > 0) {
                    $movimientoService = new \App\Services\Stock\MovimientoStockService(
                        app(\App\Services\Stock\StockValidationService::class)
                    );

                    foreach ($reservasProducto as $reserva) {
                        $cantidad = $reserva->cantidad_reservada;
                        $stock = $reserva->stockProducto;

                        try {
                            // ✅ NUEVO: Usar MovimientoStockService que hace TODO con validaciones
                            // Validaciones incluidas:
                            // 1. lockForUpdate() previene race conditions
                            // 2. Validación pre-actualización
                            // 3. Validación post-actualización (sin negativos, suma correcta)
                            // 4. Constraints en BD como segunda línea de defensa

                            $movimientoService->registrarMovimientoYActualizar(
                                stockProductoId: $stock->id,
                                cantidad: -(int)$cantidad,  // Negativo: consumo
                                tipo: MovimientoInventario::TIPO_CONSUMO_RESERVA,
                                referencia_tipo: 'proforma_convertida',
                                referencia_id: $proforma->id,
                                metadataAdicional: [
                                    'proforma_numero' => $proforma->numero,
                                    'venta_numero' => $numeroVenta,
                                    'reserva_id' => $reserva->id,
                                    'lote' => $stock->lote,
                                    'fecha_vencimiento' => $stock->fecha_vencimiento?->format('Y-m-d'),
                                ],
                                numeroDocumento: $numeroVenta  // ✅ NUEVO (2026-06-09)
                            );

                            // ✅ NUEVO: Registrar en venta_por_lotes si se proporciona ventaId
                            if ($ventaId) {
                                \App\Models\VentaPorLote::create([
                                    'venta_id' => $ventaId,
                                    'detalle_venta_id' => null,  // Null para proforma conversion (sin mapeo directo)
                                    'producto_id' => $producto_id,
                                    'stock_producto_id' => $stock->id,
                                    'cantidad_consumida' => $cantidad,
                                    'combo_padre_id' => null,  // Null: la proforma puede tener combos pero aquí consumimos componentes
                                    'fecha_vencimiento' => $stock->fecha_vencimiento,
                                ]);

                                Log::debug('📦 [ReservaDistribucionService] Registro en venta_por_lotes', [
                                    'venta_id' => $ventaId,
                                    'producto_id' => $producto_id,
                                    'stock_producto_id' => $stock->id,
                                    'cantidad_consumida' => $cantidad,
                                    'proforma_id' => $proforma->id,
                                ]);
                            }

                            Log::info('✅ [ReservaDistribucionService] Movimiento registrado con validaciones', [
                                'reserva_id' => $reserva->id,
                                'proforma_numero' => $proforma->numero,
                                'venta_numero' => $numeroVenta,
                                'stock_producto_id' => $stock->id,
                                'lote' => $stock->lote,
                                'cantidad_consumida' => $cantidad,
                                'validaciones' => [
                                    'lock_pessimista' => true,
                                    'pre_validacion' => true,
                                    'post_validacion' => true,
                                    'constraint_bd' => true,
                                ],
                            ]);
                        } catch (\Exception $e) {
                            Log::error('❌ Error registrando movimiento por lote', [
                                'reserva_id' => $reserva->id,
                                'stock_producto_id' => $stock->id,
                                'proforma_numero' => $proforma->numero,
                                'venta_numero' => $numeroVenta,
                                'error' => $e->getMessage(),
                                'tipo_error' => get_class($e),
                            ]);
                            throw $e;
                        }
                    }
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
