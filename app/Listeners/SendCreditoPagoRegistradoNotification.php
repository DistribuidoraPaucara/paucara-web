<?php

namespace App\Listeners;

use App\Events\CreditoPagoRegistrado;
use App\Jobs\EnviarNotificacionCreditoPagoRegistrado;
use Illuminate\Support\Facades\Log;

/**
 * Listener que dispara un Job para enviar notificación WebSocket cuando se registra pago de crédito
 *
 * ✅ Asincrónico (usa Cola - no bloquea)
 * ✅ No rompe la transacción principal
 * ✅ Logs con emojis para debugging
 */
class SendCreditoPagoRegistradoNotification
{
    /**
     * Handle the event.
     */
    public function handle(CreditoPagoRegistrado $event): void
    {
        try {
            $pago = $event->pago;
            $cuenta = $event->cuenta;

            Log::info('📢 Despachando Job: Notificación de pago registrado', [
                'pago_id' => $pago->id,
                'cuenta_id' => $cuenta->id,
                'cliente_id' => $cuenta->cliente_id,
                'monto' => $pago->monto,
            ]);

            // Despachar el job a la cola
            // Se ejecutará de forma asincrónica sin bloquear
            dispatch(new EnviarNotificacionCreditoPagoRegistrado($pago, $cuenta));

            Log::info('✅ Job de notificación de pago registrado despachado', [
                'pago_id' => $pago->id,
                'cuenta_id' => $cuenta->id,
            ]);

        } catch (\Exception $e) {
            Log::error('❌ Error despachando notificación de pago registrado', [
                'pago_id' => $event->pago->id ?? null,
                'cuenta_id' => $event->cuenta->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // No lanzar excepción para no fallar el registro del pago
        }
    }
}
