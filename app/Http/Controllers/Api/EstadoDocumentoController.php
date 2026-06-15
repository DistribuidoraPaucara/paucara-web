<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EstadoDocumento;
use Illuminate\Http\JsonResponse;

class EstadoDocumentoController extends Controller
{
    /**
     * GET /api/estados-documento
     *
     * Obtener todos los estados de documento activos
     */
    public function index(): JsonResponse
    {
        try {
            $estados = EstadoDocumento::where('activo', true)
                ->orderBy('nombre')
                ->get([
                    'id',
                    'codigo',
                    'nombre',
                    'descripcion',
                    'color',
                ]);

            return response()->json([
                'data' => $estados,
                'meta' => [
                    'total' => $estados->count(),
                    'timestamp' => now()->toIso8601String(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error obteniendo estados documento',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
