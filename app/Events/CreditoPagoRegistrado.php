<?php

namespace App\Events;

use App\Models\Pago;
use App\Models\CuentaPorCobrar;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento disparado cuando se registra un pago de crédito
 *
 * ✅ NO implementa ShouldBroadcast
 * ✅ Los listeners manejan las notificaciones WebSocket
 */
class CreditoPagoRegistrado
{
    use Dispatchable, SerializesModels;

    public Pago $pago;
    public CuentaPorCobrar $cuenta;

    public function __construct(Pago $pago, CuentaPorCobrar $cuenta)
    {
        $this->pago = $pago;
        $this->cuenta = $cuenta;

        // Cargar relaciones necesarias
        $this->pago->load(['tipoPago', 'usuario']);
        $this->cuenta->load(['cliente', 'venta']);
    }
}
