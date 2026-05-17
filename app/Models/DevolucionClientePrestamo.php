<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DevolucionClientePrestamo extends Model
{
    protected $table = 'devolucion_cliente_prestamo';

    protected $fillable = [
        'prestamo_cliente_detalle_id',
        'cantidad_devuelta',
        'cantidad_dañada_parcial',
        'cantidad_dañada_total',
        'monto_cobrado_daño',
        'monto_garantia_devuelta',
        'observaciones',
        'chofer_id',
        'fecha_devolucion',
    ];

    protected $casts = [
        'cantidad_devuelta' => 'integer',
        'cantidad_dañada_parcial' => 'integer',
        'cantidad_dañada_total' => 'integer',
        'monto_cobrado_daño' => 'decimal:2',
        'monto_garantia_devuelta' => 'decimal:2',
        'fecha_devolucion' => 'date',
    ];

    public function detallePrestamoCliente(): BelongsTo
    {
        return $this->belongsTo(PrestamoClienteDetalle::class, 'prestamo_cliente_detalle_id');
    }

    public function prestamoCliente(): BelongsTo
    {
        return $this->detallePrestamoCliente()->belongsTo(PrestamoCliente::class);
    }

    public function chofer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'chofer_id');
    }
}
