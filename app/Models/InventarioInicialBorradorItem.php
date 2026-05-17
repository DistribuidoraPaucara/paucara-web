<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\StockProducto;

class InventarioInicialBorradorItem extends Model
{
    protected $table = 'inventario_inicial_borrador_items';

    protected $fillable = [
        'borrador_id',
        'producto_id',
        'almacen_id',
        'cantidad',
        'lote',
        'fecha_vencimiento',
        'precio_costo',
        'stock_producto_id',
    ];

    protected $casts = [
        'cantidad' => 'decimal:2',
        'precio_costo' => 'decimal:2',
        'fecha_vencimiento' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function borrador(): BelongsTo
    {
        return $this->belongsTo(InventarioInicialBorrador::class);
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    public function almacen(): BelongsTo
    {
        return $this->belongsTo(Almacen::class);
    }

    public function stockProducto(): BelongsTo
    {
        return $this->belongsTo(StockProducto::class, 'stock_producto_id');
    }
}
