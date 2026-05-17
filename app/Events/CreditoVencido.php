<?php

namespace App\Events;

use App\Models\CuentaPorCobrar;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento disparado cuando un crédito se vence
 *
 * ✅ NO implementa ShouldBroadcast
 * ✅ Los listeners manejan las notificaciones WebSocket
 */
class CreditoVencido
{
    use Dispatchable, SerializesModels;

    public CuentaPorCobrar $cuenta;

    public function __construct(CuentaPorCobrar $cuenta)
    {
        $this->cuenta = $cuenta;

        // Cargar relaciones necesarias
        $this->cuenta->load(['cliente', 'venta']);
    }
}
