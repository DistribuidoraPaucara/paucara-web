<?php

namespace App\Console\Commands;

use App\Models\ReservaProforma;
use Illuminate\Console\Command;

class LiberarReservasExpiradas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reservas:liberar-expiradas';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Liberar reservas de stock que han expirado';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Iniciando liberación de reservas expiradas...');

        $reservasExpiradas = ReservaProforma::expiradas()->get();

        if ($reservasExpiradas->isEmpty()) {
            $this->info('No se encontraron reservas expiradas.');

            return Command::SUCCESS;
        }

        $liberadas = 0;
        $errores = 0;

        foreach ($reservasExpiradas as $reserva) {
            try {
                if ($reserva->liberar()) {
                    $liberadas++;
                    $this->line("✓ Liberada reserva ID {$reserva->id} - Proforma #{$reserva->proforma->numero}");
                } else {
                    $errores++;
                    $this->error("✗ Error al liberar reserva ID {$reserva->id}");
                }
            } catch (\Exception $e) {
                $errores++;
                $this->error("✗ Excepción al liberar reserva ID {$reserva->id}: {$e->getMessage()}");
            }
        }

        $this->info('Proceso completado:');
        $this->line("  • Reservas liberadas: {$liberadas}");

        if ($errores > 0) {
            $this->warn("  • Errores encontrados: {$errores}");
        }

        return Command::SUCCESS;
    }
}
