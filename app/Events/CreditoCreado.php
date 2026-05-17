<?php

namespace App\Events;

use App\Models\CuentaPorCobrar;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento disparado cuando se crea una cuenta por cobrar (crédito nuevo)
 *
 * ✅ NO implementa ShouldBroadcast
 * ✅ Los listeners manejan las notificaciones WebSocket
 */
class CreditoCreado
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
