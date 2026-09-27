<?php

namespace App\Listeners;

use App\Events\PrestamoClienteAnulado;
use App\Services\Notifications\PrestamoNotificationService;
use Illuminate\Support\Facades\Log;

/**
 * Listener que envía notificaciones cuando se anula un préstamo a cliente
 *
 * Se ejecuta automáticamente y síncronamente cuando se dispara el evento PrestamoClienteAnulado
 * No implementa ShouldQueue porque queremos ejecución inmediata
 *
 * ✅ Utiliza PrestamoNotificationService que:
 *    - Guarda la notificación en BD (persistente)
 *    - Envía notificación en tiempo real vía WebSocket
 */
class SendPrestamoClienteAnuladoNotification
{
    protected PrestamoNotificationService $notificationService;

    public function __construct(PrestamoNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle the event.
     *
     * Delega al PrestamoNotificationService para:
     * 1. Guardar la notificación en la base de datos (tabla notifications)
     * 2. Enviar notificación en tiempo real al servidor WebSocket Node.js
     */
    public function handle(PrestamoClienteAnulado $event): void
    {
        try {
            $prestamo = $event->prestamo;

            Log::info('🔔 SendPrestamoClienteAnuladoNotification - Listener disparado', [
                'prestamo_id' => $prestamo->id,
                'cliente_id' => $prestamo->cliente_id,
                'razon_anulacion' => $event->razon,
                'cantidad_detalles' => $prestamo->detalles->count(),
            ]);

            // Cargar relaciones necesarias si no están cargadas
            if (!$prestamo->relationLoaded('cliente')) {
                $prestamo->load('cliente');
            }
            if (!$prestamo->relationLoaded('detalles')) {
                $prestamo->load('detalles.prestable');
            }
            if (!$prestamo->relationLoaded('creador')) {
                $prestamo->load('creador');
            }
            if (!$prestamo->relationLoaded('chofer')) {
                $prestamo->load('chofer');
            }

            // ✅ Usar el servicio especializado de préstamos
            $result = $this->notificationService->notifyPrestamoClienteAnulado($prestamo, $event->razon);

            if ($result) {
                Log::info('✅ Notificación de anulación de préstamo a cliente procesada exitosamente', [
                    'prestamo_id' => $prestamo->id,
                    'cliente_id' => $prestamo->cliente_id,
                ]);
            } else {
                Log::warning('⚠️ La notificación WebSocket no pudo enviarse (pero se guardó en BD)', [
                    'prestamo_id' => $prestamo->id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de anulación de préstamo a cliente', [
                'prestamo_id' => $event->prestamo->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
