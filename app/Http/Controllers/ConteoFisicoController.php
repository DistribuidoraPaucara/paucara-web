<?php

namespace App\Http\Controllers;

use App\Models\ConteoFisico;
use App\Models\DetalleConteoFisico;
use App\Models\Almacen;
use App\Models\StockProducto;
use App\Models\Producto;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ConteoFisicoController extends Controller
{
    public function index(Request $request)
    {
        $query = ConteoFisico::with(['almacen', 'creadoPor', 'supervisadoPor']);

        // Filtros
        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->filled('tipo_conteo')) {
            $query->where('tipo_conteo', $request->tipo_conteo);
        }

        if ($request->filled('almacen_id')) {
            $query->where('almacen_id', $request->almacen_id);
        }

        if ($request->filled('fecha_desde')) {
            $query->whereDate('fecha_programada', '>=', $request->fecha_desde);
        }

        if ($request->filled('fecha_hasta')) {
            $query->whereDate('fecha_programada', '<=', $request->fecha_hasta);
        }

        $conteos = $query->orderBy('fecha_programada', 'desc')
                        ->paginate(15)
                        ->withQueryString();

        // Estadísticas
        $estadisticas = [
            'total_conteos' => ConteoFisico::count(),
            'pendientes' => ConteoFisico::pendientes()->count(),
            'en_progreso' => ConteoFisico::enProgreso()->count(),
            'finalizados' => ConteoFisico::finalizados()->count(),
            'con_diferencias' => ConteoFisico::conDiferencias()->count(),
            'programados_hoy' => ConteoFisico::programadosHoy()->count(),
        ];

        return Inertia::render('Inventario/ConteosFisicos/Index', [
            'conteos' => $conteos,
            'estadisticas' => $estadisticas,
            'filtros' => $request->only(['estado', 'tipo_conteo', 'almacen_id', 'fecha_desde', 'fecha_hasta']),
            'almacenes' => Almacen::select('id', 'nombre')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Inventario/ConteosFisicos/Create', [
            'almacenes' => Almacen::select('id', 'nombre')->get(),
            'categorias' => Categoria::select('id', 'nombre')->get(),
            'productos' => Producto::select('id', 'nombre', 'codigo')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'almacen_id' => 'required|exists:almacenes,id',
            'tipo_conteo' => 'required|in:ciclico,general,por_categoria,spot',
            'fecha_programada' => 'required|date|after_or_equal:today',
            'descripcion' => 'required|string|max:500',
            'observaciones' => 'nullable|string|max:1000',
            'filtros' => 'nullable|array',
            'filtros.categorias' => 'nullable|array',
            'filtros.productos' => 'nullable|array',
        ]);

        DB::transaction(function() use ($request) {
            $conteo = ConteoFisico::create([
                'codigo_conteo' => ConteoFisico::generarCodigo(),
                'almacen_id' => $request->almacen_id,
                'creado_por' => auth()->id(),
                'tipo_conteo' => $request->tipo_conteo,
                'fecha_programada' => $request->fecha_programada,
                'descripcion' => $request->descripcion,
                'observaciones' => $request->observaciones,
                'filtros' => $request->filtros,
            ]);

            // Generar detalles del conteo
            $this->generarDetallesConteo($conteo, $request->filtros);
        });

        return redirect()->route('conteos-fisicos.index')
                        ->with('success', 'Conteo físico programado exitosamente');
    }

    public function show(ConteoFisico $conteoFisico)
    {
        $conteoFisico->load(['almacen', 'creadoPor', 'supervisadoPor', 'detalles.producto', 'detalles.contadoPor']);

        $resumen = [
            'porcentaje_completado' => $conteoFisico->porcentajeCompletado(),
            'productos_contados' => $conteoFisico->detalles()->contados()->count(),
            'productos_pendientes' => $conteoFisico->detalles()->pendientes()->count(),
            'productos_con_diferencias' => $conteoFisico->detalles()->conDiferencias()->count(),
            'valor_diferencias' => $conteoFisico->valor_diferencias,
        ];

        return Inertia::render('Inventario/ConteosFisicos/Show', [
            'conteo' => $conteoFisico,
            'resumen' => $resumen,
        ]);
    }

    public function iniciar(ConteoFisico $conteoFisico)
    {
        if (!$conteoFisico->puedeIniciar()) {
            return back()->withErrors(['general' => 'No se puede iniciar este conteo en su estado actual']);
        }

        $conteoFisico->iniciar(auth()->id());

        return back()->with('success', 'Conteo físico iniciado exitosamente');
    }

    public function finalizar(ConteoFisico $conteoFisico)
    {
        if (!$conteoFisico->puedeFinalizar()) {
            return back()->withErrors(['general' => 'No se puede finalizar este conteo en su estado actual']);
        }

        $conteoFisico->finalizar(auth()->id());

        return back()->with('success', 'Conteo físico finalizado exitosamente');
    }

    public function aprobar(Request $request, ConteoFisico $conteoFisico)
    {
        $request->validate([
            'aplicar_ajustes' => 'required|boolean',
        ]);

        if (!$conteoFisico->puedeAprobar()) {
            return back()->withErrors(['general' => 'No se puede aprobar este conteo en su estado actual']);
        }

        if ($conteoFisico->tieneDiferenciasSignificativas() && !$request->aplicar_ajustes) {
            return back()->withErrors([
                'aplicar_ajustes' => 'Este conteo tiene diferencias significativas. Se recomienda aplicar los ajustes.'
            ]);
        }

        $conteoFisico->aprobar(auth()->id(), $request->aplicar_ajustes);

        $mensaje = $request->aplicar_ajustes
            ? 'Conteo aprobado y ajustes aplicados exitosamente'
            : 'Conteo aprobado exitosamente (sin aplicar ajustes)';

        return redirect()->route('conteos-fisicos.index')
                        ->with('success', $mensaje);
    }

    public function cancelar(Request $request, ConteoFisico $conteoFisico)
    {
        $request->validate([
            'motivo' => 'required|string|max:500',
        ]);

        if (!$conteoFisico->puedeCancelar()) {
            return back()->withErrors(['general' => 'No se puede cancelar este conteo en su estado actual']);
        }

        $conteoFisico->cancelar($request->motivo);

        return redirect()->route('conteos-fisicos.index')
                        ->with('success', 'Conteo físico cancelado exitosamente');
    }

    public function contarItem(Request $request, ConteoFisico $conteoFisico, DetalleConteoFisico $detalle)
    {
        $request->validate([
            'cantidad_contada' => 'required|numeric|min:0',
            'observaciones' => 'nullable|string|max:500',
        ]);

        if ($conteoFisico->estado !== ConteoFisico::ESTADO_EN_PROGRESO) {
            return back()->withErrors(['general' => 'El conteo no está en progreso']);
        }

        $detalle->registrarConteo(
            $request->cantidad_contada,
            auth()->id(),
            $request->observaciones
        );

        return back()->with('success', 'Producto contado exitosamente');
    }

    public function recontarItem(Request $request, ConteoFisico $conteoFisico, DetalleConteoFisico $detalle)
    {
        $request->validate([
            'cantidad_contada' => 'required|numeric|min:0',
            'observaciones' => 'nullable|string|max:500',
        ]);

        if ($conteoFisico->estado !== ConteoFisico::ESTADO_EN_PROGRESO) {
            return back()->withErrors(['general' => 'El conteo no está en progreso']);
        }

        $detalle->realizarReconteo(
            $request->cantidad_contada,
            auth()->id(),
            $request->observaciones
        );

        return back()->with('success', 'Producto recontado exitosamente');
    }

    public function marcarParaReconteo(Request $request, ConteoFisico $conteoFisico, DetalleConteoFisico $detalle)
    {
        $request->validate([
            'motivo' => 'required|string|max:500',
        ]);

        $detalle->marcarParaReconteo($request->motivo);

        return back()->with('success', 'Producto marcado para reconteo');
    }

    // API Methods
    public function apiConteos()
    {
        $conteos = ConteoFisico::with(['almacen'])
                              ->orderBy('fecha_programada', 'desc')
                              ->limit(50)
                              ->get()
                              ->map(function($conteo) {
                                  return [
                                      'id' => $conteo->id,
                                      'codigo_conteo' => $conteo->codigo_conteo,
                                      'almacen' => $conteo->almacen->nombre,
                                      'tipo_conteo' => $conteo->tipo_conteo,
                                      'estado' => $conteo->estado,
                                      'fecha_programada' => $conteo->fecha_programada,
                                      'porcentaje_completado' => $conteo->porcentajeCompletado(),
                                      'total_diferencias' => $conteo->total_diferencias,
                                      'valor_diferencias' => $conteo->valor_diferencias,
                                  ];
                              });

        return response()->json($conteos);
    }

    public function apiDetalleConteo(ConteoFisico $conteoFisico)
    {
        $detalles = $conteoFisico->detalles()
                                ->with(['producto', 'contadoPor'])
                                ->orderBy('productos.nombre')
                                ->get()
                                ->map(function($detalle) {
                                    return [
                                        'id' => $detalle->id,
                                        'producto' => [
                                            'id' => $detalle->producto->id,
                                            'nombre' => $detalle->producto->nombre,
                                            'codigo' => $detalle->producto->codigo,
                                        ],
                                        'cantidad_sistema' => $detalle->cantidad_sistema,
                                        'cantidad_contada' => $detalle->cantidad_contada,
                                        'diferencia' => $detalle->diferencia,
                                        'diferencia_formateada' => $detalle->diferencia_formateada,
                                        'valor_diferencia' => $detalle->valor_diferencia,
                                        'valor_diferencia_formateada' => $detalle->valor_diferencia_formateada,
                                        'estado_item' => $detalle->estado_item,
                                        'status_text' => $detalle->status_text,
                                        'status_color' => $detalle->status_color,
                                        'requiere_reconteo' => $detalle->requiere_reconteo,
                                        'fecha_conteo' => $detalle->fecha_conteo,
                                        'contado_por' => $detalle->contadoPor?->name,
                                        'observaciones' => $detalle->observaciones,
                                    ];
                                });

        return response()->json($detalles);
    }

    public function apiProgramarConteosCiclicos(Request $request)
    {
        $request->validate([
            'almacen_id' => 'required|exists:almacenes,id',
            'frecuencia_dias' => 'nullable|integer|min:7|max:365',
        ]);

        $conteosProgramados = ConteoFisico::programarConteosCiclicos(
            $request->almacen_id,
            $request->frecuencia_dias ?? 30
        );

        return response()->json([
            'message' => 'Conteos cíclicos programados exitosamente',
            'conteos_programados' => count($conteosProgramados),
            'conteos' => $conteosProgramados,
        ]);
    }

    public function dashboard()
    {
        $estadisticas = [
            'total_conteos' => ConteoFisico::count(),
            'pendientes' => ConteoFisico::pendientes()->count(),
            'en_progreso' => ConteoFisico::enProgreso()->count(),
            'finalizados_mes' => ConteoFisico::finalizados()
                               ->whereMonth('fecha_finalizacion', now()->month)
                               ->count(),
            'diferencias_significativas' => ConteoFisico::where('valor_diferencias', '>', 1000)->count(),
            'programados_semana' => ConteoFisico::whereBetween('fecha_programada', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ])->count(),
        ];

        // Conteos programados para esta semana
        $conteosSemana = ConteoFisico::whereBetween('fecha_programada', [
                                    now()->startOfWeek(),
                                    now()->endOfWeek()
                                ])
                                ->with(['almacen'])
                                ->orderBy('fecha_programada')
                                ->get();

        // Conteos con diferencias significativas
        $conteosConDiferencias = ConteoFisico::where('valor_diferencias', '>', 500)
                                           ->where('estado', '!=', ConteoFisico::ESTADO_CANCELADO)
                                           ->with(['almacen'])
                                           ->orderBy('valor_diferencias', 'desc')
                                           ->limit(10)
                                           ->get();

        // Estadísticas por tipo de conteo
        $conteosPorTipo = ConteoFisico::select('tipo_conteo', DB::raw('COUNT(*) as total'))
                                    ->groupBy('tipo_conteo')
                                    ->get();

        return Inertia::render('Inventario/ConteosFisicos/Dashboard', [
            'estadisticas' => $estadisticas,
            'conteos_semana' => $conteosSemana,
            'conteos_con_diferencias' => $conteosConDiferencias,
            'conteos_por_tipo' => $conteosPorTipo,
        ]);
    }

    // Métodos auxiliares privados
    private function generarDetallesConteo(ConteoFisico $conteo, $filtros)
    {
        $query = StockProducto::where('almacen_id', $conteo->almacen_id)
                             ->where('stock_actual', '>', 0)
                             ->with(['producto']);

        // Aplicar filtros
        if (!empty($filtros['categorias'])) {
            $query->whereHas('producto', function($q) use ($filtros) {
                $q->whereIn('categoria_id', $filtros['categorias']);
            });
        }

        if (!empty($filtros['productos'])) {
            $query->whereIn('producto_id', $filtros['productos']);
        }

        $stockProductos = $query->get();

        foreach ($stockProductos as $stockProducto) {
            DetalleConteoFisico::create([
                'conteo_fisico_id' => $conteo->id,
                'producto_id' => $stockProducto->producto_id,
                'stock_producto_id' => $stockProducto->id,
                'lote' => $stockProducto->lote,
                'fecha_vencimiento' => $stockProducto->fecha_vencimiento,
                'cantidad_sistema' => $stockProducto->stock_actual,
                'valor_unitario' => $stockProducto->producto->precio ?? 0,
            ]);
        }

        // Actualizar total de productos esperados
        $conteo->update([
            'total_productos_esperados' => $stockProductos->count()
        ]);
    }
}