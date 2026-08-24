<?php

namespace App\Events;

use App\Models\DevolucionProveedor;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento que se dispara cuando se registra una devolución de préstamo a proveedor
 *
 * La notificación WebSocket se envía a través de SendDevolucionProveedorRegisteredNotification listener
 */
class DevolucionProveedorRegistrada
{
    use Dispatchable, SerializesModels;

    public DevolucionProveedor $devolucion;

    public function __construct(DevolucionProveedor $devolucion)
    {
        $this->devolucion = $devolucion;
        $this->devolucion->load(['prestamo.proveedor', 'prestamo.chofer', 'detalles.detallePrestamoProveedor.prestable']);
    }
}
