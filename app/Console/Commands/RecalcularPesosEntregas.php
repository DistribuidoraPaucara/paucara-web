<?php

namespace App\Console\Commands;

use App\Models\Entrega;
use App\Models\EstadoDocumento;
use Illuminate\Console\Command;

class RecalcularPesosEntregas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:recalcular-pesos-entregas
        {--entrega_id= : Recalcular solo una entrega específica}
        {--solo-con-anuladas : Recalcular solo las entregas que tienen ventas anuladas o canceladas}
        {--dry-run : Mostrar los cambios sin guardarlos}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Recalcular peso total de entregas sumando sus ventas vigentes (sin anuladas ni canceladas)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $simular = (bool) $this->option('dry-run');

        $this->info($simular ? 'Simulando recálculo (no se guarda nada)...' : 'Iniciando recálculo de pesos para entregas...');

        $query = Entrega::query();

        if ($this->option('entrega_id')) {
            $query->whereKey($this->option('entrega_id'));
        }

        if ($this->option('solo-con-anuladas')) {
            $query->whereHas('ventas.estadoDocumento', fn ($q) => $q->whereIn('codigo', EstadoDocumento::CODIGOS_SIN_EFECTO));
        }

        $cambiadas = 0;
        $omitidas = 0;
        $totalDiferencia = 0.0;

        $query->chunkById(200, function ($entregas) use ($simular, &$cambiadas, &$omitidas, &$totalDiferencia) {
            foreach ($entregas as $entrega) {
                $pesoNuevo = $entrega->calcularPesoVigente();

                if ($pesoNuevo === null) {
                    $this->warn("{$entrega->numero_entrega}: omitida, tiene ventas vigentes sin peso");
                    $omitidas++;

                    continue;
                }

                $pesoAnterior = (float) $entrega->peso_kg;
                $diferencia = round($pesoNuevo - $pesoAnterior, 2);

                if ($diferencia == 0.0) {
                    continue;
                }

                $this->line("{$entrega->numero_entrega}: {$pesoAnterior} kg -> {$pesoNuevo} kg ({$diferencia} kg)");

                if (! $simular) {
                    $entrega->recalcularPeso();
                }

                $cambiadas++;
                $totalDiferencia += $diferencia;
            }
        });

        $this->info("Resumen: {$cambiadas} con cambios, {$omitidas} omitidas, diferencia total " . number_format($totalDiferencia, 2) . ' kg');

        return self::SUCCESS;
    }
}
