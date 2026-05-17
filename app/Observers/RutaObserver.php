<?php

namespace App\Observers;

use App\Events\RutaModificada;
use App\Models\Ruta;

class RutaObserver
{
    /**
     * Handle the Ruta "updated" event.
     */
    public function updated(Ruta $ruta): void
    {
        // Si el estado cambió, disparar evento
        if ($ruta->isDirty('estado')) {
            RutaModificada::dispatch($ruta, 'estado');
        }

        // Si la hora de salida cambió
        if ($ruta->isDirty('hora_salida')) {
            RutaModificada::dispatch($ruta, 'hora_salida');
        }

        // Si la hora de llegada cambió
        if ($ruta->isDirty('hora_llegada')) {
            RutaModificada::dispatch($ruta, 'hora_llegada');
        }
    }
}
