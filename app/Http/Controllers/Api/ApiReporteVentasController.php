<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EstadoDocumento;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApiReporteVentasController extends Controller
{
    /**
     * Obtener reporte de productos vendidos en JSON
     * GET /api/reportes/productos-vendidos
     *
     * ✅ MEJORADO: Ahora incluye ventas CON y SIN proforma asociada
     *
     * Query Parameters:
     * - fecha_desde: YYYY-MM-DD (default: hace 30 días)
     * - fecha_hasta: YYYY-MM-DD (default: hoy)
     * - usuario_creador_id: ID del preventista (opcional, usa el usuario actual si es preventista)
     * - cliente_id: ID del cliente (opcional)
     */
    public function productosVendidos(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();

            // Preparar filtros
            $filtros = [
                'fecha_desde' => $request->filled('fecha_desde') ? $request->date('fecha_desde') : now()->subMonth(),
                'fecha_hasta' => $request->filled('fecha_hasta') ? $request->date('fecha_hasta') : now(),
                'cliente_id' => $request->integer('cliente_id') ?: null,
            ];

            // Determinar preventista_id
            // Prioridad: parámetro > usuario actual (si es preventista)
            if ($request->filled('usuario_creador_id')) {
                $filtros['preventista_id'] = $request->integer('usuario_creador_id');
            } elseif ($user->hasRole('Preventista')) {
                $filtros['preventista_id'] = $user->id;
            }

            // Usar el service para calcular
            $resultado = \App\Services\ProductosVendidosService::obtenerProductosVendidos($filtros);

            // Agregar información adicional
            $resultado['es_preventista'] = $user->hasRole('Preventista');

            return response()->json($resultado);

        } catch (\Exception $e) {
            \Log::error('Error en ApiReporteVentasController::productosVendidos', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'status' => 500,
                'code' => 'REPORTE_ERROR',
                'message' => 'Error al generar reporte',
                'error' => [
                    'type' => class_basename($e),
                    'message' => $e->getMessage(),
                ],
            ], 500);
        }
    }
}
