<?php

namespace App\Console\Commands;

use App\Events\NotificacionRecurrenteEmitida;
use App\Models\NotificacionRecurrente;
use Illuminate\Console\Command;

class EnviarNotificacionesRecurrentes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notificaciones:enviar {--force : Forzar envío sin validar hora}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Enviar notificaciones recurrentes pendientes a todos los clientes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔔 Iniciando envío de notificaciones recurrentes...');

        $force = $this->option('force');
        $hora_actual = now()->format('H:i');
        $hora_actual_int = (int) str_replace(':', '', $hora_actual);

        // Obtener notificaciones activas y vigentes
        $notificaciones = NotificacionRecurrente::activas()
            ->vigentes()
            ->get();

        $this->info("📋 Total de notificaciones activas: {$notificaciones->count()}");

        $enviadas = 0;
        $saltadas = 0;

        foreach ($notificaciones as $notif) {
            // Validar si debe enviarse hoy
            if (!$notif->debeEnviarseHoy()) {
                $this->line("⏭️  Saltando: {$notif->titulo} (no corresponde hoy)");
                $saltadas++;
                continue;
            }

            // Validar hora de envío
            $hora_envio = $notif->hora_envio; // "08:00"
            $hora_envio_int = (int) str_replace(':', '', $hora_envio);

            if (!$force && $hora_actual_int < $hora_envio_int) {
                $this->line("⏳ No es hora de envío: {$notif->titulo} (espera a las {$hora_envio})");
                $saltadas++;
                continue;
            }

            // Validar que no se haya enviado hoy (para recurrentes)
            if ($notif->ultimo_envio && $notif->ultimo_envio->isToday()) {
                $this->line("✓ Ya enviado hoy: {$notif->titulo}");
                $saltadas++;
                continue;
            }

            // Enviar notificación
            try {
                broadcast(new NotificacionRecurrenteEmitida($notif));

                // Registrar envío
                $notif->registrarEnvio(1);

                $this->info("✅ Enviada: {$notif->titulo} (tipo: {$notif->tipo})");
                $enviadas++;
            } catch (\Exception $e) {
                $this->error("❌ Error enviando {$notif->titulo}: " . $e->getMessage());
            }
        }

        $this->line('');
        $this->info("✅ Resumen:");
        $this->line("   Enviadas: {$enviadas}");
        $this->line("   Saltadas: {$saltadas}");
        $this->line("   Total procesadas: " . ($enviadas + $saltadas));

        return Command::SUCCESS;
    }
}
