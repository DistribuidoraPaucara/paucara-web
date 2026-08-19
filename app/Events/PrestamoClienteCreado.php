<?php

namespace App\Events;

use App\Models\PrestamoCliente;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento que se dispara cuando se crea un nuevo préstamo a cliente
 *
 * La notificación WebSocket se envía a través de SendPrestamoClienteCreatedNotification listener
 */
class PrestamoClienteCreado
{
    use Dispatchable, SerializesModels;

    public PrestamoCliente $prestamo;

    /**
     * Create a new event instance.
     */
    public function __construct(PrestamoCliente $prestamo)
    {
        $this->prestamo = $prestamo;
        $this->prestamo->load(['cliente', 'creador', 'detalles.prestable']);
    }
}
