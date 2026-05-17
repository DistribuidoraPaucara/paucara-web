<?php

namespace App\Console\Commands;

use App\Models\AperturaCaja;
use App\Models\MovimientoCaja;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class LlenarAperturaCajaIdEnMovimientos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:llenar-apertura-caja-id-en-movimientos';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '✅ Llena apertura_caja_id en movimientos_caja existentes basándose en fechas y caja_id';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Comenzando a llenar apertura_caja_id en movimientos_caja...');

        $movimientosActualizados = 0;
        $movimientosConError = 0;

        // Obtener todas las aperturas ordenadas por fecha descendente
        $aperturas = AperturaCaja::with('cierre')
            ->orderBy('fecha', 'desc')
            ->get();

        foreach ($aperturas as $apertura) {
            try {
                // Determinar fecha de cierre (si existe) o usar ahora
                $fechaCierre = $apertura->cierre?->created_at ?? now();

                // Buscar movimientos que pertenecen a esta apertura:
                // - Fecha >= apertura->fecha
                // - Fecha <= cierre->fecha (si existe)
                // - caja_id = apertura->caja_id
                // - user_id = apertura->user_id
                // - apertura_caja_id = null (no asignado aún)
                $movimientos = MovimientoCaja::where('apertura_caja_id', null)
                    ->where('caja_id', $apertura->caja_id)
                    ->where('user_id', $apertura->user_id)
                    ->where('fecha', '>=', $apertura->fecha)
                    ->where('fecha', '<=', $fechaCierre)
                    ->get();

                if ($movimientos->count() > 0) {
                    MovimientoCaja::where('apertura_caja_id', null)
                        ->where('caja_id', $apertura->caja_id)
                        ->where('user_id', $apertura->user_id)
                        ->where('fecha', '>=', $apertura->fecha)
                        ->where('fecha', '<=', $fechaCierre)
                        ->update(['apertura_caja_id' => $apertura->id]);

                    $movimientosActualizados += $movimientos->count();
                    $this->line("✅ Apertura #{$apertura->id}: {$movimientos->count()} movimientos actualizados");
                }
            } catch (\Throwable $e) {
                $movimientosConError++;
                $this->error("❌ Error en apertura #{$apertura->id}: {$e->getMessage()}");
            }
        }

        $this->newLine();
        $this->info("✅ Proceso completado:");
        $this->info("   - Total movimientos actualizados: {$movimientosActualizados}");
        $this->warn("   - Errores: {$movimientosConError}");

        // Verificar si hay movimientos huérfanos (sin apertura asignada)
        $orfanos = MovimientoCaja::whereNull('apertura_caja_id')->count();
        if ($orfanos > 0) {
            $this->warn("\n⚠️  Hay {$orfanos} movimientos que no pudieron ser asignados a una apertura.");
            $this->info("   Esto podría significar que fueron creados sin una caja abierta.");
        }

        return 0;
    }
}
