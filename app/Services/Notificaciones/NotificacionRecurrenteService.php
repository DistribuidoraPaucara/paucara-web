<?php
namespace App\Services\Notificaciones;

use App\DTOs\Notificaciones\CrearNotificacionDTO;
use App\Models\NotificacionRecurrente;
use App\Models\User;
use App\Services\Firebase\FirebaseNotificationService;
use App\Services\Notifications\DatabaseNotificationService;
use App\Services\WebSocket\NotificacionRecurrenteWebSocketService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NotificacionRecurrenteService
{
    protected NotificacionRecurrenteWebSocketService $wsService;
    protected FirebaseNotificationService $firebaseService;
    protected DatabaseNotificationService $dbNotificationService;

    public function __construct(
        NotificacionRecurrenteWebSocketService $wsService,
        FirebaseNotificationService $firebaseService,
        DatabaseNotificationService $dbNotificationService
    ) {
        $this->wsService = $wsService;
        $this->firebaseService = $firebaseService;
        $this->dbNotificationService = $dbNotificationService;
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
                'imagen_url' => $dto->imagen_url,
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
                // Enviar a WebSocket (tiempo real para web)
                Log::debug('🎯 [NotificacionService::enviar] Enviando al WebSocket', [
                    'notificacion_id' => $notificacion->id,
                ]);
                $this->wsService->notifyEmitida($notificacion);

                // ✅ Persistir en la bandeja de los usuarios destino (campana + historial)
                $this->guardarEnBandeja($notificacion);

                // ✅ NUEVO: Enviar a Firebase Cloud Messaging (para móviles)
                Log::debug('🎯 [NotificacionService::enviar] Enviando a Firebase', [
                    'notificacion_id' => $notificacion->id,
                ]);

                try {
                    $firebaseResult = $this->firebaseService->enviarADispositivos($notificacion);
                    Log::info('✅ Firebase: notificación enviada', [
                        'notificacion_id' => $notificacion->id,
                        'enviados' => $firebaseResult['enviados'],
                        'fallidos' => $firebaseResult['fallidos'],
                    ]);
                    // Actualizar total_enviadas con el número real enviado a Firebase
                    if ($firebaseResult['enviados'] > 0) {
                        $notificacion->increment('total_enviadas', $firebaseResult['enviados']);
                    }
                } catch (\Exception $fcmError) {
                    Log::warning('⚠️  Error enviando a Firebase (continuando con WebSocket)', [
                        'notificacion_id' => $notificacion->id,
                        'error' => $fcmError->getMessage(),
                    ]);
                    // No lanzar la excepción, continuar con WebSocket
                }

                // Actualizar último envío
                $notificacion->update(['ultimo_envio' => now()]);
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

    /**
     * Guarda la notificación recurrente en `notifications` para los usuarios
     * de sus roles (o todos los activos si no tiene roles), para que aparezca
     * en la campana y en el historial. Un fallo aquí no debe frenar el envío.
     */
    protected function guardarEnBandeja(NotificacionRecurrente $notificacion): void
    {
        try {
            $roles = $notificacion->roles()->pluck('name')->all();

            $userIds = User::where('activo', true)
                ->when(! empty($roles), fn ($q) => $q->whereHas('roles', fn ($r) => $r->whereIn('name', $roles)))
                ->pluck('id')
                ->all();

            $this->dbNotificationService->createBulk($userIds, 'recurrente.' . ($notificacion->tipo ?: 'informativo'), [
                'notificacion_recurrente_id' => $notificacion->id,
                'titulo'                     => $notificacion->titulo,
                'descripcion'                => $notificacion->descripcion,
                'imagen_url'                 => $notificacion->imagen_url,
            ]);
        } catch (\Throwable $e) {
            Log::warning('⚠️ No se pudo guardar la notificación recurrente en la bandeja', [
                'notificacion_id' => $notificacion->id,
                'error'           => $e->getMessage(),
            ]);
        }
    }

    public function obtenerParaEnviar()
    {
        return NotificacionRecurrente::activas()
            ->paraEstaHora()
            ->get();
    }
}