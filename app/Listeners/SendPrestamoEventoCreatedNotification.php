<?php

namespace App\Listeners;

use App\Events\PrestamoEventoCreado;
use App\Services\Notifications\PrestamoNotificationService;
use Illuminate\Support\Facades\Log;

/**
 * Listener que envía notificaciones de préstamo a evento creado
 *
 * Se ejecuta automáticamente y síncronamente cuando se dispara el evento PrestamoEventoCreado
 * No implementa ShouldQueue porque queremos ejecución inmediata
 *
 * ✅ Utiliza PrestamoNotificationService que:
 *    - Guarda la notificación en BD (persistente)
 *    - Envía notificación en tiempo real vía WebSocket
 */
class SendPrestamoEventoCreatedNotification
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
    public function handle(PrestamoEventoCreado $event): void
    {
        try {
            $prestamo = $event->prestamo;

            Log::info('🔔 SendPrestamoEventoCreatedNotification - Listener disparado', [
                'prestamo_id' => $prestamo->id,
                'nombre_evento' => $prestamo->nombre_evento,
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
            $result = $this->notificationService->notifyPrestamoEventoCreated($prestamo);

            if ($result) {
                Log::info('✅ Notificación de préstamo a evento creada procesada exitosamente', [
                    'prestamo_id' => $prestamo->id,
                    'nombre_evento' => $prestamo->nombre_evento,
                ]);
            } else {
                Log::warning('⚠️ La notificación WebSocket no pudo enviarse (pero se guardó en BD)', [
                    'prestamo_id' => $prestamo->id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de préstamo a evento creado', [
                'prestamo_id' => $event->prestamo->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
