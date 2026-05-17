<?php

namespace App\Http\Controllers;

use App\Services\ConciliacionCajaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ConciliacionCajaController extends Controller
{
    protected ConciliacionCajaService $conciliacionService;

    public function __construct(ConciliacionCajaService $conciliacionService)
    {
        $this->conciliacionService = $conciliacionService;
        $this->middleware('auth');
    }

    /**
     * Obtener conciliación del día
     * GET /api/conciliacion/dia?fecha=2026-02-06
     */
    public function conciliacionDelDia(Request $request): JsonResponse
    {
        $this->authorize('cajas.transacciones');

        $fecha = $request->query('fecha');

        try {
            $conciliacion = $this->conciliacionService->conciliacionDelDia($fecha);

            return response()->json([
                'success' => true,
                'data' => $conciliacion,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener conciliación: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener historial de conciliaciones
     * GET /api/conciliacion/historial?fecha_inicio=2026-02-01&fecha_fin=2026-02-06
     */
    public function historial(Request $request): JsonResponse
    {
        $this->authorize('cajas.transacciones');

        $fechaInicio = $request->query('fecha_inicio', now()->subDays(7)->toDateString());
        $fechaFin = $request->query('fecha_fin', today()->toDateString());

        $conciliaciones = [];
        $fecha = \Carbon\Carbon::parse($fechaInicio);

        while ($fecha <= \Carbon\Carbon::parse($fechaFin)) {
            $conciliacion = $this->conciliacionService->conciliacionDelDia($fecha->toDateString());
            $conciliaciones[] = $conciliacion;
            $fecha->addDay();
        }

        return response()->json([
            'success' => true,
            'data' => $conciliaciones,
        ]);
    }
}
