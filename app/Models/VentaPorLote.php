<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * VentaPorLote - Trazabilidad granular de consumo de stock
 *
 * PROPÓSITO:
 * Registrar QUÉ LOTE específico fue consumido en CADA VENTA
 * - Soluciona stock negativo (precisión por lote)
 * - Auditoría completa de dónde vino cada cantidad
 * - Reversiones exactas al anular (devuelve a lote correcto)
 *
 * RELACIONES:
 * ├─ venta: La venta que consumió
 * ├─ detalleVenta: La línea (puede ser combo o producto directo)
 * ├─ producto: Producto COMPONENTE (nunca combo)
 * ├─ stockProducto: Lote específico del stock_productos
 * ├─ comboPadre: Referencia al combo si vino de uno (nullable)
 *
 * IMPORTANTE:
 * - `producto_id` es SIEMPRE componente (si vino de combo, el componente dentro del combo)
 * - `combo_padre_id` es NULL si fue venta directa del producto
 * - `cantidad_consumida` es la cantidad real consumida de este lote
 * - Un producto puede aparecer múltiples veces si fue consumido de varios lotes (FIFO)
 */
class VentaPorLote extends Model
{
    use HasFactory;

    protected $table = 'venta_por_lotes';

    protected $fillable = [
        'venta_id',
        'detalle_venta_id',
        'producto_id',
        'stock_producto_id',
        'cantidad_consumida',
        'combo_padre_id',
        'fecha_vencimiento',
    ];

    protected function casts(): array
    {
        return [
            'cantidad_consumida' => 'decimal:2',
            'fecha_vencimiento' => 'date',
        ];
    }

    /**
     * Relación: La venta que consumió este lote
     */
    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class, 'venta_id');
    }

    /**
     * Relación: Línea de detalle que originó el consumo
     * (puede ser un combo o un producto directo)
     */
    public function detalleVenta(): BelongsTo
    {
        return $this->belongsTo(DetalleVenta::class, 'detalle_venta_id');
    }

    /**
     * Relación: Producto COMPONENTE consumido
     *
     * ✅ IMPORTANTE: Esto es SIEMPRE un componente
     * Si se vendió un combo con producto A dentro, esto es producto A
     * NUNCA es el combo en sí
     */
    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    /**
     * Relación: Lote específico de stock_productos consumido
     *
     * Permite acceder a datos del lote:
     * - fecha_vencimiento
     * - lote_numero
     * - almacen_id
     * - cantidad_disponible (estado actual)
     */
    public function stockProducto(): BelongsTo
    {
        return $this->belongsTo(StockProducto::class, 'stock_producto_id');
    }

    /**
     * Relación: Combo padre (si esta línea de venta fue un combo)
     *
     * ✅ NULLABLE: Solo si el consumo fue porque se vendió un combo
     * Si fue venta directa del producto, es NULL
     *
     * Permite saber: "Este lote fue consumido porque vendimos combo XYZ"
     */
    public function comboPadre(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'combo_padre_id');
    }

    /**
     * Scope: Obtener todos los lotes consumidos por una venta
     * Usado para reversiones (anulación)
     *
     * @param $query
     * @param int $ventaId
     * @return mixed
     */
    public function scopePorVenta($query, int $ventaId)
    {
        return $query->where('venta_id', $ventaId);
    }

    /**
     * Scope: Obtener lotes consumidos de un producto específico
     * Útil para reportes por producto
     */
    public function scopePorProducto($query, int $productoId)
    {
        return $query->where('producto_id', $productoId);
    }

    /**
     * Scope: Obtener lotes consumidos de un lote específico
     * Útil para auditar un lote en particular
     */
    public function scopePorLote($query, int $stockProductoId)
    {
        return $query->where('stock_producto_id', $stockProductoId);
    }

    /**
     * Scope: Obtener lotes que vienen de un combo específico
     * Útil para saber qué lotes se consumieron porque vendimos un combo
     */
    public function scopeDelCombo($query, int $comboPadreId)
    {
        return $query->where('combo_padre_id', $comboPadreId);
    }

    /**
     * Scope: Obtener lotes de venta directa (NO de combos)
     */
    public function scopeVentasDirectas($query)
    {
        return $query->whereNull('combo_padre_id');
    }

    /**
     * Scope: Obtener lotes que vienen de combos
     */
    public function scopeDelCombos($query)
    {
        return $query->whereNotNull('combo_padre_id');
    }

    /**
     * Scope: Obtener lotes próximos a vencer (auditoria de FIFO)
     * Útil para validar que el consumo está respetando FIFO
     *
     * @param $query
     * @param int $diasAnticipacion (default 30 días)
     */
    public function scopeProximosAVencer($query, int $diasAnticipacion = 30)
    {
        $fecha = now()->addDays($diasAnticipacion);
        return $query->whereBetween('fecha_vencimiento', [now()->toDateString(), $fecha->toDateString()]);
    }
};
