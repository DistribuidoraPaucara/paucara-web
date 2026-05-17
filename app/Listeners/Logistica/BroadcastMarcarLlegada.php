<?php

namespace App\Listeners\Logistica;

use App\Events\MarcarLlegadaConfirmada;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

/**
 * Listener que asegura que el evento de llegada se propague a través de WebSocket
 *
 * El evento MarcarLlegadaConfirmada implementa ShouldBroadcast, por lo que
 * Laravel se encargará del broadcasting. Este listener es una capa adicional
 * que puede hacer logging, notificaciones adicionales, etc.
 */
class BroadcastMarcarLlegada implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(MarcarLlegadaConfirmada $event): void
    {
        // El broadcasting ya está siendo manejado por Laravel
        // Este listener puede hacer tareas adicionales como:

        \Log::info('Entrega: Chofer llegó a destino', [
            'entrega_id' => $event->entrega->id,
            'chofer_id' => $event->entrega->chofer_id,
            'ubicacion' => $event->ubicacion,
            'timestamp' => now(),
        ]);

        // Aquí podrías agregar lógica adicional como:
        // - Actualizar estadísticas
        // - Generar reportes
        // - Actualizar caché
        // - etc
    }

    /**
     * Handle a job failure.
     */
    public function failed(MarcarLlegadaConfirmada $event, \Exception $exception): void
    {
        \Log::error('Error en BroadcastMarcarLlegada', [
            'error' => $exception->getMessage(),
            'entrega_id' => $event->entrega->id,
        ]);
    }
}
