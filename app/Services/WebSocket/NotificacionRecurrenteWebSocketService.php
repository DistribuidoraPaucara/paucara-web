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

        $roleNames = $notificacion->roles->pluck('name')->toArray();
        $payload = [
            'id' => $notificacion->id,
            'titulo' => $notificacion->titulo,
            'descripcion' => $notificacion->descripcion,
            'tipo' => $notificacion->tipo,
            'total_enviadas' => $notificacion->total_enviadas,
            'vistas' => $notificacion->vistas,
            'timestamp' => now()->toIso8601String(),
        ];

        // Si hay roles asignados, enviar SOLO a esos roles
        if (!empty($roleNames)) {
            \Illuminate\Support\Facades\Log::info('📢 Enviando notificación a roles específicos', [
                'notificacion_id' => $notificacion->id,
                'roles' => $roleNames,
            ]);

            $resultados = [];
            foreach ($roleNames as $roleName) {
                $resultado = $this->notifyRole($roleName, 'notificacion-recurrente-emitida', $payload);
                $resultados[$roleName] = $resultado;
            }

            // Retornar true si al menos uno se envió exitosamente
            $enviado = in_array(true, $resultados);

            \Illuminate\Support\Facades\Log::info('✅ Notificación enviada a roles', [
                'notificacion_id' => $notificacion->id,
                'resultados' => $resultados,
                'al_menos_uno_exitoso' => $enviado,
            ]);

            return $enviado;
        }

        // Si NO hay roles asignados, hacer broadcast a todos
        \Illuminate\Support\Facades\Log::info('📢 Notificación sin roles - broadcast a todos', [
            'notificacion_id' => $notificacion->id,
        ]);

        return $this->broadcast('notificacion-recurrente-emitida', $payload);
    }
}
