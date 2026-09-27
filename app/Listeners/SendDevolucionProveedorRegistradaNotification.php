<?php

namespace App\Listeners;

use App\Events\DevolucionProveedorRegistrada;
use App\Services\Notifications\PrestamoNotificationService;
use Illuminate\Support\Facades\Log;

class SendDevolucionProveedorRegistradaNotification
{
    protected PrestamoNotificationService $notificationService;

    public function __construct(PrestamoNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(DevolucionProveedorRegistrada $event): void
    {
        try {
            $devolucion = $event->devolucion;

            Log::info('🔔 SendDevolucionProveedorRegistradaNotification - Listener disparado', [
                'devolucion_id' => $devolucion->id,
                'prestamo_id' => $devolucion->prestamo_proveedor_id,
                'cantidad_detalles' => $devolucion->detalles->count(),
            ]);

            if (!$devolucion->relationLoaded('prestamoProveedor')) {
                $devolucion->load('prestamoProveedor.creador');
            }
            if (!$devolucion->relationLoaded('detalles')) {
                $devolucion->load('detalles.prestable');
            }

            $result = $this->notificationService->notifyDevolucionProveedorRegistrada($devolucion);

            if ($result) {
                Log::info('✅ Notificación de devolución de préstamo a proveedor registrada exitosamente', [
                    'devolucion_id' => $devolucion->id,
                    'prestamo_id' => $devolucion->prestamo_proveedor_id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de devolución de préstamo a proveedor', [
                'devolucion_id' => $event->devolucion->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
