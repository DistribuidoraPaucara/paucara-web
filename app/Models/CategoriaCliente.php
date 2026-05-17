<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoriaCliente extends Model
{
    use HasFactory;

    protected $table = 'categorias_cliente';

    protected $fillable = [
        'clave',
        'nombre',
        'descripcion',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
        ];
    }

    public function clientes()
    {
        return $this->belongsToMany(Cliente::class, 'categoria_cliente', 'categoria_cliente_id', 'cliente_id')->withTimestamps();
    }
}
