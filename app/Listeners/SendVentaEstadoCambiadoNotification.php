<?php

namespace App\Listeners;

use App\Events\VentaEstadoCambiado;
use App\Services\WebSocket\VentaWebSocketService;
use Illuminate\Support\Facades\Log;

/**
 * Listener para VentaEstadoCambiado
 *
 * Responsabilidades:
 * ✓ Recibe evento cuando cambia estado de venta
 * ✓ Notifica vía WebSocket al cliente
 * ✓ Notifica al admin
 * ✓ Registra en logs
 *
 * FLUJO:
 * VentaEstadoCambiado → SendVentaEstadoCambiadoNotification
 *                    → VentaWebSocketService::notifyEstadoCambiado()
 *                    → HTTP POST a Node.js WebSocket
 *                    → Socket.IO emite a cliente
 */
class SendVentaEstadoCambiadoNotification
{
    private VentaWebSocketService $webSocketService;

    public function __construct(VentaWebSocketService $webSocketService)
    {
        $this->webSocketService = $webSocketService;
    }

    /**
     * Manejar el evento
     */
    public function handle(VentaEstadoCambiado $event): void
    {
        try {
            Log::info('📢 [SendVentaEstadoCambiadoNotification] Enviando notificación de cambio de estado', [
                'venta_id' => $event->venta->id,
                'venta_numero' => $event->venta->numero,
                'cliente_id' => $event->venta->cliente_id,
                'estado_anterior_id' => $event->estadoAnterior?->id,
                'estado_anterior_codigo' => $event->estadoAnterior?->codigo,
                'estado_nuevo_id' => $event->estadoNuevo?->id,
                'estado_nuevo_codigo' => $event->estadoNuevo?->codigo,
                'razon' => $event->razon,
            ]);

            // Verificar que el servicio WebSocket esté inicializado
            if (!$this->webSocketService) {
                Log::warning('⚠️ [SendVentaEstadoCambiadoNotification] WebSocket service no está disponible', [
                    'venta_id' => $event->venta->id,
                ]);
                return;
            }

            // Enviar notificación vía WebSocket
            $enviado = $this->webSocketService->notifyEstadoCambiado(
                $event->venta,
                $event->estadoAnterior,
                $event->estadoNuevo,
                $event->razon
            );

            if ($enviado) {
                Log::info('✅ [SendVentaEstadoCambiadoNotification] Notificación enviada exitosamente', [
                    'venta_id' => $event->venta->id,
                ]);
            } else {
                Log::warning('⚠️ [SendVentaEstadoCambiadoNotification] WebSocket retornó false', [
                    'venta_id' => $event->venta->id,
                ]);
            }

        } catch (\Throwable $e) {
            Log::error('❌ [SendVentaEstadoCambiadoNotification] Error enviando notificación', [
                'venta_id' => $event->venta->id,
                'error_message' => $e->getMessage(),
                'error_class' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            // No relanzar excepción para que el evento se considere procesado
        }
    }
}
