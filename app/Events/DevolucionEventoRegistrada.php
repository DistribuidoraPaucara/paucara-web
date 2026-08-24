<?php

namespace App\Events;

use App\Models\DevolucionEvento;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento que se dispara cuando se registra una devolución de préstamo a evento
 *
 * La notificación WebSocket se envía a través de SendDevolucionEventoRegisteredNotification listener
 */
class DevolucionEventoRegistrada
{
    use Dispatchable, SerializesModels;

    public DevolucionEvento $devolucion;

    public function __construct(DevolucionEvento $devolucion)
    {
        $this->devolucion = $devolucion;
        $this->devolucion->load(['prestamoEvento.cliente', 'prestamoEvento.chofer', 'detalles.prestamoEventoDetalle.prestable']);
    }
}
