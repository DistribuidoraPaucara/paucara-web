<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PrestamoEventoDetalle extends Model
{
    protected $table = 'prestamo_evento_detalle';

    protected $fillable = [
        'prestamo_evento_id',
        'prestable_id',
        'cantidad_prestada',
        'almacenes_ids',
        'monto_garantia',
        'estado',
    ];

    protected $casts = [
        'monto_garantia' => 'decimal:2',
        'almacenes_ids' => 'array',
    ];

    protected $appends = [
        'cantidad',
        'almacen_nombre',
    ];

    /**
     * Accessor para alias del campo cantidad_prestada
     */
    public function getCantidadAttribute(): int
    {
        return $this->cantidad_prestada ?? 0;
    }

    public function prestamoEvento(): BelongsTo
    {
        return $this->belongsTo(PrestamoEvento::class, 'prestamo_evento_id');
    }

    public function prestable(): BelongsTo
    {
        return $this->belongsTo(Prestable::class, 'prestable_id');
    }

    public function almacenes(): HasMany
    {
        return $this->hasMany(PrestamoEventoAlmacen::class, 'prestamo_evento_detalle_id');
    }

    public function devoluciones(): HasMany
    {
        return $this->hasMany(DevolucionEventoDetalle::class, 'prestamo_evento_detalle_id');
    }

    // ✅ NUEVO: Alias para compatibilidad con servicio genérico
    public function devolucionDetalles(): HasMany
    {
        return $this->devoluciones();
    }

    /**
     * Accessor para obtener el nombre del primer almacén
     */
    public function getAlmacenNombreAttribute(): ?string
    {
        $almacenesIds = $this->almacenes_ids;

        if (empty($almacenesIds) || !is_array($almacenesIds)) {
            return null;
        }

        // Obtener el primer almacén
        $primerAlmacenId = $almacenesIds[0];

        try {
            $almacen = AlmacenPrestable::find($primerAlmacenId);
            return $almacen?->nombre;
        } catch (\Exception $e) {
            return null;
        }
    }
}
