<?php

namespace App\Events;

use App\Models\DevolucionPrestamo;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DevolucionClienteAnulada
{
    use Dispatchable, SerializesModels;

    public DevolucionPrestamo $devolucion;
    public ?string $razon;

    public function __construct(DevolucionPrestamo $devolucion, ?string $razon = null)
    {
        $this->devolucion = $devolucion;
        $this->razon = $razon;
        $this->devolucion->load([
            'prestamoCliente',
            'prestamoCliente.cliente',
            'prestamoCliente.creador',
            'anuladoPor',
            'detalles.prestable'
        ]);
    }
}
