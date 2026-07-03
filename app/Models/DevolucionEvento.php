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
        'estado',
        'created_by',
        'anulada_por',
        'razon_anulacion',
        'fecha_anulacion',
    ];

    protected $casts = [
        'fecha_devolucion' => 'date',
        'monto_cobrado_daño_total' => 'decimal:2',
        'monto_garantia_devuelta_total' => 'decimal:2',
        'fecha_anulacion' => 'datetime',
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

    public function creador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function anulador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'anulada_por');
    }
}
