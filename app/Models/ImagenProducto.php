<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagenProducto extends Model
{
    use HasFactory;

    protected $table = 'imagenes_producto';

    protected $fillable = [
        'producto_id', 'url', 'es_principal', 'orden',
    ];

    protected function casts(): array
    {
        return [
            'es_principal' => 'boolean',
            'orden' => 'integer',
        ];
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}
