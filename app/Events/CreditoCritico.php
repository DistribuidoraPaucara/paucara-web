<?php

namespace App\Events;

use App\Models\Cliente;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento disparado cuando un cliente tiene crédito crítico (>80% utilización)
 *
 * ✅ NO implementa ShouldBroadcast
 * ✅ Los listeners manejan las notificaciones WebSocket
 */
class CreditoCritico
{
    use Dispatchable, SerializesModels;

    public Cliente $cliente;
    public float $porcentajeUtilizado;
    public float $saldoDisponible;

    public function __construct(Cliente $cliente, float $porcentajeUtilizado, float $saldoDisponible)
    {
        $this->cliente = $cliente;
        $this->porcentajeUtilizado = $porcentajeUtilizado;
        $this->saldoDisponible = $saldoDisponible;

        // Cargar relaciones necesarias
        $this->cliente->load(['cuentasPorCobrar' => function ($q) {
            $q->where('saldo_pendiente', '>', 0);
        }]);
    }
}
