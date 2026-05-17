<?php

namespace App\Console\Commands;

use App\Models\AsientoContable;
use Illuminate\Console\Command;

class VerAsientoCommand extends Command
{
    protected $signature = 'ver:asiento';

    protected $description = 'Ver detalles del último asiento contable';

    public function handle()
    {
        $asiento = AsientoContable::with('detalles')->latest()->first();

        if (! $asiento) {
            $this->error('No hay asientos contables');

            return;
        }

        $this->info("Asiento: {$asiento->numero}");
        $this->info("Total Debe: {$asiento->total_debe}");
        $this->info("Total Haber: {$asiento->total_haber}");
        $this->info('Detalles:');

        foreach ($asiento->detalles as $detalle) {
            $this->info("  - {$detalle->nombre_cuenta}: Debe={$detalle->debe}, Haber={$detalle->haber}");
        }
    }
}
