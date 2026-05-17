<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PrestamoProveedorDetalle extends Model
{
    protected $table = 'prestamo_proveedor_detalle';

    protected $fillable = [
        'prestamo_proveedor_id',
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
        return $this->belongsTo(PrestamoProveedor::class, 'prestamo_proveedor_id');
    }

    public function prestable(): BelongsTo
    {
        return $this->belongsTo(Prestable::class);
    }

    public function devolucionDetalles(): HasMany
    {
        return $this->hasMany(DevolucionProveedorDetalle::class, 'prestamo_proveedor_detalle_id');
    }
}
