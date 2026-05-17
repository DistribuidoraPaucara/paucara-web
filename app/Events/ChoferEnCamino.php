<?php

namespace App\Events;

use App\Models\Entrega;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChoferEnCamino implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Entrega $entrega;

    public function __construct(Entrega $entrega)
    {
        $this->entrega = $entrega;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('pedido.' . $this->entrega->proforma_id),
            new PrivateChannel('entrega.' . $this->entrega->id),
            new PrivateChannel('admin.pedidos'),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'entrega_id' => $this->entrega->id,
            'proforma_id' => $this->entrega->proforma_id,
            'chofer_nombre' => $this->entrega->chofer ? $this->entrega->chofer->user->nombre : null,
            'placa_vehiculo' => $this->entrega->vehiculo ? $this->entrega->vehiculo->placa : null,
            'estado' => $this->entrega->estado,
            'fecha_inicio' => $this->entrega->fecha_inicio,
            'mensaje' => 'Chofer en camino',
            'timestamp' => now(),
        ];
    }

    public function broadcastAs(): string
    {
        return 'chofer.en_camino';
    }
}
