<?php

namespace App\Listeners;

use App\Events\EntregaEstadoCambiado;
use App\Services\WebSocket\EntregaWebSocketService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

/**
 * SincronizarWebSocketEstadoEntrega - FASE 2
 *
 * Escucha eventos de cambio de estado de entregas y notifica al servidor WebSocket
 *
 * RESPONSABILIDADES:
 * ✓ Recibe evento EntregaEstadoCambiado desde el Bus de eventos
 * ✓ Extrae información del evento
 * ✓ Notifica al WebSocket via HTTP
 * ✓ Maneja errores sin afectar el flujo principal
 *
 * FLOW:
 * EntregaService::cambiarEstadoNormalizado()
 *   → event(new EntregaEstadoCambiado(...))
 *     → SincronizarWebSocketEstadoEntrega::handle()
 *       → EntregaWebSocketService::notifyEstadoCambio()
 *         → HTTP POST /notify/entrega-estado-cambio
 *
 * IMPORTANTE: Queue = false (síncrono) porque los cambios de estado
 * deben propagarse INMEDIATAMENTE a todos los clientes conectados
 */
class SincronizarWebSocketEstadoEntrega implements ShouldQueue
{
    use InteractsWithQueue;

    public $queue = 'high_priority';  // Cola con prioridad alta
    public $tries = 3;                // Reintentar 3 veces si falla
    public $timeout = 10;             // Timeout de 10 segundos

    public function __construct(
        private EntregaWebSocketService $webSocketService
    ) {}

    /**
     * Handle the event.
     *
     * Se ejecuta cuando se dispara EntregaEstadoCambiado
     */
    public function handle(EntregaEstadoCambiado $event): void
    {
        try {
            Log::info('🔔 [PHASE 2] SincronizarWebSocketEstadoEntrega - Notificando cambio de estado', [
                'entrega_id' => $event->entrega->id,
                'numero_entrega' => $event->entrega->numero_entrega,
                'estado_anterior' => $event->estadoAnterior->codigo,
                'estado_nuevo' => $event->estadoNuevo->codigo,
                'razon' => $event->razon,
            ]);

            // Construir payload para WebSocket
            $payload = [
                'entrega_id' => $event->entrega->id,
                'numero_entrega' => $event->entrega->numero_entrega,
                'estado_anterior' => [
                    'id' => $event->estadoAnterior->id,
                    'codigo' => $event->estadoAnterior->codigo,
                    'nombre' => $event->estadoAnterior->nombre,
                    'color' => $event->estadoAnterior->color,
                    'icono' => $event->estadoAnterior->icono,
                ],
                'estado_nuevo' => [
                    'id' => $event->estadoNuevo->id,
                    'codigo' => $event->estadoNuevo->codigo,
                    'nombre' => $event->estadoNuevo->nombre,
                    'color' => $event->estadoNuevo->color,
                    'icono' => $event->estadoNuevo->icono,
                    'es_estado_final' => $event->estadoNuevo->es_estado_final,
                ],
                'razon' => $event->razon,
                'timestamp' => now()->toIso8601String(),
                'usuario_id' => auth()?->user()?->id,

                // Información adicional para el dashboard
                'entrega' => [
                    'id' => $event->entrega->id,
                    'chofer' => $event->entrega->chofer ? [
                        'id' => $event->entrega->chofer->id,
                        'nombre' => $event->entrega->chofer->user->nombre . ' ' . $event->entrega->chofer->user->apellidos,
                    ] : null,
                    'vehiculo' => $event->entrega->vehiculo ? [
                        'id' => $event->entrega->vehiculo->id,
                        'placa' => $event->entrega->vehiculo->placa,
                    ] : null,
                    'latitud_actual' => $event->entrega->latitud_actual,
                    'longitud_actual' => $event->entrega->longitud_actual,
                    'fecha_ultima_ubicacion' => $event->entrega->fecha_ultima_ubicacion?->toIso8601String(),
                ],

                // Información de ventas asociadas
                'total_ventas' => $event->entrega->ventas?->count() ?? 0,
            ];

            // Notificar al WebSocket (determina qué evento específico emitir)
            $this->notifyWebSocket($event->estadoNuevo->codigo, $payload);

            Log::info('✅ [PHASE 2] WebSocket notificado correctamente', [
                'entrega_id' => $event->entrega->id,
                'estado' => $event->estadoNuevo->codigo,
            ]);

        } catch (\Exception $e) {
            Log::error('❌ [PHASE 2] Error notificando WebSocket', [
                'entrega_id' => $event->entrega->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // NO relanzar la excepción para no afectar el flujo principal
            // El cambio de estado ya se guardó en BD
        }
    }

    /**
     * Notificar al WebSocket con el endpoint apropiado según el estado
     *
     * Mapea código de estado a endpoint específico para mejor manejo
     * en el lado del WebSocket
     */
    private function notifyWebSocket(string $estadoCodigo, array $payload): void
    {
        switch ($estadoCodigo) {
            case 'EN_TRANSITO':
            case 'EN_CAMINO':
                // GPS activo - usar endpoint especializado
                $this->webSocketService->notifyEstadoCambio($payload, 'entrega-en-transito');
                break;

            case 'ENTREGADO':
            case 'ENTREGADA':
                // Entrega completada
                $this->webSocketService->notifyEstadoCambio($payload, 'entrega-entregada');
                break;

            case 'NOVEDAD':
            case 'RECHAZADO':
                // Problema en entrega
                $this->webSocketService->notifyEstadoCambio($payload, 'entrega-problema');
                break;

            default:
                // Cambio de estado genérico
                $this->webSocketService->notifyEstadoCambio($payload, 'entrega-estado-cambio');
        }
    }

    /**
     * Handle a job failure.
     *
     * Si la notificación falla después de reintentos, loguear pero no fallar
     */
    public function failed(EntregaEstadoCambiado $event, \Throwable $exception): void
    {
        Log::critical('❌ [PHASE 2] SincronizarWebSocketEstadoEntrega - FALLÓ después de reintentos', [
            'entrega_id' => $event->entrega->id,
            'error' => $exception->getMessage(),
        ]);

        // Notificar a admin que el WebSocket podría estar down
        // (implementar después si es necesario)
    }
}
