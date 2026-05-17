<?php

namespace App\Events;

use App\Models\Entrega;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NovedadReportada implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Entrega $entrega;
    public string $motivo;

    public function __construct(Entrega $entrega, string $motivo = '')
    {
        $this->entrega = $entrega;
        $this->motivo = $motivo;
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
            'motivo' => $this->motivo,
            'observaciones' => $this->entrega->observaciones,
            'foto_url' => $this->entrega->foto_entrega_url,
            'mensaje' => 'Novedad reportada en la entrega',
            'timestamp' => now(),
        ];
    }

    public function broadcastAs(): string
    {
        return 'novedad.reportada';
    }
}
