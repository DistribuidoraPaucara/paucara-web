<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrestableStock extends Model
{
    protected $table = 'prestable_stock';

    protected $fillable = [
        'prestable_id',
        'almacenes_prestables_id',
        'cantidad_disponible',
        // Préstamos a Clientes
        'cantidad_prestamo_cliente_activo',
        'cantidad_prestamo_cliente_devuelto',
        // Préstamos a Eventos
        'cantidad_prestamo_evento_activo',
        'cantidad_prestamo_evento_devuelto',
        // Préstamos a Proveedores
        'cantidad_prestamo_proveedor_activo',
        'cantidad_prestamo_proveedor_devuelto',
    ];

    protected $casts = [
        'cantidad_disponible' => 'integer',
        'cantidad_prestamo_cliente_activo' => 'integer',
        'cantidad_prestamo_cliente_devuelto' => 'integer',
        'cantidad_prestamo_evento_activo' => 'integer',
        'cantidad_prestamo_evento_devuelto' => 'integer',
        'cantidad_prestamo_proveedor_activo' => 'integer',
        'cantidad_prestamo_proveedor_devuelto' => 'integer',
    ];

    public function prestable(): BelongsTo
    {
        return $this->belongsTo(Prestable::class);
    }

    public function almacenPrestable(): BelongsTo
    {
        return $this->belongsTo(AlmacenPrestable::class, 'almacenes_prestables_id');
    }

    // ==================== MÉTODOS HELPER ====================

    /**
     * Total prestado a clientes (activo + devuelto)
     */
    public function getTotalPrestadoClientesAttribute(): int
    {
        return $this->cantidad_prestamo_cliente_activo + $this->cantidad_prestamo_cliente_devuelto;
    }

    /**
     * Total prestado a eventos (activo + devuelto)
     */
    public function getTotalPrestadoEventosAttribute(): int
    {
        return $this->cantidad_prestamo_evento_activo + $this->cantidad_prestamo_evento_devuelto;
    }

    /**
     * Total prestado a proveedores (activo + devuelto)
     */
    public function getTotalPrestadoProveedoresAttribute(): int
    {
        return $this->cantidad_prestamo_proveedor_activo + $this->cantidad_prestamo_proveedor_devuelto;
    }

    /**
     * Total en campo (activos de clientes + eventos)
     */
    public function getTotalEnCampoAttribute(): int
    {
        return $this->cantidad_prestamo_cliente_activo + $this->cantidad_prestamo_evento_activo;
    }

    /**
     * Total deuda con proveedores
     */
    public function getTotalDeudaProveedoresAttribute(): int
    {
        return $this->cantidad_prestamo_proveedor_activo;
    }

    /**
     * % devolución de clientes
     */
    public function getPorcentajeDevolucionClientesAttribute(): float
    {
        $total = $this->getTotalPrestadoClientesAttribute();
        return $total > 0 ? round(($this->cantidad_prestamo_cliente_devuelto / $total) * 100, 2) : 0;
    }

    /**
     * % devolución de eventos
     */
    public function getPorcentajeDevolucionEventosAttribute(): float
    {
        $total = $this->getTotalPrestadoEventosAttribute();
        return $total > 0 ? round(($this->cantidad_prestamo_evento_devuelto / $total) * 100, 2) : 0;
    }

    /**
     * % devolución de proveedores
     */
    public function getPorcentajeDevolucionProveedoresAttribute(): float
    {
        $total = $this->getTotalPrestadoProveedoresAttribute();
        return $total > 0 ? round(($this->cantidad_prestamo_proveedor_devuelto / $total) * 100, 2) : 0;
    }

    /**
     * Total general en sistema (disponible + todos los préstamos)
     */
    public function getTotalGeneralAttribute(): int
    {
        return $this->cantidad_disponible
            + $this->getTotalPrestadoClientesAttribute()
            + $this->getTotalPrestadoEventosAttribute()
            + $this->getTotalPrestadoProveedoresAttribute();
    }

    /**
     * Resumen consolidado del stock
     */
    public function getResumenAttribute(): array
    {
        return [
            'total_disponible' => $this->cantidad_disponible,
            'total_en_campo' => $this->getTotalEnCampoAttribute(),
            'total_deuda_proveedores' => $this->getTotalDeudaProveedoresAttribute(),
            'total_general' => $this->getTotalGeneralAttribute(),
            'clientes' => [
                'total_prestado' => $this->getTotalPrestadoClientesAttribute(),
                'activo' => $this->cantidad_prestamo_cliente_activo,
                'devuelto' => $this->cantidad_prestamo_cliente_devuelto,
                'porcentaje_devolucion' => $this->getPorcentajeDevolucionClientesAttribute(),
            ],
            'eventos' => [
                'total_prestado' => $this->getTotalPrestadoEventosAttribute(),
                'activo' => $this->cantidad_prestamo_evento_activo,
                'devuelto' => $this->cantidad_prestamo_evento_devuelto,
                'porcentaje_devolucion' => $this->getPorcentajeDevolucionEventosAttribute(),
            ],
            'proveedores' => [
                'total_prestado' => $this->getTotalPrestadoProveedoresAttribute(),
                'activo' => $this->cantidad_prestamo_proveedor_activo,
                'devuelto' => $this->cantidad_prestamo_proveedor_devuelto,
                'porcentaje_devolucion' => $this->getPorcentajeDevolucionProveedoresAttribute(),
            ],
        ];
    }
}
