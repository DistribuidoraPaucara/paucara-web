<?php
namespace App\Jobs;

use App\Models\CuentaPorCobrar;
use App\Models\Pago;
use App\Services\WebSocket\CreditoWebSocketService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Job para enviar notificaciones de pago registrado vía WebSocket
 *
 * Se ejecuta de forma asincrónica en la cola para no bloquear
 * la ejecución de otros procesos
 */
class EnviarNotificacionCreditoPagoRegistrado implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        protected Pago $pago,
        protected CuentaPorCobrar $cuenta,
    ) {}

    public function handle(CreditoWebSocketService $webSocketService): void
    {
        try {
            Log::info('📬 Job: Enviando notificación de pago registrado', [
                'pago_id' => $this->pago->id,
                'cuenta_id' => $this->cuenta->id,
                'cliente_id' => $this->cuenta->cliente_id,
                'monto' => $this->pago->monto,
            ]);

            // Cargar relaciones si no están cargadas
            if (!$this->pago->relationLoaded('tipoPago')) {
                $this->pago->load('tipoPago');
            }
            if (!$this->pago->relationLoaded('usuario')) {
                $this->pago->load('usuario');
            }
            if (!$this->cuenta->relationLoaded('cliente')) {
                $this->cuenta->load('cliente');
            }
            if (!$this->cuenta->relationLoaded('venta')) {
                $this->cuenta->load('venta');
            }

            $resultado = $webSocketService->notifyPagoRegistrado($this->pago, $this->cuenta);

            if ($resultado) {
                Log::info('✅ Job: Notificación de pago registrado enviada exitosamente', [
                    'pago_id' => $this->pago->id,
                    'cuenta_id' => $this->cuenta->id,
                ]);
            } else {
                Log::warning('⚠️ Job: Notificación de pago registrado no se envió', [
                    'pago_id' => $this->pago->id,
                    'cuenta_id' => $this->cuenta->id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Job: Error enviando notificación de pago registrado', [
                'error' => $e->getMessage(),
                'pago_id' => $this->pago->id,
                'cuenta_id' => $this->cuenta->id,
                'trace' => $e->getTraceAsString(),
            ]);

            // Relanzar excepción para que Laravel reinente el job
            throw $e;
        }
    }
}
