<?php

namespace App\Observers;

use App\Events\RutaDetalleActualizado;
use App\Models\RutaDetalle;

class RutaDetalleObserver
{
    /**
     * Handle the RutaDetalle "updated" event.
     */
    public function updated(RutaDetalle $detalle): void
    {
        // Si el estado cambió, disparar evento
        if ($detalle->isDirty('estado')) {
            $estado_anterior = $detalle->getOriginal('estado');
            RutaDetalleActualizado::dispatch($detalle, $estado_anterior);
        }

        // Si la hora de entrega real se registró
        if ($detalle->isDirty('hora_entrega_real')) {
            RutaDetalleActualizado::dispatch($detalle, $detalle->getOriginal('estado'));
        }
    }
}
