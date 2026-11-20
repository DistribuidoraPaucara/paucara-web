<?php

namespace App\Console\Commands;

use App\Models\HorarioNotificacion;
use App\Models\NotificacionRecurrente;
use App\Services\Firebase\FirebaseNotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EnviarNotificacionesRecurrentesFcm extends Command
{
    protected $signature = 'notificaciones:enviar-fcm {--force : Forzar envío incluso si ya fue enviada hoy}';

    protected $description = 'Enviar notificaciones recurrentes a dispositivos registrados via Firebase Cloud Messaging';

    protected FirebaseNotificationService $firebaseService;

    public function __construct(FirebaseNotificationService $firebaseService)
    {
        parent::__construct();
        $this->firebaseService = $firebaseService;
    }

    public function handle(): int
    {
        try {
            $horaActual = now()->format('H:i');
            $force = $this->option('force');

            $this->info("⏰ Verificando notificaciones para la hora: {$horaActual}");

            // Obtener horarios que deben enviarse en esta hora
            $horariosAEnviar = HorarioNotificacion::with('notificacion')
                ->where('hora', '=', $horaActual)
                ->where('activo', true)
                ->get();

            if ($horariosAEnviar->isEmpty()) {
                $this->info('✓ No hay notificaciones programadas para esta hora');
                return Command::SUCCESS;
            }

            $this->info("📢 Se encontraron {$horariosAEnviar->count()} horarios para enviar");

            $enviados = 0;
            $fallidos = 0;

            foreach ($horariosAEnviar as $horario) {
                try {
                    $notificacion = $horario->notificacion;

                    if (!$notificacion || !$notificacion->activo) {
                        Log::warning('⚠️ Notificación inactiva, saltando', [
                            'horario_id' => $horario->id,
                            'notificacion_id' => $notificacion?->id,
                        ]);
                        $fallidos++;
                        continue;
                    }

                    // Verificar si es un envío válido según la frecuencia
                    if (!$this->debeEnviarse($notificacion, $horario, $force)) {
                        $this->info("⏭️  Saltando: {$notificacion->titulo} (ya enviada hoy o no es el día)");
                        continue;
                    }

                    // Enviar a través de Firebase
                    $result = $this->firebaseService->enviarADispositivos($notificacion);

                    if ($result['enviados'] > 0) {
                        $enviados += $result['enviados'];

                        // Actualizar registro del horario
                        $horario->incrementarEnvio();

                        // Actualizar total_enviadas de la notificación
                        $notificacion->increment('total_enviadas', $result['enviados']);

                        $this->info("✅ {$notificacion->titulo}: {$result['enviados']} enviadas");

                        Log::info('✅ Notificación enviada por FCM', [
                            'notificacion_id' => $notificacion->id,
                            'horario_id' => $horario->id,
                            'enviados' => $result['enviados'],
                            'fallidos' => $result['fallidos'],
                        ]);
                    } else {
                        $this->warn("⚠️  {$notificacion->titulo}: 0 dispositivos registrados");
                        $fallidos++;
                    }
                } catch (\Exception $e) {
                    $fallidos++;
                    $this->error("❌ Error: {$e->getMessage()}");
                    Log::error('❌ Error enviando notificación', [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                    ]);
                }
            }

            $this->info("=================================");
            $this->info("📊 Resumen: {$enviados} enviadas, {$fallidos} fallidas");
            $this->info("=================================");

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error("❌ Error fatal: {$e->getMessage()}");
            Log::error('❌ Error fatal en EnviarNotificacionesRecurrentesFcm', [
                'error' => $e->getMessage(),
            ]);

            return Command::FAILURE;
        }
    }

    /**
     * Determinar si la notificación debe enviarse según su frecuencia
     */
    private function debeEnviarse(
        NotificacionRecurrente $notificacion,
        HorarioNotificacion $horario,
        bool $force = false
    ): bool {
        // Si se fuerza, siempre enviar
        if ($force) {
            return true;
        }

        // Verificar si ya fue enviada hoy
        if ($horario->yaFueEnviadaHoy()) {
            return false;
        }

        // Vigencia por fecha (incluye el día de fin completo) y frecuencia
        return $notificacion->estaVigente() && $notificacion->debeEnviarsePorFrecuencia();
    }
}
