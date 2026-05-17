<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoDocumento extends Model
{
    protected $table = 'tipos_documento';

    protected $fillable = [
        'codigo',
        'nombre',
        'descripcion',
        'genera_inventario',
        'requiere_autorizacion',
        'formato_numeracion',
        'siguiente_numero',
        'activo',
    ];

    protected $casts = [
        'genera_inventario' => 'boolean',
        'requiere_autorizacion' => 'boolean',
        'activo' => 'boolean',
        'siguiente_numero' => 'integer',
    ];

    /**
     * Scope para obtener solo tipos de documento activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }
}
