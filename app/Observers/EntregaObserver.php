<?php

namespace App\Observers;

use App\Models\Entrega;
use App\Services\Notifications\EntregaNotificationService;
use Illuminate\Support\Facades\Log;

/**
 * EntregaObserver - FASE 6: Notificaciones Completas (BD + WebSocket)
 *
 * RESPONSABILIDADES:
 * ✓ Detectar cambios de estado en Entrega
 * ✓ Disparar notificaciones a BD (persistentes)
 * ✓ Disparar notificaciones WebSocket (tiempo real)
 * ✓ Notificar a clientes, chofer, admin, creador
 * ✓ Validar SLA al cambiar de estado
 *
 * CICLO DE VIDA:
 * - created(): Cuando se crea una entrega
 * - updated(): Cuando se actualiza entrega
 *   ├─ Detecta cambio en estado o estado_entrega_id
 *   ├─ Obtiene estado anterior y nuevo
 *   └─ Dispara notificaciones BD + WebSocket
 */
class EntregaObserver
{
    private EntregaNotificationService $notificationService;

    public function __construct(EntregaNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * ✅ FASE 6: Notificar cuando se CREA una entrega
     * - Guarda notificación en BD para usuarios relevantes
     * - Envía notificación en tiempo real vía WebSocket
     */
    public function created(Entrega $entrega): void
    {
        try {
            Log::info('🔔 EntregaObserver: Entrega creada - disparando notificaciones', [
                'entrega_id' => $entrega->id,
                'numero_entrega' => $entrega->numero_entrega,
            ]);

            // ✅ NUEVO - FASE 6: Usar servicio de notificaciones (BD + WebSocket)
            $this->notificationService->notifyCreated($entrega);

            Log::info('✅ EntregaObserver: Notificaciones de creación enviadas', [
                'entrega_id' => $entrega->id,
                'numero_entrega' => $entrega->numero_entrega,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error en EntregaObserver::created', [
                'entrega_id' => $entrega->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }

    /**
     * ✅ FASE 6: Disparar notificaciones cuando Entrega cambia de estado O se asigna chofer
     *
     * Se ejecuta DESPUÉS de que se actualiza el registro en BD
     * Detecta dos tipos de cambios:
     * 1. Cambio de estado de entrega
     * 2. Asignación/cambio de chofer
     */
    public function updated(Entrega $entrega): void
    {
        try {
            // 1️⃣ DETECTAR CAMBIO DE ESTADO
            $cambioEstadoEnum = $entrega->isDirty('estado');
            $cambioEstadoFk = $entrega->isDirty('estado_entrega_id');

            if ($cambioEstadoEnum || $cambioEstadoFk) {
                // Obtener estado anterior y nuevo
                $estadoAnterior = $cambioEstadoEnum ? $entrega->getOriginal('estado') : null;
                $estadoNuevo = $entrega->estado;

                if ($cambioEstadoFk && $entrega->estadoEntrega) {
                    $estadoNuevo = $entrega->estadoEntrega->codigo;
                }

                Log::info('🔔 EntregaObserver: Cambio de estado detectado', [
                    'entrega_id' => $entrega->id,
                    'estado_anterior' => $estadoAnterior,
                    'estado_nuevo' => $estadoNuevo,
                ]);

                // ✅ FASE 6: Usar servicio de notificaciones (BD + WebSocket)
                $this->notificationService->notifyEstadoSincronizado(
                    $entrega,
                    $estadoNuevo,
                    $estadoAnterior
                );

                Log::info('✅ EntregaObserver: Notificaciones de cambio de estado enviadas', [
                    'entrega_id' => $entrega->id,
                    'estado_nuevo' => $estadoNuevo,
                ]);
            }

            // 2️⃣ DETECTAR CAMBIO DE CHOFER
            if ($entrega->isDirty('chofer_id')) {
                $choferAnterior = $entrega->getOriginal('chofer_id');
                $choferNuevo = $entrega->chofer_id;

                Log::info('🔔 EntregaObserver: Cambio de chofer detectado', [
                    'entrega_id' => $entrega->id,
                    'chofer_anterior' => $choferAnterior,
                    'chofer_nuevo' => $choferNuevo,
                ]);

                // ✅ FASE 6: Notificar asignación de chofer
                $this->notificationService->notifyChoferAsignado($entrega);

                Log::info('✅ EntregaObserver: Notificaciones de asignación de chofer enviadas', [
                    'entrega_id' => $entrega->id,
                    'chofer_id' => $choferNuevo,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error en EntregaObserver::updated', [
                'entrega_id' => $entrega->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
