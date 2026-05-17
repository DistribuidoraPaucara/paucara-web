<?php

namespace App\Listeners;

use App\Events\EntregaAsignada;
use App\Models\EstadoLogistica;
use App\Models\User;
use App\Services\Notifications\EntregaNotificationService;
use App\Services\Notifications\NotificationMessageService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

/**
 * ✅ ACTUALIZADO: SendEntregaAsignadaNotification
 *
 * Usa NotificationMessageService para construir mensajes centralizados
 * Notifica:
 * 1. Chofer: Que le fue asignada una entrega
 * 2. Cliente: Que su venta fue asignada a una entrega (CLIENTE A CLIENTE)
 * 3. Preventista: Que la venta que creó fue asignada a una entrega
 */
class SendEntregaAsignadaNotification implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct(
        protected EntregaNotificationService $notificationService
    ) {}

    public function handle(EntregaAsignada $event): void
    {
        try {
            $entrega = $event->entrega;

            Log::info('📢 [SendEntregaAsignadaNotification] Procesando entrega asignada', [
                'entrega_id' => $entrega->id,
                'numero_entrega' => $entrega->numero_entrega,
                'chofer_id' => $entrega->chofer_id,
            ]);

            // ✅ NUEVO: Notificar al CHOFER que le fue asignada una entrega
            if ($entrega->chofer_id) {
                try {
                    $this->notificationService->notifyChoferEntregaAsignada($entrega);

                    Log::info('✅ [SendEntregaAsignadaNotification] Notificación enviada al chofer', [
                        'entrega_id' => $entrega->id,
                        'chofer_id' => $entrega->chofer_id,
                    ]);
                } catch (\Exception $e) {
                    Log::error('❌ [SendEntregaAsignadaNotification] Error notificando al chofer', [
                        'entrega_id' => $entrega->id,
                        'chofer_id' => $entrega->chofer_id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            // Obtener todas las ventas asociadas a esta entrega
            $ventas = $entrega->ventas()->with(['cliente', 'preventista', 'estadoLogistico'])->get();

            Log::info('📦 [SendEntregaAsignadaNotification] Ventas encontradas', [
                'entrega_id' => $entrega->id,
                'cantidad_ventas' => $ventas->count(),
            ]);

            // ✅ CLIENTE A CLIENTE: Notificar a CLIENTES Y PREVENTISTAS de cada venta asignada
            // Formato centralizado: "Entrega Folio:456 | Preparación en Carga - Juan"
            foreach ($ventas as $venta) {
                try {
                    // ✅ NUEVO: Obtener nombre del estado logístico
                    $estadoLogisticoNombre = $venta->estadoLogistico?->nombre ?? 'Pendiente';

                    // ✅ NUEVO: Construir mensaje centralizado
                    $mensajeCliente = NotificationMessageService::ventasAsignadasAEntrega(
                        entregaId: $entrega->id,
                        estadoLogistico: $estadoLogisticoNombre,
                        clienteNombre: $venta->cliente?->nombre
                    );

                    Log::info('📝 [SendEntregaAsignadaNotification] Mensaje construido', [
                        'venta_id' => $venta->id,
                        'entrega_id' => $entrega->id,
                        'estado_logistico' => $estadoLogisticoNombre,
                        'mensaje' => $mensajeCliente,
                    ]);

                    // Notificar a cliente y preventista
                    $this->notificationService->notifyVentaAsignada($venta, $entrega);

                    Log::info('✅ [SendEntregaAsignadaNotification] Notificación de venta enviada', [
                        'venta_id' => $venta->id,
                        'venta_numero' => $venta->numero,
                        'entrega_id' => $entrega->id,
                        'cliente_id' => $venta->cliente_id,
                        'cliente_nombre' => $venta->cliente?->nombre,
                        'preventista_id' => $venta->preventista_id,
                        'estado_logistico' => $estadoLogisticoNombre,
                        'mensaje_enviado' => $mensajeCliente,
                    ]);
                } catch (\Exception $e) {
                    Log::error('❌ [SendEntregaAsignadaNotification] Error notificando venta', [
                        'venta_id' => $venta->id,
                        'entrega_id' => $entrega->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

        } catch (\Exception $e) {
            Log::error('❌ [SendEntregaAsignadaNotification] Error procesando evento', [
                'entrega_id' => $event->entrega->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
