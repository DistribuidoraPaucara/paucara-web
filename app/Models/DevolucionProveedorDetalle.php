<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DevolucionProveedorDetalle extends Model
{
    protected $table = 'devolucion_proveedor_detalle';

    protected $fillable = [
        'devolucion_proveedor_id',
        'prestamo_proveedor_detalle_id',
        'fecha_devolucion',
        'cantidad_devuelta',
        'cantidad_dañada_parcial',
        'cantidad_dañada_total',
        'monto_cobrado_daño',
        'monto_garantia_devuelta',
    ];

    protected $casts = [
        'cantidad_devuelta' => 'integer',
        'cantidad_dañada_parcial' => 'integer',
        'cantidad_dañada_total' => 'integer',
        'monto_cobrado_daño' => 'decimal:2',
        'monto_garantia_devuelta' => 'decimal:2',
    ];

    public function devolucion(): BelongsTo
    {
        return $this->belongsTo(DevolucionProveedor::class, 'devolucion_proveedor_id');
    }

    public function detallePrestamoProveedor(): BelongsTo
    {
        return $this->belongsTo(PrestamoProveedorDetalle::class, 'prestamo_proveedor_detalle_id');
    }
}
