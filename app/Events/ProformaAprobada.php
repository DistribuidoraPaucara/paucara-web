<?php

namespace App\Events;

use App\Models\Proforma;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProformaAprobada
{
    use Dispatchable, SerializesModels;

    public Proforma $proforma;
    public ?int $usuarioAprobadorId;

    public function __construct(Proforma $proforma, ?int $usuarioAprobadorId = null)
    {
        $this->proforma = $proforma;
        $this->usuarioAprobadorId = $usuarioAprobadorId ?? auth()->id();

        $this->proforma->load(['cliente', 'usuarioAprobador', 'usuarioCreador']);
    }
}
