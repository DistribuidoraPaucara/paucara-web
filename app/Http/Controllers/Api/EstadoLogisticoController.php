<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Logistica\EstadoLogisticoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EstadoLogisticoController extends Controller
{
    protected EstadoLogisticoService $estadoService;

    public function __construct(EstadoLogisticoService $estadoService)
    {
        $this->estadoService = $estadoService;
    }

    /**
     * GET /api/estados/{categoria}
     *
     * Obtener todos los estados de una categoría
     *
     * @param string $categoria Categoría: 'proforma', 'venta_logistica', 'entrega', 'vehiculo', 'pago'
     * @return JsonResponse
     */
    public function porCategoria(string $categoria): JsonResponse
    {
        try {
            // Validar categoría
            $categorias = $this->estadoService->obtenerCategorias();

            if (!in_array($categoria, $categorias)) {
                return response()->json([
                    'error' => 'Categoría no válida',
                    'categorias_disponibles' => $categorias,
                ], 400);
            }

            $estados = $this->estadoService->obtenerEstadosPorCategoria($categoria);

            return response()->json([
                'data' => $estados->map(fn($e) => [
                    'id' => $e->id,
                    'codigo' => $e->codigo,
                    'nombre' => $e->nombre,
                    'descripcion' => $e->descripcion,
                    'color' => $e->color,
                    'icono' => $e->icono,
                    'orden' => $e->orden,
                    'es_estado_final' => $e->es_estado_final,
                    'permite_edicion' => $e->permite_edicion,
                    'requiere_aprobacion' => $e->requiere_aprobacion,
                ]),
                'meta' => [
                    'categoria' => $categoria,
                    'total' => $estados->count(),
                    'timestamp' => now()->toIso8601String(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error obteniendo estados',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/estados/{categoria}/{codigo}
     *
     * Obtener un estado específico
     *
     * @param string $categoria Categoría del estado
     * @param string $codigo Código del estado
     * @return JsonResponse
     */
    public function porCodigo(string $categoria, string $codigo): JsonResponse
    {
        try {
            $estado = $this->estadoService->obtenerEstadoPorCodigo($codigo, $categoria);

            if (!$estado) {
                return response()->json([
                    'error' => 'Estado no encontrado',
                ], 404);
            }

            return response()->json([
                'data' => [
                    'id' => $estado->id,
                    'codigo' => $estado->codigo,
                    'categoria' => $estado->categoria,
                    'nombre' => $estado->nombre,
                    'descripcion' => $estado->descripcion,
                    'color' => $estado->color,
                    'icono' => $estado->icono,
                    'orden' => $estado->orden,
                    'es_estado_final' => $estado->es_estado_final,
                    'permite_edicion' => $estado->permite_edicion,
                    'requiere_aprobacion' => $estado->requiere_aprobacion,
                    'metadatos' => $estado->metadatos,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error obteniendo estado',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/transiciones/{categoria}/{codigo}
     *
     * Obtener transiciones válidas desde un estado (por categoría y código)
     *
     * @param string $categoria Categoría del estado
     * @param string $codigo Código del estado
     * @return JsonResponse
     */
    public function transicionesDisponibles(string $categoria, string $codigo): JsonResponse
    {
        try {
            $detalles = $this->estadoService->obtenerDetalleTransiciones($categoria, $codigo);

            if (empty($detalles)) {
                return response()->json([
                    'error' => 'Estado no encontrado',
                ], 404);
            }

            return response()->json([
                'data' => $detalles['transiciones_validas'],
                'meta' => [
                    'estado_actual' => $detalles['estado_actual'],
                    'total' => count($detalles['transiciones_validas']),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error obteniendo transiciones',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/estados/{estadoId}/transiciones
     *
     * Obtener transiciones válidas desde un estado (por ID de estado)
     * Endpoint optimizado para frontend que conoce el estado_entrega_id
     *
     * @param int $estadoId ID del estado en la tabla estados_logistica
     * @return JsonResponse
     */
    public function transicionesPorId(int $estadoId): JsonResponse
    {
        try {
            // Obtener el estado por ID
            $estado = \App\Models\EstadoLogistica::findOrFail($estadoId);

            // Obtener transiciones desde este estado
            $transiciones = $estado->transicionesDesde()->get()->map(function ($transicion) {
                return [
                    'codigo_destino' => $transicion->estadoDestino->codigo,
                    'nombre_destino' => $transicion->estadoDestino->nombre,
                    'requiere_validacion' => $transicion->requiere_validacion ?? false,
                    'icono' => $transicion->estadoDestino->icono,
                    'color' => $transicion->estadoDestino->color,
                ];
            });

            return response()->json([
                'transiciones' => $transiciones,
                'meta' => [
                    'estado_id' => $estado->id,
                    'estado_codigo' => $estado->codigo,
                    'estado_nombre' => $estado->nombre,
                    'categoria' => $estado->categoria,
                    'total' => $transiciones->count(),
                    'timestamp' => now()->toIso8601String(),
                ],
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Estado no encontrado',
                'estado_id' => $estadoId,
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error obteniendo transiciones',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/mapeos/{categoriaOrigen}/{codigoOrigen}/{categoriaDestino}
     *
     * Obtener el mapeo de un estado a otra categoría
     *
     * @param string $categoriaOrigen Categoría del estado origen
     * @param string $codigoOrigen Código del estado origen
     * @param string $categoriaDestino Categoría del estado destino
     * @return JsonResponse
     */
    public function obtenerMapeo(
        string $categoriaOrigen,
        string $codigoOrigen,
        string $categoriaDestino
    ): JsonResponse {
        try {
            $estadoMapeado = $this->estadoService->mapearEstado(
                $categoriaOrigen,
                $codigoOrigen,
                $categoriaDestino
            );

            if (!$estadoMapeado) {
                return response()->json([
                    'error' => 'No existe mapeo para este estado',
                    'origen' => [
                        'categoria' => $categoriaOrigen,
                        'codigo' => $codigoOrigen,
                    ],
                    'destino_requerido' => [
                        'categoria' => $categoriaDestino,
                    ],
                ], 404);
            }

            return response()->json([
                'data' => [
                    'origen' => [
                        'categoria' => $categoriaOrigen,
                        'codigo' => $codigoOrigen,
                    ],
                    'destino' => [
                        'id' => $estadoMapeado->id,
                        'codigo' => $estadoMapeado->codigo,
                        'categoria' => $estadoMapeado->categoria,
                        'nombre' => $estadoMapeado->nombre,
                        'color' => $estadoMapeado->color,
                        'icono' => $estadoMapeado->icono,
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error obteniendo mapeo',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/categorias
     *
     * Obtener todas las categorías de estados disponibles
     *
     * @return JsonResponse
     */
    public function categorias(): JsonResponse
    {
        try {
            $categorias = $this->estadoService->obtenerCategorias();

            $detalles = array_map(function ($categoria) {
                $estados = $this->estadoService->obtenerEstadosPorCategoria($categoria);

                return [
                    'codigo' => $categoria,
                    'total_estados' => $estados->count(),
                    'estados_finales' => $estados->filter(fn($e) => $e->es_estado_final)->count(),
                ];
            }, $categorias);

            return response()->json([
                'data' => $detalles,
                'meta' => [
                    'total' => count($categorias),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error obteniendo categorías',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/estadisticas/{categoria}
     *
     * Obtener estadísticas de una categoría
     *
     * @param string $categoria Categoría
     * @return JsonResponse
     */
    public function estadisticas(string $categoria): JsonResponse
    {
        try {
            $stats = $this->estadoService->obtenerEstadisticas('*', $categoria);

            return response()->json([
                'data' => $stats,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error obteniendo estadísticas',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/estados/buscar
     *
     * Buscar estados por término (fuzzy search)
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function buscar(Request $request): JsonResponse
    {
        try {
            $termino = $request->query('q', '');
            $categoria = $request->query('categoria');

            if (strlen($termino) < 2) {
                return response()->json([
                    'error' => 'El término debe tener al menos 2 caracteres',
                ], 400);
            }

            $resultados = $this->estadoService->buscar($termino, $categoria);

            return response()->json([
                'data' => $resultados->map(fn($e) => [
                    'id' => $e->id,
                    'codigo' => $e->codigo,
                    'categoria' => $e->categoria,
                    'nombre' => $e->nombre,
                    'descripcion' => $e->descripcion,
                ]),
                'meta' => [
                    'query' => $termino,
                    'categoria_filtro' => $categoria,
                    'total' => $resultados->count(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error en búsqueda',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
