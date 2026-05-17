<?php
namespace App\Console\Commands;

use Database\Seeders\TiposPrecioSeeder;
use Illuminate\Console\Command;

class SeedTiposPrecioCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tipos-precio:seed
                            {--clean : Limpiar tipos de precio existentes antes de sembrar}
                            {--force : Ejecutar sin confirmaciones}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sembrar tipos de precio del sistema de manera segura';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🌱 Comando para sembrar tipos de precio');
        $this->line('=====================================');

        $clean = $this->option('clean');
        $force = $this->option('force');

        // Mostrar información sobre lo que se va a hacer
        if ($clean) {
            $this->warn('⚠️  Se limpiarán los tipos de precio existentes antes de sembrar nuevos');
        }

        $this->info('✅ Se sembrarán los tipos de precio del sistema:');
        $this->line('   - Precio de venta');
        $this->line('   - Precio de compra');
        $this->line('   - Precio mayorista');
        $this->line('   - Precio especial');

        // Confirmar si no es forzado
        if (! $force) {
            if (! $this->confirm('¿Desea continuar?', true)) {
                $this->info('❌ Operación cancelada');
                return Command::SUCCESS;
            }
        }

        try {
            $seeder = new TiposPrecioSeeder();

            if ($clean) {
                $this->info('🧹 Limpiando tipos de precio existentes...');
                $seeder->limpiarTodosLosTiposPrecio();
                $this->info('✅ Limpieza completada');
            }

            $this->info('🌱 Ejecutando seeder...');
            $seeder->run();
            $this->info('✅ Tipos de precio sembrados exitosamente');

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error('❌ Error al ejecutar el seeder: ' . $e->getMessage());
            $this->line('Sugerencia: Verifica que no haya restricciones de clave foránea');
            return Command::FAILURE;
        }
    }
}
