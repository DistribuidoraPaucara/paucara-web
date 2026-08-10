<?php
namespace App\Services\WebSocket;

class NotificacionRecurrenteWebSocketService extends BaseWebSocketService
{
    public function notifyEmitida($notificacion): bool
    {
        // Cargar roles si no están cargados
        if (!$notificacion->relationLoaded('roles')) {
            $notificacion->load('roles');
        }

        return $this->send('notify/notificacion-recurrente-emitida', [
            'id' => $notificacion->id,
            'titulo' => $notificacion->titulo,
            'descripcion' => $notificacion->descripcion,
            'tipo' => $notificacion->tipo,
            'total_enviadas' => $notificacion->total_enviadas,
            'vistas' => $notificacion->vistas,
            'roles' => $notificacion->roles->pluck('name')->toArray(),
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
