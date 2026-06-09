<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrestamoClienteAlmacen extends Model
{
    protected $table = 'prestamo_cliente_almacenes';

    protected $fillable = [
        'prestamo_cliente_detalle_id',
        'almacenes_prestables_id',
        'cantidad',
        'es_proveedor',
    ];

    protected $casts = [
        'cantidad' => 'integer',
        'es_proveedor' => 'boolean',
    ];

    // ============================================================
    // RELACIONES
    // ============================================================

    public function detallePrestamoCliente(): BelongsTo
    {
        return $this->belongsTo(PrestamoClienteDetalle::class, 'prestamo_cliente_detalle_id');
    }

    public function almacen(): BelongsTo
    {
        return $this->belongsTo(AlmacenPrestable::class, 'almacenes_prestables_id');
    }

    // ============================================================
    // HELPERS
    // ============================================================

    public function esDeProveedor(): bool
    {
        return $this->es_proveedor;
    }

    public function esDeDistribuidora(): bool
    {
        return !$this->es_proveedor;
    }
}
