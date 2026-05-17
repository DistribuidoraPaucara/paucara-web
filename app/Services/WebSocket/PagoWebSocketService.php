<?php

namespace App\Services\WebSocket;

/**
 * Servicio especializado para notificaciones WebSocket de Pagos
 *
 * Maneja todas las notificaciones en tiempo real relacionadas con pagos
 */
class PagoWebSocketService extends BaseWebSocketService
{
    /**
     * Notificar pago recibido
     */
    public function notifyReceived($pago): bool
    {
        return $this->send('notify/payment-received', [
            'pago_id' => $pago->id,
            'cliente_id' => $pago->cliente_id ?? null,
            'monto' => (float) $pago->monto,
            'metodo_pago' => $pago->metodo_pago ?? null,
            'fecha_pago' => $pago->fecha_pago?->toIso8601String() ?? now()->toIso8601String(),
        ]);
    }

    /**
     * Notificar pago pendiente
     */
    public function notifyPending($pago): bool
    {
        return $this->send('notify/payment-pending', [
            'pago_id' => $pago->id,
            'cliente_id' => $pago->cliente_id ?? null,
            'cliente_nombre' => $pago->cliente?->nombre ?? 'Cliente',
            'monto' => (float) $pago->monto,
            'fecha_vencimiento' => $pago->fecha_vencimiento?->toIso8601String(),
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Notificar pago vencido
     */
    public function notifyOverdue($pago): bool
    {
        return $this->send('notify/payment-overdue', [
            'pago_id' => $pago->id,
            'cliente_id' => $pago->cliente_id ?? null,
            'cliente_nombre' => $pago->cliente?->nombre ?? 'Cliente',
            'monto' => (float) $pago->monto,
            'dias_vencido' => $pago->fecha_vencimiento?->diffInDays(now()) ?? 0,
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Notificar confirmación de pago
     */
    public function notifyConfirmed($pago): bool
    {
        return $this->send('notify/payment-confirmed', [
            'pago_id' => $pago->id,
            'cliente_id' => $pago->cliente_id ?? null,
            'monto' => (float) $pago->monto,
            'metodo_pago' => $pago->metodo_pago ?? null,
            'confirmado_por' => auth()->user()?->name ?? 'Sistema',
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
