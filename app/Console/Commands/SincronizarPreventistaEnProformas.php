<?php

namespace App\Console\Commands;

use App\Models\Proforma;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SincronizarPreventistaEnProformas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sincronizar-preventista-en-proformas {--dry-run : Mostrar cambios sin aplicarlos}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sincroniza preventista_id en proformas: si usuario creador tiene rol preventista, asigna su user_id';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Iniciando sincronización de preventista en proformas...');

        $dryRun = $this->option('dry-run');
        $totalProformas = 0;
        $proformasActualizadas = 0;
        $errorCount = 0;

        try {
            // Obtener todas las proformas con su usuario creador
            $proformas = Proforma::with('usuarioCreador')->get();
            $totalProformas = $proformas->count();

            $this->info("📋 Total de proformas a procesar: {$totalProformas}");
            $this->newLine();

            // Crear progress bar
            $bar = $this->output->createProgressBar($totalProformas);
            $bar->start();

            foreach ($proformas as $proforma) {
                try {
                    $usuarioCreador = $proforma->usuarioCreador;

                    // Validar que existe el usuario creador
                    if (!$usuarioCreador) {
                        $bar->advance();
                        continue;
                    }

                    // Verificar si el usuario creador tiene rol "preventista"
                    if ($usuarioCreador->hasRole('preventista')) {
                        // Si preventista_id es diferente del user_id del usuario creador, actualizar
                        if ($proforma->preventista_id !== $usuarioCreador->id) {
                            if (!$dryRun) {
                                $proforma->update([
                                    'preventista_id' => $usuarioCreador->id,
                                ]);

                                Log::info('✅ [SincronizarPreventistaEnProformas] Proforma sincronizada', [
                                    'proforma_id' => $proforma->id,
                                    'usuario_creador_id' => $usuarioCreador->id,
                                    'preventista_id_anterior' => $proforma->preventista_id,
                                    'preventista_id_nuevo' => $usuarioCreador->id,
                                ]);
                            }

                            $proformasActualizadas++;
                        }
                    }

                    $bar->advance();
                } catch (\Exception $e) {
                    $errorCount++;
                    Log::error('❌ [SincronizarPreventistaEnProformas] Error procesando proforma', [
                        'proforma_id' => $proforma->id,
                        'error' => $e->getMessage(),
                    ]);
                    $bar->advance();
                }
            }

            $bar->finish();
            $this->newLine(2);

            // Resumen final
            $this->info('═══════════════════════════════════════════════════════');
            $this->info('✅ RESUMEN DE SINCRONIZACIÓN');
            $this->info('═══════════════════════════════════════════════════════');
            $this->line("📋 Total de proformas: <fg=blue>{$totalProformas}</>");
            $this->line("✅ Proformas actualizadas: <fg=green>{$proformasActualizadas}</>");
            $this->line("❌ Errores encontrados: <fg=red>{$errorCount}</>");

            if ($dryRun) {
                $this->line("<fg=yellow>ℹ️  Modo DRY-RUN: Los cambios NO fueron aplicados</>");
                $this->line("<fg=yellow>Para aplicar los cambios, ejecuta sin la bandera --dry-run</>");
            } else {
                $this->line("<fg=green>✓ Cambios aplicados correctamente</>");
            }

            $this->info('═══════════════════════════════════════════════════════');

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('❌ Error general en sincronización: ' . $e->getMessage());
            Log::error('❌ [SincronizarPreventistaEnProformas] Error general', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return Command::FAILURE;
        }
    }
}
