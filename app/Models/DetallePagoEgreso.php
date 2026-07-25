<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetallePagoEgreso extends Model
{
    protected $fillable = [
        'egreso_id',
        'tipo_pago_id',
        'monto',
        'fecha_pago',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'fecha_pago' => 'datetime',
    ];

    public function egreso(): BelongsTo
    {
        return $this->belongsTo(Egreso::class, 'egreso_id');
    }

    public function tipoPago(): BelongsTo
    {
        return $this->belongsTo(TipoPago::class, 'tipo_pago_id');
    }
}
