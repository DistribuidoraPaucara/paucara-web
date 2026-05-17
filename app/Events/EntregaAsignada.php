<?php

namespace App\Events;

use App\Models\Entrega;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EntregaAsignada
{
    use Dispatchable, SerializesModels;

    public Entrega $entrega;

    /**
     * Create a new event instance.
     */
    public function __construct(Entrega $entrega)
    {
        $this->entrega = $entrega;
        // Cargar relaciones necesarias para los listeners
        $this->entrega->load(['vehiculo', 'chofer']);
    }

}
