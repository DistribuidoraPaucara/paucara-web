<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CalcularPesosVentas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:calcular-pesos-ventas {--solo-vacios : Solo actualizar ventas sin peso estimado}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calcular peso estimado para todas las ventas basado en productos';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Iniciando cálculo de pesos para ventas...');

        // Obtener todas las ventas o solo las que tienen peso_estimado vacío
        $query = DB::table('ventas');

        if ($this->option('solo-vacios')) {
            $query->whereNull('peso_estimado')
                ->orWhere('peso_estimado', 0);
            $this->info('Calculando solo para ventas sin peso estimado...');
        }

        $ventas = $query->get(['id', 'numero']);
        $updated = 0;
        $failed = 0;

        foreach ($ventas as $venta) {
            try {
                // Calcular peso total de la venta
                $pesoTotal = DB::table('detalle_ventas')
                    ->join('productos', 'detalle_ventas.producto_id', '=', 'productos.id')
                    ->where('detalle_ventas.venta_id', $venta->id)
                    ->sum(DB::raw('detalle_ventas.cantidad * productos.peso'));

                // Actualizar venta
                DB::table('ventas')
                    ->where('id', $venta->id)
                    ->update(['peso_estimado' => $pesoTotal ?? 0]);

                $this->line("✓ {$venta->numero}: {$pesoTotal} kg");
                $updated++;
            } catch (\Exception $e) {
                $this->error("✗ {$venta->numero}: {$e->getMessage()}");
                $failed++;
            }
        }

        $this->info("\n" . str_repeat('─', 50));
        $this->info("Resumen: {$updated} actualizadas, {$failed} errores");
        $this->info(str_repeat('─', 50));

        return 0;
    }
}
