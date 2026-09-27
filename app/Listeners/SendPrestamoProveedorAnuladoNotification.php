<?php

namespace App\Listeners;

use App\Events\PrestamoProveedorAnulado;
use App\Services\Notifications\PrestamoNotificationService;
use Illuminate\Support\Facades\Log;

class SendPrestamoProveedorAnuladoNotification
{
    protected PrestamoNotificationService $notificationService;

    public function __construct(PrestamoNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(PrestamoProveedorAnulado $event): void
    {
        try {
            $prestamo = $event->prestamo;

            Log::info('🔔 SendPrestamoProveedorAnuladoNotification - Listener disparado', [
                'prestamo_id' => $prestamo->id,
                'proveedor_nombre' => $prestamo->proveedor?->nombre,
                'razon_anulacion' => $event->razon,
                'cantidad_detalles' => $prestamo->detalles->count(),
            ]);

            if (!$prestamo->relationLoaded('creador')) {
                $prestamo->load('creador');
            }
            if (!$prestamo->relationLoaded('detalles')) {
                $prestamo->load('detalles.prestable');
            }
            if (!$prestamo->relationLoaded('proveedor')) {
                $prestamo->load('proveedor');
            }

            $result = $this->notificationService->notifyPrestamoProveedorAnulado($prestamo, $event->razon);

            if ($result) {
                Log::info('✅ Notificación de anulación de préstamo a proveedor procesada exitosamente', [
                    'prestamo_id' => $prestamo->id,
                    'proveedor_nombre' => $prestamo->proveedor?->nombre,
                ]);
            } else {
                Log::warning('⚠️ La notificación WebSocket no pudo enviarse (pero se guardó en BD)', [
                    'prestamo_id' => $prestamo->id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de anulación de préstamo a proveedor', [
                'prestamo_id' => $event->prestamo->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
