<?php

namespace App\Console\Commands;

use App\Services\Logistica\RutaService;
use Illuminate\Console\Command;
use Carbon\Carbon;

/**
 * Comando para planificar rutas diarias
 * Usa Logistica\RutaService como única fuente de verdad (Fase 1 Refactoring)
 *
 * Ejecutar manualmente:
 *   php artisan rutas:planificar-diaria
 *   php artisan rutas:planificar-diaria --fecha=2025-12-07
 *
 * Ejecutar automáticamente (nightly job):
 *   Scheduler: app/Console/Kernel.php
 *   $schedule->command('rutas:planificar-diaria --fecha=mañana')->daily At('20:00');
 */
class PlanificarRutasDiarias extends Command
{
    protected $signature = 'rutas:planificar-diaria {--fecha= : Fecha a planificar (ej: 2025-12-07, "mañana", "hoy")}';

    protected $description = 'Planificar rutas de entrega para un día específico usando algoritmo Nearest Neighbor';

    protected RutaService $rutaService;

    public function __construct(RutaService $rutaService)
    {
        parent::__construct();
        $this->rutaService = $rutaService;
    }

    /**
     * Ejecutar el comando
     */
    public function handle(): int
    {
        // Determinar fecha
        $fecha_param = $this->option('fecha');

        if (!$fecha_param) {
            $fecha = Carbon::tomorrow();
            $this->info("Planificando para: " . $fecha->format('Y-m-d'));
        } else {
            try {
                if ($fecha_param === 'mañana') {
                    $fecha = Carbon::tomorrow();
                } elseif ($fecha_param === 'hoy') {
                    $fecha = Carbon::today();
                } else {
                    $fecha = Carbon::createFromFormat('Y-m-d', $fecha_param);
                }
            } catch (\Exception $e) {
                $this->error("Formato de fecha inválido. Usa: YYYY-MM-DD");
                return Command::FAILURE;
            }
        }

        $this->info("================================");
        $this->info("  PLANIFICACIÓN DE RUTAS DIARIAS");
        $this->info("================================");
        $this->info("Fecha: " . $fecha->format('Y-m-d (l)'));
        $this->newLine();

        try {
            // Ejecutar planificación
            $this->info("⏳ Analizando entregas pendientes...");
            $resultado = $this->rutaService->planificarRutasDiarias($fecha);

            if (!$resultado['exitoso']) {
                $this->error("❌ Error: " . $resultado['error']);
                return Command::FAILURE;
            }

            // Mostrar resultados
            $this->info("✅ Planificación completada exitosamente");
            $this->newLine();

            $this->info("📊 RESUMEN:");
            $this->line("  • Rutas creadas: <info>" . $resultado['rutas_creadas'] . "</info>");

            if ($resultado['rutas_creadas'] > 0) {
                $this->newLine();
                $this->table(
                    ['Código', 'Localidad', 'Paradas', 'Distancia (km)', 'Chofer', 'Vehículo'],
                    array_map(function($ruta) {
                        return [
                            $ruta['codigo'],
                            $ruta['localidad'],
                            $ruta['paradas'],
                            number_format($ruta['distancia_km'], 2),
                            $ruta['chofer'],
                            $ruta['vehiculo']
                        ];
                    }, $resultado['rutas'])
                );
            } else {
                $this->line("\n  ℹ️  Mensaje: " . ($resultado['mensaje'] ?? 'Sin entregas para planificar'));
            }

            $this->newLine();
            $this->line("📅 Próxima ejecución: " . Carbon::tomorrow()->format('Y-m-d a las 20:00 (hora UTC)'));
            $this->line("💡 Nota: Los choferes recibirán notificación en la app sobre sus rutas asignadas");

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error("❌ Excepción: " . $e->getMessage());
            logger()->error("Error en PlanificarRutasDiarias: " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
