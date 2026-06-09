<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrestamoEventoAlmacen extends Model
{
    protected $table = 'prestamo_evento_almacenes';

    protected $fillable = [
        'prestamo_evento_detalle_id',
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

    public function detallePrestamoEvento(): BelongsTo
    {
        return $this->belongsTo(PrestamoEventoDetalle::class, 'prestamo_evento_detalle_id');
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
