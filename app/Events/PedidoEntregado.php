<?php

namespace App\Events;

use App\Models\Entrega;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PedidoEntregado implements ShouldBroadcast
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
            'estado' => $this->entrega->estado,
            'fecha_entrega' => $this->entrega->fecha_entrega,
            'firma_digital_url' => $this->entrega->firma_digital_url,
            'foto_entrega_url' => $this->entrega->foto_entrega_url,
            'observaciones' => $this->entrega->observaciones,
            'mensaje' => 'Pedido entregado correctamente',
            'timestamp' => now(),
        ];
    }

    public function broadcastAs(): string
    {
        return 'pedido.entregado';
    }
}
