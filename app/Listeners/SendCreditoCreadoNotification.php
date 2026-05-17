<?php

namespace App\Listeners;

use App\Events\CreditoCreado;
use App\Jobs\EnviarNotificacionCreditoCreado;
use Illuminate\Support\Facades\Log;

/**
 * Listener que dispara un Job para enviar notificación WebSocket cuando se crea un crédito
 *
 * ✅ Asincrónico (usa Cola - no bloquea)
 * ✅ No rompe la transacción principal
 * ✅ Logs con emojis para debugging
 */
class SendCreditoCreadoNotification
{
    /**
     * Handle the event.
     */
    public function handle(CreditoCreado $event): void
    {
        try {
            $cuenta = $event->cuenta;

            Log::info('📢 Despachando Job: Notificación de crédito creado', [
                'cuenta_id' => $cuenta->id,
                'venta_id' => $cuenta->venta_id,
                'cliente_id' => $cuenta->cliente_id,
            ]);

            // Despachar el job a la cola
            // Se ejecutará de forma asincrónica sin bloquear
            dispatch(new EnviarNotificacionCreditoCreado($cuenta));

            Log::info('✅ Job de notificación de crédito creado despachado', [
                'cuenta_id' => $cuenta->id,
                'venta_id' => $cuenta->venta_id,
            ]);

        } catch (\Exception $e) {
            Log::error('❌ Error despachando notificación de crédito creado', [
                'cuenta_id' => $event->cuenta->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // No lanzar excepción para no fallar la creación del crédito
        }
    }
}
