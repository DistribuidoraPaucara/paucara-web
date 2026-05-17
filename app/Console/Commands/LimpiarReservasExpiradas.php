<?php

namespace App\Console\Commands;

use App\Models\ReservaProforma;
use App\Models\Proforma;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LimpiarReservasExpiradas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'proforma:limpiar-reservas-expiradas
                            {--dry-run : Ejecutar en modo simulación sin hacer cambios}
                            {--force : Forzar limpieza sin confirmación}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Libera automáticamente las reservas de stock expiradas y actualiza el estado de las proformas';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $isDryRun = $this->option('dry-run');
        $isForce = $this->option('force');

        $this->info('🔍 Buscando reservas expiradas...');

        // Buscar reservas expiradas que aún están activas
        $reservasExpiradas = ReservaProforma::where('estado', ReservaProforma::ACTIVA)
            ->where('fecha_expiracion', '<', now())
            ->with(['proforma', 'stockProducto.producto'])
            ->get();

        if ($reservasExpiradas->isEmpty()) {
            $this->info('✅ No hay reservas expiradas. Sistema limpio.');
            return Command::SUCCESS;
        }

        $this->warn("⚠️  Encontradas {$reservasExpiradas->count()} reservas expiradas");

        // Mostrar tabla de reservas expiradas
        $this->table(
            ['ID', 'Proforma', 'Producto', 'Cantidad', 'Expiró hace', 'Estado Proforma'],
            $reservasExpiradas->map(function ($reserva) {
                return [
                    $reserva->id,
                    $reserva->proforma->numero,
                    $reserva->stockProducto->producto->nombre,
                    $reserva->cantidad_reservada,
                    $reserva->fecha_expiracion->diffForHumans(),
                    $reserva->proforma->estado,
                ];
            })->toArray()
        );

        // Confirmación si no es modo force
        if (!$isForce && !$isDryRun) {
            if (!$this->confirm('¿Desea liberar estas reservas?', true)) {
                $this->info('❌ Operación cancelada');
                return Command::FAILURE;
            }
        }

        if ($isDryRun) {
            $this->warn('🧪 MODO DRY-RUN: No se realizarán cambios reales');
        }

        // Agrupar por proforma para procesamiento eficiente
        $reservasPorProforma = $reservasExpiradas->groupBy('proforma_id');

        $reservasLiberadas = 0;
        $proformasActualizadas = 0;
        $errores = 0;

        $progressBar = $this->output->createProgressBar($reservasPorProforma->count());
        $progressBar->start();

        foreach ($reservasPorProforma as $proformaId => $reservas) {
            try {
                if (!$isDryRun) {
                    DB::transaction(function () use ($proformaId, $reservas, &$reservasLiberadas, &$proformasActualizadas) {
                        $proforma = Proforma::find($proformaId);

                        if (!$proforma) {
                            Log::warning("Proforma ID {$proformaId} no encontrada durante limpieza");
                            return;
                        }

                        // Liberar reservas
                        foreach ($reservas as $reserva) {
                            if ($reserva->liberar()) {
                                $reservasLiberadas++;
                            }
                        }

                        // Actualizar estado de proforma si está en PENDIENTE o APROBADA
                        if (in_array($proforma->estado, [Proforma::PENDIENTE, Proforma::APROBADA])) {
                            $proforma->update([
                                'estado' => Proforma::VENCIDA,
                                'observaciones_rechazo' => 'Reservas expiradas automáticamente por el sistema',
                            ]);
                            $proformasActualizadas++;

                            Log::info('Proforma marcada como VENCIDA por reservas expiradas', [
                                'proforma_id' => $proforma->id,
                                'numero' => $proforma->numero,
                                'reservas_liberadas' => $reservas->count(),
                            ]);
                        }
                    });
                } else {
                    // En dry-run, solo contar
                    $reservasLiberadas += $reservas->count();

                    $proforma = Proforma::find($proformaId);
                    if ($proforma && in_array($proforma->estado, [Proforma::PENDIENTE, Proforma::APROBADA])) {
                        $proformasActualizadas++;
                    }
                }

                $progressBar->advance();
            } catch (\Exception $e) {
                $errores++;

                Log::error('Error al limpiar reservas expiradas', [
                    'proforma_id' => $proformaId,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);

                if (!$isDryRun) {
                    $this->error("\n❌ Error procesando proforma ID {$proformaId}: {$e->getMessage()}");
                }
            }
        }

        $progressBar->finish();
        $this->newLine(2);

        // Resumen
        $this->info('📊 RESUMEN DE LIMPIEZA:');
        $this->line("  • Reservas liberadas: {$reservasLiberadas}");
        $this->line("  • proformas marcadas como VENCIDA: {$proformasActualizadas}");

        if ($errores > 0) {
            $this->error("  • Errores encontrados: {$errores}");
        }

        if ($isDryRun) {
            $this->warn("\n🧪 Esto fue una simulación. Use sin --dry-run para aplicar los cambios.");
        } else {
            $this->info("\n✅ Limpieza completada exitosamente");

            Log::info('Limpieza de reservas expiradas completada', [
                'reservas_liberadas' => $reservasLiberadas,
                'proformas_actualizadas' => $proformasActualizadas,
                'errores' => $errores,
            ]);
        }

        return Command::SUCCESS;
    }
}
