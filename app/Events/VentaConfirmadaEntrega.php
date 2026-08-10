<?php

namespace App\Events;

use App\Models\Venta;
use App\Models\Entrega;
use App\Models\EntregaVentaConfirmacion;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VentaConfirmadaEntrega
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $venta;
    public $entrega;
    public $confirmacion;

    public function __construct(Venta $venta, Entrega $entrega, EntregaVentaConfirmacion $confirmacion)
    {
        $this->venta = $venta->load(['cliente', 'preventista', 'estadoLogistica']);
        $this->entrega = $entrega->load(['creador', 'chofer', 'vehiculo']);
        $this->confirmacion = $confirmacion;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
