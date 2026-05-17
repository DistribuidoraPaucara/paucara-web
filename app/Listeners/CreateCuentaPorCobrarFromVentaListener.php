<?php

namespace App\Listeners;

use App\Events\VentaCreada;
use App\Services\CreditoService;
use Illuminate\Support\Facades\Log;

/**
 * Listener que crea automáticamente CuentaPorCobrar cuando
 * una venta con política de crédito es creada directamente
 * (no desde proforma)
 */
class CreateCuentaPorCobrarFromVentaListener
{
    protected CreditoService $creditoService;

    public function __construct(CreditoService $creditoService)
    {
        $this->creditoService = $creditoService;
    }

    /**
     * Handle the event.
     */
    public function handle(VentaCreada $event): void
    {
        try {
            $venta = $event->venta;

            Log::info('🔔 CreateCuentaPorCobrarFromVentaListener - Verificando política de pago', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'politica_pago' => $venta->politica_pago,
            ]);

            // Solo crear cuenta por cobrar si la política de pago es CREDITO
            if ($venta->politica_pago !== 'CREDITO') {
                Log::info('ℹ️ Venta no es a crédito, omitiendo creación de cuenta por cobrar', [
                    'venta_id' => $venta->id,
                    'politica_pago' => $venta->politica_pago,
                ]);
                return;
            }

            // Verificar que no exista ya una cuenta por cobrar para esta venta
            if ($venta->cuentaPorCobrar()->exists()) {
                Log::warning('⚠️ Ya existe cuenta por cobrar para esta venta', [
                    'venta_id' => $venta->id,
                ]);
                return;
            }

            Log::info('💳 Creando cuenta por cobrar para venta a crédito', [
                'venta_id' => $venta->id,
                'cliente_id' => $venta->cliente_id,
                'monto' => $venta->total,
                'dias_vencimiento' => 7,
            ]);

            // ✅ POLÍTICA FIJA: Todos los créditos vencen en 7 días
            // No depende del cliente ni de configuración variable
            $diasVencimiento = 7;

            // Crear cuenta por cobrar usando el servicio
            $cuenta = $this->creditoService->crearCuentaPorCobrar($venta, $diasVencimiento);

            Log::info('✅ Cuenta por cobrar creada exitosamente', [
                'cuenta_id' => $cuenta->id,
                'venta_id' => $venta->id,
                'cliente_id' => $venta->cliente_id,
                'monto_original' => $cuenta->monto_original,
                'fecha_vencimiento' => $cuenta->fecha_vencimiento->toDateString(),
            ]);

        } catch (\Exception $e) {
            Log::error('❌ Error creando cuenta por cobrar', [
                'venta_id' => $event->venta->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // No lanzar excepción para no fallar la creación de venta
            // El crédito puede crearse manualmente después
        }
    }
}
