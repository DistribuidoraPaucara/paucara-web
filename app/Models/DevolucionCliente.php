<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DevolucionCliente extends Model
{
    protected $table = 'devolucion_cliente';

    protected $fillable = [
        'prestamo_cliente_id',
        'fecha_devolucion',
        'monto_cobrado_daño_total',
        'monto_garantia_devuelta_total',
        'monto_excedido_garantia',
        'observaciones',
        'chofer_id',
        'estado',
        'razon_anulacion',
        'created_by',
        'anulada_por',
        'fecha_anulacion',
    ];

    protected $casts = [
        'monto_cobrado_daño_total'     => 'decimal:2',
        'monto_garantia_devuelta_total' => 'decimal:2',
        'monto_excedido_garantia'       => 'decimal:2',
        'fecha_devolucion'              => 'date',
        'fecha_anulacion'               => 'datetime',
    ];

    public function prestamo(): BelongsTo
    {
        return $this->belongsTo(PrestamoCliente::class, 'prestamo_cliente_id');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(DevolucionClienteDetalle::class, 'devolucion_cliente_id');
    }

    public function chofer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'chofer_id');
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
