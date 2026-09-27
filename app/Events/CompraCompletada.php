<?php

namespace App\Events;

use App\Models\Compra;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento que se dispara cuando se completa una compra
 * y se registra nuevo stock disponible
 */
class CompraCompletada
{
    use Dispatchable, SerializesModels;

    public Compra $compra;

    public function __construct(Compra $compra)
    {
        $this->compra = $compra;
        $this->compra->load(['proveedor', 'detalles.producto', 'usuario']);
    }
}
