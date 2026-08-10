<?php
namespace App\Services\Notificaciones;

use App\DTOs\Notificaciones\CrearNotificacionDTO;
use App\Models\NotificacionRecurrente;
use App\Services\WebSocket\NotificacionRecurrenteWebSocketService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NotificacionRecurrenteService
{
    protected NotificacionRecurrenteWebSocketService $wsService;

    public function __construct(NotificacionRecurrenteWebSocketService $wsService)
    {
        $this->wsService = $wsService;
    }

    public function crear(CrearNotificacionDTO $dto): NotificacionRecurrente
    {
        $dto->validar();

        $notificacion = DB::transaction(function () use ($dto) {
            Log::info('📢 [NotificacionService::crear] Creando notificación recurrente', [
                'titulo' => $dto->titulo,
                'frecuencia' => $dto->frecuencia,
                'usuario_id' => $dto->usuario_id,
            ]);

            $notificacion = NotificacionRecurrente::create([
                'titulo' => $dto->titulo,
                'descripcion' => $dto->descripcion,
                'tipo' => $dto->tipo,
                'frecuencia' => $dto->frecuencia,
                'hora_envio' => $dto->hora_envio,
                'dias_semana' => $dto->dias_semana,
                'dia_mes' => $dto->dia_mes,
                'fecha_inicio' => $dto->fecha_inicio,
                'fecha_fin' => $dto->fecha_fin,
                'activo' => $dto->activo,
                'usuario_id' => $dto->usuario_id,
            ]);

            Log::info('✅ [NotificacionService::crear] Notificación creada', [
                'notificacion_id' => $notificacion->id,
            ]);

            return $notificacion;
        });

        return $notificacion;
    }

    public function enviar(NotificacionRecurrente $notificacion): void
    {
        Log::info('📤 [NotificacionService::enviar] Enviando notificación', [
            'notificacion_id' => $notificacion->id,
            'titulo' => $notificacion->titulo,
        ]);

        try {
            DB::transaction(function () use ($notificacion) {
                $notificacion->incrementarEnvios();

                Log::debug('🎯 [NotificacionService::enviar] Enviando al WebSocket', [
                    'notificacion_id' => $notificacion->id,
                    'total_enviadas' => $notificacion->total_enviadas,
                ]);

                $this->wsService->notifyEmitida($notificacion);
            });

            Log::info('✅ [NotificacionService::enviar] Notificación enviada exitosamente', [
                'notificacion_id' => $notificacion->id,
                'total_enviadas' => $notificacion->total_enviadas,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ [NotificacionService::enviar] Error al enviar notificación', [
                'notificacion_id' => $notificacion->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function obtenerParaEnviar()
    {
        return NotificacionRecurrente::activas()
            ->paraEstaHora()
            ->get();
    }
}