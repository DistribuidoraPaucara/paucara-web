<?php

namespace App\Listeners;

use App\Events\VentaConfirmadaEntrega;
use App\Services\Notifications\EntregaNotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendVentaConfirmadaEntregaNotification implements ShouldQueue
{
    use InteractsWithQueue;

    protected $notificationService;

    public function __construct(EntregaNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function handle(VentaConfirmadaEntrega $event): void
    {
        Log::info('📢 [SendVentaConfirmadaEntregaNotification] Iniciando notificación de venta confirmada', [
            'venta_id' => $event->venta->id,
            'entrega_id' => $event->entrega->id,
            'tipo_confirmacion' => $event->confirmacion->tipo_confirmacion,
        ]);

        try {
            // Notificar al creador de la entrega (logística/admin)
            $this->notificationService->notifyVentaConfirmadaEntrega($event->venta, $event->entrega, $event->confirmacion);

            // Notificar al cliente sobre la confirmación
            $this->notificationService->notifyClienteVentaConfirmada($event->venta, $event->entrega, $event->confirmacion);

            // ✅ NUEVO: Notificar al preventista de la venta si existe
            if ($event->venta->preventista_id) {
                $preventista = \App\Models\User::find($event->venta->preventista_id);
                if ($preventista) {
                    $this->notificationService->notifyPreventistaVentaConfirmada($event->venta, $event->entrega, $event->confirmacion, $preventista);
                    Log::info('✅ [SendVentaConfirmadaEntregaNotification] Notificación enviada al preventista', [
                        'venta_id' => $event->venta->id,
                        'preventista_id' => $preventista->id,
                        'preventista_nombre' => $preventista->name,
                    ]);
                }
            }

            Log::info('✅ [SendVentaConfirmadaEntregaNotification] Notificaciones enviadas exitosamente');

        } catch (\Exception $e) {
            Log::error('❌ [SendVentaConfirmadaEntregaNotification] Error al enviar notificación', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
