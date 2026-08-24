<?php

namespace App\Events;

use App\Models\DevolucionCliente;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento que se dispara cuando se registra una devolución de préstamo a cliente
 *
 * La notificación WebSocket se envía a través de SendDevolucionRegisteredNotification listener
 * que hace HTTP POST al servidor Node.js
 */
class DevolucionRegistrada
{
    use Dispatchable, SerializesModels;

    public DevolucionCliente $devolucion;

    /**
     * Create a new event instance.
     */
    public function __construct(DevolucionCliente $devolucion)
    {
        $this->devolucion = $devolucion;
        $this->devolucion->load(['prestamo.cliente', 'prestamo.chofer', 'detalles.detallePrestamoCliente.prestable']);
    }
}
