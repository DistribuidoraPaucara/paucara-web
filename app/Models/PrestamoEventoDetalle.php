<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PrestamoEventoDetalle extends Model
{
    protected $table = 'prestamo_evento_detalle';

    protected $fillable = [
        'prestamo_evento_id',
        'prestable_id',
        'cantidad_prestada',
        'almacenes_ids',
        'monto_garantia',
        'estado',
    ];

    protected $casts = [
        'monto_garantia' => 'decimal:2',
        'almacenes_ids' => 'array',
    ];

    public function prestamoEvento(): BelongsTo
    {
        return $this->belongsTo(PrestamoEvento::class, 'prestamo_evento_id');
    }

    public function prestable(): BelongsTo
    {
        return $this->belongsTo(Prestable::class, 'prestable_id');
    }

    public function devoluciones(): HasMany
    {
        return $this->hasMany(DevolucionEventoDetalle::class, 'prestamo_evento_detalle_id');
    }
}
