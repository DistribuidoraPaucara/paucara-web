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
 * Job para enviar notificaciones de crédito creado vía WebSocket
 *
 * Se ejecuta de forma asincrónica en la cola para no bloquear
 * la ejecución de otros procesos
 */
class EnviarNotificacionCreditoCreado implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        protected CuentaPorCobrar $cuenta,
    ) {}

    public function handle(CreditoWebSocketService $webSocketService): void
    {
        try {
            Log::info('📬 Job: Enviando notificación de crédito creado', [
                'cuenta_id' => $this->cuenta->id,
                'venta_id' => $this->cuenta->venta_id,
                'cliente_id' => $this->cuenta->cliente_id,
            ]);

            // Cargar relaciones si no están cargadas
            if (!$this->cuenta->relationLoaded('cliente')) {
                $this->cuenta->load('cliente');
            }
            if (!$this->cuenta->relationLoaded('venta')) {
                $this->cuenta->load('venta');
            }

            $resultado = $webSocketService->notifyCreated($this->cuenta);

            if ($resultado) {
                Log::info('✅ Job: Notificación de crédito creado enviada exitosamente', [
                    'cuenta_id' => $this->cuenta->id,
                    'venta_id' => $this->cuenta->venta_id,
                ]);
            } else {
                Log::warning('⚠️ Job: Notificación de crédito creado no se envió', [
                    'cuenta_id' => $this->cuenta->id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Job: Error enviando notificación de crédito creado', [
                'error' => $e->getMessage(),
                'cuenta_id' => $this->cuenta->id,
                'trace' => $e->getTraceAsString(),
            ]);

            // Relanzar excepción para que Laravel reinente el job
            throw $e;
        }
    }
}
