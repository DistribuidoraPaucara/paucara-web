<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RecalcularPesosEntregas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:recalcular-pesos-entregas {--entrega_id= : Recalcular solo una entrega específica}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Recalcular peso total de entregas basado en las ventas que contienen';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Iniciando recálculo de pesos para entregas...');

        $query = DB::table('entregas');

        if ($this->option('entrega_id')) {
            $query->where('id', $this->option('entrega_id'));
            $this->info('Recalculando solo entrega ID: ' . $this->option('entrega_id'));
        }

        $entregas = $query->get(['id', 'numero_entrega', 'peso_kg']);
        $updated = 0;
        $failed = 0;
        $totalDiferencia = 0;

        foreach ($entregas as $entrega) {
            try {
                // Calcular peso total de la entrega basado en sus ventas
                $pesoTotal = DB::table('entrega_venta')
                    ->join('ventas', 'entrega_venta.venta_id', '=', 'ventas.id')
                    ->where('entrega_venta.entrega_id', $entrega->id)
                    ->sum('ventas.peso_estimado');

                $pesoAnterior = $entrega->peso_kg;
                $diferencia = $pesoTotal - $pesoAnterior;

                // Actualizar entrega
                DB::table('entregas')
                    ->where('id', $entrega->id)
                    ->update(['peso_kg' => $pesoTotal ?? 0]);

                $estado = $diferencia != 0 ? '⚠️' : '✓';
                $signo = $diferencia >= 0 ? '+' : '';
                $this->line("{$estado} {$entrega->numero_entrega}: {$pesoAnterior} kg → {$pesoTotal} kg (Δ {$signo}" . number_format($diferencia, 2) . " kg)");

                $totalDiferencia += $diferencia;
                $updated++;
            } catch (\Exception $e) {
                $this->error("✗ {$entrega->numero_entrega}: {$e->getMessage()}");
                $failed++;
            }
        }

        $this->info("\n" . str_repeat('─', 60));
        $this->info("Resumen: {$updated} actualizadas, {$failed} errores");
        if ($totalDiferencia != 0) {
            $signoTotal = $totalDiferencia >= 0 ? '+' : '';
            $this->info("Diferencia total de peso: {$signoTotal}" . number_format($totalDiferencia, 2) . " kg");
        }
        $this->info(str_repeat('─', 60));

        return 0;
    }
}
