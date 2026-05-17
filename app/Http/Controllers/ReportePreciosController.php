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

        // Obtener precio de costo base
        $tipoCosto = TipoPrecio::precioBase()->first();

        if (! $tipoCosto) {
            return Inertia::render('reportes/ganancias/index', [
                'error' => 'No se encontró un tipo de precio base (costo) configurado.',
                'ganancias' => collect([]),
                'estadisticas' => [],
                'filtros' => $filtros,
            ]);
        }

        // Query para obtener ganancias por producto
        $gananciasQuery = PrecioProducto::query()
            ->with(['producto.categoria', 'tipoPrecio'])
            ->where('activo', true)
            ->where('tipo_precio_id', '!=', $tipoCosto->id)
            ->whereHas('tipoPrecio', function ($q) {
                $q->where('es_ganancia', true);
            });

        // Aplicar filtros
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

        $ganancias = $gananciasQuery->get()->map(function ($precio) use ($tipoCosto) {
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
                'producto' => $precio->producto,
                'tipo_precio' => $precio->tipoPrecio,
                'precio_venta' => $precio->precio,
                'precio_costo' => $precioCosto?->precio ?? 0,
                'ganancia' => $ganancia,
                'porcentaje_ganancia' => $porcentajeGanancia,
                'fecha_actualizacion' => $precio->fecha_ultima_actualizacion,
            ];
        })->sortByDesc('ganancia')->values();

        // Estadísticas de ganancias
        $estadisticasGanancias = [
            'total_productos' => $ganancias->count(),
            'ganancia_total' => $ganancias->sum('ganancia'),
            'ganancia_promedio' => $ganancias->avg('ganancia') ?? 0,
            'porcentaje_promedio' => $ganancias->avg('porcentaje_ganancia') ?? 0,
            'mejor_ganancia' => $ganancias->max('ganancia') ?? 0,
            'peor_ganancia' => $ganancias->min('ganancia') ?? 0,
        ];

        return Inertia::render('reportes/ganancias/index', [
            'ganancias' => $ganancias->take(50), // Limitar para la vista
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
