<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrestamoProveedorAlmacen extends Model
{
    protected $table = 'prestamo_proveedor_almacenes';

    protected $fillable = [
        'prestamo_proveedor_detalle_id',
        'almacenes_prestables_id',
        'cantidad',
        'es_proveedor',
    ];

    protected $casts = [
        'cantidad' => 'integer',
        'es_proveedor' => 'boolean',
    ];

    public function detallePrestamoProveedor(): BelongsTo
    {
        return $this->belongsTo(PrestamoProveedorDetalle::class, 'prestamo_proveedor_detalle_id');
    }

    public function almacen(): BelongsTo
    {
        return $this->belongsTo(AlmacenPrestable::class, 'almacenes_prestables_id');
    }
}
