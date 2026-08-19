<?php

namespace App\Events;

use App\Models\PrestamoProveedor;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento que se dispara cuando se crea un préstamo a proveedor
 */
class PrestamoProveedorCreado
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $prestamo;

    public function __construct(PrestamoProveedor $prestamo)
    {
        $this->prestamo = $prestamo->load(['proveedor', 'creador', 'detalles.prestable']);
    }
}
