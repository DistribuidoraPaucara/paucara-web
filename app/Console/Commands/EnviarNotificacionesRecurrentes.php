<?php
namespace App\Console\Commands;

use App\Models\NotificacionRecurrente;
use App\Services\Notificaciones\NotificacionRecurrenteService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class EnviarNotificacionesRecurrentes extends Command
{
    protected $signature = 'notificaciones:enviar';
    protected $description = 'Envía notificaciones recurrentes según su horario programado';

    public function __construct(
        private NotificacionRecurrenteService $service
    ) {
        parent::__construct();
    }

    public function handle()
    {
        $ahora = now();
        $horaActual = $ahora->format('H:i');
        $diaHoy = strtolower($ahora->dayName);

        Log::info('⏰ [EnviarNotificacionesRecurrentes] Ejecutando scheduler', [
            'hora_actual' => $horaActual,
            'dia_hoy' => $diaHoy,
            'timestamp' => $ahora->toIso8601String(),
        ]);

        $notificaciones = NotificacionRecurrente::where('activo', true)
            ->where('hora_envio', '=', $horaActual)
            ->where('fecha_inicio', '<=', $ahora->toDateString())
            ->where(function ($q) use ($ahora) {
                $q->whereNull('fecha_fin')
                  ->orWhere('fecha_fin', '>=', $ahora->toDateString());
            })
            ->get();

        if ($notificaciones->isEmpty()) {
            Log::info('ℹ️  [EnviarNotificacionesRecurrentes] No hay notificaciones para enviar');
            return;
        }

        $this->line('📢 ' . $notificaciones->count() . ' notificación(es) encontrada(s)');

        foreach ($notificaciones as $notif) {
            if (!$notif->debeEnviarsePorFrecuencia()) {
                $this->line('⏭️  Notificación ' . $notif->id . ' no aplica para ' . $diaHoy);
                continue;
            }

            if ($notif->yaFueEnviadaHoy()) {
                $this->line('⏭️  Notificación ' . $notif->id . ' ya fue enviada hoy');
                continue;
            }

            try {
                $this->service->enviar($notif);
                $this->line('✅ Notificación ' . $notif->id . ' (' . $notif->titulo . ') enviada');
            } catch (\Exception $e) {
                $this->line('❌ Error al enviar notificación ' . $notif->id . ': ' . $e->getMessage());
                Log::error('Error en scheduler de notificaciones', [
                    'notificacion_id' => $notif->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        Log::info('✅ [EnviarNotificacionesRecurrentes] Scheduler completado');
    }
}