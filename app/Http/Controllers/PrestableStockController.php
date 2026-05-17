<?php

namespace App\Http\Controllers;

use App\Models\Prestable;
use App\Models\PrestableStock;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PrestableStockController extends Controller
{
    /**
     * GET /api/prestables/{prestable}/stock/detalle
     * Obtener detalle de stock de un prestable
     */
    public function show(Prestable $prestable): JsonResponse
    {
        try {
            $stocks = $prestable->stocks()
                ->with('almacenPrestable:id,nombre')
                ->get()
                ->map(function ($stock) use ($prestable) {
                    return [
                        'id' => $stock->id,
                        'almacenes_prestables_id' => $stock->almacenes_prestables_id,
                        'almacenPrestable' => $stock->almacenPrestable,
                        'cantidad_disponible' => $stock->cantidad_disponible,
                        'cantidad_en_prestamo_cliente' => $stock->cantidad_en_prestamo_cliente,
                        'cantidad_que_debo_devolver' => $stock->cantidad_que_debo_devolver,
                        'cantidad_vendida' => $stock->cantidad_vendida,
                        // Calcular totales considerando capacidad
                        'total_unidades' => $this->calcularUnidades($stock->cantidad_disponible, $prestable->capacidad),
                        'total_en_prestamo_cliente' => $this->calcularUnidades($stock->cantidad_en_prestamo_cliente, $prestable->capacidad),
                        'total_en_prestamo_proveedor' => $this->calcularUnidades($stock->cantidad_que_debo_devolver, $prestable->capacidad),
                        'total_vendida' => $this->calcularUnidades($stock->cantidad_vendida, $prestable->capacidad),
                        'total_general' => $this->calcularUnidades(
                            $stock->cantidad_disponible + $stock->cantidad_en_prestamo_cliente +
                            $stock->cantidad_que_debo_devolver + $stock->cantidad_vendida,
                            $prestable->capacidad
                        ),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'prestable' => $prestable->load('producto:id,nombre,sku'),
                    'capacidad' => $prestable->capacidad,
                    'stocks' => $stocks,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error obteniendo stock del prestable', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error obteniendo stock'], 500);
        }
    }

    /**
     * PUT /api/prestables-stock/{prestableStock}
     * Actualizar cantidad de stock
     */
    public function update(Request $request, PrestableStock $prestableStock): JsonResponse
    {
        Log::info('🔄 UPDATE PRESTABLE STOCK', $request->all());

        try {
            $validated = $request->validate([
                'cantidad_disponible' => 'nullable|integer|min:0',
                'cantidad_en_prestamo_cliente' => 'nullable|integer|min:0',
                'cantidad_que_debo_devolver' => 'nullable|integer|min:0',
                'cantidad_vendida' => 'nullable|integer|min:0',
            ]);

            $prestableStock->update($validated);

            Log::info('✅ Stock actualizado', ['prestable_stock_id' => $prestableStock->id]);

            return response()->json([
                'success' => true,
                'data' => $prestableStock,
                'message' => 'Stock actualizado exitosamente',
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error actualizando stock', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * POST /api/prestables/{prestable}/stock/agregar-almacen
     * Agregar stock para un almacén nuevo
     */
    public function agregarAlmacen(Request $request, Prestable $prestable): JsonResponse
    {
        try {
            $validated = $request->validate([
                'almacenes_prestables_id' => 'required|exists:almacenes_prestables,id|unique:prestable_stock,almacenes_prestables_id,NULL,id,prestable_id,' . $prestable->id,
                'cantidad_disponible' => 'nullable|integer|min:0',
                'cantidad_en_prestamo_cliente' => 'nullable|integer|min:0',
                'cantidad_que_debo_devolver' => 'nullable|integer|min:0',
                'cantidad_vendida' => 'nullable|integer|min:0',
            ]);

            $stock = $prestable->stocks()->create([
                'almacenes_prestables_id' => $validated['almacenes_prestables_id'],
                'cantidad_disponible' => $validated['cantidad_disponible'] ?? 0,
                'cantidad_en_prestamo_cliente' => $validated['cantidad_en_prestamo_cliente'] ?? 0,
                'cantidad_que_debo_devolver' => $validated['cantidad_que_debo_devolver'] ?? 0,
                'cantidad_vendida' => $validated['cantidad_vendida'] ?? 0,
            ]);

            Log::info('✅ Stock creado para nuevo almacén', ['prestable_stock_id' => $stock->id]);

            return response()->json([
                'success' => true,
                'data' => $stock,
                'message' => 'Stock creado exitosamente',
            ], 201);
        } catch (\Exception $e) {
            Log::error('❌ Error creando stock', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * DELETE /api/prestables-stock/{prestableStock}
     * Eliminar registro de stock de un almacén
     */
    public function destroy(PrestableStock $prestableStock): JsonResponse
    {
        try {
            $prestableStock->delete();

            Log::info('✅ Stock eliminado', ['prestable_stock_id' => $prestableStock->id]);

            return response()->json([
                'success' => true,
                'message' => 'Stock eliminado exitosamente',
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error eliminando stock', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Calcular unidades considerando capacidad del prestable
     */
    private function calcularUnidades(?int $cantidad, ?int $capacidad): int
    {
        if (!$cantidad || !$capacidad) {
            return $cantidad ?? 0;
        }
        return $cantidad * $capacidad;
    }
}
