<?php

namespace App\Events;

use App\Models\Proforma;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento que se dispara cuando se rechaza una proforma
 *
 * La notificación WebSocket se envía a través de SendProformaRejectedNotification listener
 * que hace HTTP POST al servidor Node.js (no usamos Broadcasting nativo de Laravel)
 */
class ProformaRechazada
{
    use Dispatchable, SerializesModels;

    public Proforma $proforma;
    public string $motivoRechazo;

    /**
     * Create a new event instance.
     */
    public function __construct(Proforma $proforma, string $motivoRechazo)
    {
        $this->proforma = $proforma;
        $this->motivoRechazo = $motivoRechazo;

        $this->proforma->load(['cliente']);
    }
}
