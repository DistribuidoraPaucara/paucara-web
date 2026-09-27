<?php

namespace App\Listeners;

use App\Events\PrestamoEventoAnulado;
use App\Services\Notifications\PrestamoNotificationService;
use Illuminate\Support\Facades\Log;

/**
 * Listener que envía notificaciones cuando se anula un préstamo a evento
 */
class SendPrestamoEventoAnuladoNotification
{
    protected PrestamoNotificationService $notificationService;

    public function __construct(PrestamoNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(PrestamoEventoAnulado $event): void
    {
        try {
            $prestamo = $event->prestamo;

            Log::info('🔔 SendPrestamoEventoAnuladoNotification - Listener disparado', [
                'prestamo_id' => $prestamo->id,
                'nombre_evento' => $prestamo->nombre_evento,
                'razon_anulacion' => $event->razon,
                'cantidad_detalles' => $prestamo->detalles->count(),
            ]);

            // Cargar relaciones necesarias
            if (!$prestamo->relationLoaded('creador')) {
                $prestamo->load('creador');
            }
            if (!$prestamo->relationLoaded('detalles')) {
                $prestamo->load('detalles.prestable');
            }
            if (!$prestamo->relationLoaded('chofer')) {
                $prestamo->load('chofer');
            }

            // Usar el servicio especializado
            $result = $this->notificationService->notifyPrestamoEventoAnulado($prestamo, $event->razon);

            if ($result) {
                Log::info('✅ Notificación de anulación de préstamo a evento procesada exitosamente', [
                    'prestamo_id' => $prestamo->id,
                    'nombre_evento' => $prestamo->nombre_evento,
                ]);
            } else {
                Log::warning('⚠️ La notificación WebSocket no pudo enviarse (pero se guardó en BD)', [
                    'prestamo_id' => $prestamo->id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de anulación de préstamo a evento', [
                'prestamo_id' => $event->prestamo->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
