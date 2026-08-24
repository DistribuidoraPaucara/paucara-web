<?php

namespace App\Listeners;

use App\Events\DevolucionProveedorRegistrada;
use App\Services\Notifications\DevolucionProveedorNotificationService;
use Illuminate\Support\Facades\Log;

class SendDevolucionProveedorRegisteredNotification
{
    protected DevolucionProveedorNotificationService $notificationService;

    public function __construct(DevolucionProveedorNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(DevolucionProveedorRegistrada $event): void
    {
        try {
            $devolucion = $event->devolucion;

            Log::info('🔔 SendDevolucionProveedorRegisteredNotification - Listener disparado', [
                'devolucion_id' => $devolucion->id,
                'prestamo_id' => $devolucion->prestamo_proveedor_id,
                'proveedor_nombre' => $devolucion->prestamo->proveedor?->nombre ?? 'N/A',
            ]);

            if (!$devolucion->relationLoaded('prestamo')) {
                $devolucion->load('prestamo.proveedor', 'prestamo.chofer');
            }
            if (!$devolucion->relationLoaded('detalles')) {
                $devolucion->load('detalles.detallePrestamoProveedor.prestable');
            }

            $result = $this->notificationService->notifyRegistered($devolucion);

            if ($result) {
                Log::info('✅ Notificación de devolución proveedor procesada exitosamente', [
                    'devolucion_id' => $devolucion->id,
                    'proveedor_nombre' => $devolucion->prestamo->proveedor?->nombre ?? 'N/A',
                ]);
            } else {
                Log::warning('⚠️ La notificación WebSocket no pudo enviarse (pero se guardó en BD)', [
                    'devolucion_id' => $devolucion->id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de devolución proveedor', [
                'devolucion_id' => $event->devolucion->id ?? null,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
