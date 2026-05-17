<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\AlmacenPrestable;

class CompraPrestableDetalle extends Model
{
    protected $table = 'compra_prestable_detalles';

    protected $fillable = [
        'compra_prestable_id',
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
     * Compra a la que pertenece este detalle
     */
    public function compraPrestable(): BelongsTo
    {
        return $this->belongsTo(CompraPrestable::class, 'compra_prestable_id');
    }

    /**
     * Prestable comprado
     */
    public function prestable(): BelongsTo
    {
        return $this->belongsTo(Prestable::class);
    }

    /**
     * Almacén de prestables donde se va a guardar el prestable
     */
    public function almacen(): BelongsTo
    {
        return $this->belongsTo(AlmacenPrestable::class, 'almacenes_prestables_id');
    }

    /**
     * Alias de compatibilidad para código legado.
     */
    public function getAlmacenesPrestablesIdAttribute(): ?int
    {
        return $this->attributes['almacenes_prestables_id'] ?? null;
    }

    /**
     * Alias de compatibilidad para código legado.
     */
    public function setAlmacenesPrestablesIdAttribute($value): void
    {
        $this->attributes['almacenes_prestables_id'] = $value;
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
