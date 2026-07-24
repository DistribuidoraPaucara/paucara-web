<?php

namespace App\Listeners;

use App\Events\DetallePagoVentaCreated;
use App\Models\AperturaCaja;
use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CreateCajaMovementFromDetallePagoVenta
{
    /**
     * ✅ NUEVO (2026-07-24): Crear MovimientoCaja cuando se registra un DetallePagoVenta
     *
     * Este listener asegura que cada pago de venta se registre en movimientos_caja
     * para auditoría y cálculo de desglose de pagos por tipo
     */
    public function handle(DetallePagoVentaCreated $event): void
    {
        try {
            $detallePago = $event->detallePago;

            Log::info('🔔 [CreateCajaMovementFromDetallePagoVenta] Procesando detalle de pago', [
                'detalle_pago_id' => $detallePago->id,
                'venta_id' => $detallePago->venta_id,
                'monto' => $detallePago->monto,
                'tipo_pago_id' => $detallePago->tipo_pago_id,
            ]);

            // Obtener apertura de caja abierta del usuario actual
            $apertura = AperturaCaja::where('user_id', Auth::id())
                ->whereDoesntHave('cierre')
                ->latest('fecha')
                ->first();

            if (!$apertura) {
                Log::warning('⚠️ [CreateCajaMovementFromDetallePagoVenta] Sin apertura de caja abierta', [
                    'detalle_pago_id' => $detallePago->id,
                    'venta_id' => $detallePago->venta_id,
                    'user_id' => Auth::id(),
                ]);
                return;
            }

            // Obtener tipo de operación VENTA
            $tipoOperacion = TipoOperacionCaja::where('codigo', 'VENTA')->first();

            if (!$tipoOperacion) {
                Log::error('❌ [CreateCajaMovementFromDetallePagoVenta] No existe tipo de operación VENTA', [
                    'detalle_pago_id' => $detallePago->id,
                ]);
                return;
            }

            // Crear movimiento de caja
            $movimiento = MovimientoCaja::create([
                'apertura_caja_id' => $apertura->id,
                'caja_id' => $apertura->caja_id,
                'user_id' => Auth::id(),
                'tipo_operacion_id' => $tipoOperacion->id,
                'tipo_pago_id' => $detallePago->tipo_pago_id,
                'venta_id' => $detallePago->venta_id,
                'monto' => $detallePago->monto,
                'fecha' => $detallePago->fecha_pago ?? now(),
                'numero_documento' => $detallePago->venta?->numero ?? 'N/A',
                'observaciones' => "Venta #{$detallePago->venta_id} | Referencia: {$detallePago->referencia} | Comprobante: {$detallePago->comprobante}",
            ]);

            Log::info('✅ [CreateCajaMovementFromDetallePagoVenta] Movimiento de caja creado', [
                'movimiento_id' => $movimiento->id,
                'detalle_pago_id' => $detallePago->id,
                'venta_id' => $detallePago->venta_id,
                'monto' => $detallePago->monto,
                'tipo_pago_id' => $detallePago->tipo_pago_id,
                'apertura_id' => $apertura->id,
            ]);

        } catch (\Exception $e) {
            Log::error('❌ [CreateCajaMovementFromDetallePagoVenta] Error creando movimiento de caja', [
                'detalle_pago_id' => $event->detallePago->id ?? 'unknown',
                'venta_id' => $event->detallePago->venta_id ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
