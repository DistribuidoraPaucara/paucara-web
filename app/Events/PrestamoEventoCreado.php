<?php

namespace App\Events;

use App\Models\PrestamoEvento;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento que se dispara cuando se crea un nuevo préstamo a evento
 *
 * La notificación WebSocket se envía a través de SendPrestamoEventoCreatedNotification listener
 */
class PrestamoEventoCreado
{
    use Dispatchable, SerializesModels;

    public PrestamoEvento $prestamo;

    /**
     * Create a new event instance.
     */
    public function __construct(PrestamoEvento $prestamo)
    {
        $this->prestamo = $prestamo;
        $this->prestamo->load(['cliente', 'creador', 'detalles.prestable']);
    }
}
