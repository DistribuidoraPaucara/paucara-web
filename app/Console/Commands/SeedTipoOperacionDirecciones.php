<?php

namespace App\Console\Commands;

use Database\Seeders\TipoOperacionCajaDireccionSeeder;
use Illuminate\Console\Command;

class SeedTipoOperacionDirecciones extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seed:tipo-operacion-direcciones {--force : Force execution without confirmation}';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Asignar direcciones (ENTRADA/SALIDA/AJUSTE) a tipos de operación de caja. Útil para refactorización de CierreCajaService.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Mostrar advertencia
        $this->warn('⚠️  Este comando asignará direcciones a los tipos de operación.');
        $this->warn('📊 Clasificaciones:');
        $this->line('   📥 ENTRADA: VENTA, PAGO, INGRESO_EXTRA');
        $this->line('   📤 SALIDA: COMPRA, GASTOS, PAGO_SUELDO, ANTICIPO, ANULACION');
        $this->line('   🔧 AJUSTE: AJUSTE, CREDITO');
        $this->line('   🔐 ESPECIAL: APERTURA, CIERRE');
        $this->newLine();

        // Pedir confirmación
        if (!$this->option('force') && !$this->confirm('¿Deseas continuar?')) {
            $this->info('❌ Operación cancelada.');
            return self::FAILURE;
        }

        try {
            $this->call('db:seed', [
                '--class' => TipoOperacionCajaDireccionSeeder::class,
            ]);

            $this->info('✅ Direcciones asignadas exitosamente!');
            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error('❌ Error al asignar direcciones: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}
