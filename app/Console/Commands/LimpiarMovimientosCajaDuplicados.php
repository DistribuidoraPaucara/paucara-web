<?php

namespace App\Console\Commands;

use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LimpiarMovimientosCajaDuplicados extends Command
{
    protected $signature = 'movimientos:limpiar-duplicados {--dry-run} {--detailed}';
    protected $description = 'Elimina movimientos de caja duplicados creados antes de la corrección (2026-07-24)';

    public function handle()
    {
        $dryRun = $this->option('dry-run');
        $detailed = $this->option('detailed');

        $this->info('🔍 Buscando movimientos de caja duplicados...');
        $this->newLine();

        // Obtener tipo de operación VENTA
        $tipoVenta = TipoOperacionCaja::where('codigo', 'VENTA')->first();
        if (!$tipoVenta) {
            $this->error('❌ No se encontró tipo de operación VENTA');
            return 1;
        }

        // Buscar ventas que tengan múltiples movimientos VENTA del MISMO tipo_pago
        // en la MISMA fecha (indicativo de duplicación)
        // Compatible con PostgreSQL y MySQL
        $dbDriver = DB::getDriverName();

        if ($dbDriver === 'pgsql') {
            // PostgreSQL
            $duplicados = DB::table('movimientos_caja')
                ->select(
                    'venta_id',
                    'tipo_pago_id',
                    DB::raw('CAST(fecha AS DATE) as fecha_dia'),
                    DB::raw('COUNT(*) as cantidad'),
                    DB::raw('STRING_AGG(CAST(id as text), \',\' ORDER BY id) as ids')
                )
                ->where('tipo_operacion_id', $tipoVenta->id)
                ->whereNotNull('venta_id')
                ->groupBy('venta_id', 'tipo_pago_id', DB::raw('CAST(fecha AS DATE)'))
                ->havingRaw('COUNT(*) > 1')
                ->get();
        } else {
            // MySQL
            $duplicados = DB::table('movimientos_caja')
                ->select(
                    'venta_id',
                    'tipo_pago_id',
                    DB::raw('DATE(fecha) as fecha_dia'),
                    DB::raw('COUNT(*) as cantidad'),
                    DB::raw('GROUP_CONCAT(id ORDER BY id) as ids')
                )
                ->where('tipo_operacion_id', $tipoVenta->id)
                ->whereNotNull('venta_id')
                ->groupBy('venta_id', 'tipo_pago_id', DB::raw('DATE(fecha)'))
                ->havingRaw('COUNT(*) > 1')
                ->get();
        }

        if ($duplicados->isEmpty()) {
            $this->info('✅ No se encontraron movimientos duplicados');
            return 0;
        }

        $this->warn("⚠️ Se encontraron {$duplicados->count()} grupos de movimientos duplicados");
        $this->newLine();

        $totalMovimientosAEliminar = 0;
        $totalMontoEliminado = 0;
        $registrosEliminados = [];

        foreach ($duplicados as $grupo) {
            $ids = explode(',', $grupo->ids);
            $idsMantener = [reset($ids)]; // Mantener el primero
            $idsEliminar = array_slice($ids, 1); // Eliminar los demás

            $this->line("📌 Venta ID: {$grupo->venta_id} | Tipo Pago: {$grupo->tipo_pago_id} | Cantidad: {$grupo->cantidad}");

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
                    'observaciones' => $mov->observaciones,
                ];

                $registrosEliminados[] = $registro;

                if ($detailed) {
                    $this->line("  ❌ ID: {$mov->id} | Monto: {$mov->monto} | Fecha: {$mov->fecha}");
                }
            }

            if (!$detailed) {
                $montoEliminado = $movimientosAEliminar->sum('monto');
                $this->line("  ❌ " . count($idsEliminar) . " duplicados a eliminar (monto total: {$montoEliminado})");
            }

            $this->line("  ✓ Mantener ID: " . reset($idsMantener));
            $this->newLine();
        }

        // Resumen
        $this->info('📊 Resumen:');
        $this->line("  • Grupos de duplicados encontrados: {$duplicados->count()}");
        $this->line("  • Movimientos a eliminar: {$totalMovimientosAEliminar}");
        $this->line("  • Monto total a eliminar: {$totalMontoEliminado}");
        $this->newLine();

        if ($dryRun) {
            $this->warn('🏃 DRY-RUN: Mostrando qué se eliminaría sin hacer cambios');
            return 0;
        }

        // Pedir confirmación
        if (!$this->confirm('¿Deseas proceder con la eliminación?')) {
            $this->info('❌ Operación cancelada');
            return 0;
        }

        // Ejecutar eliminación en transacción
        DB::transaction(function () use ($duplicados, $idsEliminar, $registrosEliminados) {
            $idsAEliminar = [];

            foreach ($duplicados as $grupo) {
                $ids = explode(',', $grupo->ids);
                $idsAEliminar = array_merge($idsAEliminar, array_slice($ids, 1));
            }

            if (!empty($idsAEliminar)) {
                MovimientoCaja::whereIn('id', $idsAEliminar)->delete();

                // Registrar auditoría
                Log::info('🧹 [LimpiarMovimientosCajaDuplicados] Limpieza completada', [
                    'cantidad_eliminados' => count($idsAEliminar),
                    'monto_eliminado' => array_sum(array_column($registrosEliminados, 'monto')),
                    'ids_eliminados' => $idsAEliminar,
                    'registros_eliminados' => $registrosEliminados,
                    'ejecutado_por' => auth()->user()?->name ?? 'Sistema',
                    'timestamp' => now()->toIso8601String(),
                ]);
            }
        });

        $this->info("✅ {$totalMovimientosAEliminar} movimientos duplicados eliminados exitosamente");
        $this->info("✅ Monto total eliminado: {$totalMontoEliminado}");
        $this->newLine();
        $this->line('📝 Revisa los logs para detalles de los registros eliminados:');
        $this->line('   grep "LimpiarMovimientosCajaDuplicados" storage/logs/laravel.log');

        return 0;
    }
}
