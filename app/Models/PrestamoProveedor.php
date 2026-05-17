<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PrestamoProveedor extends Model
{
    protected $table = 'prestamo_proveedor';

    protected $fillable = [
        'proveedor_id',
        'compra_id',
        'es_compra',
        'monto_garantia',
        'fecha_prestamo',
        'fecha_esperada_devolucion',
        'observaciones',
        'estado',
    ];

    protected $casts = [
        'es_compra' => 'boolean',
        'monto_garantia' => 'decimal:2',
        'fecha_prestamo' => 'date',
        'fecha_esperada_devolucion' => 'date',
    ];

    // ✅ Relación con detalles del préstamo
    public function detalles(): HasMany
    {
        return $this->hasMany(PrestamoProveedorDetalle::class, 'prestamo_proveedor_id');
    }

    public function compra(): BelongsTo
    {
        return $this->belongsTo(Compra::class);
    }

    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class);
    }

    // ✅ Relación a devoluciones (cabecera)
    public function devoluciones(): HasMany
    {
        return $this->hasMany(DevolucionProveedor::class, 'prestamo_proveedor_id');
    }
}
