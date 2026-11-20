<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Borra las notificaciones LEÍDAS más antiguas que N días (por defecto 90).
 * Las no leídas se conservan. Borra por lotes para no bloquear la tabla.
 */
class LimpiarNotificaciones extends Command
{
    protected $signature = 'notificaciones:limpiar {--dias=90 : Antigüedad mínima en días} {--lote=5000}';

    protected $description = 'Elimina notificaciones leídas con más de N días de antigüedad';

    public function handle(): int
    {
        $dias  = max(1, (int) $this->option('dias'));
        $lote  = max(100, (int) $this->option('lote'));
        $corte = now()->subDays($dias);
        $total = 0;

        do {
            $ids = DB::table('notifications')
                ->where('read', true)
                ->where('created_at', '<', $corte)
                ->limit($lote)
                ->pluck('id');

            $borradas = $ids->isEmpty() ? 0 : DB::table('notifications')->whereIn('id', $ids)->delete();
            $total += $borradas;
        } while ($borradas === $lote);

        // Historial de envíos push: misma retención
        $envios = DB::table('notificaciones_envios')->where('created_at', '<', $corte)->delete();

        $this->info("🧹 {$total} notificaciones leídas y {$envios} envíos push con más de {$dias} días eliminados");
        \Log::info('notificaciones:limpiar', ['eliminadas' => $total, 'envios' => $envios, 'dias' => $dias]);

        return self::SUCCESS;
    }
}
