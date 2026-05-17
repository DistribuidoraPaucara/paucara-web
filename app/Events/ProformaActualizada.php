<?php

namespace App\Events;

use App\Models\Proforma;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento que se dispara cuando se actualiza una proforma existente
 *
 * La notificación WebSocket se envía a través de SendProformaUpdatedNotification listener
 * que hace HTTP POST al servidor Node.js
 */
class ProformaActualizada
{
    use Dispatchable, SerializesModels;

    public Proforma $proforma;

    /**
     * Create a new event instance.
     */
    public function __construct(Proforma $proforma)
    {
        $this->proforma = $proforma;
        $this->proforma->load(['cliente', 'usuarioCreador', 'detalles.producto']);
    }
}
