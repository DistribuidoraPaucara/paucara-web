<?php

namespace App\Events;

use App\Models\DevolucionPrestamoProveedor;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DevolucionProveedorAnulada
{
    use Dispatchable, SerializesModels;

    public DevolucionPrestamoProveedor $devolucion;
    public ?string $razon;

    public function __construct(DevolucionPrestamoProveedor $devolucion, ?string $razon = null)
    {
        $this->devolucion = $devolucion;
        $this->razon = $razon;
        $this->devolucion->load([
            'prestamoProveedor',
            'prestamoProveedor.creador',
            'anuladoPor',
            'detalles.prestable'
        ]);
    }
}
