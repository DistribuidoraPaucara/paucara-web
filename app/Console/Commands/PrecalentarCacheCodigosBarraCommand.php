<?php

namespace App\Console\Commands;

use App\Services\CodigosBarraCacheService;
use Illuminate\Console\Command;

class PrecalentarCacheCodigosBarraCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'codigos-barra:precalentar-cache {--limite=5000 : Cantidad máxima de códigos a cachear}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Precalentar el caché de códigos de barra para búsquedas rápidas en POS';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $limite = (int) $this->option('limite');

        if ($limite <= 0) {
            $this->error('El límite debe ser mayor a 0');
            return 1;
        }

        $this->info("Precalentando caché de códigos de barra (máximo: {$limite} códigos)...");

        try {
            $servicioCache = new CodigosBarraCacheService();

            $bar = $this->output->createProgressBar($limite);
            $bar->setFormat('very_verbose');

            // Precalentar caché
            $cantidad = $servicioCache->precalentarCache(limite: $limite);

            $bar->finish();
            $this->newLine();

            $this->info("✓ Caché precalentado exitosamente con {$cantidad} códigos");
            $this->info("Tiempo de vida del caché: 1 hora (3600 segundos)");

            // Mostrar estadísticas
            $stats = $servicioCache->obtenerEstadisticas();
            $this->newLine();
            $this->info("Estadísticas:");
            $this->info("  • Códigos activos en BD: {$stats['total_codigos_activos']}");
            $this->info("  • Productos con código: {$stats['total_productos_con_codigo']}");
            $this->info("  • TTL del caché: {$stats['cache_ttl']} segundos");

            return 0;

        } catch (\Exception $e) {
            $this->error("Error al precalentar caché: {$e->getMessage()}");
            return 1;
        }
    }
}
