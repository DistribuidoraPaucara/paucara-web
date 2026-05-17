<?php

namespace App\Console\Commands;

use App\Models\ReservaProforma;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LiberarReservasInconsistentes extends Command
{
    protected $signature = 'reservas:liberar-inconsistentes {--dry-run : Preview changes without committing}';

    protected $description = 'Liberar reservas inconsistentes (activas con proformas convertidas/rechazadas/vencidas)';

    public function handle()
    {
        $dryRun = $this->option('dry-run');

        $this->info('Buscando reservas inconsistentes...');

        // Buscar reservas activas con proformas en estado inconsistente
        $reservas = ReservaProforma::where('estado', 'ACTIVA')
            ->whereHas('proforma.estadoLogistica', function ($q) {
                $q->whereIn('nombre', ['CONVERTIDA', 'RECHAZADA', 'VENCIDA']);
            })
            ->with(['proforma.estadoLogistica', 'stockProducto.producto'])
            ->get();

        if ($reservas->isEmpty()) {
            $this->info('✓ No se encontraron reservas inconsistentes');
            return self::SUCCESS;
        }

        $this->warn("Se encontraron {$reservas->count()} reservas inconsistentes");
        $this->newLine();

        // Mostrar tabla con reservas a liberar
        $tableData = $reservas->map(function ($reserva) {
            return [
                $reserva->id,
                $reserva->proforma->numero,
                $reserva->proforma->estado_proforma->nombre,
                $reserva->stockProducto->producto->sku,
                $reserva->cantidad_reservada,
                $reserva->fecha_expiracion->format('Y-m-d H:i'),
            ];
        })->toArray();

        $this->table(
            ['ID', 'Proforma', 'Estado', 'SKU', 'Cantidad', 'Expiración'],
            $tableData
        );

        $totalCantidad = $reservas->sum('cantidad_reservada');
        $this->newLine();
        $this->info("Stock total a liberar: {$totalCantidad} unidades");
        $this->newLine();

        if ($dryRun) {
            $this->warn('⚠ DRY RUN: No se realizarán cambios');
            return self::SUCCESS;
        }

        // Solicitar confirmación
        if (!$this->confirm('¿Deseas liberar estas reservas?')) {
            $this->info('Operación cancelada');
            return self::SUCCESS;
        }

        try {
            $liberadas = 0;

            DB::transaction(function () use ($reservas, &$liberadas) {
                foreach ($reservas as $reserva) {
                    $reserva->liberar();
                    $liberadas++;
                }
            });

            Log::info('Liberación automática de reservas inconsistentes completada', [
                'cantidad_liberadas' => $liberadas,
                'stock_total' => $totalCantidad,
                'comando' => 'reservas:liberar-inconsistentes',
                'timestamp' => now(),
            ]);

            $this->newLine();
            $this->info("✓ Se liberaron {$liberadas} reservas correctamente");
            $this->info("✓ Stock liberado: {$totalCantidad} unidades");

            return self::SUCCESS;
        } catch (\Exception $e) {
            Log::error('Error en liberación automática de reservas', [
                'error' => $e->getMessage(),
                'cantidad_intentadas' => $reservas->count(),
            ]);

            $this->error("✗ Error durante la liberación: {$e->getMessage()}");
            return self::FAILURE;
        }
    }
}
