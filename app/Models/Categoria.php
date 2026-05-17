<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'categorias';

    protected $fillable = [
        'nombre', 'descripcion', 'activo', 'fecha_creacion',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
            'fecha_creacion' => 'datetime',
        ];
    }

    public function productos()
    {
        return $this->hasMany(Producto::class, 'categoria_id');
    }
}
