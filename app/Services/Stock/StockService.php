<?php
namespace App\Services\Stock;

use App\DTOs\Stock\ValidacionStockDTO;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\StockProducto;
use App\Services\Traits\LogsOperations;
use App\Services\Traits\ManagesTransactions;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

/**
 * StockService - ÚNICA FUENTE DE VERDAD para operaciones de stock
 *
 * RESPONSABILIDADES:
 * ✓ Validar disponibilidad de stock
 * ✓ Consumir stock por venta
 * ✓ Recibir stock por compra
 * ✓ Revertir stock por devolución
 * ✓ Registrar movimientos
 * ✓ Manejar reservas
 *
 * INVARIANTE: Todos los cambios de stock PASAN POR AQUÍ
 *
 * NO RESPONSABILIDADES:
 * ✗ HTTP
 * ✗ Formateo de respuesta
 * ✗ Lógica de venta (eso es VentaService)
 */
class StockService
{
    use ManagesTransactions, LogsOperations;

    /**
     * Validar disponibilidad de stock para múltiples productos
     *
     * IMPORTANTE: No consume nada, solo valida
     * NUEVO: Soporta unidad_medida_id para productos fraccionados
     *
     * @param array $productos Array con estructura: { producto_id, cantidad, unidad_medida_id? }
     * @return ValidacionStockDTO
     */
    public function validarDisponible(
        array $productos,
        int $almacenId = 2
    ): ValidacionStockDTO {
        $resultados = [];
        $errores    = [];

        foreach ($productos as $item) {
            $productoId         = $item['producto_id'] ?? $item['id'];
            $cantidadSolicitada = (float) $item['cantidad'];
            $unidadMedidaId     = $item['unidad_medida_id'] ?? null;

            // Validar que el producto exista y esté activo
            $producto = Producto::find($productoId);

            if (! $producto) {
                $errores[]    = "Producto ID {$productoId}: No encontrado";
                $resultados[] = [
                    'producto_id'         => $productoId,
                    'cantidad_solicitada' => $cantidadSolicitada,
                    'stock_disponible'    => 0,
                    'suficiente'          => false,
                    'error'               => 'Producto no encontrado',
                ];
                continue;
            }

            if (! $producto->activo) {
                $errores[]    = "Producto '{$producto->nombre}': Desactivado";
                $resultados[] = [
                    'producto_id'         => $productoId,
                    'cantidad_solicitada' => $cantidadSolicitada,
                    'stock_disponible'    => 0,
                    'suficiente'          => false,
                    'error'               => 'Producto desactivado',
                ];
                continue;
            }

            // ✅ COMBOS se venden por unidad (sin conversión)
            if ($producto->es_combo) {
                // Los combos usan cantidad tal cual (vendidos como 1 combo, 2 combos, etc)
                $cantidadSolicitadaBase = $cantidadSolicitada;
            } else {
                // ✅ PRODUCTOS NORMALES: Convertir a unidad base
                // Si no se especificó unidad, usar la unidad base del producto
                if (!$unidadMedidaId) {
                    $unidadMedidaId = $producto->unidad_medida_id;
                }

                // Validar que la unidad esté configurada
                if (!$unidadMedidaId) {
                    $errores[] = "Producto '{$producto->nombre}': No tiene unidad de medida configurada en la BD";
                    $resultados[] = [
                        'producto_id'         => $productoId,
                        'cantidad_solicitada' => $cantidadSolicitada,
                        'stock_disponible'    => 0,
                        'suficiente'          => false,
                        'error'               => 'Producto sin unidad de medida configurada',
                    ];
                    continue;
                }

                // Convertir cantidad a unidad base
                try {
                    $cantidadSolicitadaBase = $producto->convertirAUnidadBase($cantidadSolicitada, $unidadMedidaId);
                } catch (\Exception $e) {
                    $errores[] = "Producto '{$producto->nombre}': Error de conversión - {$e->getMessage()}";
                    $resultados[] = [
                        'producto_id'         => $productoId,
                        'unidad_medida_id'    => $unidadMedidaId,
                        'cantidad_solicitada' => $cantidadSolicitada,
                        'stock_disponible'    => 0,
                        'suficiente'          => false,
                        'error'               => 'Error de conversión de unidad',
                    ];
                    continue;
                }
            }

            $stockDisponibleBase = $this->obtenerDisponible($productoId, $almacenId);

            $suficiente = $stockDisponibleBase >= $cantidadSolicitadaBase;

            $resultado = [
                'producto_id'              => $productoId,
                'producto_nombre'          => $producto->nombre,
                'unidad_medida_id'         => $unidadMedidaId,
                'cantidad_solicitada'      => $cantidadSolicitada,
                'cantidad_solicitada_base' => $cantidadSolicitadaBase,
                'stock_disponible_base'    => $stockDisponibleBase,
                'suficiente'               => $suficiente,
            ];

            if (! $suficiente) {
                $errores[] = "Producto '{$producto->nombre}': Stock insuficiente. " .
                    "Disponible: {$stockDisponibleBase} (base), Solicitado: {$cantidadSolicitadaBase} (base)";
            }

            $resultados[] = $resultado;
        }

        return new ValidacionStockDTO(
            valido: empty($errores),
            errores: $errores,
            detalles: $resultados,
        );
    }

    /**
     * Obtener stock disponible de un producto en un almacén
     *
     * Fórmula: cantidad_física - reservas_activas
     *
     * IMPORTANTE: Usa cantidad_disponible campo calculado en BD
     * RETORNA: float (soporta productos fraccionados)
     */
    public function obtenerDisponible(int $productoId, int $almacenId = 1): float
    {
        return (float) StockProducto::where('producto_id', $productoId)
            ->where('almacen_id', $almacenId)
            ->sum('cantidad_disponible');
    }

    /**
     * Consumir stock por venta
     *
     * DEBE ser llamado DENTRO de una transacción
     * NUEVO: Soporta unidad_medida_id para productos fraccionados
     *
     * @param array $productos Array de { producto_id, cantidad, unidad_medida_id? }
     * @param string $referencia Identificador de la operación (VENTA#123)
     * @param int $almacenId
     * @throws Exception Si hay stock insuficiente o error de conversión
     */
    public function procesarSalidaVenta(
        array $productos,
        string $referencia,
        int $almacenId = 1,
        bool $permitirStockNegativo = false  // ✅ NUEVO: Para CREDITO que permite stock negativo
    ): array {
        $movimientos = [];

        try {
            foreach ($productos as $item) {
                $productoId        = $item['producto_id'] ?? $item['id'];
                $cantidadOriginal  = (float) $item['cantidad'];
                $unidadMedidaId    = $item['unidad_medida_id'] ?? null;

                $producto = Producto::find($productoId);
                if (!$producto) {
                    throw new Exception("Producto ID {$productoId} no encontrado");
                }

                // Si no se especificó unidad, usar la unidad base del producto
                if (!$unidadMedidaId) {
                    $unidadMedidaId = $producto->unidad_medida_id;
                }

                // Convertir cantidad a unidad base
                $cantidadNecesaria = $producto->convertirAUnidadBase($cantidadOriginal, $unidadMedidaId);

                // Obtener stock con LOCK pesimista (FIFO)
                $stocks = StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacenId)
                    ->where('cantidad_disponible', '>', 0)
                    ->orderBy('fecha_vencimiento', 'asc')
                    ->orderBy('id', 'asc')
                    ->lockForUpdate()
                    ->get();

                // ✅ MODIFICADO: Validar stock total SOLO si no permitimos stock negativo (es decir, NO es CREDITO)
                $stockTotal = $stocks->sum('cantidad_disponible');
                if (!$permitirStockNegativo && $stockTotal < $cantidadNecesaria) {
                    throw new Exception(
                        "Stock insuficiente para producto ID {$productoId}: " .
                        "Disponible: {$stockTotal}, Necesario: {$cantidadNecesaria}"
                    );
                }

                // ✅ NUEVO: Log para CREDITO o stock negativo
                if ($permitirStockNegativo) {
                    \Illuminate\Support\Facades\Log::info('⚠️ [StockService] Procesando salida con stock negativo permitido (CREDITO)', [
                        'producto_id' => $productoId,
                        'cantidad_necesaria' => $cantidadNecesaria,
                        'stock_disponible' => $stockTotal,
                    ]);
                }

                // Consumir según FIFO
                $cantidadRestante = $cantidadNecesaria;

                foreach ($stocks as $stock) {
                    if ($cantidadRestante <= 0) {
                        break;
                    }

                    $cantidadTomar = min($cantidadRestante, $stock->cantidad_disponible);

                    // Actualizar stock
                    $stock->decrement('cantidad_disponible', $cantidadTomar);
                    $stock->decrement('cantidad', $cantidadTomar);

                    // Registrar movimiento
                    $observacion = "Venta: {$cantidadOriginal} {$unidadMedidaId} = {$cantidadNecesaria} base";

                    $movimiento = MovimientoInventario::create([
                        'stock_producto_id'  => $stock->id,
                        'cantidad'           => -$cantidadTomar,
                        'cantidad_anterior'  => $stock->cantidad + $cantidadTomar,
                        'cantidad_posterior' => $stock->cantidad,
                        'tipo'               => MovimientoInventario::TIPO_SALIDA_VENTA,
                        'numero_documento'   => $referencia,
                        'observacion'        => $observacion,
                        'fecha'              => now(),
                        'user_id'            => Auth::id(),
                    ]);

                    $movimientos[] = $movimiento;
                    $cantidadRestante -= $cantidadTomar;
                }
            }

            $this->logSuccess('Stock consumido por venta', [
                'referencia'  => $referencia,
                'movimientos' => count($movimientos),
            ]);

            return $movimientos;

        } catch (Exception $e) {
            $this->logError('Error al consumir stock', [
                'referencia' => $referencia,
                'error'      => $e->getMessage(),
            ], $e);

            throw $e;
        }
    }

    /**
     * Devolver stock por rechazo o devolución
     *
     * DEBE ser llamado DENTRO de una transacción
     */
    public function devolverStock(
        array $productos,
        string $referencia,
        int $almacenId = 1
    ): array {
        $movimientos = [];

        try {
            foreach ($productos as $item) {
                $productoId = $item['producto_id'] ?? $item['id'];
                $cantidad   = $item['cantidad'];

                // Buscar o crear stock
                $stock = StockProducto::firstOrCreate(
                    [
                        'producto_id' => $productoId,
                        'almacen_id'  => $almacenId,
                    ],
                    [
                        'cantidad'            => 0,
                        'cantidad_disponible' => 0,
                    ]
                );

                // Aumentar cantidad
                $stock->increment('cantidad', $cantidad);
                $stock->increment('cantidad_disponible', $cantidad);

                // Registrar movimiento
                $movimiento = MovimientoInventario::create([
                    'stock_producto_id'  => $stock->id,
                    'cantidad'           => $cantidad,
                    'cantidad_anterior'  => $stock->cantidad - $cantidad,
                    'cantidad_posterior' => $stock->cantidad,
                    'tipo'               => MovimientoInventario::TIPO_ENTRADA_DEVOLUCION,
                    'numero_documento'   => $referencia,
                    'observacion'        => 'Devolución',
                    'fecha'              => now(),
                    'user_id'            => Auth::id(),
                ]);

                $movimientos[] = $movimiento;
            }

            $this->logSuccess('Stock devuelto', [
                'referencia'  => $referencia,
                'movimientos' => count($movimientos),
            ]);

            return $movimientos;

        } catch (Exception $e) {
            $this->logError('Error al devolver stock', [
                'referencia' => $referencia,
            ], $e);

            throw $e;
        }
    }

    /**
     * Recibir stock por compra
     *
     * DEBE ser llamado DENTRO de una transacción
     */
    public function procesarEntradaCompra(
        array $productos,
        string $referencia,
        int $almacenId = 1
    ): array {
        $movimientos = [];

        try {
            foreach ($productos as $item) {
                $productoId       = $item['producto_id'] ?? $item['id'];
                $cantidad         = $item['cantidad'];
                $lote             = $item['lote'] ?? null;
                $fechaVencimiento = $item['fecha_vencimiento'] ?? null;

                // Buscar o crear
                $stock = StockProducto::firstOrCreate(
                    [
                        'producto_id' => $productoId,
                        'almacen_id'  => $almacenId,
                        'lote'        => $lote,
                    ],
                    [
                        'cantidad'            => 0,
                        'cantidad_disponible' => 0,
                        'fecha_vencimiento'   => $fechaVencimiento,
                    ]
                );

                // ✅ NUEVO (2026-03-26): Guardar valores ANTES de incrementar
                $cantidadTotalAnterior = (float) $stock->cantidad;
                $cantidadDisponibleAnterior = (float) $stock->cantidad_disponible;
                $cantidadReservadaAnterior = (float) $stock->cantidad_reservada;

                // Aumentar cantidad
                $stock->increment('cantidad', $cantidad);
                $stock->increment('cantidad_disponible', $cantidad);

                // ✅ NUEVO (2026-03-26): Valores DESPUÉS de incrementar
                $cantidadTotalPosterior = (float) $stock->cantidad;
                $cantidadDisponiblePosterior = (float) $stock->cantidad_disponible;
                $cantidadReservadaPosterior = (float) $stock->cantidad_reservada;

                // Registrar movimiento
                $movimiento = MovimientoInventario::create([
                    'stock_producto_id'  => $stock->id,
                    'cantidad'           => $cantidad,
                    'cantidad_anterior'  => $cantidadTotalAnterior,
                    'cantidad_posterior' => $cantidadTotalPosterior,
                    // ✅ NUEVO (2026-03-26): Registrar en columnas específicas también
                    'cantidad_total_anterior' => $cantidadTotalAnterior,
                    'cantidad_total_posterior' => $cantidadTotalPosterior,
                    'cantidad_disponible_anterior' => $cantidadDisponibleAnterior,
                    'cantidad_disponible_posterior' => $cantidadDisponiblePosterior,
                    'cantidad_reservada_anterior' => $cantidadReservadaAnterior,
                    'cantidad_reservada_posterior' => $cantidadReservadaPosterior,
                    'tipo'               => MovimientoInventario::TIPO_ENTRADA_COMPRA,
                    'numero_documento'   => $referencia,
                    'observacion'        => json_encode([
                        'evento' => 'Entrada por compra',
                        'referencia' => $referencia,
                        'cantidad_total_anterior' => $cantidadTotalAnterior,
                        'cantidad_total_posterior' => $cantidadTotalPosterior,
                        'cantidad_disponible_anterior' => $cantidadDisponibleAnterior,
                        'cantidad_disponible_posterior' => $cantidadDisponiblePosterior,
                        'cantidad_reservada_anterior' => $cantidadReservadaAnterior,
                        'cantidad_reservada_posterior' => $cantidadReservadaPosterior,
                    ]),
                    'fecha'              => now(),
                    'user_id'            => Auth::id(),
                ]);

                $movimientos[] = $movimiento;
            }

            $this->logSuccess('Stock recibido por compra', [
                'referencia'  => $referencia,
                'movimientos' => count($movimientos),
            ]);

            return $movimientos;

        } catch (Exception $e) {
            $this->logError('Error al recibir compra', [
                'referencia' => $referencia,
            ], $e);

            throw $e;
        }
    }

    /**
     * Obtener productos con stock bajo
     */
    public function obtenerStockBajo(): Collection
    {
        return Producto::whereHas('stocks', function ($query) {
            $query->selectRaw('producto_id, SUM(cantidad) as total')
                ->groupBy('producto_id')
                ->havingRaw('SUM(cantidad) <= productos.stock_minimo');
        })->get();
    }

    /**
     * Obtener productos próximos a vencer
     */
    public function obtenerProximosVencer(int $dias = 30): Collection
    {
        return StockProducto::whereBetween('fecha_vencimiento', [
            now(),
            now()->addDays($dias),
        ])->with('producto')->get();
    }

    /**
     * Expandir combos en sus componentes para operaciones de stock.
     * Transformación pura: no escribe a DB. Si no hay combos, retorna entrada sin cambios.
     * Agrega cantidades si el mismo producto aparece en varios combos o como línea independiente.
     */
    public function expandirCombos(array $productos): array
    {
        $ids = array_map(fn($item) => $item['producto_id'] ?? $item['id'], $productos);

        $combos = Producto::whereIn('id', $ids)
            ->where('es_combo', true)
            ->with('comboItems')
            ->get()
            ->keyBy('id');

        $expandido = [];
        $metadataProductos = []; // ✅ NUEVO: Guardar metadata de productos NO combos

        foreach ($productos as $item) {
            $productoId = $item['producto_id'] ?? $item['id'];
            $cantidad   = (float) $item['cantidad'];

            if (isset($combos[$productoId])) {
                // ✅ ACTUALIZADO (2026-02-20): Procesar items seleccionados desde Flutter
                $comboItemsSeleccionados = $item['combo_items_seleccionados'] ?? null;

                if ($comboItemsSeleccionados && is_array($comboItemsSeleccionados) && count($comboItemsSeleccionados) > 0) {
                    // ✅ CORREGIDO: Usar items seleccionados directamente (vienen de la app ya validados)
                    // Crear mapa para búsqueda rápida: producto_id => cantidad_seleccionada
                    $cantidadesSeleccionadas = [];
                    foreach ($comboItemsSeleccionados as $seleccionado) {
                        $seleccionado['producto_id'] = $seleccionado['producto_id'] ?? null;
                        $seleccionado['cantidad'] = $seleccionado['cantidad'] ?? 1;

                        if ($seleccionado['producto_id']) {
                            // Usar la cantidad especificada en combo_items_seleccionados (puede ser diferente de la del combo)
                            $cantidadesSeleccionadas[$seleccionado['producto_id']] = (float) $seleccionado['cantidad'];
                        }
                    }

                    foreach ($combos[$productoId]->comboItems as $comboItem) {
                        $id = $comboItem->producto_id;

                        // ✅ CORREGIDO: SOLO descontar si está en los items seleccionados
                        if (isset($cantidadesSeleccionadas[$id])) {
                            // Usar cantidad del combo_items_seleccionados (cantidad modificada por el usuario)
                            $cantidadItem = $cantidadesSeleccionadas[$id];
                            $expandido[$id] = ($expandido[$id] ?? 0) + ($cantidadItem * $cantidad);
                        }
                        // Si NO está en seleccionados, NO agregar nada (ignorar completamente)
                    }

                    \Log::info('✅ Combo expandido con items seleccionados', [
                        'combo_id' => $productoId,
                        'cantidad_combos' => $cantidad,
                        'items_seleccionados' => count($comboItemsSeleccionados),
                        'expandido' => $expandido,
                    ]);
                } else {
                    // Si NO hay items seleccionados, expandir TODOS los items del combo
                    // (compatibilidad con combos que no tengan items seleccionados explícitamente)
                    foreach ($combos[$productoId]->comboItems as $comboItem) {
                        $id = $comboItem->producto_id;
                        $expandido[$id] = ($expandido[$id] ?? 0) + ((float) $comboItem->cantidad * $cantidad);
                    }
                }
            } else {
                // ✅ NUEVO (2026-02-18): Si NO es combo, guardar TODA la metadata del item
                $expandido[$productoId] = ($expandido[$productoId] ?? 0) + $cantidad;

                // Guardar campos adicionales (unidad_venta_id, tipo_precio_id, etc) para productos no combos
                if (!isset($metadataProductos[$productoId])) {
                    $metadataProductos[$productoId] = $item;
                }
            }
        }

        // ✅ NUEVO (2026-02-18): Retornar preservando metadata de productos no combos
        return array_map(
            function($prodId, $cant) use ($metadataProductos, $item) {
                $resultado = ['producto_id' => $prodId, 'cantidad' => $cant];

                // Si tenemos metadata guardada para este producto (significa que NO era combo),
                // preservar todos los campos adicionales
                if (isset($metadataProductos[$prodId])) {
                    // Copiar todos los campos del item original EXCEPTO cantidad (que actualizamos)
                    foreach ($metadataProductos[$prodId] as $clave => $valor) {
                        if ($clave !== 'cantidad' && $clave !== 'producto_id') {
                            $resultado[$clave] = $valor;
                        }
                    }
                }

                return $resultado;
            },
            array_keys($expandido),
            array_values($expandido)
        );
    }
}
