<?php

namespace App\Events;

use App\Models\Venta;
use App\Models\EstadoLogistica;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento disparado cuando cambia el estado logístico de una venta
 *
 * ✅ NO implementa ShouldBroadcast (como ProformaConvertida)
 * ✅ El listener SendVentaEstadoCambiadoNotification maneja WebSocket
 * ✅ Usa estados centralizados de estados_logistica
 *
 * DISPARO:
 * - Cuando el estado_logistico_id de una venta cambia
 * - Automáticamente via VentaObserver::updated()
 * - O manualmente en SincronizacionVentaEntregaService
 */
class VentaEstadoCambiado
{
    use Dispatchable, SerializesModels;

    public Venta $venta;
    public ?EstadoLogistica $estadoAnterior;
    public ?EstadoLogistica $estadoNuevo;
    public string $razon;

    public function __construct(
        Venta $venta,
        ?EstadoLogistica $estadoAnterior,
        ?EstadoLogistica $estadoNuevo,
        string $razon = 'Sincronización automática'
    ) {
        $this->venta = $venta;
        $this->estadoAnterior = $estadoAnterior;
        $this->estadoNuevo = $estadoNuevo;
        $this->razon = $razon;

        // Cargar relaciones necesarias
        $this->venta->load(['cliente', 'entrega']);
    }
}
