<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DevolucionEventoDetalle extends Model
{
    protected $table = 'devolucion_evento_detalle';

    protected $fillable = [
        'devolucion_evento_id',
        'prestamo_evento_detalle_id',
        'cantidad_devuelta',
        'cantidad_dañada_parcial',
        'cantidad_dañada_total',
        'monto_cobrado_daño',
        'monto_garantia_devuelta',
    ];

    protected $casts = [
        'monto_cobrado_daño' => 'decimal:2',
        'monto_garantia_devuelta' => 'decimal:2',
    ];

    public function devolucionEvento(): BelongsTo
    {
        return $this->belongsTo(DevolucionEvento::class, 'devolucion_evento_id');
    }

    public function prestamoEventoDetalle(): BelongsTo
    {
        return $this->belongsTo(PrestamoEventoDetalle::class, 'prestamo_evento_detalle_id');
    }
}
