<?php

namespace App\Listeners;

use App\Events\DevolucionClienteAnulada;
use App\Services\Notifications\PrestamoNotificationService;
use Illuminate\Support\Facades\Log;

class SendDevolucionClienteAnuladaNotification
{
    protected PrestamoNotificationService $notificationService;

    public function __construct(PrestamoNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(DevolucionClienteAnulada $event): void
    {
        try {
            $devolucion = $event->devolucion;

            Log::info('🔔 SendDevolucionClienteAnuladaNotification - Listener disparado', [
                'devolucion_id' => $devolucion->id,
                'prestamo_id' => $devolucion->prestamo_cliente_id,
                'cliente_nombre' => $devolucion->prestamoCliente?->cliente?->nombre,
                'razon_anulacion' => $event->razon,
                'cantidad_detalles' => $devolucion->detalles->count(),
            ]);

            if (!$devolucion->relationLoaded('prestamoCliente')) {
                $devolucion->load('prestamoCliente.cliente.creador');
            }
            if (!$devolucion->relationLoaded('detalles')) {
                $devolucion->load('detalles.prestable');
            }
            if (!$devolucion->relationLoaded('anuladoPor')) {
                $devolucion->load('anuladoPor');
            }

            $result = $this->notificationService->notifyDevolucionClienteAnulada($devolucion, $event->razon);

            if ($result) {
                Log::info('✅ Notificación de anulación de devolución de préstamo a cliente procesada exitosamente', [
                    'devolucion_id' => $devolucion->id,
                    'prestamo_id' => $devolucion->prestamo_cliente_id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de anulación de devolución de préstamo a cliente', [
                'devolucion_id' => $event->devolucion->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
