<?php

namespace App\Services\Compra;

use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\StockProducto;
use App\Services\Stock\MovimientoInventarioService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * ✅ NUEVO (2026-03-27): Servicio centralizado para registrar entradas de compra AGRUPADAS
 *
 * Propósito: Registrar movimientos de compra AGRUPADOS por producto, no por lote
 * - Un movimiento = un producto + un número de compra
 * - Detalles por lote guardados en JSON
 *
 * Reutilizable desde:
 * - Compras (entrada por aprobación/facturación)
 * - Devoluciones de compra
 *
 * DIFERENCIA CON VENTA:
 * - En compras, cada detalle es UN LOTE ESPECÍFICO (no hay FIFO)
 * - Pero en movimientos_inventario queremos mostrar UN SOLO movimiento POR PRODUCTO
 * - Con detalles de todos los lotes en JSON
 */
class CompraDistribucionService
{
    /**
     * Inyectar el servicio centralizado
     */
    private MovimientoInventarioService $movimientoService;

    public function __construct()
    {
        $this->movimientoService = new MovimientoInventarioService();
    }

    /**
     * ✅ NUEVO (2026-03-27): Registrar entrada de compra AGRUPADA por producto
     *
     * FLUJO:
     * 1. Agrupar detalles de compra por producto_id
     * 2. Para cada producto:
     *    a. Crear o actualizar StockProducto para cada lote
     *    b. Recolectar detalles de todos los lotes del producto
     *    c. Registrar UN SOLO movimiento ENTRADA_COMPRA agrupado con detalles de lotes en JSON
     * 3. Retornar movimientos creados
     *
     * @param array $detalles Array de detalles de compra: [['producto_id' => X, 'cantidad' => Y, 'lote' => 'A', 'fecha_vencimiento' => '2026-12-31'], ...]
     * @param string $numeroCompra Referencia para movimiento (ej: COMP20260327-15)
     * @param int $almacenId ID del almacén donde se recibe la compra
     * @param int $usuarioId ID del usuario que registra
     * @return array Movimientos creados en movimientos_inventario (AGRUPADOS por producto)
     * @throws Exception Si hay error en proceso
     */
    public function registrarEntradaCompra(
        array $detalles,
        string $numeroCompra,
        int $almacenId,
        int $usuarioId
    ): array {
        Log::info('🔄 [CompraDistribucionService::registrarEntradaCompra] Iniciando entrada de compra', [
            'numero_compra' => $numeroCompra,
            'cantidad_detalles' => count($detalles),
            'almacen_id' => $almacenId,
            'timestamp' => now()->toIso8601String(),
        ]);

        $movimientos = [];

        return DB::transaction(function () use ($detalles, $numeroCompra, $almacenId, $usuarioId, &$movimientos) {
            // Agrupar detalles por producto_id
            $detallesPorProducto = [];
            foreach ($detalles as $detalle) {
                $productoId = $detalle['producto_id'] ?? $detalle['id'];
                if (!isset($detallesPorProducto[$productoId])) {
                    $detallesPorProducto[$productoId] = [];
                }
                $detallesPorProducto[$productoId][] = $detalle;
            }

            // Procesar cada producto
            foreach ($detallesPorProducto as $productoId => $detallesProducto) {
                // Obtener producto
                $producto = Producto::findOrFail($productoId);

                Log::debug('🔄 [CompraDistribucionService] Procesando producto', [
                    'producto_id' => $productoId,
                    'producto_nombre' => $producto->nombre,
                    'cantidad_lotes' => count($detallesProducto),
                ]);

                // ✅ CORREGIDO (2026-03-28): Obtener totales GENERALES del producto ANTES de procesar lotes
                // Esto incluye TODOS los lotes existentes, no solo los que se procesan en esta compra
                $cantidadTotalAnterior_acumulada = StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacenId)
                    ->sum('cantidad');

                $cantidadDisponibleAnterior_acumulada = StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacenId)
                    ->sum('cantidad_disponible');

                $cantidadReservadaAnterior_acumulada = StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacenId)
                    ->sum('cantidad_reservada');

                Log::debug('📊 [CompraDistribucionService] Totales ANTES del producto', [
                    'producto_id' => $productoId,
                    'cantidad_total_anterior' => $cantidadTotalAnterior_acumulada,
                    'cantidad_disponible_anterior' => $cantidadDisponibleAnterior_acumulada,
                    'cantidad_reservada_anterior' => $cantidadReservadaAnterior_acumulada,
                ]);

                $cantidadTotalAñadida = 0;
                $detallesLotes = [];

                // Procesar cada lote del producto
                foreach ($detallesProducto as $detalle) {
                    $cantidad = (float) ($detalle['cantidad'] ?? 0);
                    $lote = $detalle['lote'] ?? null;
                    $fechaVencimiento = $detalle['fecha_vencimiento'] ?? null;

                    if ($cantidad <= 0) {
                        Log::warning('⚠️ [CompraDistribucionService] Cantidad inválida', [
                            'producto_id' => $productoId,
                            'cantidad' => $cantidad,
                        ]);
                        continue;
                    }

                    // Buscar o crear StockProducto para este lote específico
                    $stockProducto = StockProducto::where('producto_id', $productoId)
                        ->where('almacen_id', $almacenId)
                        ->where(function ($q) use ($lote) {
                            if ($lote) {
                                $q->where('lote', $lote);
                            } else {
                                $q->whereNull('lote');
                            }
                        })
                        ->lockForUpdate()
                        ->first();

                    if (!$stockProducto) {
                        $stockProducto = StockProducto::create([
                            'producto_id' => $productoId,
                            'almacen_id' => $almacenId,
                            'cantidad' => 0,
                            'cantidad_disponible' => 0,
                            'cantidad_reservada' => 0,
                            'lote' => $lote,
                            'fecha_vencimiento' => $fechaVencimiento ? \Carbon\Carbon::parse($fechaVencimiento) : null,
                            'fecha_actualizacion' => now(),
                        ]);

                        Log::debug('✅ [CompraDistribucionService] StockProducto creado', [
                            'stock_id' => $stockProducto->id,
                            'producto_id' => $productoId,
                            'lote' => $lote,
                        ]);
                    }

                    // Capturar ANTES
                    $cantidadAnterior = (float) $stockProducto->cantidad;
                    $cantidadDisponibleAnterior = (float) $stockProducto->cantidad_disponible;
                    $cantidadReservadaAnterior = (float) $stockProducto->cantidad_reservada;

                    // Actualizar stock
                    $stockProducto->increment('cantidad', $cantidad);
                    $stockProducto->increment('cantidad_disponible', $cantidad);

                    // Recargar para obtener valores DESPUÉS
                    $stockProducto->refresh();
                    $cantidadPosterior = (float) $stockProducto->cantidad;
                    $cantidadDisponiblePosterior = (float) $stockProducto->cantidad_disponible;
                    $cantidadReservadaPosterior = (float) $stockProducto->cantidad_reservada;

                    // ✅ NO acumular aquí - ya tenemos los totales GENERALES correctos (línea 99-109)
                    // Solo recolectamos detalles por lote para el JSON

                    // Recolectar detalle de este lote
                    $detallesLotes[] = [
                        'stock_producto_id' => $stockProducto->id,
                        'lote' => $lote,
                        'cantidad' => $cantidad,
                        'cantidad_total_anterior' => $cantidadAnterior,
                        'cantidad_total_posterior' => $cantidadPosterior,
                        'cantidad_disponible_anterior' => $cantidadDisponibleAnterior,
                        'cantidad_disponible_posterior' => $cantidadDisponiblePosterior,
                        'cantidad_reservada_anterior' => $cantidadReservadaAnterior,
                        'cantidad_reservada_posterior' => $cantidadReservadaPosterior,
                    ];

                    $cantidadTotalAñadida += $cantidad;

                    Log::debug('📦 [CompraDistribucionService] Lote procesado', [
                        'compra' => $numeroCompra,
                        'stock_producto_id' => $stockProducto->id,
                        'producto_id' => $productoId,
                        'lote' => $lote,
                        'cantidad_entrada' => $cantidad,
                    ]);
                }

                // ✅ Obtener totales FINALES del producto DESPUÉS de procesar todos los lotes
                $cantidadTotalPosterior_acumulada = StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacenId)
                    ->sum('cantidad');

                $cantidadDisponiblePosterior_acumulada = StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacenId)
                    ->sum('cantidad_disponible');

                $cantidadReservadaPosterior_acumulada = StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacenId)
                    ->sum('cantidad_reservada');

                // ✅ CORREGIDO (2026-03-28): Pasar totales GENERALES correctos
                // Los detallesLotes solo contienen los lotes procesados en ESTA compra
                // Pero necesitamos los totales generales del producto (incluyendo otros lotes no procesados)
                $movimiento = $this->movimientoService->registrarMovimientoAgrupado(
                    producto_id: $productoId,
                    almacen_id: $almacenId,
                    tipo: MovimientoInventario::TIPO_ENTRADA_COMPRA,
                    referencia_tipo: 'compra',  // ✅ CORREGIDO (2026-04-05): Parámetro requerido
                    cantidad: $cantidadTotalAñadida,  // Positivo para entrada
                    numero_documento: $numeroCompra,
                    detallesLotes: $detallesLotes,
                    opciones: [
                        // 'referencia_tipo' => 'compra',  // ← Movido a parámetro directo
                        'referencia_id' => null,
                        // ✅ Pasar totales GENERALES obtenidos antes (línea 99-109)
                        'totales_previos' => [
                            'cantidad_total_anterior' => $cantidadTotalAnterior_acumulada,
                            'cantidad_disponible_anterior' => $cantidadDisponibleAnterior_acumulada,
                            'cantidad_reservada_anterior' => $cantidadReservadaAnterior_acumulada,
                        ],
                        'totales_posteriores' => [
                            'cantidad_total_posterior' => $cantidadTotalPosterior_acumulada,
                            'cantidad_disponible_posterior' => $cantidadDisponiblePosterior_acumulada,
                            'cantidad_reservada_posterior' => $cantidadReservadaPosterior_acumulada,
                        ]
                    ]
                );

                Log::info('✅ [CompraDistribucionService] Movimiento agrupado registrado', [
                    'compra' => $numeroCompra,
                    'producto_id' => $productoId,
                    'movimiento_id' => $movimiento->id,
                    'cantidad_lotes' => count($detallesLotes),
                    'cantidad_total' => $cantidadTotalAñadida,
                ]);

                $movimientos[] = $movimiento;
            }

            Log::info('✅ [CompraDistribucionService::registrarEntradaCompra] Entrada de compra completada', [
                'numero_compra' => $numeroCompra,
                'movimientos_creados' => count($movimientos),
                'almacen_id' => $almacenId,
                'timestamp' => now()->toIso8601String(),
            ]);

            return $movimientos;
        });
    }

    /**
     * Revertir entrada de compra cuando se anula
     *
     * @param string $numeroCompra Número de compra a revertir
     * @return array Resultado de reversión
     */
    public function revertirEntradaCompra(string $numeroCompra): array
    {
        Log::info('🔄 [CompraDistribucionService::revertirEntradaCompra] Iniciando reversión de entrada', [
            'numero_compra' => $numeroCompra,
            'timestamp' => now()->toIso8601String(),
        ]);

        try {
            return DB::transaction(function () use ($numeroCompra) {
                // Obtener movimientos de entrada de la compra
                $movimientos = MovimientoInventario::where('numero_documento', $numeroCompra)
                    ->where('tipo', MovimientoInventario::TIPO_ENTRADA_COMPRA)
                    ->lockForUpdate()
                    ->get();

                if ($movimientos->isEmpty()) {
                    Log::warning('⚠️ [CompraDistribucionService] No hay movimientos de entrada para revertir', [
                        'numero_compra' => $numeroCompra,
                    ]);

                    return [
                        'success' => true,
                        'cantidad_revertida' => 0,
                        'movimientos' => 0,
                        'error' => null,
                    ];
                }

                $totalRevertido = 0;
                $movimientosCreados = 0;

                // Agrupar movimientos por producto
                $movimientosPorProducto = $movimientos->groupBy(function ($mov) {
                    return $mov->stockProducto->producto_id;
                });

                foreach ($movimientosPorProducto as $productoId => $productosMovimientos) {
                    $detallesLotes = [];
                    $cantidadTotalARevertir = 0;
                    $almacenId = null;

                    // ✅ CORREGIDO (2026-04-05): Capturar totales del PRODUCTO ANTES
                    $totalProductoAntes = null;
                    $totalDisponibleAntes = null;
                    $totalReservadoAntes = null;

                    foreach ($productosMovimientos as $movimiento) {
                        $stock = $movimiento->stockProducto;
                        $cantidadARevertir = abs($movimiento->cantidad);
                        $almacenId = $stock->almacen_id;

                        // ✅ CORREGIDO (2026-04-05): Capturar totales del PRODUCTO en la PRIMERA iteración
                        if ($totalProductoAntes === null) {
                            $totalProductoAntes = (float) StockProducto::where('producto_id', $productoId)
                                ->where('almacen_id', $almacenId)
                                ->sum('cantidad');

                            $totalDisponibleAntes = (float) StockProducto::where('producto_id', $productoId)
                                ->where('almacen_id', $almacenId)
                                ->sum('cantidad_disponible');

                            $totalReservadoAntes = (float) StockProducto::where('producto_id', $productoId)
                                ->where('almacen_id', $almacenId)
                                ->sum('cantidad_reservada');
                        }

                        // Valores ANTES de revertir (por lote)
                        $cantidadAnterior = $stock->cantidad;
                        $cantidadDisponibleAnterior = $stock->cantidad_disponible;
                        $cantidadReservadaAnterior = $stock->cantidad_reservada;

                        // Revertir stock
                        $stock->decrement('cantidad', $cantidadARevertir);
                        $stock->decrement('cantidad_disponible', $cantidadARevertir);

                        // Recargar para obtener DESPUÉS
                        $stock->refresh();
                        $cantidadPosterior = $stock->cantidad;
                        $cantidadDisponiblePosterior = $stock->cantidad_disponible;
                        $cantidadReservadaPosterior = $stock->cantidad_reservada;

                        // Recolectar detalle
                        $detallesLotes[] = [
                            'stock_producto_id' => $stock->id,
                            'lote' => $stock->lote,
                            'cantidad' => $cantidadARevertir,
                            'cantidad_total_anterior' => $cantidadAnterior,
                            'cantidad_total_posterior' => $cantidadPosterior,
                            'cantidad_disponible_anterior' => $cantidadDisponibleAnterior,
                            'cantidad_disponible_posterior' => $cantidadDisponiblePosterior,
                            'cantidad_reservada_anterior' => $cantidadReservadaAnterior,
                            'cantidad_reservada_posterior' => $cantidadReservadaPosterior,
                        ];

                        $totalRevertido += $cantidadARevertir;
                        $cantidadTotalARevertir += $cantidadARevertir;
                    }

                    // ✅ CORREGIDO (2026-04-05): Capturar totales del PRODUCTO DESPUÉS
                    $totalProductoDespues = (float) StockProducto::where('producto_id', $productoId)
                        ->where('almacen_id', $almacenId)
                        ->sum('cantidad');

                    $totalDisponibleDespues = (float) StockProducto::where('producto_id', $productoId)
                        ->where('almacen_id', $almacenId)
                        ->sum('cantidad_disponible');

                    $totalReservadoDespues = (float) StockProducto::where('producto_id', $productoId)
                        ->where('almacen_id', $almacenId)
                        ->sum('cantidad_reservada');

                    // Crear movimiento de reversión agrupado
                    $movimientoReversion = $this->movimientoService->registrarMovimientoAgrupado(
                        producto_id: $productoId,
                        almacen_id: $almacenId,
                        tipo: MovimientoInventario::TIPO_SALIDA_AJUSTE,
                        referencia_tipo: 'compra_reversion',  // ✅ CORREGIDO (2026-04-05): Parámetro requerido
                        cantidad: -$cantidadTotalARevertir,  // Negativo para salida/reversión
                        numero_documento: $numeroCompra . '-REV',
                        detallesLotes: $detallesLotes,
                        opciones: [
                            // 'referencia_tipo' => 'compra_reversion',  // ← Movido a parámetro directo
                            'referencia_id' => null,
                            // ✅ CORREGIDO (2026-04-05): Pasar totales del PRODUCTO COMPLETO
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
                        ]
                    );

                    Log::info('✅ [CompraDistribucionService] Reversión agrupada registrada', [
                        'compra' => $numeroCompra,
                        'producto_id' => $productoId,
                        'movimiento_id' => $movimientoReversion->id,
                        'cantidad_lotes' => count($detallesLotes),
                    ]);

                    $movimientosCreados++;
                }

                Log::info('✅ [CompraDistribucionService::revertirEntradaCompra] Reversión completada', [
                    'numero_compra' => $numeroCompra,
                    'cantidad_total_revertida' => $totalRevertido,
                    'movimientos_creados' => $movimientosCreados,
                    'timestamp' => now()->toIso8601String(),
                ]);

                return [
                    'success' => true,
                    'cantidad_revertida' => $totalRevertido,
                    'movimientos' => $movimientosCreados,
                    'error' => null,
                ];
            });
        } catch (Exception $e) {
            Log::error('❌ [CompraDistribucionService::revertirEntradaCompra] Error en reversión', [
                'numero_compra' => $numeroCompra,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'cantidad_revertida' => 0,
                'movimientos' => 0,
                'error' => $e->getMessage(),
            ];
        }
    }
}
