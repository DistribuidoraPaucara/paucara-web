<?php

namespace App\Listeners;

use App\Events\CreditoVencido;
use App\Jobs\EnviarNotificacionCreditoVencido;
use Illuminate\Support\Facades\Log;

/**
 * Listener que dispara un Job para notificar vía WebSocket cuando un crédito se vence
 *
 * ✅ Asincrónico (usa Cola - no bloquea)
 * ✅ No rompe la transacción principal
 * ✅ Logs con emojis para debugging
 */
class SendCreditoVencidoNotification
{
    public function handle(CreditoVencido $event): void
    {
        try {
            $cuenta = $event->cuenta;

            Log::info('📢 Despachando Job: Notificación de crédito vencido', [
                'cuenta_id' => $cuenta->id,
                'cliente_id' => $cuenta->cliente_id,
                'cliente_nombre' => $cuenta->cliente?->nombre,
                'saldo_pendiente' => $cuenta->saldo_pendiente,
                'dias_vencido' => $cuenta->dias_vencido,
            ]);

            // Despachar el job a la cola
            // Se ejecutará de forma asincrónica sin bloquear
            dispatch(new EnviarNotificacionCreditoVencido($cuenta));

            Log::info('✅ Job de notificación de crédito vencido despachado', [
                'cuenta_id' => $cuenta->id,
            ]);

        } catch (\Exception $e) {
            Log::error('❌ Error despachando notificación de crédito vencido', [
                'error' => $e->getMessage(),
                'cuenta_id' => $event->cuenta->id ?? null,
                'trace' => $e->getTraceAsString(),
            ]);
            // NO re-lanzar excepción para no romper la transacción
        }
    }
}
