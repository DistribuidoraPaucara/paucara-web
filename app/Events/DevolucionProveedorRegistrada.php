<?php

namespace App\Events;

use App\Models\DevolucionPrestamoProveedor;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DevolucionProveedorRegistrada
{
    use Dispatchable, SerializesModels;

    public DevolucionPrestamoProveedor $devolucion;

    public function __construct(DevolucionPrestamoProveedor $devolucion)
    {
        $this->devolucion = $devolucion;
        $this->devolucion->load([
            'prestamoProveedor',
            'prestamoProveedor.creador',
            'registradoPor',
            'detalles.prestable'
        ]);
    }
}
