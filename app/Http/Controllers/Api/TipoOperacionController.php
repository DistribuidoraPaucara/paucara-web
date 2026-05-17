<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TipoOperacion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * API Controller: TipoOperacionController
 *
 * Gestiona las operaciones de lectura de tipos de operación disponibles
 * para ajustes masivos de inventario.
 *
 * Endpoint:
 * - GET /api/inventario/tipos-operacion
 *
 * Respuesta:
 * {
 *   "data": [
 *     {
 *       "id": 1,
 *       "clave": "ENTRADA_AJUSTE",
 *       "label": "Entrada por Ajuste",
 *       "descripcion": "Aumento de stock por ajuste de inventario",
 *       "direccion": "entrada",
 *       "requiere_tipo_motivo": "tipo_ajuste",
 *       "requiere_proveedor": false,
 *       "requiere_cliente": false,
 *       "created_at": "2024-01-01T10:30:00Z",
 *       "updated_at": "2024-01-01T10:30:00Z"
 *     }
 *   ]
 * }
 */
class TipoOperacionController extends Controller
{
    /**
     * Obtiene todos los tipos de operación activos
     *
     * GET /api/inventario/tipos-operacion
     *
     * Retorna lista completa de tipos de operación disponibles
     * para el sistema de ajustes masivos de inventario.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $tiposOperacion = TipoOperacion::activos()
                ->orderBy('direccion')
                ->orderBy('label')
                ->get();

            return response()->json([
                'data' => $tiposOperacion,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener tipos de operación',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtiene un tipo de operación específico por ID
     *
     * GET /api/inventario/tipos-operacion/{id}
     *
     * @param TipoOperacion $tipoOperacion
     * @return JsonResponse
     */
    public function show(TipoOperacion $tipoOperacion): JsonResponse
    {
        try {
            return response()->json([
                'data' => $tipoOperacion,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener tipo de operación',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtiene tipos de operación por dirección (entrada o salida)
     *
     * GET /api/inventario/tipos-operacion/por-direccion/{direccion}
     *
     * @param string $direccion 'entrada' o 'salida'
     * @return JsonResponse
     */
    public function porDireccion(string $direccion): JsonResponse
    {
        try {
            $direccionesValidas = ['entrada', 'salida'];

            if (!in_array($direccion, $direccionesValidas)) {
                return response()->json([
                    'message' => 'Dirección inválida. Use: ' . implode(', ', $direccionesValidas),
                ], 422);
            }

            $tiposOperacion = TipoOperacion::where('direccion', $direccion)
                ->activos()
                ->orderBy('label')
                ->get();

            return response()->json([
                'data' => $tiposOperacion,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener tipos de operación por dirección',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtiene tipos de operación con todos sus detalles y requerimientos
     *
     * Útil para formularios dinámicos que necesitan información
     * completa sobre qué campos requiere cada operación
     *
     * GET /api/inventario/tipos-operacion/con-requisitos
     *
     * @return JsonResponse
     */
    public function conRequisitos(): JsonResponse
    {
        try {
            $tiposOperacion = TipoOperacion::activos()
                ->orderBy('direccion')
                ->orderBy('label')
                ->get()
                ->map(function ($tipo) {
                    return [
                        'id' => $tipo->id,
                        'clave' => $tipo->clave,
                        'label' => $tipo->label,
                        'descripcion' => $tipo->descripcion,
                        'direccion' => $tipo->direccion,
                        'requiere_tipo_motivo' => $tipo->requiere_tipo_motivo,
                        'requiere_proveedor' => (bool) $tipo->requiere_proveedor,
                        'requiere_cliente' => (bool) $tipo->requiere_cliente,
                        'requisitos' => [
                            'tipo_motivo' => $tipo->requiere_tipo_motivo ? [
                                'requerido' => true,
                                'tipo' => $tipo->requiere_tipo_motivo,
                                'campo_id' => $tipo->requiere_tipo_motivo . '_id',
                            ] : null,
                            'proveedor' => $tipo->requiere_proveedor ? [
                                'requerido' => true,
                                'campo_id' => 'proveedor_id',
                            ] : null,
                            'cliente' => $tipo->requiere_cliente ? [
                                'requerido' => true,
                                'campo_id' => 'cliente_id',
                            ] : null,
                        ],
                        'helper_text' => $this->generarTextoAyuda($tipo),
                        'created_at' => $tipo->created_at,
                        'updated_at' => $tipo->updated_at,
                    ];
                });

            return response()->json([
                'data' => $tiposOperacion,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener tipos de operación con requisitos',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Genera texto de ayuda dinámico para cada tipo de operación
     *
     * @param TipoOperacion $tipo
     * @return string
     */
    private function generarTextoAyuda(TipoOperacion $tipo): string
    {
        $requisitos = [];

        if ($tipo->requiere_tipo_motivo) {
            $requisitos[] = "Requiere {$tipo->requiere_tipo_motivo}";
        }

        if ($tipo->requiere_proveedor) {
            $requisitos[] = 'Requiere información del proveedor';
        }

        if ($tipo->requiere_cliente) {
            $requisitos[] = 'Requiere información del cliente';
        }

        return $tipo->descripcion ?? implode(', ', $requisitos);
    }
}
