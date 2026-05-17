<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CuentaContable extends Model
{
    protected $fillable = [
        'codigo',
        'nombre',
        'descripcion',
        'tipo',
        'naturaleza',
        'codigo_padre',
        'nivel',
        'acepta_movimiento',
        'activa',
    ];

    protected function casts(): array
    {
        return [
            'acepta_movimiento' => 'boolean',
            'activa' => 'boolean',
        ];
    }

    /**
     * Cuentas hijas
     */
    public function cuentasHijas(): HasMany
    {
        return $this->hasMany(static::class, 'codigo_padre', 'codigo');
    }

    /**
     * Cuenta padre
     */
    public function cuentaPadre()
    {
        return $this->belongsTo(static::class, 'codigo_padre', 'codigo');
    }

    /**
     * Obtener jerarquía completa de la cuenta
     */
    public function getJerarquiaCompleta(): string
    {
        $jerarquia = [$this->nombre];
        $cuenta = $this;

        while ($cuenta->cuentaPadre) {
            $cuenta = $cuenta->cuentaPadre;
            array_unshift($jerarquia, $cuenta->nombre);
        }

        return implode(' > ', $jerarquia);
    }

    /**
     * Verificar si la cuenta puede recibir movimientos
     */
    public function puedeRecibirMovimientos(): bool
    {
        return $this->acepta_movimiento && $this->activa;
    }
}
