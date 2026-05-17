<?php

namespace App\Listeners;

use App\Events\CreditoCritico;
use App\Jobs\EnviarNotificacionCreditoCritico;
use Illuminate\Support\Facades\Log;

/**
 * Listener que dispara un Job para notificar vía WebSocket cuando un cliente tiene crédito crítico (>80%)
 *
 * ✅ Asincrónico (usa Cola - no bloquea)
 * ✅ No rompe la transacción principal
 * ✅ Logs con emojis para debugging
 */
class SendCreditoCriticoNotification
{
    public function handle(CreditoCritico $event): void
    {
        try {
            $cliente = $event->cliente;
            $porcentaje = $event->porcentajeUtilizado;
            $saldoDisponible = $event->saldoDisponible;

            Log::info('📢 Despachando Job: Notificación de crédito crítico', [
                'cliente_id' => $cliente->id,
                'cliente_nombre' => $cliente->nombre,
                'porcentaje_utilizado' => $porcentaje,
                'saldo_disponible' => $saldoDisponible,
            ]);

            // Despachar el job a la cola
            // Se ejecutará de forma asincrónica sin bloquear
            dispatch(new EnviarNotificacionCreditoCritico($cliente, $porcentaje, $saldoDisponible));

            Log::info('✅ Job de notificación de crédito crítico despachado', [
                'cliente_id' => $cliente->id,
            ]);

        } catch (\Exception $e) {
            Log::error('❌ Error despachando notificación de crédito crítico', [
                'error' => $e->getMessage(),
                'cliente_id' => $event->cliente->id ?? null,
                'trace' => $e->getTraceAsString(),
            ]);
            // NO re-lanzar excepción para no romper la transacción
        }
    }
}
