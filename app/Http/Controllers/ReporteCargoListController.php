<?php

namespace App\Http\Controllers;

use App\Models\ReporteCarga;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

/**
 * ReporteCargoListController - Gestión centralizada de reportes de carga
 *
 * RESPONSABILIDADES:
 * ✓ Listar reportes con filtros avanzados
 * ✓ Búsqueda de reportes
 * ✓ Exportar reportes
 * ✓ Estadísticas de reportes
 */
class ReporteCargoListController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:reportes-carga.index')->only('index');
    }

    /**
     * Mostrar página de reportes
     *
     * GET /logistica/reportes
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $page = $request->input('page', 1);

        // Filtros
        $estado = $request->input('estado');
        $fechaDesde = $request->input('fecha_desde');
        $fechaHasta = $request->input('fecha_hasta');
        $choferId = $request->input('chofer_id');
        $vehiculoId = $request->input('vehiculo_id');
        $search = $request->input('search');

        // Query base
        $query = ReporteCarga::query()
            ->with([
                'entregas' => function ($q) {
                    $q->orderBy('reporte_carga_entregas.orden');
                },
                'entregas.ventas.cliente',
                'vehiculo',
            ])
            ->withCount('entregas');

        // Aplicar filtros
        if ($estado) {
            $query->where('estado', $estado);
        }

        if ($fechaDesde) {
            $query->whereDate('fecha_generacion', '>=', $fechaDesde);
        }

        if ($fechaHasta) {
            $query->whereDate('fecha_generacion', '<=', $fechaHasta);
        }

        if ($choferId) {
            $query->whereHas('entregas', function ($q) use ($choferId) {
                $q->where('chofer_id', $choferId);
            });
        }

        if ($vehiculoId) {
            $query->where('vehiculo_id', $vehiculoId);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('numero_reporte', 'like', "%{$search}%")
                    ->orWhere('descripcion', 'like', "%{$search}%")
                    ->orWhereHas('entregas.ventas.cliente', function ($q2) use ($search) {
                        $q2->where('nombre', 'like', "%{$search}%");
                    });
            });
        }

        // Obtener reportes paginados
        $reportes = $query
            ->latest('fecha_generacion')
            ->paginate($perPage, ['*'], 'page', $page);

        // Cargar opciones para selectores
        $choferes = \App\Models\Empleado::where('estado', 'activo')
            ->whereNotNull('licencia')
            ->with('user:id,name')
            ->get(['id', 'user_id'])
            ->map(function ($empleado) {
                return [
                    'id' => $empleado->id,
                    'nombre' => $empleado->nombre, // Usa el accessor
                ];
            });

        $vehiculos = \App\Models\Vehiculo::where('estado', 'disponible')
            ->orWhere('estado', 'en_uso')
            ->get(['id', 'placa', 'marca', 'modelo']);

        // Estados disponibles
        $estados = [
            'PENDIENTE' => 'Pendiente',
            'CONFIRMADO' => 'Confirmado',
            'ENTREGADO' => 'Entregado',
            'CANCELADO' => 'Cancelado',
        ];

        // Estadísticas
        $estadisticas = [
            'total_reportes' => ReporteCarga::count(),
            'pendientes' => ReporteCarga::where('estado', 'PENDIENTE')->count(),
            'confirmados' => ReporteCarga::where('estado', 'CONFIRMADO')->count(),
            'entregados' => ReporteCarga::where('estado', 'ENTREGADO')->count(),
            'peso_total' => ReporteCarga::sum('peso_total_kg'),
            'entregas_total' => \App\Models\ReporteCargaEntrega::count(),
        ];

        // Filtros activos
        $filtrosActivos = [
            'estado' => $estado,
            'fecha_desde' => $fechaDesde,
            'fecha_hasta' => $fechaHasta,
            'chofer_id' => $choferId,
            'vehiculo_id' => $vehiculoId,
            'search' => $search,
        ];

        // Construir links de paginación
        $links = [];
        if ($reportes->previousPageUrl()) {
            $links[] = ['url' => $reportes->previousPageUrl(), 'label' => '&laquo; Previous', 'active' => false];
        } else {
            $links[] = ['url' => null, 'label' => '&laquo; Previous', 'active' => false];
        }

        for ($i = 1; $i <= $reportes->lastPage(); $i++) {
            $links[] = [
                'url' => $reportes->url($i),
                'label' => (string) $i,
                'active' => $i === $reportes->currentPage(),
            ];
        }

        if ($reportes->nextPageUrl()) {
            $links[] = ['url' => $reportes->nextPageUrl(), 'label' => 'Next &raquo;', 'active' => false];
        } else {
            $links[] = ['url' => null, 'label' => 'Next &raquo;', 'active' => false];
        }

        return Inertia::render('logistica/reportes/index', [
            'reportes' => [
                'data' => $reportes->items(),
                'links' => $links,
                'meta' => [
                    'total' => $reportes->total(),
                    'per_page' => $reportes->perPage(),
                    'current_page' => $reportes->currentPage(),
                    'last_page' => $reportes->lastPage(),
                    'from' => $reportes->firstItem(),
                    'to' => $reportes->lastItem(),
                ],
            ],
            'choferes' => $choferes,
            'vehiculos' => $vehiculos,
            'estados' => $estados,
            'estadisticas' => $estadisticas,
            'filtros' => $filtrosActivos,
        ]);
    }

    /**
     * Obtener estadísticas de reportes (API)
     *
     * GET /api/reportes-estadisticas
     */
    public function estadisticas()
    {
        return response()->json([
            'total_reportes' => ReporteCarga::count(),
            'pendientes' => ReporteCarga::where('estado', 'PENDIENTE')->count(),
            'confirmados' => ReporteCarga::where('estado', 'CONFIRMADO')->count(),
            'entregados' => ReporteCarga::where('estado', 'ENTREGADO')->count(),
            'peso_promedio' => ReporteCarga::avg('peso_total_kg'),
            'peso_total' => ReporteCarga::sum('peso_total_kg'),
        ]);
    }

    /**
     * Exportar reportes seleccionados como ZIP
     *
     * POST /api/reportes/exportar-zip
     */
    public function exportarZip(Request $request)
    {
        $reporteIds = $request->input('reporte_ids', []);

        if (empty($reporteIds)) {
            return response()->json([
                'success' => false,
                'message' => 'No hay reportes seleccionados',
            ], 422);
        }

        try {
            $reportes = ReporteCarga::whereIn('id', $reporteIds)
                ->with(['entregas', 'vehiculo', 'detalles.producto'])
                ->get();

            // Crear ZIP con PDFs
            $zip = new \ZipArchive();
            $zipPath = storage_path('app/temp/reportes-' . time() . '.zip');

            // Crear carpeta si no existe
            if (!is_dir(storage_path('app/temp'))) {
                mkdir(storage_path('app/temp'), 0755, true);
            }

            if ($zip->open($zipPath, \ZipArchive::CREATE) === true) {
                foreach ($reportes as $reporte) {
                    // Generar PDF para cada reporte
                    $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('reportes.reporte-carga-pdf', [
                        'reporte' => $reporte,
                        'fecha_generacion' => now()->format('d/m/Y H:i'),
                        'empresa' => config('app.name'),
                        'detallado' => true,
                    ])->output();

                    // Agregar PDF al ZIP
                    $zip->addFromString(
                        "reporte-{$reporte->numero_reporte}.pdf",
                        $pdf
                    );
                }
                $zip->close();

                // Retornar ZIP para descargar
                return response()->download($zipPath, "reportes-" . now()->format('YmdHis') . ".zip")
                    ->deleteFileAfterSend(true);
            } else {
                throw new \Exception('No se pudo crear el archivo ZIP');
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error exportando reportes',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
