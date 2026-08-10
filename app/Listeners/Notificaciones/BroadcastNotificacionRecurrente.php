<?php
namespace App\Listeners\Notificaciones;

use App\Events\NotificacionRecurrenteEmitida;
use App\Listeners\BaseBroadcastListener;

class BroadcastNotificacionRecurrente extends BaseBroadcastListener
{
    protected string $eventName = 'NotificacionRecurrenteEmitida';
    private NotificacionRecurrenteEmitida $event;

    public function handle(NotificacionRecurrenteEmitida $event): void
    {
        $this->event = $event;
        $this->logBroadcast();
    }

    public function broadcastOn(): array
    {
        return [
            $this->publicChannel("notificaciones-recurrentes"),
        ];
    }

    public function broadcastAs(): string
    {
        return "notificacion-recurrente:emitida";
    }

    public function broadcastWith(): array
    {
        return [
            "id" => $this->event->notificacion->id,
            "titulo" => $this->event->notificacion->titulo,
            "descripcion" => $this->event->notificacion->descripcion,
            "tipo" => $this->event->notificacion->tipo,
            "total_enviadas" => $this->event->notificacion->total_enviadas,
            "vistas" => $this->event->notificacion->vistas,
            "timestamp" => now()->toIso8601String(),
        ];
    }
}