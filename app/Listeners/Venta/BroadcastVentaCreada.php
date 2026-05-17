<?php

namespace App\Listeners\Venta;

use App\Events\VentaCreada;
use App\Listeners\BaseBroadcastListener;
use Illuminate\Broadcasting\Channel;

/**
 * Listener: Broadcast cuando se crea una Venta
 *
 * FLUJO:
 * 1. VentaService::crear() → event(VentaCreada)
 * 2. Este Listener escucha VentaCreada
 * 3. Hace broadcast a clientes interesados
 * 4. Clientes reciben en tiempo real
 *
 * CLIENTES INTERESADOS:
 * - Admin (ve todas las ventas)
 * - Vendedor (ve sus ventas)
 * - Cliente (ve sus propias ventas)
 * - Dashboard (ve estadísticas)
 */
class BroadcastVentaCreada extends BaseBroadcastListener
{
    protected string $eventName = 'VentaCreada';

    public function __construct(private VentaCreada $event) {}

    /**
     * Handle the event
     */
    public function handle(): void
    {
        $this->logBroadcast();
    }

    /**
     * Broadcast a estos canales
     */
    public function broadcastOn(): array
    {
        return [
            // Todos los admins/supervisores ven
            $this->publicChannel('ventas.created'),

            // El vendedor que creó la venta
            $this->userChannel($this->event->venta->usuario_id),

            // El cliente involucrado
            $this->organizationChannel(1), // TODO: cambiar por org_id real
        ];
    }

    /**
     * Nombre del evento en el cliente (socket.on('venta:created'))
     */
    public function broadcastAs(): string
    {
        return 'venta:created';
    }

    /**
     * Datos que recibe el cliente
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->event->venta->id,
            'numero' => $this->event->venta->numero,
            'cliente_id' => $this->event->venta->cliente_id,
            'cliente_nombre' => $this->event->venta->cliente->nombre ?? 'N/A',
            'total' => (float) $this->event->venta->total,
            'estado' => $this->event->venta->estado,
            'fecha' => $this->event->venta->fecha->toDateString(),
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
