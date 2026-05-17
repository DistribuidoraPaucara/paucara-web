<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Prestable extends Model
{
    protected $table = 'prestables';

    protected $fillable = [
        'nombre',
        'codigo',
        'tipo',
        'capacidad',
        'producto_id',
        'proveedor_id',
        'prestable_relacionado_id',
        'descripcion',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'capacidad' => 'integer',
    ];

    // ============================================
    // RELACIONES
    // ============================================

    /**
     * Producto al que pertenece esta canastilla (referencia)
     */
    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    /**
     * Proveedor que fabrica esta canastilla
     */
    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class);
    }

    /**
     * Canastilla relacionada (si este prestable es de tipo EMBASES)
     */
    public function prestablePadre(): BelongsTo
    {
        return $this->belongsTo(Prestable::class, 'prestable_relacionado_id');
    }

    /**
     * Embases relacionados (si este prestable es de tipo CANASTILLA)
     */
    public function embasesRelacionados(): HasMany
    {
        return $this->hasMany(Prestable::class, 'prestable_relacionado_id');
    }

    /**
     * Precios de venta y préstamo
     */
    public function precios(): HasMany
    {
        return $this->hasMany(PrestablePrice::class);
    }

    /**
     * Condiciones (garantía, montos por daño)
     */
    public function condiciones(): HasMany
    {
        return $this->hasMany(PrestableCondicion::class);
    }

    /**
     * Stock en almacenes
     */
    public function stocks(): HasMany
    {
        return $this->hasMany(PrestableStock::class);
    }

    /**
     * Préstamos a clientes
     */
    public function prestamosCliente(): HasMany
    {
        return $this->hasMany(PrestamoCliente::class);
    }

    /**
     * Préstamos de proveedores
     */
    public function prestamosProveedor(): HasMany
    {
        return $this->hasMany(PrestamoProveedor::class);
    }

    /**
     * Productos relacionados a este prestable
     */
    public function productosRelacionados(): HasMany
    {
        return $this->hasMany(ProductoRelacionadoPrestable::class);
    }

    /**
     * Último detalle de compra confirmado para precio referencial dinámico.
     */
    public function ultimoDetalleCompra(): HasOne
    {
        return $this->hasOne(CompraPrestableDetalle::class)
            ->whereHas('compraPrestable', function ($q) {
                $q->where('estado', 'CONFIRMADA');
            })
            ->latestOfMany('id');
    }
}
