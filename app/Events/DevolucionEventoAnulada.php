<?php

namespace App\Events;

use App\Models\DevolucionPrestamoEvento;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DevolucionEventoAnulada
{
    use Dispatchable, SerializesModels;

    public DevolucionPrestamoEvento $devolucion;
    public ?string $razon;

    public function __construct(DevolucionPrestamoEvento $devolucion, ?string $razon = null)
    {
        $this->devolucion = $devolucion;
        $this->razon = $razon;
        $this->devolucion->load([
            'prestamoEvento',
            'prestamoEvento.creador',
            'anuladoPor',
            'detalles.prestable'
        ]);
    }
}
