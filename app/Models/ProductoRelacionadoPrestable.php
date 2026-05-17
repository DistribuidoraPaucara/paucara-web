<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductoRelacionadoPrestable extends Model
{
    protected $table = 'productos_relacionado_prestables';

    protected $fillable = [
        'prestable_id',
        'producto_id',
        'descripcion',
        'es_principal',
        'orden',
    ];

    protected $casts = [
        'es_principal' => 'boolean',
    ];

    public function prestable()
    {
        return $this->belongsTo(Prestable::class, 'prestable_id');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    public function scopePrincipal($query)
    {
        return $query->where('es_principal', true);
    }

    public function scopeOrdenado($query)
    {
        return $query->orderBy('orden', 'asc')->orderBy('id', 'asc');
    }
}
