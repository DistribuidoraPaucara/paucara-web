<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrestamoUbicacion extends Model
{
    protected $table = 'prestamo_ubicaciones';

    protected $fillable = [
        'prestamo_cliente_id',
        'prestamo_evento_id',
        'prestamo_proveedor_id',
        'direccion_cliente_id',
        'localidad_id',
        'es_ubicacion_manual',
        'direccion',
        'longitud',
        'latitud',
    ];

    protected $casts = [
        'es_ubicacion_manual' => 'boolean',
        'longitud' => 'decimal:8',
        'latitud' => 'decimal:8',
    ];

    // ============================================
    // RELACIONES
    // ============================================

    /**
     * Préstamo a cliente
     */
    public function prestamoCliente(): BelongsTo
    {
        return $this->belongsTo(PrestamoCliente::class, 'prestamo_cliente_id');
    }

    /**
     * Préstamo a evento
     */
    public function prestamoEvento(): BelongsTo
    {
        return $this->belongsTo(PrestamoEvento::class, 'prestamo_evento_id');
    }

    /**
     * Préstamo a proveedor
     */
    public function prestamoProveedor(): BelongsTo
    {
        return $this->belongsTo(PrestamoProveedor::class, 'prestamo_proveedor_id');
    }

    /**
     * Dirección del cliente (si se usa la relación)
     */
    public function direccionCliente(): BelongsTo
    {
        return $this->belongsTo(DireccionCliente::class, 'direccion_cliente_id');
    }

    /**
     * Localidad (si es ubicación manual)
     */
    public function localidad(): BelongsTo
    {
        return $this->belongsTo(Localidad::class, 'localidad_id');
    }

    // ============================================
    // MÉTODOS AUXILIARES
    // ============================================

    /**
     * Obtener la dirección completa (manual o desde cliente)
     */
    public function getDireccionCompleta(): string
    {
        if ($this->es_ubicacion_manual && $this->localidad && $this->direccion) {
            return "{$this->localidad->nombre}, {$this->direccion}";
        }

        if ($this->direccionCliente) {
            return $this->direccionCliente->direccion_completa ?? $this->direccionCliente->direccion;
        }

        return 'Sin ubicación registrada';
    }

    /**
     * Obtener la localidad (manual o desde dirección cliente)
     */
    public function getLocalidad()
    {
        if ($this->es_ubicacion_manual) {
            return $this->localidad;
        }

        return $this->direccionCliente?->localidad;
    }
}
