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
        'tipo_operacion_caja_id',
        'monto_efectivo',
        'monto_transferencia',
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

    public function tipoOperacion(): BelongsTo
    {
        return $this->belongsTo(TipoOperacionCaja::class, 'tipo_operacion_caja_id');
    }
}
