<?php

namespace App\Events;

use App\Models\Compra;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento que se dispara cuando una compra queda aprobada
 * y se registra nuevo stock disponible
 */
class CompraCompletada
{
    use Dispatchable, SerializesModels;

    public Compra $compra;

    /**
     * @param int|null $usuarioId Usuario autenticado que creó/aprobó la compra (también recibe la notificación)
     */
    public function __construct(Compra $compra, public ?int $usuarioId = null)
    {
        $this->compra = $compra;
        $this->compra->load(['proveedor', 'detalles.producto', 'usuario']);
    }
}
