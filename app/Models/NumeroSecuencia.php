<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * NumeroSecuencia - Gestiona secuencias de números por tipo y fecha
 *
 * Previene saltos de números causados por transacciones fallidas.
 * Cada tipo de documento (VENTA, PROFORMA, etc.) tiene una secuencia diaria.
 *
 * Ejemplo:
 *  - tipo: 'VENTA', fecha: '2026-07-04', secuencial: 2124
 *  - Próximo número: VEN20260704-2125
 */
class NumeroSecuencia extends Model
{
    protected $table = 'numero_secuencias';

    protected $fillable = [
        'tipo',
        'fecha',
        'secuencial',
    ];

    protected $casts = [
        'fecha' => 'date',
    ];
}
