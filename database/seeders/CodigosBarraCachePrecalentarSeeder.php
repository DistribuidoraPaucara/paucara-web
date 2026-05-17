<?php

namespace Database\Seeders;

use App\Services\CodigosBarraCacheService;
use Illuminate\Database\Seeder;

class CodigosBarraCachePrecalentarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Precalentando caché de códigos de barra...');

        try {
            $servicioCache = new CodigosBarraCacheService();

            // Precalentar caché con un límite razonable (5000 códigos)
            $cantidad = $servicioCache->precalentarCache(limite: 5000);

            $this->command->info("✓ Caché precalentado exitosamente con {$cantidad} códigos");

            // Mostrar estadísticas
            $stats = $servicioCache->obtenerEstadisticas();
            $this->command->info('Estadísticas:');
            $this->command->info("  • Códigos activos en BD: {$stats['total_codigos_activos']}");
            $this->command->info("  • Productos con código: {$stats['total_productos_con_codigo']}");
            $this->command->info("  • TTL del caché: {$stats['cache_ttl']} segundos");

        } catch (\Exception $e) {
            $this->command->error("Error al precalentar caché: {$e->getMessage()}");
        }
    }
}
