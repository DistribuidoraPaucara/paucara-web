<?php

namespace App\Services;

use App\Models\Producto;
use Illuminate\Support\Facades\Log;

class ComboResponseService
{
    /**
     * ✅ NUEVO: Construir array de combo_items con stock actualizado
     * Centraliza la lógica de construcción de combo_items para usarse en múltiples endpoints
     *
     * @param Producto $producto - El producto combo
     * @param int $almacenId - ID del almacén para filtrar stock
     * @return array Array de combo_items con stock, capacidad, etc.
     */
    public static function construirComboItems(Producto $producto, int $almacenId): array
    {
        // Si no es combo o no tiene items, retornar array vacío
        if (!$producto->es_combo || !$producto->comboItems || $producto->comboItems->count() === 0) {
            return [];
        }

        try {
            // ✅ Obtener información de capacidad del combo
            $capacidadInfo = ComboStockService::calcularCapacidadConDetalles($producto->id, $almacenId);

            $comboItems = $producto->comboItems
                ->map(function ($item) use ($capacidadInfo, $almacenId, $producto) {
                    // ✅ MEJORADO: Sumar stock de TODOS los lotes del almacén (no solo el primero)
                    // Puede haber múltiples registros por lote/fecha_vencimiento
                    $stockParaAlmacen = $item->producto?->stock
                        ? collect($item->producto->stock)->where('almacen_id', $almacenId)
                        : collect();

                    $stockDisponible = (int) $stockParaAlmacen->sum('cantidad_disponible');
                    $stockTotal = (int) $stockParaAlmacen->sum('cantidad');

                    // ✅ DEBUG: Log detallado del stock de cada item
                    Log::debug('📦 [ComboResponseService::construirComboItems] Stock de item del combo', [
                        'combo_id' => $producto->id,
                        'item_id' => $item->id,
                        'producto_id' => $item->producto_id,
                        'producto_nombre' => $item->producto?->nombre,
                        'almacen_id' => $almacenId,
                        'stock_records_para_almacen' => $stockParaAlmacen->count(),
                        'stock_disponible_calculado' => $stockDisponible,
                        'stock_total_calculado' => $stockTotal,
                    ]);

                    // Obtener información del detalle de capacidad (incluye cuello de botella)
                    $detalle = collect($capacidadInfo['detalles'] ?? [])
                        ->firstWhere('producto_id', $item->producto_id);

                    return [
                        'id' => $item->id,
                        'combo_id' => $item->combo_id,
                        'producto_id' => $item->producto_id,
                        'producto_nombre' => $item->producto?->nombre ?? '',
                        'producto_sku' => $item->producto?->sku ?? '',
                        'producto_codigo_barras' => $item->producto?->codigo_barras ?? '',
                        'cantidad' => (float) $item->cantidad,
                        'precio_unitario' => (float) $item->precio_unitario,
                        'tipo_precio_id' => $item->tipo_precio_id,
                        'tipo_precio_nombre' => $item->tipoPrecio?->nombre ?? '',
                        'unidad_medida_id' => $item->producto?->unidad_medida_id,
                        'unidad_medida_nombre' => $item->producto?->unidad?->nombre ?? null,
                        'stock_disponible' => (int) $stockDisponible,
                        'stock_total' => (int) $stockTotal,
                        'es_obligatorio' => (bool) $item->es_obligatorio,
                        'es_cuello_botella' => $detalle['es_cuello_botella'] ?? false,
                        'combos_posibles' => $detalle['combos_posibles'] ?? 0,
                    ];
                })
                ->values()
                ->all();

            // ✅ DEBUG: Log detallado del combo
            Log::info('📦 [ComboResponseService::construirComboItems] Combo cargado', [
                'combo_id' => $producto->id,
                'combo_nombre' => $producto->nombre,
                'cantidad_items' => count($comboItems),
                'items_detalle' => $comboItems
            ]);

            return $comboItems;

        } catch (\Exception $e) {
            Log::error('❌ [ComboResponseService::construirComboItems] Error al construir combo_items', [
                'combo_id' => $producto->id,
                'almacen_id' => $almacenId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [];
        }
    }
}
