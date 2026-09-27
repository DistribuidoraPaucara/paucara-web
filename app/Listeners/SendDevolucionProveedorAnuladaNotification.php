<?php

namespace App\Listeners;

use App\Events\DevolucionProveedorAnulada;
use App\Services\Notifications\PrestamoNotificationService;
use Illuminate\Support\Facades\Log;

class SendDevolucionProveedorAnuladaNotification
{
    protected PrestamoNotificationService $notificationService;

    public function __construct(PrestamoNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(DevolucionProveedorAnulada $event): void
    {
        try {
            $devolucion = $event->devolucion;

            Log::info('🔔 SendDevolucionProveedorAnuladaNotification - Listener disparado', [
                'devolucion_id' => $devolucion->id,
                'prestamo_id' => $devolucion->prestamo_proveedor_id,
                'razon_anulacion' => $event->razon,
                'cantidad_detalles' => $devolucion->detalles->count(),
            ]);

            if (!$devolucion->relationLoaded('prestamoProveedor')) {
                $devolucion->load('prestamoProveedor.creador');
            }
            if (!$devolucion->relationLoaded('detalles')) {
                $devolucion->load('detalles.prestable');
            }
            if (!$devolucion->relationLoaded('anuladoPor')) {
                $devolucion->load('anuladoPor');
            }

            $result = $this->notificationService->notifyDevolucionProveedorAnulada($devolucion, $event->razon);

            if ($result) {
                Log::info('✅ Notificación de anulación de devolución de préstamo a proveedor procesada exitosamente', [
                    'devolucion_id' => $devolucion->id,
                    'prestamo_id' => $devolucion->prestamo_proveedor_id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de anulación de devolución de préstamo a proveedor', [
                'devolucion_id' => $event->devolucion->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
