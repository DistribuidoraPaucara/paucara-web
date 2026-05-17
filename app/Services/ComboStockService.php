<?php

namespace App\Services;

use App\Models\ComboItem;
use App\Models\Producto;
use App\Models\StockProducto;

class ComboStockService
{
    /**
     * Calcula cuántos combos se pueden hacer basado en el stock disponible de productos obligatorios.
     * Los productos opcionales NO se consideran en el cálculo.
     *
     * @param int $comboId - ID del combo (producto)
     * @param int|null $almacenId - ID del almacén (opcional, si es null usa todos)
     * @param int|null $sectorId - ID del sector (opcional, si es null usa todo el almacén)
     * @return int - Cantidad máxima de combos que se pueden hacer
     */
    public static function calcularCapacidadCombos(int $comboId, ?int $almacenId = null, ?int $sectorId = null): int
    {
        // Obtener el combo
        $combo = Producto::findOrFail($comboId);

        // Obtener solo los items obligatorios del combo
        $itemsObligatorios = ComboItem::where('combo_id', $comboId)
            ->where('es_obligatorio', true)
            ->where('cantidad', '>', 0)
            ->get();

        // Si no hay items obligatorios, retornar 0
        if ($itemsObligatorios->isEmpty()) {
            return 0;
        }

        $cantidadesDisponibles = [];

        // Para cada producto obligatorio, calcular cuántos combos se pueden hacer
        foreach ($itemsObligatorios as $item) {
            // Obtener el stock disponible del producto
            $stockQuery = StockProducto::where('producto_id', $item->producto_id);

            // Filtrar por almacén si se especifica
            if ($almacenId) {
                $stockQuery->where('almacen_id', $almacenId);
            }

            // Filtrar por sector si se especifica
            if ($sectorId) {
                $stockQuery->where('sector_id', $sectorId);
            }

            $stockDisponible = $stockQuery->sum('cantidad_disponible') ?? 0;

            // Calcular cuántos combos se pueden hacer con este producto
            // cantidad_combos = stock_disponible / cantidad_requerida_en_combo
            $combosDisponibles = $stockDisponible > 0
                ? (int) floor($stockDisponible / $item->cantidad)
                : 0;

            $cantidadesDisponibles[] = $combosDisponibles;
        }

        // Retornar el mínimo (el cuello de botella)
        return !empty($cantidadesDisponibles) ? min($cantidadesDisponibles) : 0;
    }

    /**
     * Calcula la capacidad de combos con detalles por producto (obligatorios y opcionales).
     * La capacidad total se calcula SOLO con obligatorios.
     * Los opcionales se muestran como referencia sin afectar el cálculo.
     *
     * @param int $comboId - ID del combo
     * @param int|null $almacenId - ID del almacén (opcional)
     * @param int|null $sectorId - ID del sector (opcional)
     * @return array - [
     *     'capacidad_total' => int,
     *     'detalles' => [
     *         [
     *             'producto_id' => int,
     *             'producto_nombre' => string,
     *             'cantidad_requerida' => float,
     *             'stock_disponible' => int,
     *             'combos_posibles' => int,
     *             'es_obligatorio' => bool,
     *             'es_cuello_botella' => bool
     *         ]
     *     ]
     * ]
     */
    public static function calcularCapacidadConDetalles(int $comboId, ?int $almacenId = null, ?int $sectorId = null): array
    {
        // Obtener el combo
        $combo = Producto::findOrFail($comboId);

        // Obtener todos los items (obligatorios y opcionales)
        $todosItems = ComboItem::where('combo_id', $comboId)
            ->where('cantidad', '>', 0)
            ->get();

        if ($todosItems->isEmpty()) {
            return [
                'capacidad_total' => 0,
                'detalles' => [],
            ];
        }

        // Separar obligatorios y opcionales
        $itemsObligatorios = $todosItems->filter(fn($item) => $item->es_obligatorio);
        $itemsOpcionales = $todosItems->filter(fn($item) => !$item->es_obligatorio);

        $detalles = [];
        $capacidades = [];

        // Procesar obligatorios (que afectan la capacidad total)
        foreach ($itemsObligatorios as $item) {
            $producto = $item->producto;

            // Obtener stock disponible
            $stockQuery = StockProducto::where('producto_id', $item->producto_id);

            if ($almacenId) {
                $stockQuery->where('almacen_id', $almacenId);
            }

            if ($sectorId) {
                $stockQuery->where('sector_id', $sectorId);
            }

            $stockDisponible = $stockQuery->sum('cantidad_disponible') ?? 0;

            // Calcular combos posibles
            $combosPosibles = $stockDisponible > 0
                ? (int) floor($stockDisponible / $item->cantidad)
                : 0;

            $capacidades[] = $combosPosibles;

            $detalles[] = [
                'producto_id' => $producto->id,
                'producto_nombre' => $producto->nombre,
                'cantidad_requerida' => (float) $item->cantidad,
                'stock_disponible' => (int) $stockDisponible,
                'combos_posibles' => $combosPosibles,
                'es_obligatorio' => true,
                'es_cuello_botella' => false, // Se asignará después
            ];
        }

        // Calcular capacidad total SOLO con obligatorios
        $capacidadTotal = !empty($capacidades) ? min($capacidades) : 0;

        // Marcar cuál es el cuello de botella (solo entre obligatorios)
        if ($capacidadTotal > 0 && !empty($detalles)) {
            foreach ($detalles as &$detalle) {
                if ($detalle['es_obligatorio'] && $detalle['combos_posibles'] === $capacidadTotal) {
                    $detalle['es_cuello_botella'] = true;
                }
            }
        }

        // Procesar opcionales (solo como referencia, sin afectar capacidad)
        foreach ($itemsOpcionales as $item) {
            $producto = $item->producto;

            // Obtener stock disponible
            $stockQuery = StockProducto::where('producto_id', $item->producto_id);

            if ($almacenId) {
                $stockQuery->where('almacen_id', $almacenId);
            }

            if ($sectorId) {
                $stockQuery->where('sector_id', $sectorId);
            }

            $stockDisponible = $stockQuery->sum('cantidad_disponible') ?? 0;

            // Calcular cuántos combos se podrían hacer (solo referencia)
            $combosPosibles = $stockDisponible > 0
                ? (int) floor($stockDisponible / $item->cantidad)
                : 0;

            $detalles[] = [
                'producto_id' => $producto->id,
                'producto_nombre' => $producto->nombre,
                'cantidad_requerida' => (float) $item->cantidad,
                'stock_disponible' => (int) $stockDisponible,
                'combos_posibles' => $combosPosibles,
                'es_obligatorio' => false,
                'es_cuello_botella' => false, // Los opcionales nunca son cuello de botella
            ];
        }

        return [
            'capacidad_total' => $capacidadTotal,
            'detalles' => $detalles,
        ];
    }

    /**
     * ✅ NUEVO (2026-02-20): Obtener stock y capacidad de combo
     * Método compatibilidad para ApiProformaController
     *
     * @param int $comboId - ID del combo
     * @param int|null $almacenId - ID del almacén
     * @param int|null $sectorId - ID del sector (opcional)
     * @return array - ['capacidad' => int, 'cuello_botella' => array, 'componentes' => array]
     */
    public static function obtenerStockProducto(int $comboId, ?int $almacenId = null, ?int $sectorId = null): array
    {
        $detalles = self::calcularCapacidadConDetalles($comboId, $almacenId, $sectorId);

        // Encontrar cuello de botella
        $cuelloBotella = null;
        foreach ($detalles['detalles'] as $detalle) {
            if ($detalle['es_cuello_botella'] && $detalle['es_obligatorio']) {
                $cuelloBotella = [
                    'producto_id' => $detalle['producto_id'],
                    'producto_nombre' => $detalle['producto_nombre'],
                    'stock_disponible' => $detalle['stock_disponible'],
                    'combos_posibles' => $detalle['combos_posibles'],
                ];
                break;
            }
        }

        return [
            'capacidad' => $detalles['capacidad_total'],
            'cuello_botella' => $cuelloBotella,
            'componentes' => $detalles['detalles'],
        ];
    }
}
