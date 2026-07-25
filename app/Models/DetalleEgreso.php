<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleEgreso extends Model
{
    protected $fillable = [
        'egreso_id',
        'concepto',
        'cantidad',
        'monto_unitario',
        'descuento',
        'subtotal',
    ];

    protected $casts = [
        'monto_unitario' => 'decimal:2',
        'descuento' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function egreso(): BelongsTo
    {
        return $this->belongsTo(Egreso::class, 'egreso_id');
    }
}
