<?php
namespace App\Jobs;

use App\Models\Cliente;
use App\Services\WebSocket\CreditoWebSocketService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Job para enviar notificaciones de crédito crítico vía WebSocket
 *
 * Se ejecuta de forma asincrónica en la cola para no bloquear
 * la ejecución de otros procesos
 */
class EnviarNotificacionCreditoCritico implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        protected Cliente $cliente,
        protected float $porcentajeUtilizado,
        protected float $saldoDisponible,
    ) {}

    public function handle(CreditoWebSocketService $webSocketService): void
    {
        try {
            Log::info('📬 Job: Enviando notificación de crédito crítico', [
                'cliente_id' => $this->cliente->id,
                'cliente_nombre' => $this->cliente->nombre,
                'porcentaje_utilizado' => $this->porcentajeUtilizado,
            ]);

            $resultado = $webSocketService->notifyCritico(
                $this->cliente,
                $this->porcentajeUtilizado,
                $this->saldoDisponible
            );

            if ($resultado) {
                Log::info('✅ Job: Notificación de crédito crítico enviada exitosamente', [
                    'cliente_id' => $this->cliente->id,
                    'porcentaje_utilizado' => $this->porcentajeUtilizado,
                ]);
            } else {
                Log::warning('⚠️ Job: Notificación de crédito crítico no se envió', [
                    'cliente_id' => $this->cliente->id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Job: Error enviando notificación de crédito crítico', [
                'error' => $e->getMessage(),
                'cliente_id' => $this->cliente->id,
                'trace' => $e->getTraceAsString(),
            ]);

            // Relanzar excepción para que Laravel reinente el job
            throw $e;
        }
    }
}
