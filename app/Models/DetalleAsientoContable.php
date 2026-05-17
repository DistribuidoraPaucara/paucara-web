<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleAsientoContable extends Model
{
    protected $fillable = [
        'asiento_contable_id',
        'codigo_cuenta',
        'nombre_cuenta',
        'descripcion',
        'debe',
        'haber',
        'orden',
    ];

    protected function casts(): array
    {
        return [
            'debe' => 'decimal:2',
            'haber' => 'decimal:2',
        ];
    }

    /**
     * Asiento contable al que pertenece este detalle
     */
    public function asientoContable(): BelongsTo
    {
        return $this->belongsTo(AsientoContable::class);
    }

    /**
     * Cuenta contable (si existe en el plan de cuentas)
     */
    public function cuentaContable(): BelongsTo
    {
        return $this->belongsTo(CuentaContable::class, 'codigo_cuenta', 'codigo');
    }
}
