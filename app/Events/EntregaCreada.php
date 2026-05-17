<?php

namespace App\Events;

use App\Models\Entrega;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EntregaCreada implements ShouldBroadcast
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
            new PrivateChannel('admin.pedidos'),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'entrega_id' => $this->entrega->id,
            'proforma' => $this->entrega->proforma ? [
                'id' => $this->entrega->proforma->id,
                'numero' => $this->entrega->proforma->numero,
            ] : null,
            'cliente' => $this->entrega->proforma?->cliente ? [
                'id' => $this->entrega->proforma->cliente->id,
                'nombre' => $this->entrega->proforma->cliente->nombre,
            ] : null,
            'estado' => $this->entrega->estado,
            'mensaje' => 'Entrega creada',
            'timestamp' => now(),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'entrega.creada';
    }
}
