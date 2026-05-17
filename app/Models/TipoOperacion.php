<?php

namespace App\Models;

use App\Models\Traits\HasActiveScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoOperacion extends Model
{
    use HasFactory, HasActiveScope;
    protected $table = 'tipo_operaciones';

    protected $fillable = [
        'clave',
        'label',
        'direccion',
        'requiere_tipo_motivo',
        'requiere_proveedor',
        'requiere_cliente',
        'descripcion',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'requiere_proveedor' => 'boolean',
            'requiere_cliente' => 'boolean',
            'activo' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Scopes
     */
    public function scopeEntrada($query)
    {
        return $query->where('direccion', 'entrada');
    }

    public function scopeSalida($query)
    {
        return $query->where('salida', 'salida');
    }

    public function scopePorClave($query, $clave)
    {
        return $query->where('clave', $clave);
    }

    /**
     * Helpers
     */
    public function esEntrada(): bool
    {
        return $this->direccion === 'entrada';
    }

    public function esSalida(): bool
    {
        return $this->direccion === 'salida';
    }

    public function requiereAjuste(): bool
    {
        return $this->requiere_tipo_motivo === 'tipo_ajuste';
    }

    public function requiereMerma(): bool
    {
        return $this->requiere_tipo_motivo === 'tipo_merma';
    }

    /**
     * Retorna array con información de formulario dinámico
     */
    public function getRequirementsAttribute(): array
    {
        return [
            'requiere_tipo_motivo' => $this->requiere_tipo_motivo,
            'requiere_proveedor' => $this->requiere_proveedor,
            'requiere_cliente' => $this->requiere_cliente,
        ];
    }
}
