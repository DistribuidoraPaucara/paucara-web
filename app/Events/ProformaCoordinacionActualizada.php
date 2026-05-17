<?php

namespace App\Events;

use App\Models\Proforma;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProformaCoordinacionActualizada
{
    use Dispatchable, SerializesModels;

    public Proforma $proforma;
    public int $usuarioId;

    /**
     * Create a new event instance.
     */
    public function __construct(Proforma $proforma, int $usuarioId)
    {
        $this->proforma = $proforma;
        $this->usuarioId = $usuarioId;
    }
}
