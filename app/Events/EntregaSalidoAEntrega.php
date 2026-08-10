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

/**
 * ✅ NUEVO: Evento cuando una entrega sale a entrega (EN_TRANSITO)
 * Se dispara cuando el estado cambia de PREPARACION_CARGA a EN_TRANSITO
 */
class EntregaSalidoAEntrega
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Entrega $entrega,
        public string $estadoAnterior = 'PREPARACION_CARGA'
    ) {}
}
