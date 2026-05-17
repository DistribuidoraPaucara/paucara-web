<?php

namespace App\Events;

use App\Models\Proforma;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento que se dispara cuando se crea una nueva proforma
 *
 * La notificación WebSocket se envía a través de SendProformaCreatedNotification listener
 * que hace HTTP POST al servidor Node.js (no usamos Broadcasting nativo de Laravel)
 */
class ProformaCreada
{
    use Dispatchable, SerializesModels;

    public Proforma $proforma;

    /**
     * Create a new event instance.
     */
    public function __construct(Proforma $proforma)
    {
        $this->proforma = $proforma;
        $this->proforma->load(['cliente', 'usuarioCreador']);
    }

}
