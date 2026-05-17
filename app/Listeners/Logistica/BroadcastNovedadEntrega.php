<?php

namespace App\Listeners\Logistica;

use App\Events\NovedadEntregaReportada;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

/**
 * Listener que asegura que el evento de novedad se propague a través de WebSocket
 *
 * El evento NovedadEntregaReportada implementa ShouldBroadcast, por lo que
 * Laravel se encargará del broadcasting automáticamente.
 */
class BroadcastNovedadEntrega implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(NovedadEntregaReportada $event): void
    {
        // El broadcasting ya está siendo manejado por Laravel
        // Este listener puede hacer tareas adicionales

        \Log::warning('Entrega: Novedad reportada', [
            'entrega_id' => $event->entrega->id,
            'chofer_id' => $event->entrega->chofer_id,
            'proforma_id' => $event->entrega->proforma_id,
            'motivo' => $event->motivo,
            'tiene_foto' => !is_null($event->fotoUrl),
            'timestamp' => now(),
        ]);

        // Aquí podrías agregar lógica adicional como:
        // - Crear ticket de soporte
        // - Notificar a gerente de logística
        // - Actualizar scorecard de chofer
        // - Activar protocolo de rescate
        // - etc
    }

    /**
     * Handle a job failure.
     */
    public function failed(NovedadEntregaReportada $event, \Exception $exception): void
    {
        \Log::error('Error en BroadcastNovedadEntrega', [
            'error' => $exception->getMessage(),
            'entrega_id' => $event->entrega->id,
        ]);
    }
}
