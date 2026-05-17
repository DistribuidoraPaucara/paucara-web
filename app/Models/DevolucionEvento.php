<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DevolucionEvento extends Model
{
    protected $table = 'devolucion_evento';

    protected $fillable = [
        'prestamo_evento_id',
        'fecha_devolucion',
        'cantidad_total_devuelta',
        'monto_cobrado_daño_total',
        'monto_garantia_devuelta_total',
        'observaciones',
        'chofer_id',
    ];

    protected $casts = [
        'fecha_devolucion' => 'date',
        'monto_cobrado_daño_total' => 'decimal:2',
        'monto_garantia_devuelta_total' => 'decimal:2',
    ];

    public function prestamoEvento(): BelongsTo
    {
        return $this->belongsTo(PrestamoEvento::class, 'prestamo_evento_id');
    }

    public function chofer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'chofer_id');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(DevolucionEventoDetalle::class, 'devolucion_evento_id');
    }
}
