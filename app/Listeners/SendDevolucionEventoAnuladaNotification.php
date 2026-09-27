<?php

namespace App\Listeners;

use App\Events\DevolucionEventoAnulada;
use App\Services\Notifications\PrestamoNotificationService;
use Illuminate\Support\Facades\Log;

class SendDevolucionEventoAnuladaNotification
{
    protected PrestamoNotificationService $notificationService;

    public function __construct(PrestamoNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(DevolucionEventoAnulada $event): void
    {
        try {
            $devolucion = $event->devolucion;

            Log::info('🔔 SendDevolucionEventoAnuladaNotification - Listener disparado', [
                'devolucion_id' => $devolucion->id,
                'prestamo_id' => $devolucion->prestamo_evento_id,
                'razon_anulacion' => $event->razon,
                'cantidad_detalles' => $devolucion->detalles->count(),
            ]);

            if (!$devolucion->relationLoaded('prestamoEvento')) {
                $devolucion->load('prestamoEvento.creador');
            }
            if (!$devolucion->relationLoaded('detalles')) {
                $devolucion->load('detalles.prestable');
            }
            if (!$devolucion->relationLoaded('anuladoPor')) {
                $devolucion->load('anuladoPor');
            }

            $result = $this->notificationService->notifyDevolucionEventoAnulada($devolucion, $event->razon);

            if ($result) {
                Log::info('✅ Notificación de anulación de devolución de préstamo a evento procesada exitosamente', [
                    'devolucion_id' => $devolucion->id,
                    'prestamo_id' => $devolucion->prestamo_evento_id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de anulación de devolución de préstamo a evento', [
                'devolucion_id' => $event->devolucion->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
