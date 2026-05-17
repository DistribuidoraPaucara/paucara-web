<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComboItem extends Model
{
    use HasFactory;

    protected $table = 'combo_items';

    protected $fillable = [
        'combo_id',
        'producto_id',
        'cantidad',
        'precio_unitario',
        'tipo_precio_id',
        'es_obligatorio',
        'grupo_opcional',
    ];

    protected function casts(): array
    {
        return [
            'cantidad'        => 'decimal:2',
            'precio_unitario' => 'decimal:2',
        ];
    }

    public function combo(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'combo_id');
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    public function tipoPrecio(): BelongsTo
    {
        return $this->belongsTo(TipoPrecio::class, 'tipo_precio_id');
    }
}
