<?php

namespace App\Listeners;

use App\Events\PrestamoProveedorCreado;
use App\Services\Notifications\PrestamoNotificationService;
use Illuminate\Support\Facades\Log;

/**
 * Listener que envía notificaciones de préstamo a proveedor creado
 */
class SendPrestamoProveedorCreatedNotification
{
    protected PrestamoNotificationService $notificationService;

    public function __construct(PrestamoNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(PrestamoProveedorCreado $event): void
    {
        try {
            $prestamo = $event->prestamo;

            Log::info('🔔 SendPrestamoProveedorCreatedNotification - Listener disparado', [
                'prestamo_id' => $prestamo->id,
                'proveedor_id' => $prestamo->proveedor_id,
                'cantidad_detalles' => $prestamo->detalles->count(),
            ]);

            if (!$prestamo->relationLoaded('proveedor')) {
                $prestamo->load('proveedor');
            }
            if (!$prestamo->relationLoaded('detalles')) {
                $prestamo->load('detalles.prestable');
            }
            if (!$prestamo->relationLoaded('creador')) {
                $prestamo->load('creador');
            }

            $result = $this->notificationService->notifyPrestamoProveedorCreated($prestamo);

            if ($result) {
                Log::info('✅ Notificación de préstamo a proveedor creada procesada exitosamente', [
                    'prestamo_id' => $prestamo->id,
                    'proveedor_id' => $prestamo->proveedor_id,
                ]);
            } else {
                Log::warning('⚠️ La notificación WebSocket no pudo enviarse (pero se guardó en BD)', [
                    'prestamo_id' => $prestamo->id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de préstamo a proveedor creado', [
                'prestamo_id' => $event->prestamo->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
