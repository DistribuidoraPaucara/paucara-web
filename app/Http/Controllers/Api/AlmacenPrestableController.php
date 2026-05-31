<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AlmacenPrestable;
use App\Models\Prestable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AlmacenPrestableController extends Controller
{
    /**
     * GET /api/almacenes-prestables/index-json
     * Listar almacenes de prestables con búsqueda y paginación
     */
    public function indexApi(Request $request): JsonResponse
    {
        try {
            $query = AlmacenPrestable::query()
                ->orderBy('nombre', 'asc');

            // Filtro de búsqueda general (q)
            if ($request->filled('q')) {
                $searchTerm = $request->string('q');
                $query->where('nombre', 'ilike', "%{$searchTerm}%");
            }

            // Filtro por es_proveedor
            if ($request->filled('es_proveedor')) {
                $esProveedor = filter_var($request->input('es_proveedor'), FILTER_VALIDATE_BOOLEAN);
                $query->where('es_proveedor', $esProveedor);
            }

            // Paginación
            $perPage = $request->integer('per_page', 20);
            $almacenes = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $almacenes->items(),
                'pagination' => [
                    'current_page' => $almacenes->currentPage(),
                    'per_page' => $almacenes->perPage(),
                    'total' => $almacenes->total(),
                    'last_page' => $almacenes->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error en almacenes-prestables indexApi', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/almacenes-prestables/{almacenId}/prestables
     * Listar prestables disponibles en un almacén específico con stock
     */
    public function prestablesPorAlmacen(Request $request, AlmacenPrestable $almacen): JsonResponse
    {
        try {
            // Buscar prestables que tengan stock en este almacén
            $query = Prestable::query()
                ->whereHas('stocks', function ($q) use ($almacen) {
                    $q->where('almacenes_prestables_id', $almacen->id);
                })
                ->with(['stocks' => function ($q) use ($almacen) {
                    $q->where('almacenes_prestables_id', $almacen->id)
                        ->select('prestable_id', 'almacenes_prestables_id', 'cantidad_disponible');
                }, 'ultimoDetalleCompra'])
                ->orderBy('nombre', 'asc');

            // Filtro de búsqueda
            if ($request->filled('q')) {
                $searchTerm = $request->string('q');
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('nombre', 'ilike', "%{$searchTerm}%")
                        ->orWhere('codigo', 'ilike', "%{$searchTerm}%");
                });
            }

            // Paginación
            $perPage = $request->integer('per_page', 20);
            $prestables = $query->paginate($perPage);

            // Enriquecer respuesta con información de stock
            $data = $prestables->items();
            $dataEnriquecida = array_map(function ($prestable) {
                $stock = $prestable->stocks()->first();
                return [
                    'id' => $prestable->id,
                    'nombre' => $prestable->nombre,
                    'codigo' => $prestable->codigo,
                    'tipo' => $prestable->tipo ?? null,
                    'capacidad' => $prestable->capacidad ?? null,
                    'precio_compra_referencial' => $prestable->ultimoDetalleCompra?->precio_unitario ?? 0,
                    'stock_disponible' => $stock?->cantidad_disponible ?? 0,
                ];
            }, $data);

            return response()->json([
                'success' => true,
                'data' => $dataEnriquecida,
                'pagination' => [
                    'current_page' => $prestables->currentPage(),
                    'per_page' => $prestables->perPage(),
                    'total' => $prestables->total(),
                    'last_page' => $prestables->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error obteniendo prestables por almacén', [
                'almacen_id' => $almacen->id,
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
