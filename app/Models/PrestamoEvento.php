<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PrestamoEvento extends Model
{
    protected $table = 'prestamo_evento';

    protected $fillable = [
        'evento_id',
        'nombre_evento',
        'chofer_id',
        'cantidad',
        'monto_garantia',
        'fecha_prestamo',
        'fecha_esperada_devolucion',
        'estado',
    ];

    protected $casts = [
        'monto_garantia' => 'decimal:2',
        'fecha_prestamo' => 'date',
        'fecha_esperada_devolucion' => 'date',
    ];

    public function chofer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'chofer_id');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(PrestamoEventoDetalle::class, 'prestamo_evento_id');
    }

    public function devoluciones(): HasMany
    {
        return $this->hasMany(DevolucionEvento::class, 'prestamo_evento_id');
    }
}
