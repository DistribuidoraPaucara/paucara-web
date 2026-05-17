<?php

namespace App\Console\Commands;

use App\Models\Venta;
use Illuminate\Console\Command;

class TestAsientoCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:asiento';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test asiento contable generation';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $venta = Venta::latest()->first();
        if (! $venta) {
            $this->error('No hay ventas disponibles');

            return;
        }

        $this->info("Probando con venta: {$venta->numero}");

        // Probar generación manual
        try {
            $venta->generarAsientoContable();
            $asiento = $venta->fresh()->asientoContable;

            if ($asiento) {
                $this->info("✅ Asiento contable generado: {$asiento->numero}");
                $this->info("   - Debe: {$asiento->total_debe}");
                $this->info("   - Haber: {$asiento->total_haber}");
                $this->info("   - Detalles: {$asiento->detalles->count()}");
            } else {
                $this->error('❌ No se generó el asiento contable');
            }
        } catch (\Exception $e) {
            $this->error('Error: '.$e->getMessage());
        }
    }
}
