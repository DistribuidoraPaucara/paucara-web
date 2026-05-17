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
        'observaciones',
        'chofer_id',
    ];

    protected $casts = [
        'monto_cobrado_daño_total'     => 'decimal:2',
        'monto_garantia_devuelta_total' => 'decimal:2',
        'fecha_devolucion'              => 'date',
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
}
