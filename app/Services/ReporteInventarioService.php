<?php

namespace App\Services;

use App\Models\Almacen;
use App\Models\Categoria;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\StockProducto;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReporteInventarioService
{
    /**
     * Obtener datos del reporte de Stock Actual
     */
    public function obtenerStockActual(array $filtros): Collection
    {
        $query = StockProducto::with([
            'producto:id,nombre,stock_minimo',
            'producto.codigosBarra:id,producto_id,codigo',
            'producto.precios' => function ($q) {
                $q->where('activo', true)->whereIn('tipo_precio_id', function ($subQuery) {
                    $subQuery->select('id')->from('tipos_precio')->whereIn('codigo', ['costo', 'venta']);
                });
            },
            'almacen:id,nombre'
        ])->where('cantidad', '>', 0);

        // Aplicar filtros
        if (!empty($filtros['almacen_id'])) {
            $query->where('almacen_id', $filtros['almacen_id']);
        }

        if (!empty($filtros['categoria_id'])) {
            $query->whereHas('producto', function ($q) use ($filtros) {
                $q->where('categoria_id', $filtros['categoria_id']);
            });
        }

        if ($filtros['solo_con_stock'] ?? false) {
            $query->where('cantidad', '>', 0);
        }

        $stocks = $query->orderBy('almacen_id')
            ->orderBy('producto_id')
            ->get();

        return $stocks->map(function ($stock) {
            $codigo = $stock->producto->codigosBarra->first()?->codigo ?? '';

            // Obtener precios por tipo
            $precioCosto = 0;
            $precioVenta = 0;

            foreach ($stock->producto->precios as $precio) {
                if ($precio->tipoPrecio?->codigo === 'costo') {
                    $precioCosto = $precio->precio ?? 0;
                } elseif ($precio->tipoPrecio?->codigo === 'venta') {
                    $precioVenta = $precio->precio ?? 0;
                }
            }

            return [
                'almacen' => $stock->almacen->nombre ?? 'N/A',
                'codigo_producto' => $codigo,
                'nombre_producto' => $stock->producto->nombre,
                'cantidad' => $stock->cantidad,
                'cantidad_disponible' => $stock->cantidad_disponible ?? 0,
                'cantidad_reservada' => $stock->cantidad_reservada ?? 0,
                'precio_compra' => $precioCosto,
                'precio_venta' => $precioVenta,
                'valor_compra' => $stock->cantidad * $precioCosto,
                'valor_venta' => $stock->cantidad * $precioVenta,
                'stock_minimo' => $stock->producto->stock_minimo ?? 0,
                'fecha_actualizacion' => now()->format('d/m/Y'),
            ];
        });
    }

    /**
     * Obtener datos del reporte de Movimientos de Inventario
     */
    public function obtenerMovimientos(array $filtros): Collection
    {
        $fechaDesde = $filtros['fecha_desde'] ?? now()->subMonth();
        $fechaHasta = $filtros['fecha_hasta'] ?? now();

        $query = MovimientoInventario::with([
            'stockProducto.producto:id,nombre',
            'stockProducto.producto.codigosBarra:id,producto_id,codigo',
            'stockProducto.almacen:id,nombre',
            'user:id,name'
        ])->whereBetween('fecha', [$fechaDesde, $fechaHasta]);

        if (!empty($filtros['almacen_id'])) {
            $query->whereHas('stockProducto', function ($q) use ($filtros) {
                $q->where('almacen_id', $filtros['almacen_id']);
            });
        }

        if (!empty($filtros['categoria_id'])) {
            $query->whereHas('stockProducto.producto', function ($q) use ($filtros) {
                $q->where('categoria_id', $filtros['categoria_id']);
            });
        }

        $movimientos = $query->orderByDesc('fecha')
            ->orderByDesc('id')
            ->get();

        return $movimientos->map(function ($mov) {
            $codigo = $mov->stockProducto->producto->codigosBarra->first()?->codigo ?? '';
            return [
                'fecha' => $mov->fecha->format('d/m/Y H:i'),
                'almacen' => $mov->stockProducto->almacen->nombre ?? 'N/A',
                'codigo_producto' => $codigo,
                'nombre_producto' => $mov->stockProducto->producto->nombre,
                'tipo_movimiento' => $mov->tipo,
                'cantidad' => $mov->cantidad,
                'motivo' => $mov->motivo ?? 'N/A',
                'usuario' => $mov->user->name ?? 'Sistema',
                'referencia' => $mov->referencia ?? '',
            ];
        });
    }

    /**
     * Helper para obtener precio de un producto por tipo
     */
    private function obtenerPrecioProducto($producto, string $tipo): float
    {
        if (!$producto || !$producto->precios) {
            return 0;
        }

        foreach ($producto->precios as $precio) {
            if ($precio->tipoPrecio?->codigo === $tipo && ($precio->activo ?? true)) {
                return $precio->precio ?? 0;
            }
        }

        return 0;
    }

    /**
     * Obtener datos del reporte de Stock Valorizado
     */
    public function obtenerStockValorizado(array $filtros): Collection
    {
        $stocks = $this->obtenerStockActual($filtros);

        return $stocks->groupBy('almacen')->map(function ($itemsPorAlmacen, $almacen) {
            $valorCompra = $itemsPorAlmacen->sum('valor_compra');
            $valorVenta = $itemsPorAlmacen->sum('valor_venta');

            return [
                'almacen' => $almacen,
                'total_productos' => $itemsPorAlmacen->count(),
                'cantidad_total' => $itemsPorAlmacen->sum('cantidad'),
                'valor_compra_total' => $valorCompra,
                'valor_venta_total' => $valorVenta,
                'margen_bruto' => $valorVenta - $valorCompra,
                'margen_porcentaje' => $valorCompra > 0 ? (($valorVenta - $valorCompra) / $valorCompra * 100) : 0,
                'productos' => $itemsPorAlmacen->values(),
            ];
        })->values();
    }

    /**
     * Obtener datos del reporte de Productos Bajo Mínimo
     */
    public function obtenerProductosBajoMinimo(array $filtros): Collection
    {
        // Get all products with their stock by warehouse
        $query = Producto::with([
            'codigosBarra:id,producto_id,codigo',
            'categoria:id,nombre',
            'precios' => function ($q) {
                $q->where('activo', true)->whereIn('tipo_precio_id', function ($subQuery) {
                    $subQuery->select('id')->from('tipos_precio')->whereIn('codigo', ['costo', 'venta']);
                });
            },
            'stock' => function ($q) {
                if (!empty($filtros['almacen_id'])) {
                    $q->where('almacen_id', $filtros['almacen_id']);
                }
                $q->with('almacen:id,nombre');
            }
        ]);

        if (!empty($filtros['categoria_id'])) {
            $query->where('categoria_id', $filtros['categoria_id']);
        }

        $productos = $query->orderBy('nombre')->get();

        $resultado = [];
        foreach ($productos as $producto) {
            // Check if total stock is below minimum
            $totalStock = $producto->stock->sum('cantidad');

            if ($totalStock < ($producto->stock_minimo ?? 0) || $totalStock == 0) {
                $codigo = $producto->codigosBarra->first()?->codigo ?? '';
                $precioCosto = $this->obtenerPrecioProducto($producto, 'costo');
                $precioVenta = $this->obtenerPrecioProducto($producto, 'venta');

                foreach ($producto->stock as $stock) {
                    $resultado[] = [
                        'codigo' => $codigo,
                        'nombre_producto' => $producto->nombre,
                        'almacen' => $stock->almacen->nombre ?? 'N/A',
                        'stock_actual' => $stock->cantidad,
                        'stock_minimo' => $producto->stock_minimo ?? 0,
                        'falta' => max(0, ($producto->stock_minimo ?? 0) - $stock->cantidad),
                        'precio_compra' => $precioCosto,
                        'precio_venta' => $precioVenta,
                        'categoria' => $producto->categoria->nombre ?? 'N/A',
                    ];
                }
            }
        }

        return collect($resultado);
    }

    /**
     * Obtener datos del reporte de Productos Sin Movimiento
     */
    public function obtenerProductosSinMovimiento(array $filtros): Collection
    {
        $diasSinMovimiento = 90; // Por defecto 90 días
        $fechaLimite = now()->subDays($diasSinMovimiento);

        // Productos que NO tienen movimientos después de la fecha límite
        $productosConMovimiento = MovimientoInventario::where('fecha', '>=', $fechaLimite)
            ->distinct('stock_producto_id')
            ->pluck('stock_producto_id');

        $query = StockProducto::with([
            'producto:id,nombre,categoria_id',
            'producto.codigosBarra:id,producto_id,codigo',
            'producto.precios' => function ($q) {
                $q->where('activo', true)->whereIn('tipo_precio_id', function ($subQuery) {
                    $subQuery->select('id')->from('tipos_precio')->whereIn('codigo', ['costo', 'venta']);
                });
            },
            'almacen:id,nombre',
            'producto.categoria:id,nombre'
        ])->whereNotIn('id', $productosConMovimiento)
            ->where('cantidad', '>', 0);

        if (!empty($filtros['almacen_id'])) {
            $query->where('almacen_id', $filtros['almacen_id']);
        }

        if (!empty($filtros['categoria_id'])) {
            $query->whereHas('producto', function ($q) use ($filtros) {
                $q->where('categoria_id', $filtros['categoria_id']);
            });
        }

        $stocks = $query->orderBy('almacen_id')
            ->orderBy('producto_id')
            ->get();

        return $stocks->map(function ($stock) use ($diasSinMovimiento) {
            $codigo = $stock->producto->codigosBarra->first()?->codigo ?? '';
            $precioCosto = $this->obtenerPrecioProducto($stock->producto, 'costo');
            return [
                'codigo' => $codigo,
                'nombre_producto' => $stock->producto->nombre,
                'almacen' => $stock->almacen->nombre ?? 'N/A',
                'categoria' => $stock->producto->categoria->nombre ?? 'N/A',
                'cantidad_stock' => $stock->cantidad,
                'precio_compra' => $precioCosto,
                'precio_venta' => $this->obtenerPrecioProducto($stock->producto, 'venta'),
                'valor_inmobilizado' => $stock->cantidad * $precioCosto,
                'dias_sin_movimiento' => $diasSinMovimiento,
                'fecha_ultimo_movimiento' => now()->format('d/m/Y'),
            ];
        });
    }

    /**
     * Obtener datos del reporte de Vencimientos
     */
    public function obtenerVencimientos(array $filtros): Collection
    {
        $dias = 30; // Próximos 30 días por defecto
        $ahora = now();
        $fechaLimite = $ahora->copy()->addDays($dias);

        $query = StockProducto::with([
            'producto:id,nombre,categoria_id',
            'producto.codigosBarra:id,producto_id,codigo',
            'producto.precios' => function ($q) {
                $q->where('activo', true)->where(function ($subQuery) {
                    $subQuery->whereIn('tipo_precio_id', function ($typeQuery) {
                        $typeQuery->select('id')->from('tipos_precio')->where('codigo', 'costo');
                    });
                });
            },
            'almacen:id,nombre',
            'producto.categoria:id,nombre'
        ])->whereNotNull('fecha_vencimiento')
            ->where('cantidad', '>', 0)
            ->whereBetween('fecha_vencimiento', [$ahora, $fechaLimite]);

        if (!empty($filtros['almacen_id'])) {
            $query->where('almacen_id', $filtros['almacen_id']);
        }

        if (!empty($filtros['categoria_id'])) {
            $query->whereHas('producto', function ($q) use ($filtros) {
                $q->where('categoria_id', $filtros['categoria_id']);
            });
        }

        $stocks = $query->orderBy('fecha_vencimiento')->get();

        return $stocks->map(function ($stock) use ($ahora) {
            $codigo = $stock->producto->codigosBarra->first()?->codigo ?? '';
            $precioCosto = $this->obtenerPrecioProducto($stock->producto, 'costo');
            $diasParaVencer = $stock->fecha_vencimiento->diffInDays($ahora);
            $estado = $stock->fecha_vencimiento < $ahora ? 'VENCIDO' : 'PRÓXIMO A VENCER';

            return [
                'codigo' => $codigo,
                'nombre_producto' => $stock->producto->nombre,
                'almacen' => $stock->almacen->nombre ?? 'N/A',
                'categoria' => $stock->producto->categoria->nombre ?? 'N/A',
                'cantidad' => $stock->cantidad,
                'fecha_vencimiento' => $stock->fecha_vencimiento->format('d/m/Y'),
                'dias_para_vencer' => abs($diasParaVencer),
                'estado' => $estado,
                'precio_compra' => $precioCosto,
                'valor_total' => $stock->cantidad * $precioCosto,
            ];
        });
    }

    /**
     * Obtener datos del Kardex de un producto específico
     */
    public function obtenerKardex(array $filtros): Collection
    {
        if (empty($filtros['producto_id'])) {
            return collect();
        }

        $fechaDesde = $filtros['fecha_desde'] ?? now()->subYear();
        $fechaHasta = $filtros['fecha_hasta'] ?? now();

        $movimientos = MovimientoInventario::with([
            'stockProducto.almacen:id,nombre',
            'user:id,name'
        ])->whereHas('stockProducto', function ($q) use ($filtros) {
            $q->where('producto_id', $filtros['producto_id']);
        })
            ->whereBetween('fecha', [$fechaDesde, $fechaHasta])
            ->orderBy('fecha')
            ->orderBy('id')
            ->get();

        return $movimientos->map(function ($mov) {
            return [
                'fecha' => $mov->fecha->format('d/m/Y H:i'),
                'almacen' => $mov->stockProducto->almacen->nombre ?? 'N/A',
                'tipo_movimiento' => $mov->tipo,
                'cantidad' => $mov->cantidad,
                'motivo' => $mov->motivo ?? 'N/A',
                'usuario' => $mov->user->name ?? 'Sistema',
                'referencia' => $mov->referencia ?? '',
                'observaciones' => $mov->observaciones ?? '',
            ];
        });
    }

    /**
     * Obtener datos del reporte de Rotación de Inventario
     */
    public function obtenerRotacion(array $filtros): Collection
    {
        $fechaDesde = $filtros['fecha_desde'] ?? now()->subMonth();
        $fechaHasta = $filtros['fecha_hasta'] ?? now();

        // Obtener productos con movimientos en el período
        $productosConMovimiento = DB::table('movimientos_inventario')
            ->select([
                'productos.id',
                'productos.nombre',
                'codigos_barra.codigo',
                'categorias.nombre as categoria',
                DB::raw('COUNT(DISTINCT movimientos_inventario.id) as total_movimientos'),
                DB::raw('SUM(ABS(movimientos_inventario.cantidad)) as cantidad_total'),
                DB::raw('AVG(ABS(movimientos_inventario.cantidad)) as promedio_movimiento'),
                DB::raw('MAX(movimientos_inventario.fecha) as ultima_fecha_movimiento'),
            ])
            ->join('stock_productos', 'movimientos_inventario.stock_producto_id', '=', 'stock_productos.id')
            ->join('productos', 'stock_productos.producto_id', '=', 'productos.id')
            ->leftJoin('codigos_barra', 'productos.id', '=', 'codigos_barra.producto_id')
            ->leftJoin('categorias', 'productos.categoria_id', '=', 'categorias.id')
            ->whereBetween('movimientos_inventario.fecha', [$fechaDesde, $fechaHasta]);

        if (!empty($filtros['almacen_id'])) {
            $productosConMovimiento->where('stock_productos.almacen_id', $filtros['almacen_id']);
        }

        if (!empty($filtros['categoria_id'])) {
            $productosConMovimiento->where('productos.categoria_id', $filtros['categoria_id']);
        }

        $resultados = $productosConMovimiento
            ->groupBy('productos.id', 'productos.nombre', 'codigos_barra.codigo', 'categorias.nombre')
            ->orderByDesc('total_movimientos')
            ->limit(100)
            ->get();

        return $resultados->map(function ($item) {
            return [
                'codigo' => $item->codigo ?? '',
                'nombre_producto' => $item->nombre,
                'categoria' => $item->categoria ?? 'N/A',
                'total_movimientos' => $item->total_movimientos,
                'cantidad_total_movida' => $item->cantidad_total,
                'promedio_por_movimiento' => round($item->promedio_movimiento, 2),
                'ultima_fecha_movimiento' => $item->ultima_fecha_movimiento,
                'rotacion_clasificacion' => $this->clasificarRotacion($item->total_movimientos),
            ];
        });
    }

    /**
     * Clasificar el nivel de rotación según la cantidad de movimientos
     */
    private function clasificarRotacion(int $totalMovimientos): string
    {
        if ($totalMovimientos >= 20) {
            return 'A - Alta Rotación';
        } elseif ($totalMovimientos >= 10) {
            return 'B - Rotación Media';
        } elseif ($totalMovimientos >= 5) {
            return 'C - Rotación Baja';
        } else {
            return 'D - Mínima Rotación';
        }
    }
}
