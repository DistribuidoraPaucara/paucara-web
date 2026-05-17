<?php

namespace App\Listeners\Logistica;

use App\Events\EntregaConfirmada;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

/**
 * Listener que asegura que el evento de confirmación de entrega se propague
 *
 * El evento EntregaConfirmada implementa ShouldBroadcast, por lo que
 * Laravel se encargará del broadcasting automáticamente.
 */
class BroadcastEntregaConfirmada implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(EntregaConfirmada $event): void
    {
        // El broadcasting ya está siendo manejado por Laravel
        // Este listener puede hacer tareas adicionales

        \Log::info('Entrega: Confirmada exitosamente', [
            'entrega_id' => $event->entrega->id,
            'chofer_id' => $event->entrega->chofer_id,
            'proforma_id' => $event->entrega->proforma_id,
            'tiene_firma' => !is_null($event->firmaUrl),
            'cantidad_fotos' => count($event->fotosUrls),
            'timestamp' => now(),
        ]);

        // Aquí podrías agregar lógica adicional como:
        // - Actualizar métricas de entregas
        // - Generar certificado de entrega
        // - Enviar receipt adicional
        // - Actualizar histórico de cliente
        // - etc
    }

    /**
     * Handle a job failure.
     */
    public function failed(EntregaConfirmada $event, \Exception $exception): void
    {
        \Log::error('Error en BroadcastEntregaConfirmada', [
            'error' => $exception->getMessage(),
            'entrega_id' => $event->entrega->id,
        ]);
    }
}
