<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PrestamoClienteDetalle extends Model
{
    protected $table = 'prestamo_cliente_detalle';

    protected $fillable = [
        'prestamo_cliente_id',
        'prestable_id',
        'cantidad_prestada',
        'precio_unitario',
        'precio_prestamo',
        'estado',
    ];

    protected $casts = [
        'cantidad_prestada' => 'integer',
        'precio_unitario' => 'decimal:2',
        'precio_prestamo' => 'decimal:2',
    ];

    public function prestamo(): BelongsTo
    {
        return $this->belongsTo(PrestamoCliente::class, 'prestamo_cliente_id');
    }

    public function prestable(): BelongsTo
    {
        return $this->belongsTo(Prestable::class);
    }

    public function devolucionDetalles(): HasMany
    {
        return $this->hasMany(DevolucionClienteDetalle::class, 'prestamo_cliente_detalle_id');
    }

    // Método legacy para compatibilidad (deprecado)
    public function devoluciones(): HasMany
    {
        return $this->devolucionDetalles();
    }
}
