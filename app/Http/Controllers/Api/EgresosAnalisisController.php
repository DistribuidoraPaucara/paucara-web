<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AperturaCaja;
use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EgresosAnalisisController extends Controller
{
    /**
     * GET /api/egresos
     * Obtener análisis detallado de egresos con filtros
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'fecha_desde' => 'nullable|date',
            'fecha_hasta' => 'nullable|date',
            'tipo_operacion_id' => 'nullable|exists:tipo_operacion_caja,id',
            'categoria' => 'nullable|string',
            'monto_min' => 'nullable|numeric|min:0',
            'monto_max' => 'nullable|numeric|min:0',
            'estado_caja' => 'nullable|in:abierta,cerrada,todas', // abierta, cerrada, todas
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $perPage = $validated['per_page'] ?? 15;
        $fechaDesde = ($validated['fecha_desde'] ?? null) ? Carbon::parse($validated['fecha_desde']) : now()->subMonths(1);
        $fechaHasta = ($validated['fecha_hasta'] ?? null) ? Carbon::parse($validated['fecha_hasta'])->endOfDay() : now();

        // Construir query de egresos (monto < 0)
        $query = MovimientoCaja::query()
            ->with(['tipoOperacion', 'usuario', 'caja', 'apertura'])
            ->where('monto', '<', 0) // Solo egresos
            ->whereBetween('fecha', [$fechaDesde, $fechaHasta]);

        // Filtro por tipo de operación
        if (!empty($validated['tipo_operacion_id'])) {
            $query->where('tipo_operacion_id', $validated['tipo_operacion_id']);
        }

        // Filtro por categoría (búsqueda en observaciones)
        if (!empty($validated['categoria'])) {
            $query->where('observaciones', 'ilike', '%' . $validated['categoria'] . '%');
        }

        // Filtro por rango de monto (monto está negativizado)
        if (!empty($validated['monto_min'])) {
            $query->where('monto', '<=', -$validated['monto_min']);
        }
        if (!empty($validated['monto_max'])) {
            $query->where('monto', '>=', -$validated['monto_max']);
        }

        // Filtro por estado de caja
        $estadoCaja = $validated['estado_caja'] ?? 'todas';
        if ($estadoCaja === 'cerrada') {
            $query->whereHas('apertura.cierre');
        } elseif ($estadoCaja === 'abierta') {
            $query->whereHas('apertura', fn($q) => $q->whereDoesntHave('cierre'));
        }

        // Paginar
        $egresos = $query->orderBy('fecha', 'desc')->paginate($perPage);

        // Calcular sumatorias y estadísticas
        $totales = $this->calcularTotales($fechaDesde, $fechaHasta, $validated);
        $egresoPorTipo = $this->egresoPorTipo($fechaDesde, $fechaHasta, $validated);
        $egresoPorCategoria = $this->egresoPorCategoria($fechaDesde, $fechaHasta, $validated);
        $comparativaAnterior = $this->comparativaConPeriodoAnterior($fechaDesde, $fechaHasta);

        return response()->json([
            'success' => true,
            'data' => [
                'egresos' => $egresos,
                'totales' => $totales,
                'por_tipo' => $egresoPorTipo,
                'por_categoria' => $egresoPorCategoria,
                'comparativa_periodo_anterior' => $comparativaAnterior,
            ],
        ]);
    }

    /**
     * Calcular totales de egresos
     */
    private function calcularTotales(Carbon $desde, Carbon $hasta, array $filtros): array
    {
        $query = MovimientoCaja::where('monto', '<', 0)
            ->whereBetween('fecha', [$desde, $hasta]);

        if (!empty($filtros['tipo_operacion_id'])) {
            $query->where('tipo_operacion_id', $filtros['tipo_operacion_id']);
        }
        if (!empty($filtros['categoria'])) {
            $query->where('observaciones', 'ilike', '%' . $filtros['categoria'] . '%');
        }
        $estadoCaja = $filtros['estado_caja'] ?? 'todas';
        if ($estadoCaja === 'cerrada') {
            $query->whereHas('apertura.cierre');
        } elseif ($estadoCaja === 'abierta') {
            $query->whereHas('apertura', fn($q) => $q->whereDoesntHave('cierre'));
        }

        $total = abs($query->sum('monto'));
        $cantidad = $query->count();
        $promedio = $cantidad > 0 ? $total / $cantidad : 0;

        return [
            'total' => round($total, 2),
            'cantidad' => $cantidad,
            'promedio' => round($promedio, 2),
        ];
    }

    /**
     * Egresos por tipo de operación
     */
    private function egresoPorTipo(Carbon $desde, Carbon $hasta, array $filtros): array
    {
        $query = MovimientoCaja::where('monto', '<', 0)
            ->whereBetween('fecha', [$desde, $hasta])
            ->select('tipo_operacion_id', DB::raw('COUNT(*) as cantidad, ABS(SUM(monto)) as total'))
            ->groupBy('tipo_operacion_id')
            ->with('tipoOperacion');

        if (!empty($filtros['categoria'])) {
            $query->where('observaciones', 'ilike', '%' . $filtros['categoria'] . '%');
        }

        return $query->get()->map(function ($item) {
            return [
                'tipo_operacion' => $item->tipoOperacion->nombre,
                'codigo' => $item->tipoOperacion->codigo,
                'total' => round($item->total, 2),
                'cantidad' => $item->cantidad,
                'promedio' => round($item->total / $item->cantidad, 2),
            ];
        })->toArray();
    }

    /**
     * Egresos por categoría (extraída de observaciones)
     */
    private function egresoPorCategoria(Carbon $desde, Carbon $hasta, array $filtros): array
    {
        $query = MovimientoCaja::where('monto', '<', 0)
            ->whereBetween('fecha', [$desde, $hasta])
            ->where('observaciones', '!=', '');

        if (!empty($filtros['tipo_operacion_id'])) {
            $query->where('tipo_operacion_id', $filtros['tipo_operacion_id']);
        }

        $egresos = $query->get();

        // Extraer categorías del formato [CATEGORIA]
        $categorias = [];
        foreach ($egresos as $egreso) {
            $categoria = $this->extraerCategoria($egreso->observaciones);
            if ($categoria) {
                if (!isset($categorias[$categoria])) {
                    $categorias[$categoria] = ['total' => 0, 'cantidad' => 0];
                }
                $categorias[$categoria]['total'] += abs($egreso->monto);
                $categorias[$categoria]['cantidad']++;
            }
        }

        // Formatear resultado
        $resultado = [];
        foreach ($categorias as $categoria => $datos) {
            $resultado[] = [
                'categoria' => $categoria,
                'total' => round($datos['total'], 2),
                'cantidad' => $datos['cantidad'],
                'promedio' => round($datos['total'] / $datos['cantidad'], 2),
            ];
        }

        // Ordenar por total descendente
        usort($resultado, fn($a, $b) => $b['total'] <=> $a['total']);

        return $resultado;
    }

    /**
     * Comparativa con período anterior
     */
    private function comparativaConPeriodoAnterior(Carbon $desde, Carbon $hasta): array
    {
        $diasPeriodo = $desde->diffInDays($hasta);
        $periodoPrevio = [
            'desde' => $desde->clone()->subDays($diasPeriodo),
            'hasta' => $desde->clone()->subDay(),
        ];

        $totalActual = abs(MovimientoCaja::where('monto', '<', 0)
            ->whereBetween('fecha', [$desde, $hasta])
            ->sum('monto'));

        $totalPrevio = abs(MovimientoCaja::where('monto', '<', 0)
            ->whereBetween('fecha', [$periodoPrevio['desde'], $periodoPrevio['hasta']])
            ->sum('monto'));

        $diferencia = $totalActual - $totalPrevio;
        $porcentaje = $totalPrevio > 0 ? ($diferencia / $totalPrevio) * 100 : 0;

        return [
            'periodo_actual' => round($totalActual, 2),
            'periodo_anterior' => round($totalPrevio, 2),
            'diferencia' => round($diferencia, 2),
            'porcentaje_cambio' => round($porcentaje, 2),
            'tendencia' => $diferencia > 0 ? 'alza' : 'baja',
        ];
    }

    /**
     * Extraer categoría del formato [CATEGORIA]
     */
    private function extraerCategoria(string $observaciones): ?string
    {
        if (preg_match('/^\[([^\]]+)\]/', $observaciones, $matches)) {
            return $matches[1];
        }
        return null;
    }
}
