<?php

namespace App\Events;

use App\Models\Entrega;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PublicChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Event fired when a delivery driver confirms arrival at destination
 *
 * Triggered: When driver calls POST /api/chofer/entregas/{id}/marcar-llegada
 * Broadcast channels: entrega.{id}, chofer.{id}, admin.pedidos, pedido.{proforma_id}
 */
class MarcarLlegadaConfirmada implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Entrega $entrega;
    public array $ubicacion;

    /**
     * Create a new event instance.
     *
     * @param Entrega $entrega The delivery record
     * @param array $ubicacion GPS coordinates ['latitud' => ..., 'longitud' => ...]
     */
    public function __construct(Entrega $entrega, array $ubicacion)
    {
        $this->entrega = $entrega;
        $this->ubicacion = $ubicacion;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('entrega.' . $this->entrega->id),
            new PrivateChannel('chofer.' . $this->entrega->chofer_id),
            new PrivateChannel('admin.pedidos'),
            new PrivateChannel('pedido.' . $this->entrega->proforma_id),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'entrega_id' => $this->entrega->id,
            'proforma_id' => $this->entrega->proforma_id,
            'chofer' => $this->entrega->chofer ? [
                'id' => $this->entrega->chofer->id,
                'nombre' => $this->entrega->chofer->user->nombre . ' ' . $this->entrega->chofer->user->apellidos,
                'telefono' => $this->entrega->chofer->user->telefono ?? null,
            ] : null,
            'vehiculo' => $this->entrega->vehiculo ? [
                'id' => $this->entrega->vehiculo->id,
                'placa' => $this->entrega->vehiculo->placa,
            ] : null,
            'estado' => $this->entrega->estado,
            'ubicacion' => $this->ubicacion,
            'fecha_llegada' => $this->entrega->fecha_llegada,
            'mensaje' => 'Chofer ha llegado al destino',
            'timestamp' => now(),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'entrega.llegada-confirmada';
    }
}
