<?php

namespace App\Console\Commands;

use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LimpiarMovimientosCajaDuplicadosStrict extends Command
{
    protected $signature = 'movimientos:limpiar-duplicados-strict {--dry-run} {--detailed} {--fecha-desde=2026-07-20}';
    protected $description = 'Elimina duplicados detectando movimientos IDÉNTICOS (mismo venta_id, tipo_pago, monto, hora)';

    public function handle()
    {
        $dryRun = $this->option('dry-run');
        $detailed = $this->option('detailed');
        $fechaDesde = $this->option('fecha-desde');

        $this->info("🔍 Buscando movimientos IDÉNTICOS creados desde {$fechaDesde}...");
        $this->newLine();

        // Obtener tipo de operación VENTA
        $tipoVenta = TipoOperacionCaja::where('codigo', 'VENTA')->first();
        if (!$tipoVenta) {
            $this->error('❌ No se encontró tipo de operación VENTA');
            return 1;
        }

        // Buscar movimientos que sean EXACTAMENTE IDÉNTICOS
        // (mismo venta_id, tipo_pago_id, monto, en la misma hora)
        // Compatible con PostgreSQL y MySQL
        $dbDriver = DB::getDriverName();

        if ($dbDriver === 'pgsql') {
            // PostgreSQL
            $duplicados = DB::table('movimientos_caja')
                ->select(
                    'venta_id',
                    'tipo_pago_id',
                    'monto',
                    DB::raw('TO_CHAR(fecha, \'YYYY-MM-DD HH:00:00\') as fecha_hora'),
                    DB::raw('COUNT(*) as cantidad'),
                    DB::raw('STRING_AGG(CAST(id as text), \',\' ORDER BY id) as ids')
                )
                ->where('tipo_operacion_id', $tipoVenta->id)
                ->whereNotNull('venta_id')
                ->where('fecha', '>=', "{$fechaDesde} 00:00:00")
                ->groupBy('venta_id', 'tipo_pago_id', 'monto', DB::raw('TO_CHAR(fecha, \'YYYY-MM-DD HH:00:00\')'))
                ->havingRaw('COUNT(*) > 1')
                ->get();
        } else {
            // MySQL
            $duplicados = DB::table('movimientos_caja')
                ->select(
                    'venta_id',
                    'tipo_pago_id',
                    'monto',
                    DB::raw('DATE_FORMAT(fecha, "%Y-%m-%d %H:00:00") as fecha_hora'),
                    DB::raw('COUNT(*) as cantidad'),
                    DB::raw('GROUP_CONCAT(id ORDER BY id) as ids')
                )
                ->where('tipo_operacion_id', $tipoVenta->id)
                ->whereNotNull('venta_id')
                ->where('fecha', '>=', "{$fechaDesde} 00:00:00")
                ->groupBy('venta_id', 'tipo_pago_id', 'monto', DB::raw('DATE_FORMAT(fecha, "%Y-%m-%d %H:00:00")'))
                ->havingRaw('COUNT(*) > 1')
                ->get();
        }

        if ($duplicados->isEmpty()) {
            $this->info('✅ No se encontraron movimientos idénticos');
            return 0;
        }

        $this->warn("⚠️ Se encontraron {$duplicados->count()} grupos de movimientos idénticos");
        $this->newLine();

        $totalMovimientosAEliminar = 0;
        $totalMontoEliminado = 0;
        $registrosEliminados = [];
        $detallesPorVenta = [];

        foreach ($duplicados as $grupo) {
            $ids = array_map('intval', explode(',', $grupo->ids));
            $idsMantener = [reset($ids)];
            $idsEliminar = array_slice($ids, 1);

            $cantidad = $grupo->cantidad;
            $monto = $grupo->monto;
            $montoTotal = $monto * ($cantidad - 1); // Lo que se eliminará

            // Agrupar por venta para reporte
            if (!isset($detallesPorVenta[$grupo->venta_id])) {
                $detallesPorVenta[$grupo->venta_id] = [
                    'cantidad_duplicados' => 0,
                    'monto_total_duplicado' => 0,
                    'detalles' => []
                ];
            }
            $detallesPorVenta[$grupo->venta_id]['cantidad_duplicados'] += count($idsEliminar);
            $detallesPorVenta[$grupo->venta_id]['monto_total_duplicado'] += $montoTotal;

            $this->line("📌 Venta #{$grupo->venta_id} | Tipo Pago: {$grupo->tipo_pago_id} | Monto: {$grupo->monto}");
            $this->line("   Duplicados encontrados: {$cantidad} | Hora: {$grupo->fecha_hora}");

            // Obtener detalles de los movimientos a eliminar
            $movimientosAEliminar = MovimientoCaja::whereIn('id', $idsEliminar)->get();

            foreach ($movimientosAEliminar as $mov) {
                $totalMontoEliminado += $mov->monto;
                $totalMovimientosAEliminar++;

                $registro = [
                    'id' => $mov->id,
                    'venta_id' => $mov->venta_id,
                    'tipo_pago_id' => $mov->tipo_pago_id,
                    'monto' => $mov->monto,
                    'fecha' => $mov->fecha,
                    'numero_documento' => $mov->numero_documento,
                    'observaciones' => substr($mov->observaciones ?? '', 0, 100),
                ];

                $registrosEliminados[] = $registro;
                $detallesPorVenta[$grupo->venta_id]['detalles'][] = $registro;

                if ($detailed) {
                    $this->line("     ❌ ID: {$mov->id} | {$mov->fecha}");
                }
            }

            $this->line("     ✓ Mantener ID: " . reset($idsMantener));
            $this->line("     💰 Monto a eliminar: {$montoTotal}");
            $this->newLine();
        }

        // Resumen por venta
        $this->info('📊 Resumen por Venta:');
        foreach ($detallesPorVenta as $ventaId => $detalle) {
            $this->line("  Venta #{$ventaId}: {$detalle['cantidad_duplicados']} duplicados | Monto: {$detalle['monto_total_duplicado']}");
        }
        $this->newLine();

        // Resumen general
        $this->info('📊 Resumen General:');
        $this->line("  • Grupos de duplicados: {$duplicados->count()}");
        $this->line("  • Movimientos a eliminar: {$totalMovimientosAEliminar}");
        $this->line("  • Monto total a eliminar: {$totalMontoEliminado}");
        $this->newLine();

        if ($dryRun) {
            $this->warn('🏃 DRY-RUN: Se mostró qué se eliminaría sin hacer cambios');
            return 0;
        }

        // Pedir confirmación
        if (!$this->confirm("¿Deseas eliminar {$totalMovimientosAEliminar} movimientos duplicados?")) {
            $this->info('❌ Operación cancelada');
            return 0;
        }

        // Ejecutar eliminación en transacción
        $idsAEliminar = [];
        foreach ($duplicados as $grupo) {
            $ids = array_map('intval', explode(',', $grupo->ids));
            $idsAEliminar = array_merge($idsAEliminar, array_slice($ids, 1));
        }

        DB::transaction(function () use ($idsAEliminar, $registrosEliminados, $detallesPorVenta) {
            if (!empty($idsAEliminar)) {
                MovimientoCaja::whereIn('id', $idsAEliminar)->delete();

                // Registrar auditoría
                Log::warning('🧹 [LimpiarMovimientosCajaDuplicadosStrict] Limpieza de duplicados completada', [
                    'cantidad_eliminados' => count($idsAEliminar),
                    'monto_eliminado' => array_sum(array_column($registrosEliminados, 'monto')),
                    'ids_eliminados' => $idsAEliminar,
                    'detalles_por_venta' => $detallesPorVenta,
                    'ejecutado_por' => auth()->user()?->name ?? 'Artisan CLI',
                    'fecha_ejecucion' => now()->toIso8601String(),
                ]);
            }
        });

        $this->info("✅ {$totalMovimientosAEliminar} movimientos duplicados eliminados");
        $this->info("✅ Monto total eliminado: \${$totalMontoEliminado}");
        $this->newLine();
        $this->line('📝 Verificar los logs:');
        $this->line('   tail -100 storage/logs/laravel.log | grep "LimpiarMovimientosCajaDuplicadosStrict"');

        return 0;
    }
}
