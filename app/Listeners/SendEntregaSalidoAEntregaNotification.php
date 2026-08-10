<?php

namespace App\Listeners;

use App\Events\EntregaSalidoAEntrega;
use App\Services\Notifications\EntregaNotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

/**
 * ✅ NUEVO: SendEntregaSalidoAEntregaNotification
 * Notifica cuando una entrega sale a entrega (cambia de PREPARACION_CARGA a EN_TRANSITO)
 * Mensaje amigable: "Tu carga ya está en camino" o "Tu pedido salió a entrega"
 */
class SendEntregaSalidoAEntregaNotification implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct(
        protected EntregaNotificationService $notificationService
    ) {}

    public function handle(EntregaSalidoAEntrega $event): void
    {
        try {
            $entrega = $event->entrega;

            Log::info('📦 [SendEntregaSalidoAEntregaNotification] Procesando notificación', [
                'entrega_id' => $entrega->id,
                'numero_entrega' => $entrega->numero_entrega,
                'estado_anterior' => $event->estadoAnterior,
            ]);

            // Notificar a los clientes de las ventas
            $ventas = $entrega->ventas()->with(['cliente', 'preventista'])->get();

            Log::info('📦 [SendEntregaSalidoAEntregaNotification] Ventas encontradas', [
                'entrega_id' => $entrega->id,
                'cantidad_ventas' => $ventas->count(),
            ]);

            foreach ($ventas as $venta) {
                try {
                    // 1️⃣ Notificar al cliente: "Tu pedido salió a entrega"
                    $this->notificationService->notifyClienteEntregaSalidoAEntrega($venta, $entrega);

                    // 2️⃣ Notificar al preventista
                    if ($venta->preventista_id) {
                        $preventista = \App\Models\User::find($venta->preventista_id);
                        if ($preventista) {
                            $this->notificationService->notifyPreventistaEntregaSalidoAEntrega($venta, $entrega, $preventista);
                        }
                    }

                    Log::info('✅ [SendEntregaSalidoAEntregaNotification] Notificaciones enviadas', [
                        'venta_id' => $venta->id,
                        'venta_numero' => $venta->numero,
                        'entrega_id' => $entrega->id,
                        'cliente_id' => $venta->cliente_id,
                    ]);
                } catch (\Exception $e) {
                    Log::error('❌ [SendEntregaSalidoAEntregaNotification] Error notificando', [
                        'venta_id' => $venta->id,
                        'entrega_id' => $entrega->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            Log::info('✅ [SendEntregaSalidoAEntregaNotification] Notificaciones enviadas exitosamente');

        } catch (\Exception $e) {
            Log::error('❌ [SendEntregaSalidoAEntregaNotification] Error procesando evento', [
                'entrega_id' => $event->entrega->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
