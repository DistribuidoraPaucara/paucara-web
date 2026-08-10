<?php
namespace App\Jobs;

use App\Models\CuentaPorCobrar;
use App\Services\WebSocket\CreditoWebSocketService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Job para enviar notificaciones de crédito vencido vía WebSocket
 *
 * Se ejecuta de forma asincrónica en la cola para no bloquear
 * la ejecución de otros procesos
 */
class EnviarNotificacionCreditoVencido implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        protected CuentaPorCobrar $cuenta,
    ) {}

    public function handle(CreditoWebSocketService $webSocketService): void
    {
        try {
            Log::info('📬 Job: Enviando notificación de crédito vencido', [
                'cuenta_id' => $this->cuenta->id,
                'cliente_id' => $this->cuenta->cliente_id,
                'cliente_nombre' => $this->cuenta->cliente?->nombre,
            ]);

            $resultado = $webSocketService->notifyVencido($this->cuenta);

            if ($resultado) {
                Log::info('✅ Job: Notificación de crédito vencido enviada exitosamente', [
                    'cuenta_id' => $this->cuenta->id,
                ]);
            } else {
                Log::warning('⚠️ Job: Notificación de crédito vencido no se envió', [
                    'cuenta_id' => $this->cuenta->id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Job: Error enviando notificación de crédito vencido', [
                'error' => $e->getMessage(),
                'cuenta_id' => $this->cuenta->id,
                'trace' => $e->getTraceAsString(),
            ]);

            // Relanzar excepción para que Laravel reinente el job
            throw $e;
        }
    }
}
