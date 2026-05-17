<?php

namespace App\Listeners;

use App\Events\UbicacionActualizada;
use App\Services\WebSocket\EntregaWebSocketService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

/**
 * SincronizarWebSocketUbicacion - FASE 3
 *
 * Escucha eventos de actualización de ubicación GPS y notifica al WebSocket
 * para que los clientes conectados vean el tracking en tiempo real
 *
 * RESPONSABILIDADES:
 * ✓ Recibe evento UbicacionActualizada del TrackingService
 * ✓ Construye payload con datos de ubicación
 * ✓ Notifica al WebSocket via HTTP
 * ✓ Maneja errores sin afectar el flujo principal
 *
 * FLOW:
 * TrackingService::registrarUbicacion()
 *   → broadcast(new UbicacionActualizada(...))
 *     → SincronizarWebSocketUbicacion::handle()
 *       → EntregaWebSocketService::notifyUbicacion()
 *         → HTTP POST /notify/entrega-ubicacion
 *
 * IMPORTANTE:
 * - Se ejecuta en QUEUE con prioridad alta (ubicaciones = tiempo real)
 * - NO bloquea el flujo si WebSocket falla
 * - Reintentos automáticos si falla
 */
class SincronizarWebSocketUbicacion implements ShouldQueue
{
    use InteractsWithQueue;

    public $queue = 'high_priority';  // Cola con prioridad alta (tracking es crítico)
    public $tries = 3;                // Reintentar 3 veces si falla
    public $timeout = 10;             // Timeout de 10 segundos

    public function __construct(
        private EntregaWebSocketService $webSocketService
    ) {}

    /**
     * Handle the event.
     *
     * Se ejecuta cuando TrackingService registra una nueva ubicación
     */
    public function handle(UbicacionActualizada $event): void
    {
        try {
            Log::debug('🔔 [PHASE 3] SincronizarWebSocketUbicacion - Notificando ubicación', [
                'entrega_id' => $event->entregaId,
                'latitud' => $event->latitud,
                'longitud' => $event->longitud,
                'velocidad' => $event->velocidad,
            ]);

            // Construir payload para WebSocket
            $payload = [
                'entrega_id' => $event->entregaId,
                'latitud' => $event->latitud,
                'longitud' => $event->longitud,
                'velocidad' => $event->velocidad,
                'rumbo' => $event->rumbo,
                'altitud' => $event->altitud,
                'precision' => $event->precision,
                'timestamp' => $event->timestamp,
                'chofer_nombre' => $event->choferNombre,
                'tipo' => 'ubicacion_actualizada',
                'prioridad' => 'high',
            ];

            // Notificar al WebSocket
            $this->webSocketService->notifyUbicacion($payload);

            Log::debug('✅ [PHASE 3] WebSocket notificado correctamente', [
                'entrega_id' => $event->entregaId,
            ]);

        } catch (\Exception $e) {
            Log::error('❌ [PHASE 3] Error notificando ubicación al WebSocket', [
                'entrega_id' => $event->entregaId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // NO relanzar excepción - la ubicación ya se guardó en BD
        }
    }

    /**
     * Handle a job failure.
     *
     * Si la notificación falla después de reintentos, loguear pero no fallar
     */
    public function failed(UbicacionActualizada $event, \Throwable $exception): void
    {
        Log::critical('❌ [PHASE 3] SincronizarWebSocketUbicacion - FALLÓ después de reintentos', [
            'entrega_id' => $event->entregaId,
            'error' => $exception->getMessage(),
        ]);

        // Opcional: Notificar a admin que el WebSocket podría estar down
    }
}
