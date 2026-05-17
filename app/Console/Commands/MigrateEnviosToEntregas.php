<?php

namespace App\Console\Commands;

use App\Models\Empleado;
use App\Models\Entrega;
use App\Models\Envio;
use App\Models\UbicacionTracking;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MigrateEnviosToEntregas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'logistica:migrate-envios-to-entregas {--force : Execute migration without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migra datos históricos de Envios a Entregas (consolidación de sistema de logística)';

    /**
     * Statistics for the migration
     */
    private array $stats = [
        'total' => 0,
        'migrados' => 0,
        'errores' => 0,
        'sin_chofer' => 0,
        'chofer_no_encontrado' => 0,
    ];

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->newLine();
        $this->info('==============================================');
        $this->info('Migración: Envios → Entregas');
        $this->info('==============================================');

        // Verificar estado actual
        $totalEnvios = Envio::count();
        $totalEntregas = Entrega::count();

        $this->info("\nEstado actual:");
        $this->line("  Envios:   {$totalEnvios} registros");
        $this->line("  Entregas: {$totalEntregas} registros");

        // Si no hay Envios, nada que hacer
        if ($totalEnvios === 0) {
            $this->info("\n✓ La tabla Envios está VACÍA - No hay datos que migrar");
            $this->line("\nEsta migración está PREPARADA para usar cuando sea necesario.");
            $this->line("Para ejecutarla, espere a tener Envios en la tabla y ejecute:");
            $this->line("  php artisan logistica:migrate-envios-to-entregas --force");
            return Command::SUCCESS;
        }

        // Confirmación antes de proceder
        if (!$this->option('force')) {
            if (!$this->confirm("\n⚠️ ADVERTENCIA: Se migraráN {$totalEnvios} Envios a Entregas. ¿Continuar?")) {
                $this->warn('Migración cancelada.');
                return Command::FAILURE;
            }
        }

        DB::beginTransaction();
        try {
            $this->migrateEnvios();
            DB::commit();

            $this->printSummary();
            return Command::SUCCESS;

        } catch (\Exception $e) {
            DB::rollback();
            $this->error("\n✗ Error durante migración: {$e->getMessage()}");
            Log::error('EnviosToEntregas Migration Failed', [
                'error' => $e->getMessage(),
                'stats' => $this->stats,
            ]);
            return Command::FAILURE;
        }
    }

    /**
     * Migrar todos los Envios a Entregas
     */
    private function migrateEnvios(): void
    {
        $envios = Envio::all();
        $this->stats['total'] = $envios->count();

        $this->newLine();
        $this->info("Migrando {$this->stats['total']} Envios...");

        $bar = $this->output->createProgressBar($this->stats['total']);
        $bar->start();

        foreach ($envios as $envio) {
            try {
                $this->migrateEnvio($envio);
                $this->stats['migrados']++;
            } catch (\Exception $e) {
                $this->stats['errores']++;
                Log::error("Error migrando Envio {$envio->id}", [
                    'error' => $e->getMessage(),
                    'envio_id' => $envio->id,
                ]);
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
    }

    /**
     * Migrar un Envio individual a Entrega
     */
    private function migrateEnvio(Envio $envio): void
    {
        // Mapear chofer_id (User.id → Empleado.id)
        $empleadoId = null;
        if ($envio->chofer_id) {
            $user = User::find($envio->chofer_id);
            if ($user) {
                $empleado = Empleado::where('user_id', $user->id)->first();
                if ($empleado) {
                    $empleadoId = $empleado->id;
                } else {
                    $this->stats['chofer_no_encontrado']++;
                }
            }
        } else {
            $this->stats['sin_chofer']++;
        }

        // Mapear estados
        $estadoMap = [
            'PROGRAMADO' => 'PROGRAMADO',
            'EN_PREPARACION' => 'ASIGNADA',
            'EN_RUTA' => 'EN_CAMINO',
            'ENTREGADO' => 'ENTREGADO',
            'CANCELADO' => 'CANCELADA',
        ];
        $estadoNuevo = $estadoMap[$envio->estado] ?? 'PROGRAMADO';

        // Crear Entrega
        $entrega = Entrega::create([
            'venta_id' => $envio->venta_id,
            'vehiculo_id' => $envio->vehiculo_id,
            'chofer_id' => $empleadoId,
            'estado' => $estadoNuevo,
            'fecha_programada' => $envio->fecha_programada,
            'fecha_inicio' => $envio->fecha_salida,
            'fecha_entrega' => $envio->fecha_entrega,
            'direccion_entrega' => $envio->direccion_entrega,
            'observaciones' => $envio->observaciones,
            'motivo_novedad' => $envio->motivo_rechazo,
            'foto_entrega_url' => $envio->foto_entrega,
            'firma_digital_url' => $envio->firma_cliente,
            'fecha_asignacion' => $envio->created_at,
            'created_at' => $envio->created_at,
            'updated_at' => $envio->updated_at,
        ]);

        // Migrar datos de GPS si existen
        if ($envio->coordenadas_lat && $envio->coordenadas_lng) {
            UbicacionTracking::create([
                'entrega_id' => $entrega->id,
                'latitud' => $envio->coordenadas_lat,
                'longitud' => $envio->coordenadas_lng,
                'timestamp' => $envio->updated_at,
            ]);
        }

        // Registrar en historial de auditoría
        $this->logMigration($envio, $entrega, $empleadoId);
    }

    /**
     * Registrar la migración en logs
     */
    private function logMigration(Envio $envio, Entrega $entrega, ?int $empleadoId): void
    {
        Log::info('Envio migrado a Entrega', [
            'envio_id' => $envio->id,
            'entrega_id' => $entrega->id,
            'venta_id' => $envio->venta_id,
            'chofer_original' => $envio->chofer_id,
            'chofer_nuevo' => $empleadoId,
            'estado_original' => $envio->estado,
            'estado_nuevo' => $entrega->estado,
            'timestamp' => now(),
        ]);
    }

    /**
     * Imprimir resumen de la migración
     */
    private function printSummary(): void
    {
        $this->newLine();
        $this->info('==============================================');
        $this->info('Resumen de Migración');
        $this->info('==============================================');

        $this->line("Total procesados:      {$this->stats['total']}");
        $this->line("Migrados exitosamente: {$this->stats['migrados']}");
        $this->line("Errores:               {$this->stats['errores']}");
        $this->line("Sin chofer asignado:   {$this->stats['sin_chofer']}");
        $this->line("Chofer no encontrado:  {$this->stats['chofer_no_encontrado']}");

        if ($this->stats['errores'] === 0) {
            $this->info("\n✓ Migración completada exitosamente");
        } else {
            $this->warn("\n⚠️ Migración completada con {$this->stats['errores']} errores");
        }

        $this->newLine();
    }
}
