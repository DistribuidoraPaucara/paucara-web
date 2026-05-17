<?php

namespace App\Events;

use App\Models\Entrega;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EntregaEnCamino implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Entrega $entrega;

    /**
     * Create a new event instance.
     */
    public function __construct(Entrega $entrega)
    {
        $this->entrega = $entrega;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('entrega.' . $this->entrega->id),
            new PrivateChannel('chofer.' . $this->entrega->chofer_id),
            new PrivateChannel('admin.pedidos'),
            new PrivateChannel('cliente.' . $this->entrega->proforma?->cliente_id),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'entrega_id' => $this->entrega->id,
            'chofer' => $this->entrega->chofer ? [
                'id' => $this->entrega->chofer->id,
                'nombre' => $this->entrega->chofer->user->nombre . ' ' . $this->entrega->chofer->user->apellidos,
            ] : null,
            'vehiculo' => $this->entrega->vehiculo ? [
                'id' => $this->entrega->vehiculo->id,
                'placa' => $this->entrega->vehiculo->placa,
            ] : null,
            'estado' => $this->entrega->estado,
            'fecha_inicio' => $this->entrega->fecha_inicio,
            'mensaje' => 'Entrega en camino',
            'timestamp' => now(),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'entrega.en_camino';
    }
}
