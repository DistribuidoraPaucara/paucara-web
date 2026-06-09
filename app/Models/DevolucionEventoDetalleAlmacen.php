<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DevolucionEventoDetalleAlmacen extends Model
{
    protected $table = 'devolucion_evento_detalle_almacenes';

    protected $fillable = [
        'devolucion_evento_detalle_id',
        'almacenes_prestables_id',
        'cantidad_devuelta',
        'cantidad_dañada_parcial',
        'cantidad_dañada_total',
        'monto_cobrado_daño',
        'monto_garantia_devuelta',
        'es_proveedor',
    ];

    protected $casts = [
        'cantidad_devuelta' => 'integer',
        'cantidad_dañada_parcial' => 'integer',
        'cantidad_dañada_total' => 'integer',
        'monto_cobrado_daño' => 'decimal:2',
        'monto_garantia_devuelta' => 'decimal:2',
        'es_proveedor' => 'boolean',
    ];

    // ============================================================
    // RELACIONES
    // ============================================================

    public function detalleDevolucionEvento(): BelongsTo
    {
        return $this->belongsTo(DevolucionEventoDetalle::class, 'devolucion_evento_detalle_id');
    }

    public function almacen(): BelongsTo
    {
        return $this->belongsTo(AlmacenPrestable::class, 'almacenes_prestables_id');
    }

    // ============================================================
    // HELPERS
    // ============================================================

    public function getTotalDevuelto(): int
    {
        return $this->cantidad_devuelta + $this->cantidad_dañada_parcial + $this->cantidad_dañada_total;
    }

    public function esDeProveedor(): bool
    {
        return $this->es_proveedor;
    }

    public function esDeDistribuidora(): bool
    {
        return !$this->es_proveedor;
    }
}
