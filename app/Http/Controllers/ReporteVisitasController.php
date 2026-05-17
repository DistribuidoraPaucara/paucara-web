<?php

namespace App\Http\Controllers;

use App\Models\VisitaPreventistaCliente;
use App\Models\Empleado;
use App\Exports\VisitasExport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

class ReporteVisitasController extends Controller
{
    /**
     * GET /admin/reportes/visitas
     * Vista principal de reportes
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', VisitaPreventistaCliente::class);

        // Obtener filtros
        $filters = $request->only([
            'preventista_id',
            'fecha_inicio',
            'fecha_fin',
            'estado_visita',
            'tipo_visita',
        ]);

        // Construir query
        $query = VisitaPreventistaCliente::with(['preventista.user', 'cliente']);

        if (!empty($filters['preventista_id'])) {
            $query->where('preventista_id', $filters['preventista_id']);
        }

        if (!empty($filters['fecha_inicio']) && !empty($filters['fecha_fin'])) {
            $query->whereBetween('fecha_hora_visita', [
                Carbon::parse($filters['fecha_inicio'])->startOfDay(),
                Carbon::parse($filters['fecha_fin'])->endOfDay(),
            ]);
        }

        if (!empty($filters['estado_visita'])) {
            $query->where('estado_visita', $filters['estado_visita']);
        }

        if (!empty($filters['tipo_visita'])) {
            $query->where('tipo_visita', $filters['tipo_visita']);
        }

        // Obtener datos
        $visitas = $query->orderBy('fecha_hora_visita', 'desc')
            ->paginate(50);

        // Calcular métricas
        $metricas = $this->calcularMetricas($query->clone());

        // Obtener preventistas para filtro
        $preventistas = Empleado::whereHas('user', function($q) {
            $q->whereHas('roles', function($r) {
                $r->where('name', 'Preventista');
            });
        })->with('user')->get();

        return Inertia::render('admin/reportes/visitas', [
            'visitas' => $visitas,
            'metricas' => $metricas,
            'preventistas' => $preventistas,
            'filters' => $filters,
        ]);
    }

    /**
     * GET /admin/reportes/visitas/exportar-excel
     * Exportar a Excel
     */
    public function exportarExcel(Request $request)
    {
        $this->authorize('viewAny', VisitaPreventistaCliente::class);

        $filters = $request->only([
            'preventista_id',
            'fecha_inicio',
            'fecha_fin',
            'estado_visita',
            'tipo_visita',
        ]);

        $filename = 'visitas_preventistas_' . now()->format('Ymd_His') . '.xlsx';

        return Excel::download(
            new VisitasExport($filters),
            $filename
        );
    }

    /**
     * Calcular métricas del reporte
     */
    private function calcularMetricas($query): array
    {
        $total = $query->count();
        $exitosas = $query->clone()->exitosas()->count();
        $noAtendidas = $query->clone()->noAtendidas()->count();
        $fueraHorario = $query->clone()->fueraDeHorario()->count();

        return [
            'total_visitas' => $total,
            'visitas_exitosas' => $exitosas,
            'visitas_no_atendidas' => $noAtendidas,
            'visitas_fuera_horario' => $fueraHorario,
            'porcentaje_exitosas' => $total > 0 ? round(($exitosas / $total) * 100, 2) : 0,
            'porcentaje_no_atendidas' => $total > 0 ? round(($noAtendidas / $total) * 100, 2) : 0,
            'porcentaje_fuera_horario' => $total > 0 ? round(($fueraHorario / $total) * 100, 2) : 0,
        ];
    }
}
