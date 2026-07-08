<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\EntregaReporteService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EntregaReporteController extends Controller
{
    public function __construct(private EntregaReporteService $entregaReporteService)
    {
    }

    /**
     * Reporte de confirmaciones de entrega por chofer
     * GET /api/choferes/{chofer}/entregas-reporte
     *
     * Filtra confirmaciones desde el día 1 del mes hasta hoy, del usuario registrador
     * Agrupa productos por venta entregada con estados válidos (COMPLETA|DEVOLUCION_PARCIAL)
     */
    public function choferEntregas(int $chofer, Request $request): JsonResponse
    {
        try {
            $choferModel = User::findOrFail($chofer);

            // Obtener reporte de confirmaciones
            $reporte = $this->entregaReporteService->generarReporteConfirmaciones(
                $chofer,
                $request->input('fecha_desde'),
                $request->input('fecha_hasta')
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'chofer' => [
                        'id' => $choferModel->id,
                        'nombre' => $choferModel->name,
                        'email' => $choferModel->email,
                    ],
                    'filtros' => $reporte['filtros'],
                    'resumen' => $reporte['resumen'],
                    'productos_resumen' => $reporte['productos_resumen'],
                    'productos_por_venta' => $reporte['productos_por_venta'],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo reporte',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
