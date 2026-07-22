<?php

namespace App\Http\Controllers;

use App\Models\PrecioProducto;
use App\Models\Producto;
use App\Models\TipoPrecio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportePreciosController extends Controller
{
    public function index(Request $request): Response
    {
        $filtros = $request->validate([
            'fecha_desde' => ['nullable', 'date'],
            'fecha_hasta' => ['nullable', 'date'],
            'tipo_precio_id' => ['nullable', 'exists:tipos_precio,id'],
            'categoria_id' => ['nullable', 'exists:categorias,id'],
            'producto_id' => ['nullable', 'exists:productos,id'],
        ]);

        $query = PrecioProducto::query()
            ->with(['producto.categoria', 'tipoPrecio'])
            ->where('activo', true);

        // Aplicar filtros
        if (! empty($filtros['fecha_desde'])) {
            $query->whereDate('fecha_ultima_actualizacion', '>=', $filtros['fecha_desde']);
        }

        if (! empty($filtros['fecha_hasta'])) {
            $query->whereDate('fecha_ultima_actualizacion', '<=', $filtros['fecha_hasta']);
        }

        if (! empty($filtros['tipo_precio_id'])) {
            $query->where('tipo_precio_id', $filtros['tipo_precio_id']);
        }

        if (! empty($filtros['categoria_id'])) {
            $query->whereHas('producto', function ($q) use ($filtros) {
                $q->where('categoria_id', $filtros['categoria_id']);
            });
        }

        if (! empty($filtros['producto_id'])) {
            $query->where('producto_id', $filtros['producto_id']);
        }

        $precios = $query->paginate(20)->withQueryString();

        // Estadísticas generales
        $estadisticas = $this->calcularEstadisticasPrecios($filtros);

        return Inertia::render('reportes/precios/index', [
            'precios' => $precios,
            'estadisticas' => $estadisticas,
            'filtros' => $filtros,
            'tipos_precio' => TipoPrecio::activos()->ordenados()->get(['id', 'nombre', 'color']),
            'categorias' => \App\Models\Categoria::orderBy('nombre')->get(['id', 'nombre']),
        ]);
    }

    public function ganancias(Request $request): Response
    {
        $filtros = $request->validate([
            'fecha_desde' => ['nullable', 'date'],
            'fecha_hasta' => ['nullable', 'date'],
            'tipo_precio_id' => ['nullable', 'exists:tipos_precio,id'],
            'categoria_id' => ['nullable', 'exists:categorias,id'],
        ]);

        // Obtener tipo de precio base (costo)
        $tipoCosto = TipoPrecio::precioBase()->first();

        if (! $tipoCosto) {
            return Inertia::render('reportes/ganancias/index', [
                'error' => 'No se encontró un tipo de precio base (costo) configurado.',
                'ganancias' => collect([]),
                'estadisticas' => [],
                'filtros' => $filtros,
            ]);
        }

        // Obtener detalles de ventas reales (ventas confirmadas)
        $query = \App\Models\DetalleVenta::query()
            ->join('ventas', 'detalle_ventas.venta_id', '=', 'ventas.id')
            ->join('productos', 'detalle_ventas.producto_id', '=', 'productos.id')
            ->join('categorias', 'productos.categoria_id', '=', 'categorias.id')
            ->where('productos.activo', true)
            ->where('ventas.estado_documento_id', '!=', 2); // Excluir ventas canceladas

        // Aplicar filtros
        if (! empty($filtros['fecha_desde'])) {
            $query->whereDate('ventas.fecha', '>=', $filtros['fecha_desde']);
        }

        if (! empty($filtros['fecha_hasta'])) {
            $query->whereDate('ventas.fecha', '<=', $filtros['fecha_hasta']);
        }

        if (! empty($filtros['tipo_precio_id'])) {
            $query->where('detalle_ventas.tipo_precio_id', $filtros['tipo_precio_id']);
        }

        if (! empty($filtros['categoria_id'])) {
            $query->where('productos.categoria_id', $filtros['categoria_id']);
        }

        $detalles = $query->select(
            'detalle_ventas.id',
            'detalle_ventas.producto_id',
            'detalle_ventas.cantidad',
            'detalle_ventas.precio_unitario',
            'detalle_ventas.tipo_precio_id',
            'detalle_ventas.created_at',
            'productos.nombre as producto_nombre',
            'productos.sku',
            'productos.categoria_id',
            'categorias.nombre as categoria_nombre',
            'ventas.fecha as fecha_venta'
        )->get();

        // Calcular ganancias agrupadas por producto
        $gananciasMap = [];

        foreach ($detalles as $detalle) {
            // Obtener precio de costo del producto
            $precioCosto = PrecioProducto::where('producto_id', $detalle->producto_id)
                ->where('tipo_precio_id', $tipoCosto->id)
                ->where('activo', true)
                ->first();

            $precioUnitarioCosto = $precioCosto?->precio ?? 0;
            $gananciaUnitaria = $detalle->precio_unitario - $precioUnitarioCosto;
            $gananciaTotal = $gananciaUnitaria * $detalle->cantidad;
            $porcentajeGanancia = $precioUnitarioCosto > 0 ? ($gananciaUnitaria / $precioUnitarioCosto) * 100 : 0;

            $key = "{$detalle->producto_id}_{$detalle->tipo_precio_id}";

            if (! isset($gananciasMap[$key])) {
                $gananciasMap[$key] = [
                    'producto_id' => $detalle->producto_id,
                    'producto_nombre' => $detalle->producto_nombre,
                    'producto_sku' => $detalle->sku,
                    'categoria' => [
                        'id' => $detalle->categoria_id,
                        'nombre' => $detalle->categoria_nombre,
                    ],
                    'tipo_precio_id' => $detalle->tipo_precio_id,
                    'cantidad_vendida' => 0,
                    'precio_venta_unitario' => $detalle->precio_unitario,
                    'precio_costo_unitario' => $precioUnitarioCosto,
                    'ganancia_unitaria' => $gananciaUnitaria,
                    'ganancia_total' => 0,
                    'porcentaje_ganancia' => $porcentajeGanancia,
                    'ingresos_totales' => 0,
                    'costos_totales' => 0,
                    'primera_venta' => $detalle->fecha_venta,
                    'ultima_venta' => $detalle->fecha_venta,
                ];
            }

            $gananciasMap[$key]['cantidad_vendida'] += $detalle->cantidad;
            $gananciasMap[$key]['ganancia_total'] += $gananciaTotal;
            $gananciasMap[$key]['ingresos_totales'] += $detalle->precio_unitario * $detalle->cantidad;
            $gananciasMap[$key]['costos_totales'] += $precioUnitarioCosto * $detalle->cantidad;
            $gananciasMap[$key]['ultima_venta'] = $detalle->fecha_venta;
        }

        // Convertir a colección y ordenar por ganancia
        $ganancias = collect($gananciasMap)
            ->sortByDesc('ganancia_total')
            ->values();

        // Cargar relaciones de tipo_precio y producto para mejor presentación
        $ganancias = $ganancias->map(function ($ganancia) {
            $tipoPrecio = TipoPrecio::find($ganancia['tipo_precio_id']);
            $producto = Producto::find($ganancia['producto_id']);

            $ganancia['tipo_precio'] = $tipoPrecio ? [
                'id' => $tipoPrecio->id,
                'nombre' => $tipoPrecio->nombre,
                'color' => $tipoPrecio->color ?? 'secondary',
                'configuracion' => [
                    'icono' => '💰',
                ]
            ] : [
                'id' => $ganancia['tipo_precio_id'],
                'nombre' => 'Tipo desconocido',
                'color' => 'secondary',
                'configuracion' => ['icono' => '❓']
            ];

            $ganancia['producto'] = $producto ? [
                'id' => $producto->id,
                'nombre' => $producto->nombre,
                'sku' => $producto->sku,
                'categoria' => [
                    'id' => $ganancia['categoria']['id'],
                    'nombre' => $ganancia['categoria']['nombre'],
                ]
            ] : [
                'id' => $ganancia['producto_id'],
                'nombre' => 'Producto desconocido',
                'sku' => '',
                'categoria' => $ganancia['categoria']
            ];

            return $ganancia;
        })->filter(function ($ganancia) {
            // Filtrar solo ganancias con datos válidos
            return $ganancia['producto'] && $ganancia['tipo_precio'] && $ganancia['ganancia_total'] != 0;
        })->values();

        // Estadísticas de ganancias
        $estadisticasGanancias = [
            'total_productos_vendidos' => $ganancias->count(),
            'cantidad_total_vendida' => $ganancias->sum('cantidad_vendida'),
            'ingresos_totales' => $ganancias->sum('ingresos_totales'),
            'costos_totales' => $ganancias->sum('costos_totales'),
            'ganancia_total' => $ganancias->sum('ganancia_total'),
            'ganancia_promedio' => $ganancias->avg('ganancia_total') ?? 0,
            'porcentaje_promedio' => $ganancias->avg('porcentaje_ganancia') ?? 0,
            'mejor_ganancia' => $ganancias->max('ganancia_total') ?? 0,
            'peor_ganancia' => $ganancias->min('ganancia_total') ?? 0,
        ];

        return Inertia::render('reportes/ganancias/index', [
            'ganancias' => $ganancias->take(50),
            'estadisticas' => $estadisticasGanancias,
            'filtros' => $filtros,
            'tipos_precio' => TipoPrecio::ganancias()->activos()->ordenados()->get(['id', 'nombre', 'color']),
            'categorias' => \App\Models\Categoria::orderBy('nombre')->get(['id', 'nombre']),
        ]);
    }

    public function export(Request $request): JsonResponse
    {
        $filtros = $request->validate([
            'fecha_desde' => ['nullable', 'date'],
            'fecha_hasta' => ['nullable', 'date'],
            'tipo_precio_id' => ['nullable', 'exists:tipos_precio,id'],
            'categoria_id' => ['nullable', 'exists:categorias,id'],
        ]);

        $precios = PrecioProducto::query()
            ->with(['producto.categoria', 'tipoPrecio'])
            ->where('activo', true);

        // Aplicar mismos filtros que en index
        if (! empty($filtros['fecha_desde'])) {
            $precios->whereDate('fecha_ultima_actualizacion', '>=', $filtros['fecha_desde']);
        }

        if (! empty($filtros['fecha_hasta'])) {
            $precios->whereDate('fecha_ultima_actualizacion', '<=', $filtros['fecha_hasta']);
        }

        if (! empty($filtros['tipo_precio_id'])) {
            $precios->where('tipo_precio_id', $filtros['tipo_precio_id']);
        }

        if (! empty($filtros['categoria_id'])) {
            $precios->whereHas('producto', function ($q) use ($filtros) {
                $q->where('categoria_id', $filtros['categoria_id']);
            });
        }

        $datosExport = $precios->get()->map(function ($precio) {
            return [
                'Producto' => $precio->producto->nombre,
                'Categoría' => $precio->producto->categoria?->nombre ?? 'Sin categoría',
                'Tipo de Precio' => $precio->tipoPrecio->nombre,
                'Precio' => number_format($precio->precio, 2),
                'Última Actualización' => $precio->fecha_ultima_actualizacion?->format('d/m/Y H:i'),
                'Activo' => $precio->activo ? 'Sí' : 'No',
            ];
        });

        return response()->json([
            'data' => $datosExport,
            'filename' => 'reporte_precios_'.now()->format('Y-m-d_H-i-s').'.xlsx',
        ]);
    }

    public function exportGanancias(Request $request): JsonResponse
    {
        $filtros = $request->validate([
            'fecha_desde' => ['nullable', 'date'],
            'fecha_hasta' => ['nullable', 'date'],
            'tipo_precio_id' => ['nullable', 'exists:tipos_precio,id'],
            'categoria_id' => ['nullable', 'exists:categorias,id'],
        ]);

        // Mismo cálculo que en ganancias() pero para export
        $tipoCosto = TipoPrecio::precioBase()->first();

        if (! $tipoCosto) {
            return response()->json(['error' => 'No se encontró tipo de precio base'], 400);
        }

        $gananciasQuery = PrecioProducto::query()
            ->with(['producto.categoria', 'tipoPrecio'])
            ->where('activo', true)
            ->where('tipo_precio_id', '!=', $tipoCosto->id)
            ->whereHas('tipoPrecio', function ($q) {
                $q->where('es_ganancia', true);
            });

        // Aplicar filtros...
        if (! empty($filtros['fecha_desde'])) {
            $gananciasQuery->whereDate('fecha_ultima_actualizacion', '>=', $filtros['fecha_desde']);
        }

        if (! empty($filtros['fecha_hasta'])) {
            $gananciasQuery->whereDate('fecha_ultima_actualizacion', '<=', $filtros['fecha_hasta']);
        }

        if (! empty($filtros['tipo_precio_id'])) {
            $gananciasQuery->where('tipo_precio_id', $filtros['tipo_precio_id']);
        }

        if (! empty($filtros['categoria_id'])) {
            $gananciasQuery->whereHas('producto', function ($q) use ($filtros) {
                $q->where('categoria_id', $filtros['categoria_id']);
            });
        }

        $datosExport = $gananciasQuery->get()->map(function ($precio) use ($tipoCosto) {
            $precioCosto = PrecioProducto::where('producto_id', $precio->producto_id)
                ->where('tipo_precio_id', $tipoCosto->id)
                ->where('activo', true)
                ->first();

            $ganancia = 0;
            $porcentajeGanancia = 0;

            if ($precioCosto && $precioCosto->precio > 0) {
                $ganancia = $precio->precio - $precioCosto->precio;
                $porcentajeGanancia = ($ganancia / $precioCosto->precio) * 100;
            }

            return [
                'Producto' => $precio->producto->nombre,
                'Categoría' => $precio->producto->categoria?->nombre ?? 'Sin categoría',
                'Tipo de Precio' => $precio->tipoPrecio->nombre,
                'Precio Costo' => number_format($precioCosto?->precio ?? 0, 2),
                'Precio Venta' => number_format($precio->precio, 2),
                'Ganancia' => number_format($ganancia, 2),
                'Porcentaje Ganancia' => number_format($porcentajeGanancia, 2).'%',
                'Última Actualización' => $precio->fecha_ultima_actualizacion?->format('d/m/Y H:i'),
            ];
        });

        return response()->json([
            'data' => $datosExport,
            'filename' => 'reporte_ganancias_'.now()->format('Y-m-d_H-i-s').'.xlsx',
        ]);
    }

    private function calcularEstadisticasPrecios(array $filtros): array
    {
        $query = PrecioProducto::query()->where('activo', true);

        // Aplicar mismos filtros
        if (! empty($filtros['fecha_desde'])) {
            $query->whereDate('fecha_ultima_actualizacion', '>=', $filtros['fecha_desde']);
        }

        if (! empty($filtros['fecha_hasta'])) {
            $query->whereDate('fecha_ultima_actualizacion', '<=', $filtros['fecha_hasta']);
        }

        if (! empty($filtros['tipo_precio_id'])) {
            $query->where('tipo_precio_id', $filtros['tipo_precio_id']);
        }

        if (! empty($filtros['categoria_id'])) {
            $query->whereHas('producto', function ($q) use ($filtros) {
                $q->where('categoria_id', $filtros['categoria_id']);
            });
        }

        $precios = $query->get();

        return [
            'total_precios' => $precios->count(),
            'precio_promedio' => $precios->avg('precio') ?? 0,
            'precio_minimo' => $precios->min('precio') ?? 0,
            'precio_maximo' => $precios->max('precio') ?? 0,
            'total_productos_con_precio' => $precios->unique('producto_id')->count(),
            'por_tipo_precio' => $precios->groupBy('tipo_precio_id')->map->count(),
        ];
    }
}
