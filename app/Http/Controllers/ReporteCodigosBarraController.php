<?php

namespace App\Http\Controllers;

use App\Models\CodigoBarra;
use App\Models\HistorialCodigoBarra;
use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReporteCodigosBarraController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:reportes.view');
    }

    /**
     * Reporte: Productos sin código de barra
     */
    public function productosSinCodigo(Request $request): Response
    {
        $query = Producto::whereDoesntHave('codigosBarra', fn ($q) =>
            $q->where('activo', true)
        )
            ->where('activo', true)
            ->orderBy('nombre');

        // Filtros
        if ($request->filled('categoria_id')) {
            $query->where('categoria_id', $request->input('categoria_id'));
        }

        if ($request->filled('marca_id')) {
            $query->where('marca_id', $request->input('marca_id'));
        }

        if ($request->filled('q')) {
            $q = $request->input('q');
            $query->where(function ($query) use ($q) {
                $query->where('nombre', 'like', "%{$q}%")
                    ->orWhere('sku', 'like', "%{$q}%")
                    ->orWhere('descripcion', 'like', "%{$q}%");
            });
        }

        // Paginación
        $productos = $query->paginate(50);

        // Estadísticas
        $stats = [
            'total_productos' => Producto::where('activo', true)->count(),
            'sin_codigo' => Producto::whereDoesntHave('codigosBarra', fn ($q) =>
                $q->where('activo', true)
            )->where('activo', true)->count(),
            'con_codigo' => Producto::whereHas('codigosBarra', fn ($q) =>
                $q->where('activo', true)
            )->where('activo', true)->count(),
        ];

        return Inertia::render('reportes/codigos-barra/productos-sin-codigo', [
            'productos' => $productos,
            'stats' => $stats,
            'filters' => $request->only('categoria_id', 'marca_id', 'q'),
            'categorias' => \App\Models\Categoria::where('activo', true)
                ->pluck('nombre', 'id')
                ->toArray(),
            'marcas' => \App\Models\Marca::where('activo', true)
                ->pluck('nombre', 'id')
                ->toArray(),
        ]);
    }

    /**
     * Reporte: Códigos duplicados o inactivos
     */
    public function codigosDuplicadosInactivos(Request $request): Response
    {
        $tipo = $request->input('tipo', 'duplicados'); // duplicados | inactivos | todos

        // Códigos duplicados (activos)
        $duplicadosQuery = CodigoBarra::select('codigo')
            ->where('activo', true)
            ->groupBy('codigo')
            ->havingRaw('COUNT(*) > 1');

        // Códigos inactivos
        $inactivosQuery = CodigoBarra::where('activo', false);

        if ($tipo === 'duplicados') {
            $codigos = CodigoBarra::whereIn('codigo', $duplicadosQuery)
                ->where('activo', true)
                ->with('producto')
                ->orderBy('codigo')
                ->paginate(50);

            $titulo = 'Códigos Duplicados (Activos)';
        } elseif ($tipo === 'inactivos') {
            $codigos = $inactivosQuery
                ->with('producto')
                ->orderByDesc('updated_at')
                ->paginate(50);

            $titulo = 'Códigos Inactivos';
        } else {
            // Todos
            $activos = CodigoBarra::whereIn('codigo', $duplicadosQuery)
                ->where('activo', true)
                ->count();

            $inactivos = $inactivosQuery->count();

            $codigos = CodigoBarra::with('producto')
                ->when($request->filled('producto_id'), function ($q) use ($request) {
                    $q->where('producto_id', $request->input('producto_id'));
                })
                ->orderByDesc('updated_at')
                ->paginate(50);

            $titulo = 'Análisis de Códigos';
        }

        // Estadísticas
        $totalDuplicados = CodigoBarra::select('codigo')
            ->where('activo', true)
            ->groupBy('codigo')
            ->havingRaw('COUNT(*) > 1')
            ->count();

        $totalInactivos = CodigoBarra::where('activo', false)->count();

        $stats = [
            'total_codigos' => CodigoBarra::count(),
            'total_activos' => CodigoBarra::where('activo', true)->count(),
            'total_inactivos' => $totalInactivos,
            'total_duplicados' => $totalDuplicados,
            'porcentaje_duplicados' => CodigoBarra::where('activo', true)->count() > 0
                ? round(($totalDuplicados / CodigoBarra::where('activo', true)->count()) * 100, 2)
                : 0,
        ];

        return Inertia::render('reportes/codigos-barra/duplicados-inactivos', [
            'codigos' => $codigos,
            'stats' => $stats,
            'titulo' => $titulo,
            'tipo' => $tipo,
            'tiposDisponibles' => ['duplicados' => 'Duplicados', 'inactivos' => 'Inactivos', 'todos' => 'Todos'],
        ]);
    }

    /**
     * Reporte: Historial de cambios por fecha y usuario
     */
    public function historialCambios(Request $request): Response
    {
        $query = HistorialCodigoBarra::with(['usuario', 'producto', 'codigoBarra']);

        // Filtros
        if ($request->filled('fecha_desde')) {
            $query->whereDate('fecha_evento', '>=', $request->input('fecha_desde'));
        }

        if ($request->filled('fecha_hasta')) {
            $query->whereDate('fecha_evento', '<=', $request->input('fecha_hasta'));
        }

        if ($request->filled('usuario_id')) {
            $query->where('usuario_id', $request->input('usuario_id'));
        }

        if ($request->filled('tipo_evento')) {
            $query->where('tipo_evento', $request->input('tipo_evento'));
        }

        if ($request->filled('producto_id')) {
            $query->where('producto_id', $request->input('producto_id'));
        }

        if ($request->filled('q')) {
            $q = $request->input('q');
            $query->where(function ($query) use ($q) {
                $query->where('codigo_nuevo', 'like', "%{$q}%")
                    ->orWhere('codigo_anterior', 'like', "%{$q}%")
                    ->orWhere('razon', 'like', "%{$q}%");
            });
        }

        // Ordenamiento
        $query->orderByDesc('fecha_evento');

        $historial = $query->paginate(50);

        // Estadísticas
        $stats = [
            'total_eventos' => HistorialCodigoBarra::count(),
            'eventos_semana' => HistorialCodigoBarra::where('fecha_evento', '>=', now()->subDays(7))->count(),
            'eventos_mes' => HistorialCodigoBarra::where('fecha_evento', '>=', now()->subDays(30))->count(),
            'usuarios_activos' => HistorialCodigoBarra::distinct('usuario_id')->whereNotNull('usuario_id')->count(),
        ];

        // Tipo de eventos disponibles
        $tiposEventos = [
            'CREADO' => 'Código creado',
            'ACTUALIZADO' => 'Código actualizado',
            'MARCADO_PRINCIPAL' => 'Marcado como principal',
            'DESMARCADO_PRINCIPAL' => 'Desmarcado como principal',
            'INACTIVADO' => 'Código inactivado',
            'REACTIVADO' => 'Código reactivado',
        ];

        // Usuarios que han realizado cambios
        $usuarios = \App\Models\User::whereHas('historialCodigosBarra')
            ->pluck('name', 'id')
            ->toArray();

        return Inertia::render('reportes/codigos-barra/historial-cambios', [
            'historial' => $historial,
            'stats' => $stats,
            'tiposEventos' => $tiposEventos,
            'usuarios' => $usuarios,
            'filters' => $request->only('fecha_desde', 'fecha_hasta', 'usuario_id', 'tipo_evento', 'producto_id', 'q'),
        ]);
    }

    /**
     * API: Descargar reporte como CSV
     */
    public function descargarProductosSinCodigo()
    {
        $productos = Producto::whereDoesntHave('codigosBarra', fn ($q) =>
            $q->where('activo', true)
        )
            ->where('activo', true)
            ->select('id', 'nombre', 'sku', 'categoria_id', 'marca_id', 'precio_base')
            ->with(['categoria:id,nombre', 'marca:id,nombre'])
            ->get();

        $csv = "ID,Nombre,SKU,Categoría,Marca,Precio Base\n";

        foreach ($productos as $p) {
            $csv .= "{$p->id},\"{$p->nombre}\",{$p->sku},{$p->categoria?->nombre},{$p->marca?->nombre},{$p->precio_base}\n";
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename=productos-sin-codigo-' . now()->format('Y-m-d') . '.csv');
    }

    /**
     * API: Descargar historial como CSV
     */
    public function descargarHistorial()
    {
        $historial = HistorialCodigoBarra::with(['usuario', 'producto'])
            ->orderByDesc('fecha_evento')
            ->get();

        $csv = "Fecha,Tipo Evento,Producto,Código Anterior,Código Nuevo,Usuario,Razón\n";

        foreach ($historial as $h) {
            $fecha = $h->fecha_evento->format('Y-m-d H:i:s');
            $csv .= "{$fecha},{$h->tipo_evento},\"{$h->producto?->nombre}\",{$h->codigo_anterior},{$h->codigo_nuevo},\"{$h->usuario_nombre}\",\"{$h->razon}\"\n";
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename=historial-codigos-' . now()->format('Y-m-d') . '.csv');
    }
}
