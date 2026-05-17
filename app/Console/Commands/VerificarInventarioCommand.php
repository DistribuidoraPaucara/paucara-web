<?php

namespace App\Console\Commands;

use App\Jobs\VerificarStockBajoJob;
use App\Jobs\VerificarVencimientosJob;
use Illuminate\Console\Command;

class VerificarInventarioCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'inventario:verificar
                            {--stock-bajo : Solo verificar productos con stock bajo}
                            {--vencimientos : Solo verificar productos próximos a vencer}
                            {--dias=30 : Días de anticipación para vencimientos}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verifica el inventario y envía alertas de stock bajo y productos próximos a vencer';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🔍 Iniciando verificación de inventario...');

        $stockBajo = $this->option('stock-bajo');
        $vencimientos = $this->option('vencimientos');
        $dias = (int) $this->option('dias');

        // Si no se especifica ninguna opción, ejecutar ambas verificaciones
        if (! $stockBajo && ! $vencimientos) {
            $stockBajo = true;
            $vencimientos = true;
        }

        try {
            if ($stockBajo) {
                $this->info('📦 Verificando productos con stock bajo...');
                VerificarStockBajoJob::dispatch();
                $this->info('✅ Verificación de stock bajo programada');
            }

            if ($vencimientos) {
                $this->info("📅 Verificando productos próximos a vencer (próximos {$dias} días)...");
                VerificarVencimientosJob::dispatch($dias);
                $this->info('✅ Verificación de vencimientos programada');
            }

            $this->info('🎉 Verificación de inventario completada exitosamente');

            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error('❌ Error durante la verificación de inventario: '.$e->getMessage());

            return self::FAILURE;
        }
    }
}
