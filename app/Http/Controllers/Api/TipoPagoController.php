<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TipoPago;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class TipoPagoController extends Controller
{
    /**
     * Listar todos los tipos de pago
     *
     * GET /api/tipos-pago
     * GET /api/tipos-pago?activo=true
     * GET /api/tipos-pago?q=efectivo
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = TipoPago::query();

            // Filtrar por estado activo si se especifica
            if ($request->has('activo')) {
                $query->where('activo', filter_var($request->query('activo'), FILTER_VALIDATE_BOOLEAN));
            }

            // Búsqueda en nombre y código
            if ($request->has('q')) {
                $q = strtolower($request->query('q'));
                $query->where(function ($sub) use ($q) {
                    $sub->whereRaw('LOWER(nombre) like ?', ["%$q%"])
                        ->orWhereRaw('LOWER(codigo) like ?', ["%$q%"]);
                });
            }

            $tiposPago = $query
                ->orderBy('activo', 'desc')
                ->orderBy('nombre', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $tiposPago,
                'count' => $tiposPago->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error en TipoPagoController@index', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al listar tipos de pago: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener un tipo de pago específico
     *
     * GET /api/tipos-pago/{id}
     *
     * @param TipoPago $tipoPago
     * @return JsonResponse
     */
    public function show(TipoPago $tipoPago): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $tipoPago,
            ]);
        } catch (\Exception $e) {
            Log::error('Error en TipoPagoController@show', [
                'error' => $e->getMessage(),
                'tipo_pago_id' => $tipoPago->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener tipo de pago: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Crear un nuevo tipo de pago
     *
     * POST /api/tipos-pago
     * {
     *   "codigo": "EFECTIVO",
     *   "nombre": "Pago en Efectivo",
     *   "activo": true,
     *   "es_credito": false
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
                'codigo' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('tipos_pago', 'codigo'),
                ],
                'nombre' => ['required', 'string', 'max:255'],
                'activo' => ['sometimes', 'boolean'],
                'es_credito' => ['sometimes', 'boolean'],
            ], [
                'codigo.required' => 'El código es requerido',
                'codigo.unique' => 'Ya existe un tipo de pago con ese código',
                'nombre.required' => 'El nombre es requerido',
            ]);

            // Crear tipo de pago
            $tipoPago = TipoPago::create([
                'codigo' => $validated['codigo'],
                'nombre' => $validated['nombre'],
                'activo' => $validated['activo'] ?? true,
                'es_credito' => $validated['es_credito'] ?? false,
            ]);

            Log::info('Tipo de pago creado exitosamente', [
                'tipo_pago_id' => $tipoPago->id,
                'codigo' => $tipoPago->codigo,
                'user_id' => auth()->id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Tipo de pago creado correctamente',
                'data' => $tipoPago,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error en TipoPagoController@store', [
                'error' => $e->getMessage(),
                'input' => $request->all(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al crear tipo de pago: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualizar un tipo de pago
     *
     * PUT /api/tipos-pago/{id}
     * {
     *   "nombre": "Pago en Efectivo Actualizado",
     *   "activo": true,
     *   "es_credito": false
     * }
     *
     * @param Request $request
     * @param TipoPago $tipoPago
     * @return JsonResponse
     */
    public function update(Request $request, TipoPago $tipoPago): JsonResponse
    {
        try {
            // Validar datos
            $validated = $request->validate([
                'codigo' => [
                    'sometimes',
                    'string',
                    'max:255',
                    Rule::unique('tipos_pago', 'codigo')->ignore($tipoPago->id),
                ],
                'nombre' => ['sometimes', 'string', 'max:255'],
                'activo' => ['sometimes', 'boolean'],
                'es_credito' => ['sometimes', 'boolean'],
            ], [
                'codigo.unique' => 'Ya existe un tipo de pago con ese código',
            ]);

            // Actualizar solo los campos proporcionados
            $tipoPago->update($validated);

            Log::info('Tipo de pago actualizado', [
                'tipo_pago_id' => $tipoPago->id,
                'cambios' => $validated,
                'user_id' => auth()->id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Tipo de pago actualizado correctamente',
                'data' => $tipoPago,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error en TipoPagoController@update', [
                'error' => $e->getMessage(),
                'tipo_pago_id' => $tipoPago->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar tipo de pago: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar un tipo de pago
     *
     * DELETE /api/tipos-pago/{id}
     *
     * ⚠️ NO se puede eliminar un tipo de pago que tenga pagos asociados
     *
     * @param TipoPago $tipoPago
     * @return JsonResponse
     */
    public function destroy(TipoPago $tipoPago): JsonResponse
    {
        try {
            // Verificar que no tenga pagos o compras asociadas
            $pagoCount = $tipoPago->pagos()->count();
            $compraCount = $tipoPago->compras()->count();

            if ($pagoCount > 0 || $compraCount > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar el tipo de pago porque tiene registros asociados',
                    'pagos_asociados' => $pagoCount,
                    'compras_asociadas' => $compraCount,
                ], 409);
            }

            // Guardar info antes de eliminar
            $tipoPagoInfo = [
                'id' => $tipoPago->id,
                'codigo' => $tipoPago->codigo,
                'nombre' => $tipoPago->nombre,
            ];

            $tipoPago->delete();

            Log::info('Tipo de pago eliminado', [
                'tipo_pago_info' => $tipoPagoInfo,
                'user_id' => auth()->id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Tipo de pago eliminado correctamente',
                'data' => $tipoPagoInfo,
            ]);
        } catch (\Exception $e) {
            Log::error('Error en TipoPagoController@destroy', [
                'error' => $e->getMessage(),
                'tipo_pago_id' => $tipoPago->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar tipo de pago: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener tipos de pago activos (para formularios/selects)
     *
     * GET /api/tipos-pago/activos/listar
     *
     * @return JsonResponse
     */
    public function activos(): JsonResponse
    {
        try {
            $tiposPago = TipoPago::where('activo', true)
                ->orderBy('nombre', 'asc')
                ->select('id', 'codigo', 'nombre', 'es_credito')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $tiposPago,
                'count' => $tiposPago->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error en TipoPagoController@activos', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener tipos de pago activos: ' . $e->getMessage(),
            ], 500);
        }
    }
}
