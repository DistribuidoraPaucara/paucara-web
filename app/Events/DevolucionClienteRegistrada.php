<?php

namespace App\Events;

use App\Models\DevolucionPrestamo;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DevolucionClienteRegistrada
{
    use Dispatchable, SerializesModels;

    public DevolucionPrestamo $devolucion;

    public function __construct(DevolucionPrestamo $devolucion)
    {
        $this->devolucion = $devolucion;
        $this->devolucion->load([
            'prestamoCliente',
            'prestamoCliente.cliente',
            'prestamoCliente.creador',
            'registradoPor',
            'detalles.prestable'
        ]);
    }
}
