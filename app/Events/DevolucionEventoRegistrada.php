<?php

namespace App\Events;

use App\Models\DevolucionPrestamoEvento;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DevolucionEventoRegistrada
{
    use Dispatchable, SerializesModels;

    public DevolucionPrestamoEvento $devolucion;

    public function __construct(DevolucionPrestamoEvento $devolucion)
    {
        $this->devolucion = $devolucion;
        $this->devolucion->load([
            'prestamoEvento',
            'prestamoEvento.creador',
            'registradoPor',
            'detalles.prestable'
        ]);
    }
}
