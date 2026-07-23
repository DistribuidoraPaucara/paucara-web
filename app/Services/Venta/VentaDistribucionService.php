<?php

namespace App\Services\Venta;

use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\StockProducto;
use App\Models\Venta;  // ✅ NUEVO (2026-06-09): Para obtener venta_id en devoluciones
use App\Services\Stock\MovimientoInventarioService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * VentaDistribucionService - Gestión centralizada de consumo y devolución de stock para ventas
 *
 * RESPONSABILIDADES:
 * ✓ Consumir stock cuando se crea una venta (FIFO por vencimiento)
 * ✓ Devolver stock cuando se anula una venta (inversa al consumo)
 * ✓ Validar disponibilidad ANTES de consumir
 * ✓ Obtener información de disponibilidad actual
 * ✓ Registrar movimientos completos (cantidad_anterior, cantidad_posterior)
 *
 * CARACTERÍSTICAS:
 * ✅ FIFO: Ordena por fecha_vencimiento (vence primero) + id (creado primero)
 * ✅ Almacén: Siempre usa empresa.almacen_id (del usuario autenticado)
 * ✅ Stock Negativo: Permitido para CREDITO (promesas de pago)
 * ✅ Transacciones: DB::transaction para atomicidad
 * ✅ Auditoría: Logs completos de cada operación
 * ✅ Movimientos: Registra ANTES/DESPUÉS correctamente
 */
class VentaDistribucionService
{
    /**
     * ✅ NUEVO (2026-02-16): Verificar si una cantidad es número entero
     * Útil para productos NO fraccionados que deben rechazar decimales
     */
    private function esCantidadEntero(float $cantidad): bool
    {
        return $cantidad == floor($cantidad);
    }

    /**
     * ✅ NUEVO (2026-02-16): Obtener cantidad real a consumir del stock
     * Aplica conversiones de unidad si el producto se vende en unidad diferente a almacenamiento
     *
     * FLUJO:
     * 1. Si producto NO es fraccionado y cantidad tiene decimales → ERROR
     * 2. Si hay conversión de unidad → convertir a unidad de almacenamiento
     * 3. Devolver cantidad a consumir (en unidad de almacenamiento)
     *
     * @param Producto $producto Producto a consumir
     * @param float $cantidadSolicitada Cantidad solicitada (en unidad de venta)
     * @param int|null $unidadVentaId ID de unidad de venta (null = usar unidad base del producto)
     * @return array ['cantidad_consumir' => float, 'conversion_aplicada' => bool, 'factor' => float|null]
     * @throws Exception Si producto no permite decimales pero cantidad tiene decimales
     */
    private function obtenerCantidadAConsumir(
        Producto $producto,
        float $cantidadSolicitada,
        ?int $unidadVentaId = null
    ): array {
        // 🔷 PASO 1: Validar que decimales sean permitidos si aplican
        if (!$producto->es_fraccionado && !$this->esCantidadEntero($cantidadSolicitada)) {
            throw new Exception(
                "El producto '{$producto->nombre}' no permite cantidades fraccionadas. " .
                "Solicitado: {$cantidadSolicitada}"
            );
        }

        // 🔷 PASO 2: Si no hay unidad de venta especificada, usar unidad nativa del producto
        $unidadVentaId = $unidadVentaId ?? $producto->unidad_medida_id;

        // 🔷 PASO 3: Si vende en unidad igual a la de almacenamiento, no hay conversión
        if ($unidadVentaId === $producto->unidad_medida_id) {
            return [
                'cantidad_consumir' => $cantidadSolicitada,
                'conversion_aplicada' => false,
                'factor' => null,
            ];
        }

        // 🔷 PASO 4: Buscar conversión activa de esta unidad a unidad de almacenamiento
        $conversion = $producto->conversiones()
            ->where('unidad_destino_id', $unidadVentaId)
            ->where('activo', true)
            ->first();

        // Si NO hay conversión pero se solicita en unidad diferente → ERROR
        if (!$conversion) {
            Log::error('❌ [VentaDistribucionService] Conversión no encontrada', [
                'producto_id' => $producto->id,
                'producto_nombre' => $producto->nombre,
                'unidad_venta_id' => $unidadVentaId,
                'unidad_almacenamiento_id' => $producto->unidad_medida_id,
            ]);

            throw new Exception(
                "No existe conversión configurada para el producto '{$producto->nombre}' " .
                "de la unidad de venta a la unidad de almacenamiento"
            );
        }

        // 🔷 PASO 5: Convertir cantidad de unidad de venta a unidad de almacenamiento
        $cantidadAConsumir = $conversion->convertirABase($cantidadSolicitada);

        Log::debug('🔄 [VentaDistribucionService] Conversión aplicada', [
            'producto_id' => $producto->id,
            'producto_nombre' => $producto->nombre,
            'cantidad_solicitada' => $cantidadSolicitada,
            'unidad_venta' => $conversion->unidadDestino?->nombre ?? 'ID:' . $unidadVentaId,
            'cantidad_consumir' => $cantidadAConsumir,
            'unidad_almacenamiento' => $conversion->unidadBase?->nombre ?? 'ID:' . $producto->unidad_medida_id,
            'factor_conversion' => $conversion->factor_conversion,
        ]);

        return [
            'cantidad_consumir' => $cantidadAConsumir,
            'conversion_aplicada' => true,
            'factor' => (float) $conversion->factor_conversion,
        ];
    }

    /**
     * ✅ NUEVO (2026-03-27): Servicio centralizado para registrar movimientos
     */
    private MovimientoInventarioService $movimientoService;

    public function __construct()
    {
        $this->movimientoService = new MovimientoInventarioService();
    }

    /**
     * ✅ REFACTORIZADO (2026-03-27): Consumir stock para una venta usando FIFO con movimientos AGRUPADOS
     *
     * FLUJO:
     * 1. Validar datos
     * 2. Para cada producto:
     *    a. Obtener stocks con FIFO (vencimiento cercano primero)
     *    b. Validar si hay disponible (excepto CREDITO o farmacia con producto sin stock)
     *    c. Consumir según FIFO, recolectando detalles de cada lote
     *    d. Registrar UN SOLO movimiento AGRUPADO por producto con detalles de lotes en JSON
     * 3. Retornar movimientos creados
     *
     * @param array $detalles Array de productos: [['producto_id' => X, 'cantidad' => Y], ...]
     * @param string $numeroVenta Referencia para movimiento (ej: VEN20260211-0001)
     * @param bool $permitirStockNegativo Para CREDITO (permite stock negativo)
     * @param bool $esFarmacia Permite venta sin stock para productos configurados (2026-05-08)
     * @return array Movimientos creados en movimientos_inventario (AGRUPADOS por producto)
     * @throws Exception Si stock insuficiente o error en proceso
     */
    public function consumirStock(
        array $detalles,
        string $numeroVenta,
        ?int $ventaId = null,                    // ✅ NUEVO (2026-06-29): Para referencia_id en movimientos
        bool $permitirStockNegativo = false,
        bool $esFarmacia = false
    ): array {
        Log::info('🔄 [VentaDistribucionService::consumirStock] Iniciando consumo de stock', [
            'numero_venta' => $numeroVenta,
            'cantidad_productos' => count($detalles),
            'almacen_id' => auth()->user()?->empresa?->almacen_id ?? 1,
            'permite_stock_negativo' => $permitirStockNegativo,
            'es_farmacia' => $esFarmacia,
            'timestamp' => now()->toIso8601String(),
        ]);

        $almacenId = auth()->user()?->empresa?->almacen_id ?? 1;
        $movimientos = [];
        $productosProcessados = [];

        return DB::transaction(function () use ($detalles, $numeroVenta, $ventaId, $almacenId, $permitirStockNegativo, $esFarmacia, &$movimientos, &$productosProcessados) {
            foreach ($detalles as $item) {
                $productoId = $item['producto_id'] ?? $item['id'];
                // ✅ CAMBIO (2026-02-16): Permitir decimales en lugar de truncar a entero
                $cantidad = (float) ($item['cantidad'] ?? 0);
                // ✅ NUEVO: Obtener unidad de venta desde el item (si existe)
                // 🔧 CORREGIDO (2026-02-18): Buscar 'unidad_venta_id' (del frontend) o 'unidad_medida_id' (para compatibilidad)
                $unidadVentaId = $item['unidad_venta_id'] ?? $item['unidad_medida_id'] ?? null;

                if ($cantidad <= 0) {
                    Log::warning('⚠️ [VentaDistribucionService] Cantidad inválida', [
                        'producto_id' => $productoId,
                        'cantidad' => $cantidad,
                    ]);
                    continue;
                }

                // ✅ NUEVO (2026-06-29): Rastrear que este producto fue procesado
                $productosProcessados[$productoId] = true;

                // 1. Obtener producto
                $producto = Producto::find($productoId);
                if (!$producto) {
                    throw new Exception("Producto ID {$productoId} no encontrado");
                }

                // ✅ NUEVO (2026-02-16): Obtener cantidad real a consumir (aplicando conversiones si aplican)
                try {
                    $resultadoConversion = $this->obtenerCantidadAConsumir($producto, $cantidad, $unidadVentaId);
                    $cantidadAConsumir = $resultadoConversion['cantidad_consumir'];
                    $conversionAplicada = $resultadoConversion['conversion_aplicada'];
                    $factorConversion = $resultadoConversion['factor'];
                } catch (Exception $e) {
                    Log::error('❌ [VentaDistribucionService] Error al obtener cantidad a consumir', [
                        'producto_id' => $productoId,
                        'cantidad_solicitada' => $cantidad,
                        'unidad_venta_id' => $unidadVentaId,
                        'error' => $e->getMessage(),
                    ]);
                    throw $e;
                }

                // ✅ NUEVO (2026-05-08): Determinar si se permite venta sin stock (debe estar ANTES de usar en query)
                $permitirSinStock = $esFarmacia && $producto->puedeVenderseSinStock($esFarmacia);

                // 2. Obtener stocks disponibles con FIFO (vencimiento cercano primero)
                // ✅ FIFO: ordenar por fecha_vencimiento ASC (vence primero), luego id (creado primero)
                // ✅ NUEVO (2026-05-08): Para farmacias sin stock, permitir cantidad_disponible <= 0
                $stockQuery = StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacenId);

                // Solo filtrar por cantidad_disponible si NO es farmacia con venta sin stock
                if (!$permitirSinStock) {
                    $stockQuery->where('cantidad_disponible', '>', 0);
                }

                $stocks = $stockQuery
                    ->orderBy('fecha_vencimiento', 'asc')  // ← Vencimiento más cercano primero
                    ->orderBy('id', 'asc')                  // ← Creado primero
                    ->lockForUpdate()                       // ← Lock pesimista
                    ->get();

                // 3. Validar stock disponible (en unidad de almacenamiento)
                // ✅ NUEVO (2026-05-08): Permitir stock negativo para farmacias con productos sin stock
                $stockTotal = $stocks->sum('cantidad_disponible');

                if (!$permitirStockNegativo && !$permitirSinStock && $stockTotal < $cantidadAConsumir) {
                    Log::error('❌ [VentaDistribucionService] Stock insuficiente', [
                        'producto_id' => $productoId,
                        'cantidad_solicitada' => $cantidad,
                        'cantidad_a_consumir' => $cantidadAConsumir,
                        'unidad_venta' => $unidadVentaId,
                        'stock_disponible' => $stockTotal,
                        'numero_venta' => $numeroVenta,
                        'conversion_aplicada' => $conversionAplicada,
                    ]);
                    throw new Exception(
                        "Stock insuficiente para producto ID {$productoId}: " .
                        "Disponible: {$stockTotal}, Necesario: {$cantidadAConsumir}"
                    );
                }

                // ✅ Log si es CREDITO (stock negativo permitido)
                if ($permitirStockNegativo && $stockTotal < $cantidadAConsumir) {
                    Log::info('ℹ️ [VentaDistribucionService] Stock negativo permitido (CREDITO)', [
                        'producto_id' => $productoId,
                        'cantidad_solicitada' => $cantidad,
                        'cantidad_a_consumir' => $cantidadAConsumir,
                        'stock_disponible' => $stockTotal,
                        'numero_venta' => $numeroVenta,
                        'conversion_aplicada' => $conversionAplicada,
                    ]);
                }

                // ✅ NUEVO (2026-05-08): Log si es FARMACIA con producto sin stock
                if ($permitirSinStock && $stockTotal < $cantidadAConsumir) {
                    Log::info('✅ [VentaDistribucionService] Stock negativo permitido (FARMACIA - Producto sin stock)', [
                        'producto_id' => $productoId,
                        'producto_nombre' => $producto->nombre,
                        'cantidad_solicitada' => $cantidad,
                        'cantidad_a_consumir' => $cantidadAConsumir,
                        'stock_disponible' => $stockTotal,
                        'numero_venta' => $numeroVenta,
                        'permite_venta_sin_stock' => $producto->permite_venta_sin_stock,
                    ]);
                }


                // ✅ NUEVO (2026-05-08): Para farmacias sin stock, crear registro si no existe
                if ($permitirSinStock && $stocks->isEmpty()) {
                    $stock = StockProducto::firstOrCreate(
                        [
                            'producto_id' => $productoId,
                            'almacen_id' => $almacenId,
                            'lote' => null,
                        ],
                        [
                            'cantidad' => 0,
                            'cantidad_disponible' => 0,
                            'cantidad_reservada' => 0,
                            'fecha_actualizacion' => now(),
                        ]
                    );

                    Log::info('✅ [VentaDistribucionService] Registro de stock creado para farmacia sin stock', [
                        'producto_id' => $productoId,
                        'almacen_id' => $almacenId,
                        'stock_id' => $stock->id,
                    ]);

                    // Recargar stocks para incluir el nuevo registro
                    $stocks = StockProducto::where('producto_id', $productoId)
                        ->where('almacen_id', $almacenId)
                        ->orderBy('fecha_vencimiento', 'asc')
                        ->orderBy('id', 'asc')
                        ->lockForUpdate()
                        ->get();
                }

                // 4. ✅ REFACTORIZADO (2026-06-08): Consumir stock según FIFO con MovimientoStockService
                $cantidadRestante = (float) $cantidadAConsumir;
                $movimientoStockService = new \App\Services\Stock\MovimientoStockService(
                    app(\App\Services\Stock\StockValidationService::class)
                );

                foreach ($stocks as $stock) {
                    if ($cantidadRestante <= 0) {
                        break;
                    }

                    // Tomar lo menor: lo que necesito o lo que hay disponible
                    $cantidadTomar = (float) min($cantidadRestante, (float) $stock->cantidad_disponible);

                    try {
                        // ✅ NUEVO: Usar MovimientoStockService que valida y actualiza atomicamente
                        $movimientoRegistrado = $movimientoStockService->registrarMovimientoYActualizar(
                            stockProductoId: $stock->id,
                            cantidad: -(int)$cantidadTomar,  // Negativo: salida
                            tipo: MovimientoInventario::TIPO_SALIDA_VENTA,
                            referencia_tipo: 'venta',
                            referencia_id: $ventaId ?? 0,  // ✅ CORREGIDO (2026-06-29): Usar venta_id real
                            metadataAdicional: [
                                'numero_venta' => $numeroVenta,
                                'lote' => $stock->lote,
                                'fecha_vencimiento' => $stock->fecha_vencimiento?->format('Y-m-d'),
                                'unidad_venta_id' => $unidadVentaId,
                                'conversion_aplicada' => $conversionAplicada,
                                'factor_conversion' => $factorConversion,
                            ],
                            numeroDocumento: $numeroVenta  // ✅ NUEVO (2026-06-09)
                        );

                        // ✅ NUEVO: Agregar a movimientos para retornar
                        $movimientos[] = $movimientoRegistrado;

                        // ✅ NUEVO (2026-07-24): Registrar en venta_por_lotes para trazabilidad por lote
                        if ($ventaId) {
                            try {
                                \App\Models\VentaPorLote::create([
                                    'venta_id'           => $ventaId,
                                    'detalle_venta_id'   => $item['detalle_venta_id'] ?? null,
                                    'producto_id'        => $productoId,
                                    'stock_producto_id'  => $stock->id,
                                    'cantidad_consumida' => $cantidadTomar,
                                    'combo_padre_id'     => $item['combo_padre_id'] ?? null,
                                    'fecha_vencimiento'  => $stock->fecha_vencimiento,
                                ]);

                                Log::debug('✅ [VentaDistribucionService] Registrado en venta_por_lotes', [
                                    'venta_id'          => $ventaId,
                                    'detalle_venta_id'  => $item['detalle_venta_id'] ?? null,
                                    'producto_id'       => $productoId,
                                    'stock_id'          => $stock->id,
                                    'cantidad_consumida'=> $cantidadTomar,
                                    'combo_padre_id'    => $item['combo_padre_id'] ?? null,
                                ]);
                            } catch (\Exception $e) {
                                Log::error('❌ Error registrando en venta_por_lotes', [
                                    'venta_id' => $ventaId,
                                    'stock_id' => $stock->id,
                                    'error' => $e->getMessage(),
                                ]);
                                // No lanzar excepción - el consumo ya se registró, este es adicional
                            }
                        }

                        Log::debug('📦 [VentaDistribucionService] Stock consumido de lote', [
                            'venta' => $numeroVenta,
                            'stock_producto_id' => $stock->id,
                            'producto_id' => $productoId,
                            'lote' => $stock->lote,
                            'cantidad_consumida' => $cantidadTomar,
                        ]);
                    } catch (\Exception $e) {
                        Log::error('❌ Error consumiendo lote', [
                            'stock_id' => $stock->id,
                            'venta' => $numeroVenta,
                            'error' => $e->getMessage(),
                        ]);
                        throw $e;
                    }

                    $cantidadRestante = (float) ($cantidadRestante - $cantidadTomar);
                }

                // ✅ REFACTORIZADO (2026-06-08): MovimientoStockService ya registra cada lote individualmente
                // Las auditorías ahora están en movimientos_inventario con más granularidad (por lote)
            }

            Log::info('✅ [VentaDistribucionService::consumirStock] Stock consumido exitosamente', [
                'numero_venta' => $numeroVenta,
                'movimientos_creados' => count($movimientos),
                'almacen_id' => $almacenId,
                'timestamp' => now()->toIso8601String(),
            ]);

            return $movimientos;
        });
    }

    /**
     * ✅ REFACTORIZADO (2026-03-27): Devolver stock cuando se anula una venta con movimientos AGRUPADOS
     *
     * FLUJO:
     * 1. Obtener movimientos de consumo de la venta (SALIDA_VENTA + CONSUMO_RESERVA)
     * 2. Agrupar por producto
     * 3. Para cada producto:
     *    a. Recolectar detalles de todos los lotes
     *    b. Restaurar cantidad en stock_productos para cada lote
     *    c. Registrar UN SOLO movimiento ENTRADA_AJUSTE agrupado con detalles de lotes en JSON
     * 4. Retornar resultado de devolución
     *
     * @param string $numeroVenta Referencia de la venta a devolver
     * @return array Resultado de devolución: ['success' => bool, 'cantidad_devuelta' => int, 'movimientos' => int, 'error' => string|null]
     */
    public function devolverStock(string $numeroVenta): array
    {
        Log::info('🔄 [VentaDistribucionService::devolverStock] Iniciando devolución de stock', [
            'numero_venta' => $numeroVenta,
            'timestamp' => now()->toIso8601String(),
        ]);

        try {
            return DB::transaction(function () use ($numeroVenta) {
                // ✅ NUEVO: Obtener venta_id desde el número de venta para referencia_id
                $venta = Venta::where('numero', $numeroVenta)->first();
                $ventaId = $venta?->id ?? 0;

                // ✅ NUEVO (2026-07-24): Usar venta_por_lotes para devoluciones exactas por lote
                $ventaPorLotes = \App\Models\VentaPorLote::where('venta_id', $ventaId)
                    ->with('stockProducto')
                    ->lockForUpdate()
                    ->get();

                // Si no hay registros en venta_por_lotes, intentar fallback a movimientos (compatibilidad)
                if ($ventaPorLotes->isEmpty()) {
                    Log::info('⚠️ [VentaDistribucionService::devolverStock] No hay registros en venta_por_lotes, usando fallback a movimientos', [
                        'venta_id' => $ventaId,
                        'numero_venta' => $numeroVenta,
                    ]);

                    // ✅ FALLBACK: Obtener movimientos de consumo (SALIDA_VENTA + CONSUMO_RESERVA)
                    $movimientos = MovimientoInventario::where('numero_documento', $numeroVenta)
                        ->whereIn('tipo', [
                            MovimientoInventario::TIPO_SALIDA_VENTA,
                            'CONSUMO_RESERVA'
                        ])
                        ->lockForUpdate()
                        ->get();

                    if ($movimientos->isEmpty()) {
                        Log::warning('⚠️ [VentaDistribucionService] No hay movimientos de consumo para devolver', [
                            'numero_venta' => $numeroVenta,
                        ]);

                        return [
                            'success' => true,
                            'cantidad_devuelta' => 0,
                            'movimientos' => 0,
                            'error' => null,
                        ];
                    }

                    $ventaPorLotes = collect();  // Colección vacía para no ejecutar lógica nueva
                }

                $totalDevuelto = 0;
                $movimientosCreados = 0;
                $almacenId = auth()->user()?->empresa?->almacen_id ?? 1;
                $movimientoStockService = new \App\Services\Stock\MovimientoStockService(
                    app(\App\Services\Stock\StockValidationService::class)
                );

                // ✅ NUEVO (2026-07-24): Devolver usando venta_por_lotes (más preciso)
                if ($ventaPorLotes->isNotEmpty()) {
                    // Agrupar por lote (stock_producto_id) para devolver exactamente a cada lote
                    $porLote = $ventaPorLotes->groupBy('stock_producto_id');

                    foreach ($porLote as $stockId => $lotesDelLote) {
                        $cantidadTotalLote = $lotesDelLote->sum('cantidad_consumida');

                        try {
                            // Obtener el stock_producto actual
                            $stock = StockProducto::lockForUpdate()->find($stockId);
                            if (!$stock) {
                                Log::error('❌ Stock no encontrado para devolución', [
                                    'stock_id' => $stockId,
                                    'venta_id' => $ventaId,
                                ]);
                                continue;
                            }

                            // ✅ Registrar entrada (devolución) exactamente a este lote
                            $movimientoStockService->registrarMovimientoYActualizar(
                                stockProductoId: $stock->id,
                                cantidad: (int)$cantidadTotalLote,
                                tipo: MovimientoInventario::TIPO_ENTRADA_AJUSTE,
                                referencia_tipo: 'venta_devolucion',
                                referencia_id: $ventaId,
                                metadataAdicional: [
                                    'numero_venta' => $numeroVenta . '-DEV',
                                    'lote' => $stock->lote,
                                    'fecha_vencimiento' => $stock->fecha_vencimiento?->format('Y-m-d'),
                                    'razon' => 'Devolución por anulación de venta (venta_por_lotes)',
                                ],
                                numeroDocumento: $numeroVenta . '-DEV'
                            );

                            Log::info('✅ [VentaDistribucionService] Stock devuelto a lote (venta_por_lotes)', [
                                'venta_id' => $ventaId,
                                'stock_id' => $stock->id,
                                'lote' => $stock->lote,
                                'cantidad_devuelta' => $cantidadTotalLote,
                            ]);

                            $totalDevuelto += $cantidadTotalLote;
                            $movimientosCreados++;

                        } catch (\Exception $e) {
                            Log::error('❌ Error devolviendo lote', [
                                'stock_id' => $stockId,
                                'venta_id' => $ventaId,
                                'error' => $e->getMessage(),
                            ]);
                            throw $e;
                        }
                    }
                } else {
                    // ✅ FALLBACK: Usar movimientos si venta_por_lotes está vacío
                    $movimientos = MovimientoInventario::where('numero_documento', $numeroVenta)
                        ->whereIn('tipo', [
                            MovimientoInventario::TIPO_SALIDA_VENTA,
                            'CONSUMO_RESERVA'
                        ])
                        ->lockForUpdate()
                        ->get();

                    $movimientosPorProducto = $movimientos->groupBy(function ($mov) {
                        return $mov->stockProducto->producto_id;
                    });

                    foreach ($movimientosPorProducto as $productoId => $productosMovimientos) {
                        foreach ($productosMovimientos as $movimiento) {
                            $stock = $movimiento->stockProducto;
                            $cantidadADevolver = abs($movimiento->cantidad);

                            try {
                                $movimientoStockService->registrarMovimientoYActualizar(
                                    stockProductoId: $stock->id,
                                    cantidad: (int)$cantidadADevolver,
                                    tipo: MovimientoInventario::TIPO_ENTRADA_AJUSTE,
                                    referencia_tipo: 'venta_devolucion',
                                    referencia_id: $ventaId,
                                    metadataAdicional: [
                                        'numero_venta' => $numeroVenta . '-DEV',
                                        'lote' => $stock->lote,
                                        'fecha_vencimiento' => $stock->fecha_vencimiento?->format('Y-m-d'),
                                        'movimiento_original_id' => $movimiento->id,
                                    ],
                                    numeroDocumento: $numeroVenta . '-DEV'
                                );

                                $totalDevuelto += $cantidadADevolver;
                            } catch (\Exception $e) {
                                Log::error('❌ Error devolviendo lote (fallback)', [
                                    'stock_id' => $stock->id,
                                    'venta_id' => $ventaId,
                                    'error' => $e->getMessage(),
                                ]);
                                throw $e;
                            }
                        }
                        $movimientosCreados++;
                    }
                }

                Log::info('✅ [VentaDistribucionService::devolverStock] Stock devuelto exitosamente', [
                    'venta_id' => $ventaId,
                    'numero_venta' => $numeroVenta,
                    'cantidad_total_devuelta' => $totalDevuelto,
                    'movimientos_creados' => $movimientosCreados,
                    'usa_venta_por_lotes' => $ventaPorLotes->isNotEmpty(),
                    'timestamp' => now()->toIso8601String(),
                ]);

                return [
                    'success' => true,
                    'cantidad_devuelta' => $totalDevuelto,
                    'movimientos' => $movimientosCreados,
                    'error' => null,
                ];
            });
        } catch (Exception $e) {
            Log::error('❌ [VentaDistribucionService::devolverStock] Error en devolución', [
                'numero_venta' => $numeroVenta,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'cantidad_devuelta' => 0,
                'movimientos' => 0,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Validar si hay stock disponible para una venta
     *
     * ✅ NUEVO (2026-05-08): Soporte para farmacias que pueden vender sin stock
     *
     * @param array $detalles Array de productos a validar
     * @param bool $esFarmacia Si la empresa es farmacia, permite venta sin stock para productos configurados
     * @return array ['valido' => bool, 'detalles' => array de errores si aplica]
     */
    public function validarDisponible(array $detalles, bool $esFarmacia = false): array
    {
        Log::debug('🔍 [VentaDistribucionService::validarDisponible] Validando disponibilidad', [
            'cantidad_productos' => count($detalles),
            'almacen_id' => auth()->user()?->empresa?->almacen_id ?? 1,
            'es_farmacia' => $esFarmacia,
        ]);

        $almacenId = auth()->user()?->empresa?->almacen_id ?? 1;
        $errores = [];

        foreach ($detalles as $item) {
            $productoId = $item['producto_id'] ?? $item['id'];
            // ✅ CAMBIO (2026-02-16): Permitir decimales en lugar de truncar a entero
            $cantidad = (float) ($item['cantidad'] ?? 0);
            // ✅ NUEVO: Obtener unidad de venta desde el item (si existe)
            $unidadVentaId = $item['unidad_medida_id'] ?? null;

            if ($cantidad <= 0) {
                continue;
            }

            // ✅ NUEVO (2026-02-16): Obtener cantidad real a consumir (con conversión si aplica)
            $producto = Producto::find($productoId);
            if (!$producto) {
                $errores[] = [
                    'producto_id' => $productoId,
                    'cantidad_necesaria' => $cantidad,
                    'stock_disponible' => 0,
                    'error' => 'Producto no encontrado',
                ];
                continue;
            }

            try {
                $resultadoConversion = $this->obtenerCantidadAConsumir($producto, $cantidad, $unidadVentaId);
                $cantidadAValidar = $resultadoConversion['cantidad_consumir'];
            } catch (Exception $e) {
                $errores[] = [
                    'producto_id' => $productoId,
                    'cantidad_necesaria' => $cantidad,
                    'stock_disponible' => 0,
                    'error' => $e->getMessage(),
                ];
                continue;
            }

            // ✅ NUEVO (2026-05-08): Validar que productos sin stock SOLO se vendan en farmacias
            if ($producto->permite_venta_sin_stock && !$esFarmacia) {
                $errores[] = [
                    'producto_id' => $productoId,
                    'cantidad_necesaria' => $cantidad,
                    'stock_disponible' => 0,
                    'error' => "El producto '{$producto->nombre}' solo puede venderse en empresas de farmacia. Esta empresa no está configurada como farmacia.",
                ];

                Log::warning('⚠️ [VentaDistribucionService] Intento de vender producto sin stock en empresa no-farmacia', [
                    'producto_id' => $productoId,
                    'producto_nombre' => $producto->nombre,
                    'es_farmacia' => $esFarmacia,
                    'permite_venta_sin_stock' => $producto->permite_venta_sin_stock,
                ]);
                continue;
            }

            // ✅ NUEVO (2026-05-08): Permitir venta sin stock para farmacias si producto lo permite
            if ($esFarmacia && $producto->puedeVenderseSinStock($esFarmacia)) {
                Log::info('✅ [VentaDistribucionService] Venta sin stock permitida en farmacia', [
                    'producto_id' => $productoId,
                    'producto_nombre' => $producto->nombre,
                    'cantidad' => $cantidad,
                    'permitir_venta_sin_stock' => $producto->permite_venta_sin_stock,
                ]);
                continue;  // Saltarse validación de stock para este producto
            }

            $stockTotal = StockProducto::where('producto_id', $productoId)
                ->where('almacen_id', $almacenId)
                ->sum('cantidad_disponible');

            if ($stockTotal < $cantidadAValidar) {
                $errores[] = [
                    'producto_id' => $productoId,
                    'cantidad_necesaria' => $cantidadAValidar,
                    'stock_disponible' => $stockTotal,
                ];

                Log::warning('⚠️ [VentaDistribucionService] Stock insuficiente', [
                    'producto_id' => $productoId,
                    'cantidad_solicitada' => $cantidad,
                    'cantidad_a_validar' => $cantidadAValidar,
                    'stock_disponible' => $stockTotal,
                ]);
            }

            // ✅ NUEVO (2026-03-28): Validar también items del combo si es_combo
            if ($producto->es_combo && !empty($item['combo_items_seleccionados'])) {
                foreach ($item['combo_items_seleccionados'] as $comboItem) {
                    // Si el item no está incluido, no validar
                    if (!($comboItem['incluido'] ?? true)) {
                        continue;
                    }

                    $itemProductoId = $comboItem['producto_id'] ?? null;
                    $itemCantidad = (float) ($comboItem['cantidad'] ?? 0);

                    if (!$itemProductoId || $itemCantidad <= 0) {
                        continue;
                    }

                    // Calcular cantidad total necesaria: cantidad de combos × cantidad por combo
                    $cantidadTotalNecesaria = $cantidad * $itemCantidad;

                    // Validar stock disponible para el item del combo
                    $itemStockTotal = StockProducto::where('producto_id', $itemProductoId)
                        ->where('almacen_id', $almacenId)
                        ->sum('cantidad_disponible');

                    if ($itemStockTotal < $cantidadTotalNecesaria) {
                        $itemProducto = Producto::find($itemProductoId);
                        $errores[] = [
                            'producto_id' => $itemProductoId,
                            'producto_nombre' => $itemProducto?->nombre ?? "Producto #{$itemProductoId}",
                            'cantidad_necesaria' => $cantidadTotalNecesaria,
                            'stock_disponible' => $itemStockTotal,
                            'es_componente_combo' => true,
                            'combo_producto_id' => $productoId,
                        ];

                        Log::warning('⚠️ [VentaDistribucionService] Stock insuficiente en componente de combo', [
                            'combo_producto_id' => $productoId,
                            'combo_cantidad' => $cantidad,
                            'item_producto_id' => $itemProductoId,
                            'item_cantidad_base' => $itemCantidad,
                            'cantidad_necesaria' => $cantidadTotalNecesaria,
                            'stock_disponible' => $itemStockTotal,
                        ]);
                    }
                }
            }
        }

        $valido = empty($errores);

        Log::debug('✅ [VentaDistribucionService::validarDisponible] Validación completada', [
            'valido' => $valido,
            'errores' => count($errores),
        ]);

        return [
            'valido' => $valido,
            'detalles' => $errores,
        ];
    }

    /**
     * Obtener disponibilidad actual de stock para productos
     *
     * @param array $productoIds Array de IDs de productos
     * @return array Array con disponibilidad por producto: [['producto_id' => X, 'disponible' => Y], ...]
     */
    public function obtenerDisponibilidad(array $productoIds): array
    {
        $almacenId = auth()->user()?->empresa?->almacen_id ?? 1;

        return StockProducto::whereIn('producto_id', $productoIds)
            ->where('almacen_id', $almacenId)
            ->groupBy('producto_id')
            ->selectRaw('producto_id, SUM(cantidad_disponible) as disponible')
            ->get()
            ->map(function ($item) {
                return [
                    'producto_id' => $item->producto_id,
                    // ✅ CAMBIO (2026-02-16): Retornar como float para soportar productos fraccionados
                    'disponible' => (float) $item->disponible,
                ];
            })
            ->toArray();
    }
}
