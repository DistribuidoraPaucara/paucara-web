<?php

namespace App\Events;

use App\Models\NotificacionRecurrente;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificacionRecurrenteEmitida implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public NotificacionRecurrente $notificacion;

    /**
     * Create a new event instance.
     */
    public function __construct(NotificacionRecurrente $notificacion)
    {
        $this->notificacion = $notificacion;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('notificaciones-recurrentes'),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'type' => 'notificacion_recurrente',
            'id' => $this->notificacion->id,
            'titulo' => $this->notificacion->titulo,
            'descripcion' => $this->notificacion->descripcion,
            'tipo' => $this->notificacion->tipo,
            'enviada_en' => $this->notificacion->ultimo_envio,
        ];
    }

    /**
     * Get the broadcast event name.
     */
    public function broadcastAs(): string
    {
        return 'notificacion-recurrente-emitida';
    }
}
