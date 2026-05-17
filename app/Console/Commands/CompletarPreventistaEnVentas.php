<?php

namespace App\Console\Commands;

use App\Models\Venta;
use Illuminate\Console\Command;

class CompletarPreventistaEnVentas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ventas:completar-preventista {--solo-nulos : Solo completar ventas sin preventista_id} {--fuerza : Sobrescribir preventista_id existentes}';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Completa el campo preventista_id en ventas basado en el usuario creador de la proforma';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Iniciando completado de preventista_id en ventas...');

        // Construir query
        $query = Venta::whereNotNull('proforma_id');

        // Si solo-nulos, filtrar por preventista_id NULL
        if ($this->option('solo-nulos')) {
            $query->whereNull('preventista_id');
            $this->info('📌 Filtrando: Solo ventas SIN preventista_id');
        } else {
            $this->info('📌 Procesando: Todas las ventas con proforma_id');
        }

        $ventas = $query->with('proforma.usuarioCreador')->get();

        if ($ventas->isEmpty()) {
            $this->warn('⚠️ No hay ventas que procesar');
            return;
        }

        $this->info("📊 Total de ventas a procesar: {$ventas->count()}");

        $actualizado = 0;
        $saltado = 0;
        $noTienePreventistaRol = 0;
        $errores = [];

        $bar = $this->output->createProgressBar($ventas->count());
        $bar->start();

        foreach ($ventas as $venta) {
            try {
                $bar->advance();

                // Verificar si la venta ya tiene preventista asignado
                if (!$this->option('fuerza') && $venta->preventista_id) {
                    $saltado++;
                    continue;
                }

                // Obtener la proforma
                if (!$venta->proforma) {
                    $errores[] = "Venta #{$venta->id}: Proforma no encontrada";
                    continue;
                }

                // Obtener el usuario creador
                $usuarioCreador = $venta->proforma->usuarioCreador;
                if (!$usuarioCreador) {
                    $errores[] = "Venta #{$venta->id}: Usuario creador de proforma no encontrado";
                    continue;
                }

                // Verificar si es preventista
                if (!$usuarioCreador->hasRole('preventista')) {
                    $noTienePreventistaRol++;
                    continue;
                }

                // Actualizar la venta
                $venta->update(['preventista_id' => $usuarioCreador->id]);
                $actualizado++;

            } catch (\Exception $e) {
                $errores[] = "Venta #{$venta->id}: {$e->getMessage()}";
            }
        }

        $bar->finish();
        $this->newLine(2);

        // Resultados
        $this->info('✅ RESULTADOS:');
        $this->line("   Actualizadas: <fg=green>{$actualizado}</>");
        $this->line("   Saltadas (ya tienen preventista): <fg=yellow>{$saltado}</>");
        $this->line("   No tienen rol preventista: <fg=cyan>{$noTienePreventistaRol}</>");

        if (!empty($errores)) {
            $this->warn("\n⚠️ ERRORES ({count($errores)}):");
            foreach ($errores as $error) {
                $this->line("   - {$error}");
            }
        }

        $this->info("\n✨ Completado");
    }
}
