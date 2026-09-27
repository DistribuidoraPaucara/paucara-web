<?php

namespace App\Listeners;

use App\Events\DevolucionClienteRegistrada;
use App\Services\Notifications\PrestamoNotificationService;
use Illuminate\Support\Facades\Log;

class SendDevolucionClienteRegistradaNotification
{
    protected PrestamoNotificationService $notificationService;

    public function __construct(PrestamoNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(DevolucionClienteRegistrada $event): void
    {
        try {
            $devolucion = $event->devolucion;

            Log::info('🔔 SendDevolucionClienteRegistradaNotification - Listener disparado', [
                'devolucion_id' => $devolucion->id,
                'prestamo_id' => $devolucion->prestamo_cliente_id,
                'cliente_nombre' => $devolucion->prestamoCliente?->cliente?->nombre,
                'cantidad_detalles' => $devolucion->detalles->count(),
            ]);

            if (!$devolucion->relationLoaded('prestamoCliente')) {
                $devolucion->load('prestamoCliente.cliente.creador');
            }
            if (!$devolucion->relationLoaded('detalles')) {
                $devolucion->load('detalles.prestable');
            }

            $result = $this->notificationService->notifyDevolucionClienteRegistrada($devolucion);

            if ($result) {
                Log::info('✅ Notificación de devolución de préstamo a cliente registrada exitosamente', [
                    'devolucion_id' => $devolucion->id,
                    'prestamo_id' => $devolucion->prestamo_cliente_id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de devolución de préstamo a cliente', [
                'devolucion_id' => $event->devolucion->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
