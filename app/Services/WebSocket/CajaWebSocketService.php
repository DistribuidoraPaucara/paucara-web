<?php

namespace App\Services\WebSocket;

use App\Models\CierreCaja;
use Illuminate\Support\Facades\Log;

/**
 * Servicio especializado para notificaciones WebSocket de cierres de caja
 *
 * Maneja todas las notificaciones en tiempo real relacionadas con el flujo de
 * aprobación/rechazo de cierres de caja.
 *
 * FLUJO DE NOTIFICACIONES:
 * 1. Cajero cierra caja → PENDIENTE
 *    → notifyCierrePendiente() → Notifica a todos los admins
 *
 * 2. Admin consolida → CONSOLIDADA
 *    → notifyCierreConsolidado() → Notifica al cajero
 *
 * 3. Admin rechaza → RECHAZADA
 *    → notifyCierreRechazado() → Notifica al cajero con motivo
 *
 * 4. Cajero corrige → vuelve a PENDIENTE
 *    → notifyCierrePendiente() → Notifica a admins nuevamente
 */
class CajaWebSocketService extends BaseWebSocketService
{
    /**
     * Notificar que hay un nuevo cierre pendiente (a todos los admins)
     *
     * @param CierreCaja $cierre
     * @return bool
     */
    public function notifyCierrePendiente(CierreCaja $cierre): bool
    {
        try {
            // Obtener todos los usuarios con permiso admin.cajas
            $admins = \App\Models\User::permission('admin.cajas')->pluck('id')->toArray();

            foreach ($admins as $adminId) {
                $this->notifyUser($adminId, 'cierre.pendiente', [
                    'cierre_id' => $cierre->id,
                    'caja' => $cierre->caja->nombre,
                    'usuario' => $cierre->usuario->name,
                    'diferencia' => (float)$cierre->diferencia,
                    'monto_esperado' => (float)$cierre->monto_esperado,
                    'monto_real' => (float)$cierre->monto_real,
                    'fecha' => $cierre->fecha->toIso8601String(),
                    'mensaje' => "🔔 Nuevo cierre pendiente de {$cierre->usuario->name} en caja {$cierre->caja->nombre}",
                ]);
            }

            return true;
        } catch (\Exception $e) {
            Log::warning('Error enviando WebSocket notifyCierrePendiente', [
                'cierre_id' => $cierre->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Notificar que un cierre fue consolidado (al cajero)
     *
     * @param CierreCaja $cierre
     * @return bool
     */
    public function notifyCierreConsolidado(CierreCaja $cierre): bool
    {
        try {
            $verificador = $cierre->verificador?->name ?? 'Admin';
            return $this->notifyUser($cierre->user_id, 'cierre.consolidado', [
                'cierre_id' => $cierre->id,
                'caja' => $cierre->caja->nombre,
                'usuario' => $cierre->usuario->name,
                'verificador' => $verificador,
                'diferencia' => (float)$cierre->diferencia,
                'monto_esperado' => (float)$cierre->monto_esperado,
                'monto_real' => (float)$cierre->monto_real,
                'fecha' => $cierre->fecha->toIso8601String(),
                'observaciones' => $cierre->observaciones_verificacion,
                'mensaje' => "✅ Tu cierre de caja fue consolidado por {$verificador}",
            ]);
        } catch (\Exception $e) {
            Log::warning('Error enviando WebSocket notifyCierreConsolidado', [
                'cierre_id' => $cierre->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Notificar que un cierre fue rechazado (al cajero)
     *
     * @param CierreCaja $cierre
     * @param string $motivo Motivo del rechazo
     * @return bool
     */
    public function notifyCierreRechazado(CierreCaja $cierre, string $motivo): bool
    {
        try {
            return $this->notifyUser($cierre->user_id, 'cierre.rechazado', [
                'cierre_id' => $cierre->id,
                'caja' => $cierre->caja->nombre,
                'usuario' => $cierre->usuario->name,
                'verificador' => $cierre->verificador?->name ?? 'Admin',
                'motivo' => $motivo,
                'requiere_reapertura' => $cierre->requiere_reapertura,
                'diferencia' => (float)$cierre->diferencia,
                'fecha' => $cierre->fecha->toIso8601String(),
                'mensaje' => "❌ Tu cierre fue rechazado: {$motivo}. Por favor corrige y vuelve a enviar.",
            ]);
        } catch (\Exception $e) {
            Log::warning('Error enviando WebSocket notifyCierreRechazado', [
                'cierre_id' => $cierre->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }
}
