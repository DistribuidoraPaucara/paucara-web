<?php

namespace App\Console\Commands;

use App\Models\EntregaVentaConfirmacion;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Builder;

class ActualizarConfirmadoPorChofer extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'entregas:actualizar-confirmado-por
                            {chofer_id : ID del chofer}
                            {--fecha-desde=2026-07-01 : Fecha inicio (YYYY-MM-DD)}
                            {--fecha-hasta= : Fecha fin (YYYY-MM-DD), default: hoy}
                            {--force : Ejecutar sin confirmación}
                            {--dry-run : Simular sin actualizar}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Actualizar confirmado_por de todas las entregas_venta_confirmaciones donde chofer_id sea X en un rango de fechas';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $chofer_id = $this->argument('chofer_id');
        $fecha_desde = $this->option('fecha-desde');
        $fecha_hasta = $this->option('fecha-hasta') ?: now()->format('Y-m-d');
        $force = $this->option('force');
        $dry_run = $this->option('dry-run');

        $this->info('🔍 Validando parámetros...');

        // Validar chofer_id
        if (!is_numeric($chofer_id) || $chofer_id < 1) {
            $this->error('❌ chofer_id debe ser un número positivo');
            return 1;
        }

        // Validar fechas
        try {
            $fecha_desde = Carbon::createFromFormat('Y-m-d', $fecha_desde)->startOfDay();
            $fecha_hasta = Carbon::createFromFormat('Y-m-d', $fecha_hasta)->endOfDay();
        } catch (\Exception $e) {
            $this->error('❌ Formato de fecha inválido. Usar YYYY-MM-DD');
            return 1;
        }

        if ($fecha_desde > $fecha_hasta) {
            $this->error('❌ fecha-desde debe ser menor a fecha-hasta');
            return 1;
        }

        // Verificar que el chofer existe
        $chofer = \App\Models\User::find($chofer_id);
        if (!$chofer) {
            $this->error("❌ Usuario (chofer) ID {$chofer_id} no encontrado");
            return 1;
        }

        $this->info("✅ Chofer encontrado: {$chofer->name} ({$chofer->email})");

        // Buscar entregas del chofer en el rango de fechas
        $this->info("\n🔍 Buscando entregas...");
        $entregas = \App\Models\Entrega::where('chofer_id', $chofer_id)
            ->whereBetween('created_at', [$fecha_desde, $fecha_hasta])
            ->select('id', 'numero_entrega', 'created_at')
            ->get();

        if ($entregas->isEmpty()) {
            $this->warn("⚠️  No se encontraron entregas para el chofer {$chofer_id} entre {$fecha_desde->format('Y-m-d')} y {$fecha_hasta->format('Y-m-d')}");
            return 0;
        }

        $this->info("✅ Entregas encontradas: {$entregas->count()}");
        $entregas->each(fn($e) => $this->line("   • {$e->numero_entrega} (ID: {$e->id})"));

        // Buscar confirmaciones que necesitan actualización
        $this->info("\n🔍 Buscando entregas_venta_confirmaciones...");

        $confirmaciones = EntregaVentaConfirmacion::whereIn('entrega_id', $entregas->pluck('id'))
            ->where('confirmado_por', '!=', $chofer_id)  // Solo las que no están asignadas al chofer
            ->get();

        if ($confirmaciones->isEmpty()) {
            $this->warn('⚠️  No hay confirmaciones que actualizar (todas ya están asignadas al chofer)');
            return 0;
        }

        $this->info("✅ Confirmaciones encontradas: {$confirmaciones->count()}");

        // Agrupar por estado actual de confirmado_por
        $this->info("\n📊 Resumen de cambios:");
        $confirmaciones->groupBy('confirmado_por')
            ->each(function ($group, $confirmado_por) use ($chofer_id, $chofer) {
                $nombre = $confirmado_por
                    ? \App\Models\User::find($confirmado_por)?->name ?? "Usuario {$confirmado_por}"
                    : 'Sin asignar';
                $this->line("   • {$group->count()} de {$nombre} → {$chofer->name}");
            });

        // Si es dry-run, terminar aquí
        if ($dry_run) {
            $this->info("\n✅ DRY-RUN completado (sin actualizar)");
            return 0;
        }

        // Pedir confirmación
        if (!$force) {
            if (!$this->confirm("\n⚠️  ¿Deseas actualizar {$confirmaciones->count()} registros?", false)) {
                $this->info('❌ Operación cancelada');
                return 0;
            }
        }

        // Actualizar
        $this->info("\n⏳ Actualizando...");

        $updated = EntregaVentaConfirmacion::whereIn('entrega_id', $entregas->pluck('id'))
            ->where('confirmado_por', '!=', $chofer_id)
            ->update(['confirmado_por' => $chofer_id]);

        $this->info("✅ Actualización completada: {$updated} registros actualizados");

        return 0;
    }
}
