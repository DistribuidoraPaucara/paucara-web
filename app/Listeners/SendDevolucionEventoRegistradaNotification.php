<?php

namespace App\Listeners;

use App\Events\DevolucionEventoRegistrada;
use App\Services\Notifications\PrestamoNotificationService;
use Illuminate\Support\Facades\Log;

class SendDevolucionEventoRegistradaNotification
{
    protected PrestamoNotificationService $notificationService;

    public function __construct(PrestamoNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(DevolucionEventoRegistrada $event): void
    {
        try {
            $devolucion = $event->devolucion;

            Log::info('🔔 SendDevolucionEventoRegistradaNotification - Listener disparado', [
                'devolucion_id' => $devolucion->id,
                'prestamo_id' => $devolucion->prestamo_evento_id,
                'cantidad_detalles' => $devolucion->detalles->count(),
            ]);

            if (!$devolucion->relationLoaded('prestamoEvento')) {
                $devolucion->load('prestamoEvento.creador');
            }
            if (!$devolucion->relationLoaded('detalles')) {
                $devolucion->load('detalles.prestable');
            }

            $result = $this->notificationService->notifyDevolucionEventoRegistrada($devolucion);

            if ($result) {
                Log::info('✅ Notificación de devolución de préstamo a evento registrada exitosamente', [
                    'devolucion_id' => $devolucion->id,
                    'prestamo_id' => $devolucion->prestamo_evento_id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de devolución de préstamo a evento', [
                'devolucion_id' => $event->devolucion->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
