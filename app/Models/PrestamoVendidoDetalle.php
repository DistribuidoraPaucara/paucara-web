<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrestamoVendidoDetalle extends Model
{
    protected $table = 'prestamos_vendidos_detalles';

    protected $fillable = [
        'prestamo_vendido_id',
        'prestable_id',
        'almacenes_prestables_id',
        'cantidad',
        'precio_unitario',
        'subtotal',
        'observaciones',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'precio_unitario' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    // ==================== RELACIONES ====================

    /**
     * Venta a la que pertenece este detalle
     */
    public function prestamoVendido(): BelongsTo
    {
        return $this->belongsTo(PrestamoVendido::class, 'prestamo_vendido_id');
    }

    /**
     * Prestable vendido
     */
    public function prestable(): BelongsTo
    {
        return $this->belongsTo(Prestable::class);
    }

    /**
     * Almacén de prestables del cual se sacó el prestable
     */
    public function almacenPrestable(): BelongsTo
    {
        return $this->belongsTo(AlmacenPrestable::class, 'almacenes_prestables_id');
    }

    /**
     * Alias para compatibilidad con código que usa detalles.almacen.
     */
    public function almacen(): BelongsTo
    {
        return $this->almacenPrestable();
    }

    /**
     * Alias de compatibilidad para payloads/lecturas antiguas con almacen_id.
     */
    public function getAlmacenIdAttribute(): ?int
    {
        return $this->attributes['almacenes_prestables_id'] ?? null;
    }

    /**
     * Alias de compatibilidad para payloads/lecturas antiguas con almacen_id.
     */
    public function setAlmacenIdAttribute($value): void
    {
        $this->attributes['almacenes_prestables_id'] = $value;
    }

    // ==================== MÉTODOS ====================

    /**
     * Calcular subtotal automáticamente
     */
    public function calcularSubtotal(): self
    {
        $this->subtotal = $this->cantidad * $this->precio_unitario;
        return $this;
    }

    /**
     * Scope por prestable
     */
    public function scopePorPrestable($query, int $prestableId)
    {
        return $query->where('prestable_id', $prestableId);
    }

    /**
     * Scope por almacén
     */
    public function scopePorAlmacen($query, int $almacenId)
    {
        return $query->where('almacenes_prestables_id', $almacenId);
    }
}
