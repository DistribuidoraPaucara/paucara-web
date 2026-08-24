<?php

namespace App\Listeners;

use App\Events\DevolucionRegistrada;
use App\Services\Notifications\DevolucionNotificationService;
use Illuminate\Support\Facades\Log;

/**
 * Listener que envía notificaciones de devolución registrada
 *
 * Se ejecuta automáticamente y síncronamente cuando se dispara el evento DevolucionRegistrada
 * No implementa ShouldQueue porque queremos ejecución inmediata
 *
 * ✅ Utiliza DevolucionNotificationService que:
 *    - Guarda la notificación en BD (persistente)
 *    - Envía notificación en tiempo real vía WebSocket
 */
class SendDevolucionRegisteredNotification
{
    protected DevolucionNotificationService $notificationService;

    public function __construct(DevolucionNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle the event.
     *
     * Delega al DevolucionNotificationService para:
     * 1. Guardar la notificación en la base de datos (tabla notifications)
     * 2. Enviar notificación en tiempo real al servidor WebSocket Node.js
     */
    public function handle(DevolucionRegistrada $event): void
    {
        try {
            $devolucion = $event->devolucion;

            Log::info('🔔 SendDevolucionRegisteredNotification - Listener disparado', [
                'devolucion_id' => $devolucion->id,
                'prestamo_id' => $devolucion->prestamo_cliente_id,
                'prestamo_numero' => $devolucion->prestamo->numero ?? 'N/A',
                'created_by' => $devolucion->created_by,
                'chofer_id' => $devolucion->chofer_id,
            ]);

            // Cargar relaciones necesarias si no están cargadas
            if (!$devolucion->relationLoaded('prestamo')) {
                $devolucion->load('prestamo.cliente');
            }
            if (!$devolucion->relationLoaded('detalles')) {
                $devolucion->load('detalles.detallePrestamoCliente.prestable');
            }

            // ✅ Usar el servicio especializado de devoluciones
            $result = $this->notificationService->notifyRegistered($devolucion);

            if ($result) {
                Log::info('✅ Notificación de devolución registrada procesada exitosamente', [
                    'devolucion_id' => $devolucion->id,
                    'prestamo_numero' => $devolucion->prestamo->numero ?? 'N/A',
                ]);
            } else {
                Log::warning('⚠️ La notificación WebSocket no pudo enviarse (pero se guardó en BD)', [
                    'devolucion_id' => $devolucion->id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de devolución', [
                'devolucion_id' => $event->devolucion->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
