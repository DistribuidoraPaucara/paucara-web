<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdicionalesProducto extends Model
{
    protected $table = 'adicionales_producto';

    protected $fillable = [
        'producto_id',
        'nombre',
        'descripcion',
        'precio_adicional',
        'orden',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'precio_adicional' => 'decimal:2',
            'activo' => 'boolean',
        ];
    }

    // Relaciones
    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    public function scopeDelProducto($query, $productoId)
    {
        return $query->where('producto_id', $productoId);
    }

    public function scopeOrdenados($query)
    {
        return $query->orderBy('orden')->orderBy('nombre');
    }
}
