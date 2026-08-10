<?php

namespace App\Listeners;

use App\Events\EntregaListoParaEntrega;
use App\Services\Notifications\EntregaNotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

/**
 * ✅ NUEVO: SendEntregaListoParaEntregaNotification
 *
 * Notifica cuando una entrega está lista para salir a entrega
 * Notifica a:
 * 1. Usuario creador de la entrega
 * 2. Clientes de las ventas asignadas
 */
class SendEntregaListoParaEntregaNotification implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct(
        protected EntregaNotificationService $notificationService
    ) {}

    public function handle(EntregaListoParaEntrega $event): void
    {
        try {
            $entrega = $event->entrega;

            Log::info('📢 [SendEntregaListoParaEntregaNotification] Procesando notificación', [
                'entrega_id' => $entrega->id,
                'numero_entrega' => $entrega->numero_entrega,
                'created_by' => $entrega->created_by,
            ]);

            // 1️⃣ Notificar al creador de la entrega
            if ($entrega->created_by) {
                try {
                    $this->notificationService->notifyEntregaListoParaEntrega($entrega);
                    Log::info('✅ [SendEntregaListoParaEntregaNotification] Notificación enviada al creador', [
                        'entrega_id' => $entrega->id,
                        'creator_id' => $entrega->created_by,
                    ]);
                } catch (\Exception $e) {
                    Log::error('❌ [SendEntregaListoParaEntregaNotification] Error notificando al creador', [
                        'entrega_id' => $entrega->id,
                        'creator_id' => $entrega->created_by,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            // 2️⃣ Notificar a los clientes de las ventas
            $ventas = $entrega->ventas()->with(['cliente'])->get();

            Log::info('📦 [SendEntregaListoParaEntregaNotification] Ventas encontradas', [
                'entrega_id' => $entrega->id,
                'cantidad_ventas' => $ventas->count(),
            ]);

            foreach ($ventas as $venta) {
                try {
                    // Notificar al cliente
                    $this->notificationService->notifyClienteEntregaListo($venta, $entrega);

                    // Notificar a preventista
                    if ($venta->preventista_id) {
                        $preventista = \App\Models\User::find($venta->preventista_id);
                        if ($preventista) {
                            $this->notificationService->notifyVentaEnTransito($venta, $entrega, $preventista, 'preventista');
                        }
                    }

                    // Notificar a managers y admins
                    $managerAdminUsers = \App\Models\User::role(['manager', 'Manager', 'admin', 'Admin'])->get();
                    foreach ($managerAdminUsers as $user) {
                        $this->notificationService->notifyVentaEnTransito($venta, $entrega, $user, 'manager_admin');
                    }

                    Log::info('✅ [SendEntregaListoParaEntregaNotification] Notificaciones enviadas', [
                        'venta_id' => $venta->id,
                        'venta_numero' => $venta->numero,
                        'entrega_id' => $entrega->id,
                        'cliente_id' => $venta->cliente_id,
                        'cliente_nombre' => $venta->cliente?->nombre,
                        'preventista_id' => $venta->preventista_id,
                    ]);
                } catch (\Exception $e) {
                    Log::error('❌ [SendEntregaListoParaEntregaNotification] Error notificando', [
                        'venta_id' => $venta->id,
                        'entrega_id' => $entrega->id,
                        'cliente_id' => $venta->cliente_id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

        } catch (\Exception $e) {
            Log::error('❌ [SendEntregaListoParaEntregaNotification] Error procesando evento', [
                'entrega_id' => $event->entrega->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
