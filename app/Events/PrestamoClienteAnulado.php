<?php

namespace App\Events;

use App\Models\PrestamoCliente;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento que se dispara cuando se anula un préstamo a cliente
 *
 * La notificación WebSocket se envía a través de SendPrestamoClienteAnuladoNotification listener
 */
class PrestamoClienteAnulado
{
    use Dispatchable, SerializesModels;

    public PrestamoCliente $prestamo;
    public ?string $razon;

    /**
     * Create a new event instance.
     */
    public function __construct(PrestamoCliente $prestamo, ?string $razon = null)
    {
        $this->prestamo = $prestamo;
        $this->razon = $razon;
        $this->prestamo->load(['cliente', 'creador', 'chofer', 'detalles.prestable']);
    }
}
