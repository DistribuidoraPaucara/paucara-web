<?php

namespace App\Events;

use App\Models\Entrega;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EntregaCancelada implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Entrega $entrega;
    public ?string $motivo;

    /**
     * Create a new event instance.
     */
    public function __construct(Entrega $entrega, ?string $motivo = null)
    {
        $this->entrega = $entrega;
        $this->motivo = $motivo;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('entregas.' . $this->entrega->id),
            new PrivateChannel('choferes.' . $this->entrega->chofer_id),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'entrega_id' => $this->entrega->id,
            'numero_entrega' => $this->entrega->numero_entrega,
            'estado' => 'CANCELADA',
            'motivo' => $this->motivo,
            'fecha_cancelacion' => $this->entrega->updated_at->toIso8601String(),
            'chofer_id' => $this->entrega->chofer_id,
            'vehiculo_id' => $this->entrega->vehiculo_id,
        ];
    }

    /**
     * El nombre del evento para broadcasting
     */
    public function broadcastAs(): string
    {
        return 'entrega.cancelada';
    }
}
