<?php

namespace App\Events;

use App\Models\PrestamoEvento;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento que se dispara cuando se anula un préstamo a evento
 *
 * La notificación WebSocket se envía a través de SendPrestamoEventoAnuladoNotification listener
 */
class PrestamoEventoAnulado
{
    use Dispatchable, SerializesModels;

    public PrestamoEvento $prestamo;
    public ?string $razon;

    /**
     * Create a new event instance.
     */
    public function __construct(PrestamoEvento $prestamo, ?string $razon = null)
    {
        $this->prestamo = $prestamo;
        $this->razon = $razon;
        $this->prestamo->load(['creador', 'chofer', 'detalles.prestable']);
    }
}
