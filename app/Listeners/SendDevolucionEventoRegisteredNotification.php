<?php

namespace App\Listeners;

use App\Events\DevolucionEventoRegistrada;
use App\Services\Notifications\DevolucionEventoNotificationService;
use Illuminate\Support\Facades\Log;

/**
 * Listener que envía notificaciones de devolución de evento registrada
 */
class SendDevolucionEventoRegisteredNotification
{
    protected DevolucionEventoNotificationService $notificationService;

    public function __construct(DevolucionEventoNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(DevolucionEventoRegistrada $event): void
    {
        try {
            $devolucion = $event->devolucion;

            Log::info('🔔 SendDevolucionEventoRegisteredNotification - Listener disparado', [
                'devolucion_id' => $devolucion->id,
                'prestamo_id' => $devolucion->prestamo_evento_id,
                'evento_nombre' => $devolucion->prestamoEvento->nombre_evento ?? 'N/A',
            ]);

            if (!$devolucion->relationLoaded('prestamoEvento')) {
                $devolucion->load('prestamoEvento.cliente');
            }
            if (!$devolucion->relationLoaded('detalles')) {
                $devolucion->load('detalles.prestamoEventoDetalle.prestable');
            }

            $result = $this->notificationService->notifyRegistered($devolucion);

            if ($result) {
                Log::info('✅ Notificación de devolución evento procesada exitosamente', [
                    'devolucion_id' => $devolucion->id,
                    'evento_nombre' => $devolucion->prestamoEvento->nombre_evento ?? 'N/A',
                ]);
            } else {
                Log::warning('⚠️ La notificación WebSocket no pudo enviarse (pero se guardó en BD)', [
                    'devolucion_id' => $devolucion->id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de devolución evento', [
                'devolucion_id' => $event->devolucion->id ?? null,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
