<?php

namespace App\Console\Commands;

use App\Models\Envio;
use App\Models\SeguimientoEnvio;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class LimpiarEnviosAntiguos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'envios:limpiar-antiguos
                            {--days=90 : Días de antigüedad para considerar un envío como antiguo}
                            {--estado=ENTREGADO,CANCELADO : Estados de envíos a limpiar}
                            {--force : Forzar la limpieza sin confirmación}
                            {--dry-run : Mostrar lo que se eliminaría sin eliminarlo realmente}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Limpia envíos antiguos entregados o cancelados y sus seguimientos';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $dias = $this->option('days');
        $estados = explode(',', $this->option('estado'));
        $dryRun = $this->option('dry-run');
        $force = $this->option('force');

        $this->info("🚚 Limpieza de Envíos Antiguos");
        $this->info("════════════════════════════════════");
        $this->line("Criterios de limpieza:");
        $this->line("  • Antigüedad: Más de {$dias} días");
        $this->line("  • Estados: " . implode(', ', $estados));
        $this->line("");

        // Validar estados
        $estadosValidos = [Envio::PROGRAMADO, Envio::EN_PREPARACION, Envio::EN_RUTA, Envio::ENTREGADO, Envio::CANCELADO];
        foreach ($estados as $estado) {
            if (!in_array(trim($estado), $estadosValidos)) {
                $this->error("Estado inválido: {$estado}");
                $this->line("Estados válidos: " . implode(', ', $estadosValidos));
                return 1;
            }
        }

        // Obtener envíos a limpiar
        $fechaLimite = now()->subDays($dias);

        $enviosQuery = Envio::whereIn('estado', array_map('trim', $estados))
            ->where('updated_at', '<', $fechaLimite);

        $totalEnvios = $enviosQuery->count();

        if ($totalEnvios === 0) {
            $this->info("✅ No se encontraron envíos para limpiar.");
            return 0;
        }

        // Mostrar resumen
        $this->table(
            ['Estado', 'Cantidad', 'Fecha límite'],
            [
                ['Envíos a eliminar', $totalEnvios, $fechaLimite->format('Y-m-d H:i:s')],
            ]
        );

        // Obtener detalles por estado
        $detallesPorEstado = DB::table('envios')
            ->select('estado', DB::raw('COUNT(*) as total'))
            ->whereIn('estado', array_map('trim', $estados))
            ->where('updated_at', '<', $fechaLimite)
            ->groupBy('estado')
            ->get();

        $this->line("\nDesglose por estado:");
        foreach ($detallesPorEstado as $detalle) {
            $this->line("  • {$detalle->estado}: {$detalle->total} envíos");
        }

        // Contar seguimientos
        $totalSeguimientos = SeguimientoEnvio::whereIn('envio_id',
            $enviosQuery->pluck('id')
        )->count();

        $this->line("  • Seguimientos asociados: {$totalSeguimientos}");
        $this->line("");

        // Modo dry-run
        if ($dryRun) {
            $this->warn("🔍 MODO DRY-RUN: No se eliminará nada");
            $this->line("\nSe eliminarían:");
            $this->line("  • {$totalEnvios} envíos");
            $this->line("  • {$totalSeguimientos} seguimientos");
            return 0;
        }

        // Confirmación
        if (!$force) {
            if (!$this->confirm("¿Desea continuar con la eliminación?")) {
                $this->info("Operación cancelada.");
                return 0;
            }
        }

        // Procesar eliminación
        $this->info("\n🗑️  Eliminando registros...");

        DB::beginTransaction();
        try {
            $bar = $this->output->createProgressBar(2);
            $bar->start();

            // 1. Eliminar seguimientos primero (relación foránea)
            $seguimientosEliminados = SeguimientoEnvio::whereIn('envio_id',
                $enviosQuery->pluck('id')
            )->delete();
            $bar->advance();

            // 2. Eliminar envíos
            $enviosEliminados = $enviosQuery->delete();
            $bar->advance();

            $bar->finish();
            $this->line("");

            DB::commit();

            // Resumen final
            $this->info("\n✅ Limpieza completada exitosamente");
            $this->table(
                ['Tipo', 'Eliminados'],
                [
                    ['Envíos', $enviosEliminados],
                    ['Seguimientos', $seguimientosEliminados],
                ]
            );

            // Log de auditoría
            \Log::info('Limpieza de envíos antiguos ejecutada', [
                'envios_eliminados' => $enviosEliminados,
                'seguimientos_eliminados' => $seguimientosEliminados,
                'dias_antigüedad' => $dias,
                'estados' => $estados,
                'ejecutado_por' => 'sistema',
            ]);

            return 0;

        } catch (\Exception $e) {
            DB::rollBack();

            $this->error("\n❌ Error al limpiar envíos:");
            $this->error($e->getMessage());

            \Log::error('Error en limpieza de envíos antiguos', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return 1;
        }
    }
}
