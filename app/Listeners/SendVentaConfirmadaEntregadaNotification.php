<?php

namespace App\Listeners;

use App\Events\VentaConfirmadaEntregada;
use App\Services\Notifications\EntregaNotificationService;
use Illuminate\Support\Facades\Log;

/**
 * Listener que envía notificaciones cuando un chofer confirma venta entregada
 *
 * Se ejecuta automáticamente y síncronamente cuando se dispara el evento VentaConfirmadaEntregada
 * No implementa ShouldQueue porque queremos ejecución inmediata
 *
 * ✅ Utiliza EntregaNotificationService que:
 *    - Guarda la notificación en BD (persistente)
 *    - Envía notificación en tiempo real vía WebSocket
 */
class SendVentaConfirmadaEntregadaNotification
{
    protected EntregaNotificationService $notificationService;

    public function __construct(EntregaNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle the event.
     *
     * Delega al EntregaNotificationService para:
     * 1. Guardar la notificación en la base de datos (tabla notifications)
     * 2. Enviar notificación en tiempo real al servidor WebSocket Node.js
     */
    public function handle(VentaConfirmadaEntregada $event): void
    {
        try {
            $venta = $event->venta;
            $entrega = $event->entrega;

            Log::info('🔔 SendVentaConfirmadaEntregadaNotification - Listener disparado', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'entrega_id' => $entrega->id,
                'tipo_entrega' => $event->tipoEntrega,
            ]);

            // Cargar relaciones necesarias si no están cargadas
            if (!$venta->relationLoaded('cliente')) {
                $venta->load('cliente');
            }
            if (!$venta->relationLoaded('preventista')) {
                $venta->load('preventista');
            }
            if (!$entrega->relationLoaded('chofer')) {
                $entrega->load('chofer');
            }

            // ✅ Usar el servicio especializado de entregas
            $result = $this->notificationService->notifyVentaConfirmadaEntregada(
                venta: $venta,
                entrega: $entrega,
                confirmacion: $event->confirmacion,
                tipoEntrega: $event->tipoEntrega,
                tipoNovedad: $event->tipoNovedad,
                estadoPago: $event->estadoPago,
                totalRecibido: $event->totalRecibido
            );

            if ($result) {
                Log::info('✅ Notificación de venta confirmada entregada procesada exitosamente', [
                    'venta_id' => $venta->id,
                    'venta_numero' => $venta->numero,
                    'tipo_entrega' => $event->tipoEntrega,
                ]);
            } else {
                Log::warning('⚠️ La notificación WebSocket no pudo enviarse (pero se guardó en BD)', [
                    'venta_id' => $venta->id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de venta confirmada entregada', [
                'venta_id' => $event->venta->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
