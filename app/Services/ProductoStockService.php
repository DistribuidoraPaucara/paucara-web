<?php

namespace App\Services;

use App\Models\Producto;
use App\Models\StockProducto;
use Illuminate\Support\Collection;

/**
 * ProductoStockService - Servicio para obtener información de stock disponible de productos
 *
 * RESPONSABILIDADES:
 * ✓ Obtener stock disponible de un producto
 * ✓ Obtener stock de múltiples productos
 * ✓ Filtrar por almacén
 * ✓ Diferenciar entre productos normales, combos y fraccionados
 *
 * USO:
 * - ProductosTable.tsx (mostrar stock en tabla)
 * - Búsqueda de productos en ventas/compras
 * - Endpoints API para consultar disponibilidad
 */
class ProductoStockService
{
    /**
     * Obtener stock disponible de un producto específico
     *
     * @param int $productoId - ID del producto
     * @param int|null $almacenId - ID del almacén (si es null, suma todos)
     * @param int|null $sectorId - ID del sector (opcional, si es null suma todo el almacén)
     * @return array Con estructura: {
     *     producto_id: int,
     *     stock_disponible: int,
     *     stock_total: int,
     *     stock_reservado: int,
     *     capacidad: int|null  // Solo para combos
     * }
     */
    public static function obtenerStockProducto(int $productoId, ?int $almacenId = null, ?int $sectorId = null): array
    {
        $producto = Producto::find($productoId);

        if (!$producto) {
            return [
                'producto_id' => $productoId,
                'stock_disponible' => 0,
                'stock_total' => 0,
                'stock_reservado' => 0,
                'capacidad' => null,
            ];
        }

        // Obtener stock
        $query = StockProducto::where('producto_id', $productoId);

        if ($almacenId) {
            $query->where('almacen_id', $almacenId);
        }

        if ($sectorId) {
            $query->where('sector_id', $sectorId);
        }

        $stockDisponible = $query->sum('cantidad_disponible') ?? 0;
        $stockTotal = $query->sum('cantidad') ?? 0;
        $stockReservado = $stockTotal - $stockDisponible;

        // Si es combo, también obtener capacidad
        $capacidad = null;
        if ($producto->es_combo) {
            $capacidad = ComboStockService::calcularCapacidadCombos($productoId, $almacenId, $sectorId);
        }

        return [
            'producto_id' => $productoId,
            'stock_disponible' => (int) $stockDisponible,
            'stock_total' => (int) $stockTotal,
            'stock_reservado' => (int) $stockReservado,
            'capacidad' => $capacidad,
        ];
    }

    /**
     * Obtener stock de múltiples productos
     *
     * @param array $productoIds - Array de IDs de productos
     * @param int|null $almacenId - ID del almacén (si es null, suma todos)
     * @param int|null $sectorId - ID del sector (opcional)
     * @return Collection Con datos de stock de cada producto
     */
    public static function obtenerStockMultiples(array $productoIds, ?int $almacenId = null, ?int $sectorId = null): Collection
    {
        return collect($productoIds)->map(function ($productoId) use ($almacenId, $sectorId) {
            return self::obtenerStockProducto($productoId, $almacenId, $sectorId);
        });
    }

    /**
     * Obtener stock de todos los productos (con paginación opcional)
     *
     * @param int|null $almacenId - ID del almacén (si es null, suma todos)
     * @param int|null $sectorId - ID del sector (opcional)
     * @param int $perPage - Productos por página (null = sin paginación)
     * @return mixed Collection o Paginator
     */
    public static function obtenerStockTodos(?int $almacenId = null, ?int $sectorId = null, ?int $perPage = null)
    {
        $query = Producto::query();

        // Cargar stock con relación al sector
        $query->with(['stocks' => function ($q) use ($almacenId, $sectorId) {
            if ($almacenId) {
                $q->where('almacen_id', $almacenId);
            }
            if ($sectorId) {
                $q->where('sector_id', $sectorId);
            }
            // Cargar relación sector para cada stock
            $q->with('sector:id,nombre,es_generico');
        }]);

        $productos = $perPage ? $query->paginate($perPage) : $query->get();

        // Mapear cada producto con sus datos de stock
        return $productos instanceof \Illuminate\Pagination\Paginator
            ? $productos->through(function ($producto) {
                return self::formatearProductoConStock($producto);
            })
            : $productos->map(function ($producto) {
                return self::formatearProductoConStock($producto);
            });
    }

    /**
     * Formatear producto con sus datos de stock
     *
     * @param Producto $producto
     * @return array
     */
    private static function formatearProductoConStock(Producto $producto): array
    {
        $stockDisponible = $producto->stocks->sum('cantidad_disponible') ?? 0;
        $stockTotal = $producto->stocks->sum('cantidad') ?? 0;

        return [
            'id' => $producto->id,
            'nombre' => $producto->nombre,
            'sku' => $producto->sku,
            'es_combo' => (bool) $producto->es_combo,
            'es_fraccionado' => (bool) $producto->es_fraccionado,
            'stock_disponible' => (int) $stockDisponible,
            'stock_total' => (int) $stockTotal,
            'stock_reservado' => (int) ($stockTotal - $stockDisponible),
            'capacidad' => $producto->es_combo ? ComboStockService::calcularCapacidadCombos($producto->id) : null,
        ];
    }

    /**
     * Obtener stock disponible simple (solo el número)
     *
     * @param int $productoId - ID del producto
     * @param int|null $almacenId - ID del almacén
     * @param int|null $sectorId - ID del sector (opcional)
     * @return int Stock disponible
     */
    public static function obtenerStockDisponible(int $productoId, ?int $almacenId = null, ?int $sectorId = null): int
    {
        $query = StockProducto::where('producto_id', $productoId);

        if ($almacenId) {
            $query->where('almacen_id', $almacenId);
        }

        if ($sectorId) {
            $query->where('sector_id', $sectorId);
        }

        return (int) ($query->sum('cantidad_disponible') ?? 0);
    }

    /**
     * Verificar si hay stock disponible
     *
     * @param int $productoId - ID del producto
     * @param int $cantidad - Cantidad solicitada
     * @param int|null $almacenId - ID del almacén
     * @param int|null $sectorId - ID del sector (opcional)
     * @return bool
     */
    public static function hayStockDisponible(int $productoId, int $cantidad, ?int $almacenId = null, ?int $sectorId = null): bool
    {
        $stockDisponible = self::obtenerStockDisponible($productoId, $almacenId, $sectorId);
        return $stockDisponible >= $cantidad;
    }
}
