<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleDevolucion extends Model
{
    use HasFactory;

    protected $table = 'detalle_devoluciones';
    public $timestamps = true;

    protected $fillable = [
        'devolucion_id',
        'detalle_venta_id',
        'producto_id',
        'cantidad_devuelta',
        'precio_unitario',
        'subtotal',
    ];

    protected function casts(): array
    {
        return [
            'cantidad_devuelta' => 'float',  // ✅ FIXED 2026-03-24: Cambié a float para evitar problemas con decimal:6
            'precio_unitario' => 'float',
            'subtotal' => 'float',
        ];
    }

    /**
     * Relaciones
     */
    public function devolucion(): BelongsTo
    {
        return $this->belongsTo(Devolucion::class);
    }

    public function detalleVenta(): BelongsTo
    {
        return $this->belongsTo(DetalleVenta::class, 'detalle_venta_id');
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }
}
