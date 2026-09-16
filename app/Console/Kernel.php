<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Liberar reservas inconsistentes diariamente a las 2 AM
        $schedule->command('reservas:liberar-inconsistentes')
            ->dailyAt('02:00')
            ->appendOutputTo(storage_path('logs/reservas-cleanup.log'));

        // Enviar notificaciones recurrentes cada minuto (Socket.IO)
        $schedule->command('notificaciones:enviar')
            ->everyMinute()
            ->withoutOverlapping()
            ->appendOutputTo(storage_path('logs/notificaciones.log'));

        // ✅ NUEVO: Enviar notificaciones recurrentes via Firebase Cloud Messaging cada minuto
        $schedule->command('notificaciones:enviar-fcm')
            ->everyMinute()
            ->withoutOverlapping()
            ->appendOutputTo(storage_path('logs/notificaciones-fcm.log'));
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
