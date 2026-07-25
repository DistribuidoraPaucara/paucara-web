<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Egreso extends Model
{
    protected $fillable = [
        'numero',
        'tipo_operacion_caja_id',
        'estado_documento_id',
        'usuario_id',
        'fecha',
        'descripcion',
        'subtotal',
        'descuento',
        'impuesto',
        'total',
        'estado_pago',
        'monto_pagado',
        'monto_pendiente',
        'observaciones',
    ];

    protected $casts = [
        'fecha' => 'date',
        'subtotal' => 'decimal:2',
        'descuento' => 'decimal:2',
        'impuesto' => 'decimal:2',
        'total' => 'decimal:2',
        'monto_pagado' => 'decimal:2',
        'monto_pendiente' => 'decimal:2',
    ];

    // Relaciones
    public function tipoOperacion(): BelongsTo
    {
        return $this->belongsTo(TipoOperacionCaja::class, 'tipo_operacion_caja_id');
    }

    public function estadoDocumento(): BelongsTo
    {
        return $this->belongsTo(EstadoDocumento::class, 'estado_documento_id');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleEgreso::class, 'egreso_id');
    }

    public function detallesPago(): HasMany
    {
        return $this->hasMany(DetallePagoEgreso::class, 'egreso_id');
    }
}
