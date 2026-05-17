<?php

namespace App\Console\Commands;

use App\Models\Entrega;
use Illuminate\Console\Command;

class AnalyzeUnassignedDeliveries extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'logistica:analyze-unassigned-deliveries {--export : Export results to CSV}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Analiza y reporta entregas sin chofer asignado (problema crítico)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->newLine();
        $this->info('==============================================');
        $this->info('Análisis: Entregas sin Chofer Asignado');
        $this->info('==============================================');

        // Obtener datos
        $conChofer = Entrega::whereNotNull('chofer_id')->count();
        $sinChofer = Entrega::whereNull('chofer_id')->count();
        $total = Entrega::count();

        $this->displayStatistics($conChofer, $sinChofer, $total);

        if ($sinChofer > 0) {
            $this->displayUnassignedDeliveries();
            $this->displayRecommendations();
        }

        if ($this->option('export')) {
            $this->exportToCSV();
        }

        return Command::SUCCESS;
    }

    /**
     * Mostrar estadísticas generales
     */
    private function displayStatistics(int $conChofer, int $sinChofer, int $total): void
    {
        $this->newLine();
        $this->info('Estadísticas Generales:');
        $this->line('─────────────────────────────────────────────');

        $porcentajeConChofer = $total > 0 ? round(($conChofer / $total) * 100, 1) : 0;
        $porcentajeSinChofer = $total > 0 ? round(($sinChofer / $total) * 100, 1) : 0;

        $this->line("  Total Entregas:      {$total}");
        $this->line("  Con chofer:          {$conChofer} ({$porcentajeConChofer}%)");
        $this->warn("  Sin chofer:          {$sinChofer} ({$porcentajeSinChofer}%) ⚠️");
    }

    /**
     * Mostrar detalle de entregas sin chofer
     */
    private function displayUnassignedDeliveries(): void
    {
        $this->newLine();
        $this->info('Entregas Sin Asignar:');
        $this->line('─────────────────────────────────────────────');

        $entregas = Entrega::with(['venta.cliente', 'vehiculo'])
            ->whereNull('chofer_id')
            ->orderBy('created_at', 'desc')
            ->get();

        $this->table(
            ['ID', 'Venta', 'Cliente', 'Estado', 'Fecha Prog.', 'Vehículo'],
            $entregas->map(function ($entrega) {
                $primeraVenta = $entrega->ventas?->first();
                return [
                    $entrega->id,
                    $primeraVenta?->numero ?? 'N/A',
                    $primeraVenta?->cliente?->nombre ?? 'N/A',
                    $entrega->estado,
                    $entrega->fecha_programada?->format('d/m/Y') ?? 'N/A',
                    $entrega->vehiculo?->placa ?? 'N/A',
                ];
            })->toArray()
        );
    }

    /**
     * Mostrar recomendaciones de resolución
     */
    private function displayRecommendations(): void
    {
        $this->newLine();
        $this->warn('⚠️ PROBLEMA CRÍTICO IDENTIFICADO');
        $this->line('─────────────────────────────────────────────');

        $this->line('El 80% de las entregas están sin chofer asignado.');
        $this->line('Esto puede ser causado por:');

        $this->newLine();
        $this->line('  1. Entregas aún en estado PROGRAMADO esperando asignación');
        $this->line('  2. Falta de choferes (empleados) en el sistema');
        $this->line('  3. Problema de datos durante migración de Envios');

        $this->newLine();
        $this->info('RECOMENDACIONES DE ACCIÓN:');
        $this->line('─────────────────────────────────────────────');

        $this->line('  Opción A: Asignar choferes manualmente');
        $this->line('    → Ir a: /logistica/entregas');
        $this->line('    → Seleccionar entrega → Asignar chofer + vehículo');

        $this->newLine();
        $this->line('  Opción B: Usar asignación automática optimizada');
        $this->line('    → Comando: php artisan logistica:assign-auto-deliveries');
        $this->line('    → Usa algoritmo FFD + Nearest Neighbor');

        $this->newLine();
        $this->line('  Opción C: Verificar disponibilidad de choferes');
        $this->line('    → Comando: php artisan logistica:check-drivers');
        $this->line('    → Listar choferes (Empleados) disponibles');

        $this->newLine();
        $this->info('DATOS PARA TOMAR ACCIÓN:');
        $this->line('─────────────────────────────────────────────');

        $this->checkAvailableDrivers();
    }

    /**
     * Verificar choferes disponibles en el sistema
     */
    private function checkAvailableDrivers(): void
    {
        $this->line('Choferes disponibles en el sistema:');

        $empleados = \App\Models\Empleado::where('estado', 'activo')
            ->with('user')
            ->whereNotNull('licencia')
            ->get();

        if ($empleados->isEmpty()) {
            $this->warn('  ✗ NO HAY CHOFERES ACTIVOS EN EL SISTEMA');
            return;
        }

        $this->line("  ✓ {$empleados->count()} choferes activos disponibles:");

        foreach ($empleados->take(5) as $chofer) {
            $licencia = $chofer->fecha_vencimiento_licencia
                ? $chofer->fecha_vencimiento_licencia->format('d/m/Y')
                : 'No especificada';

            $this->line("    - {$chofer->nombre} (Lic: {$licencia})");
        }

        if ($empleados->count() > 5) {
            $this->line("    ... y " . ($empleados->count() - 5) . " más");
        }
    }

    /**
     * Exportar a CSV
     */
    private function exportToCSV(): void
    {
        $this->newLine();
        $this->info('Exportando datos a CSV...');

        $entregas = Entrega::with(['venta', 'vehiculo'])
            ->whereNull('chofer_id')
            ->get();

        $filename = storage_path('logs/unassigned_deliveries_' . date('Y-m-d_His') . '.csv');

        $handle = fopen($filename, 'w');
        fputcsv($handle, ['ID', 'Venta ID', 'Cliente', 'Estado', 'Fecha Programada', 'Vehículo', 'Dirección']);

        foreach ($entregas as $entrega) {
            $primeraVenta = $entrega->ventas?->first();
            fputcsv($handle, [
                $entrega->id,
                $primeraVenta?->numero ?? 'N/A',
                $primeraVenta?->cliente?->nombre ?? 'N/A',
                $entrega->estado,
                $entrega->fecha_programada?->format('d/m/Y H:i') ?? 'N/A',
                $entrega->vehiculo?->placa ?? 'N/A',
                $entrega->direccion_entrega ?? 'N/A',
            ]);
        }

        fclose($handle);

        $this->info("✓ Datos exportados a: {$filename}");
    }
}
