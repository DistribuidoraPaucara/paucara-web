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
        // Préstamos a Clientes (salientes)
        'cantidad_cliente_deudor',           // Clientes que me deben devoluciones
        'cantidad_cliente_devuelto',         // Historial de devoluciones
        'cantidad_cliente_dañada',           // Items dañados en devoluciones
        // Préstamos a Eventos (salientes)
        'cantidad_evento_deudor',            // Eventos que me deben devoluciones
        'cantidad_evento_devuelto',          // Historial de devoluciones
        'cantidad_evento_dañada',            // Items dañados en devoluciones
        // Préstamos a Proveedores (entrantes)
        'cantidad_proveedor_acreedor',       // Yo le debo al proveedor
        'cantidad_proveedor_devuelto',       // Historial de devoluciones
        'cantidad_proveedor_dañada',         // Items dañados en devoluciones
    ];

    protected $casts = [
        'cantidad_disponible' => 'integer',
        'cantidad_cliente_deudor' => 'integer',
        'cantidad_cliente_devuelto' => 'integer',
        'cantidad_cliente_dañada' => 'integer',
        'cantidad_evento_deudor' => 'integer',
        'cantidad_evento_devuelto' => 'integer',
        'cantidad_evento_dañada' => 'integer',
        'cantidad_proveedor_acreedor' => 'integer',
        'cantidad_proveedor_devuelto' => 'integer',
        'cantidad_proveedor_dañada' => 'integer',
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
     * Total unidades prestadas a clientes (deudor + devuelto)
     * Incluye lo que aún deben + historial
     */
    public function getTotalPrestadoClientesAttribute(): int
    {
        return $this->cantidad_cliente_deudor + $this->cantidad_cliente_devuelto;
    }

    /**
     * Total unidades prestadas a eventos (deudor + devuelto)
     */
    public function getTotalPrestadoEventosAttribute(): int
    {
        return $this->cantidad_evento_deudor + $this->cantidad_evento_devuelto;
    }

    /**
     * Total unidades recibidas de proveedores (acreedor + devuelto)
     */
    public function getTotalRecibidoProveedoresAttribute(): int
    {
        return $this->cantidad_proveedor_acreedor + $this->cantidad_proveedor_devuelto;
    }

    /**
     * Total unidades en campo (sin devolver)
     * Clientes + eventos que aún no devuelven + deuda con proveedores
     */
    public function getTotalEnCampoAttribute(): int
    {
        return $this->cantidad_cliente_deudor + $this->cantidad_evento_deudor;
    }

    /**
     * Deuda actual con proveedores (lo que debo devolver)
     */
    public function getDeudaProveedorAttribute(): int
    {
        return $this->cantidad_proveedor_acreedor;
    }

    /**
     * % devolución de clientes
     * Qué porcentaje de lo que pedí ya me lo devolvieron
     */
    public function getPorcentajeDevolucionClientesAttribute(): float
    {
        $total = $this->getTotalPrestadoClientesAttribute();
        return $total > 0 ? round(($this->cantidad_cliente_devuelto / $total) * 100, 2) : 0;
    }

    /**
     * % devolución de eventos
     */
    public function getPorcentajeDevolucionEventosAttribute(): float
    {
        $total = $this->getTotalPrestadoEventosAttribute();
        return $total > 0 ? round(($this->cantidad_evento_devuelto / $total) * 100, 2) : 0;
    }

    /**
     * % devolución a proveedores
     * Qué porcentaje de lo que me prestó ya le devolví
     */
    public function getPorcentajeDevolucionProveedoresAttribute(): float
    {
        $total = $this->getTotalRecibidoProveedoresAttribute();
        return $total > 0 ? round(($this->cantidad_proveedor_devuelto / $total) * 100, 2) : 0;
    }

    /**
     * Total general de unidades en el sistema
     */
    public function getTotalGeneralAttribute(): int
    {
        return $this->cantidad_disponible
            + $this->getTotalPrestadoClientesAttribute()
            + $this->getTotalPrestadoEventosAttribute()
            + $this->getTotalRecibidoProveedoresAttribute();
    }

    /**
     * Total unidades disponibles para prestar o vender
     */
    public function getDisponibleParaPrestamosAttribute(): int
    {
        return $this->cantidad_disponible;
    }

    /**
     * Total unidades que clientes aún deben devolver
     */
    public function getClientesDeudoresAttribute(): int
    {
        return $this->cantidad_cliente_deudor;
    }

    /**
     * Total unidades que eventos aún deben devolver
     */
    public function getEventosDeudoresAttribute(): int
    {
        return $this->cantidad_evento_deudor;
    }

    /**
     * Cantidad de unidades pendientes de devolución en total (clientes + eventos)
     */
    public function getTotalPendientesDevolucionAttribute(): int
    {
        return $this->cantidad_cliente_deudor + $this->cantidad_evento_deudor;
    }

    /**
     * Resumen consolidado del stock
     */
    public function getResumenAttribute(): array
    {
        return [
            'total_disponible' => $this->cantidad_disponible,
            'total_en_campo' => $this->getTotalEnCampoAttribute(),
            'total_deuda_proveedores' => $this->getDeudaProveedorAttribute(),
            'total_general' => $this->getTotalGeneralAttribute(),
            'clientes' => [
                'total_prestado' => $this->getTotalPrestadoClientesAttribute(),
                'deudor' => $this->cantidad_cliente_deudor,
                'devuelto' => $this->cantidad_cliente_devuelto,
                'porcentaje_devolucion' => $this->getPorcentajeDevolucionClientesAttribute(),
            ],
            'eventos' => [
                'total_prestado' => $this->getTotalPrestadoEventosAttribute(),
                'deudor' => $this->cantidad_evento_deudor,
                'devuelto' => $this->cantidad_evento_devuelto,
                'porcentaje_devolucion' => $this->getPorcentajeDevolucionEventosAttribute(),
            ],
            'proveedores' => [
                'total_recibido' => $this->getTotalRecibidoProveedoresAttribute(),
                'acreedor' => $this->cantidad_proveedor_acreedor,
                'devuelto' => $this->cantidad_proveedor_devuelto,
                'porcentaje_devolucion' => $this->getPorcentajeDevolucionProveedoresAttribute(),
            ],
        ];
    }
}
