<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DevolucionClienteDetalle extends Model
{
    protected $table = 'devolucion_cliente_detalle';

    protected $fillable = [
        'devolucion_cliente_id',
        'prestamo_cliente_detalle_id',
        'cantidad_devuelta',
        'cantidad_dañada_parcial',
        'cantidad_dañada_total',
        'monto_cobrado_daño',
        'monto_garantia_devuelta',
    ];

    protected $casts = [
        'cantidad_devuelta'       => 'integer',
        'cantidad_dañada_parcial' => 'integer',
        'cantidad_dañada_total'   => 'integer',
        'monto_cobrado_daño'      => 'decimal:2',
        'monto_garantia_devuelta' => 'decimal:2',
    ];

    public function devolucion(): BelongsTo
    {
        return $this->belongsTo(DevolucionCliente::class, 'devolucion_cliente_id');
    }

    public function detallePrestamoCliente(): BelongsTo
    {
        return $this->belongsTo(PrestamoClienteDetalle::class, 'prestamo_cliente_detalle_id');
    }
}
