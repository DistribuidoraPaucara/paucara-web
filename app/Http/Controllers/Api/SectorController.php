<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Almacen;
use App\Models\Sector;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class SectorController extends Controller
{
    /**
     * Listar todos los sectores de un almacén
     *
     * GET /api/almacenes/{almacenId}/sectores
     * GET /api/sectores?almacen_id=2
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $almacenId = $request->query('almacen_id');

            if (!$almacenId) {
                return response()->json([
                    'success' => false,
                    'message' => 'El parámetro almacen_id es requerido',
                ], 400);
            }

            // Verificar que el almacén exista
            $almacen = Almacen::find($almacenId);
            if (!$almacen) {
                return response()->json([
                    'success' => false,
                    'message' => 'Almacén no encontrado',
                ], 404);
            }

            $sectores = Sector::where('almacen_id', $almacenId)
                ->orderBy('es_generico', 'desc') // Genéricos primero
                ->orderBy('nombre', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $sectores,
                'count' => $sectores->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error en SectorController@index', [
                'error' => $e->getMessage(),
                'almacen_id' => $request->query('almacen_id'),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al listar sectores: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener un sector específico
     *
     * GET /api/sectores/{id}
     *
     * @param Sector $sector
     * @return JsonResponse
     */
    public function show(Sector $sector): JsonResponse
    {
        try {
            // Cargar relaciones
            $sector->load('almacen:id,nombre', 'stockProductos:id,producto_id,cantidad,cantidad_disponible');

            return response()->json([
                'success' => true,
                'data' => $sector,
            ]);
        } catch (\Exception $e) {
            Log::error('Error en SectorController@show', [
                'error' => $e->getMessage(),
                'sector_id' => $sector->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener sector: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Crear un nuevo sector
     *
     * POST /api/sectores
     * {
     *   "almacen_id": 2,
     *   "nombre": "Bebidas",
     *   "descripcion": "Sección de bebidas y refrescos"
     * }
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validar datos
            $validated = $request->validate([
                'almacen_id' => 'required|integer|exists:almacenes,id',
                'nombre' => [
                    'required',
                    'string',
                    'max:100',
                    Rule::unique('sectores')->where(function ($query) use ($request) {
                        return $query->where('almacen_id', $request->input('almacen_id'));
                    }),
                ],
                'descripcion' => 'nullable|string|max:500',
                'stock_minimo' => 'sometimes|integer|min:0',
                'stock_maximo' => 'sometimes|integer|min:0|gte:stock_minimo',
            ], [
                'almacen_id.required' => 'El almacén es requerido',
                'almacen_id.exists' => 'El almacén no existe',
                'nombre.required' => 'El nombre del sector es requerido',
                'nombre.unique' => 'Ya existe un sector con ese nombre en este almacén',
                'stock_minimo.min' => 'El stock mínimo no puede ser negativo',
                'stock_maximo.min' => 'El stock máximo no puede ser negativo',
                'stock_maximo.gte' => 'El stock máximo debe ser mayor o igual al mínimo',
            ]);

            // Crear sector (es_generico siempre false para creaciones manuales)
            $sector = Sector::create([
                'almacen_id' => $validated['almacen_id'],
                'nombre' => $validated['nombre'],
                'descripcion' => $validated['descripcion'] ?? null,
                'es_generico' => false,
            ]);

            Log::info('Sector creado exitosamente', [
                'sector_id' => $sector->id,
                'almacen_id' => $sector->almacen_id,
                'nombre' => $sector->nombre,
                'user_id' => auth()->id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Sector creado correctamente',
                'data' => $sector,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error en SectorController@store', [
                'error' => $e->getMessage(),
                'input' => $request->all(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al crear sector: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualizar un sector
     *
     * PUT /api/sectores/{id}
     * {
     *   "nombre": "Bebidas Premium",
     *   "descripcion": "Bebidas y refrescos de marca premium"
     * }
     *
     * ⚠️ NO se puede cambiar almacen_id ni es_generico
     *
     * @param Request $request
     * @param Sector $sector
     * @return JsonResponse
     */
    public function update(Request $request, Sector $sector): JsonResponse
    {
        try {
            // Proteger sector genérico de cambios críticos
            if ($sector->es_generico && $request->has('nombre') && $request->input('nombre') !== 'General') {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede cambiar el nombre del sector genérico',
                ], 403);
            }

            // Validar datos
            $validated = $request->validate([
                'nombre' => [
                    'nullable',
                    'string',
                    'max:100',
                    Rule::unique('sectores')
                        ->where(function ($query) use ($sector) {
                            return $query->where('almacen_id', $sector->almacen_id);
                        })
                        ->ignore($sector->id),
                ],
                'descripcion' => 'nullable|string|max:500',
                'stock_minimo' => 'sometimes|integer|min:0',
                'stock_maximo' => 'sometimes|integer|min:0|gte:stock_minimo',
            ], [
                'nombre.unique' => 'Ya existe un sector con ese nombre en este almacén',
                'stock_minimo.min' => 'El stock mínimo no puede ser negativo',
                'stock_maximo.min' => 'El stock máximo no puede ser negativo',
                'stock_maximo.gte' => 'El stock máximo debe ser mayor o igual al mínimo',
            ]);

            // Actualizar solo campos permitidos
            if ($request->has('nombre') && $request->input('nombre')) {
                $sector->nombre = $validated['nombre'];
            }

            if ($request->has('descripcion')) {
                $sector->descripcion = $validated['descripcion'];
            }

            $sector->save();

            Log::info('Sector actualizado', [
                'sector_id' => $sector->id,
                'cambios' => $validated,
                'user_id' => auth()->id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Sector actualizado correctamente',
                'data' => $sector,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error en SectorController@update', [
                'error' => $e->getMessage(),
                'sector_id' => $sector->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar sector: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar un sector
     *
     * DELETE /api/sectores/{id}
     *
     * ⚠️ NO se puede eliminar un sector genérico (es_generico=true)
     * ⚠️ NO se puede eliminar un sector que tenga stocks asociados
     *
     * @param Sector $sector
     * @return JsonResponse
     */
    public function destroy(Sector $sector): JsonResponse
    {
        try {
            // Proteger sector genérico
            if ($sector->es_generico) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar el sector genérico automático del almacén',
                ], 403);
            }

            // Verificar que no tenga stocks asociados
            $stockCount = $sector->stockProductos()->count();
            if ($stockCount > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "No se puede eliminar el sector porque tiene {$stockCount} productos en stock",
                    'productos_en_stock' => $stockCount,
                ], 409);
            }

            // Guardar info antes de eliminar
            $sectorInfo = [
                'id' => $sector->id,
                'nombre' => $sector->nombre,
                'almacen_id' => $sector->almacen_id,
            ];

            $sector->delete();

            Log::info('Sector eliminado', [
                'sector_info' => $sectorInfo,
                'user_id' => auth()->id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Sector eliminado correctamente',
                'data' => $sectorInfo,
            ]);
        } catch (\Exception $e) {
            Log::error('Error en SectorController@destroy', [
                'error' => $e->getMessage(),
                'sector_id' => $sector->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar sector: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener el sector genérico de un almacén
     *
     * GET /api/almacenes/{almacenId}/sector-generico
     *
     * @param int $almacenId
     * @return JsonResponse
     */
    public function obtenerGenerico(int $almacenId): JsonResponse
    {
        try {
            $almacen = Almacen::find($almacenId);
            if (!$almacen) {
                return response()->json([
                    'success' => false,
                    'message' => 'Almacén no encontrado',
                ], 404);
            }

            $sectorGenerico = $almacen->sectorGenerico();

            if (!$sectorGenerico) {
                return response()->json([
                    'success' => false,
                    'message' => 'El almacén no tiene sector genérico (esto no debería ocurrir)',
                ], 500);
            }

            return response()->json([
                'success' => true,
                'data' => $sectorGenerico,
            ]);
        } catch (\Exception $e) {
            Log::error('Error en SectorController@obtenerGenerico', [
                'error' => $e->getMessage(),
                'almacen_id' => $almacenId,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener sector genérico: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener sectores de un almacén (para formularios/selects)
     *
     * GET /api/almacenes/{almacenId}/sectores
     *
     * @param int $almacenId
     * @return JsonResponse
     */
    public function obtenerSectoresPorAlmacen(int $almacenId): JsonResponse
    {
        try {
            // Verificar que el almacén exista
            $almacen = Almacen::find($almacenId);
            if (!$almacen) {
                return response()->json([
                    'success' => false,
                    'message' => 'Almacén no encontrado',
                ], 404);
            }

            // Obtener todos los sectores del almacén, ordenados
            $sectores = Sector::where('almacen_id', $almacenId)
                ->orderBy('es_generico', 'desc') // Genéricos primero
                ->orderBy('nombre', 'asc')
                ->select('id', 'nombre', 'es_generico', 'descripcion')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $sectores,
                'count' => $sectores->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error en SectorController@obtenerSectoresPorAlmacen', [
                'error' => $e->getMessage(),
                'almacen_id' => $almacenId,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener sectores: ' . $e->getMessage(),
            ], 500);
        }
    }
}
