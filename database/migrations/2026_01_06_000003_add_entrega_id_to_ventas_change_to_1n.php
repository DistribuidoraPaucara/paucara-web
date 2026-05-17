<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * FASE 3: CAMBIAR RELACIÓN VENTA-ENTREGA DE N:M A 1:N
 *
 * ANTES (N:M via pivot):
 *   entrega_venta (pivot table)
 *   ├─ entrega_id → entregas
 *   └─ venta_id → ventas
 *
 *   PROBLEMA: Una venta puede estar en múltiples entregas (confuso)
 *            Difícil trackear venta individual
 *
 * DESPUÉS (1:N):
 *   ventas.entrega_id → entregas
 *
 *   BENEFICIO: Una venta pertenece a UNA entrega
 *             Fácil trackear el progreso individual
 *             Sincronización simple
 *
 * PROCESO:
 * 1. Agregar columna entrega_id a tabla ventas (nullable)
 * 2. Migrar datos: pivot → FK (tomar primera entrega si hay múltiples)
 * 3. Crear índice y FK
 * 4. Mantener pivot temporalmente para compatibilidad
 * 5. En Fase 3b: eliminar pivot cuando todo esté testeado
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            // 1. Agregar columna entrega_id
            $table->unsignedBigInteger('entrega_id')
                ->nullable()
                ->after('id')
                ->comment('FK a entregas (1:N relationship - NUEVA ARQUITECTURA)');

            // Crear FK
            $table->foreign('entrega_id')
                ->references('id')
                ->on('entregas')
                ->onDelete('set null');

            // Índice para búsquedas rápidas
            $table->index('entrega_id');
        });

        // 2. Migrar datos del pivot table al FK
        $this->migrateFromPivotToFk();
    }

    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropForeign(['entrega_id']);
            $table->dropIndex(['entrega_id']);
            $table->dropColumn('entrega_id');
        });
    }

    /**
     * Migrar datos de entrega_venta (pivot) a ventas.entrega_id (FK)
     *
     * ESTRATEGIA:
     * - Si una venta está en 1 entrega: migrar directamente
     * - Si una venta está en múltiples entregas: tomar la más reciente
     *   (La más reciente es probablemente la correcta)
     */
    private function migrateFromPivotToFk(): void
    {
        $migradas = 0;
        $conflictos = 0;

        // Obtener todas las relaciones del pivot
        $ventasEnPivot = DB::table('entrega_venta')
            ->select('venta_id')
            ->distinct()
            ->get();

        foreach ($ventasEnPivot as $row) {
            $ventaId = $row->venta_id;

            // Obtener todas las entregas para esta venta
            $entregas = DB::table('entrega_venta')
                ->where('venta_id', $ventaId)
                ->orderByDesc('created_at')  // Más reciente primero
                ->pluck('entrega_id')
                ->toArray();

            if (count($entregas) === 1) {
                // Caso simple: 1 venta en 1 entrega
                DB::table('ventas')
                    ->where('id', $ventaId)
                    ->update(['entrega_id' => $entregas[0]]);

                $migradas++;
            } elseif (count($entregas) > 1) {
                // Caso complejo: 1 venta en múltiples entregas
                // Tomar la más reciente (asumiendo que es la correcta)
                DB::table('ventas')
                    ->where('id', $ventaId)
                    ->update(['entrega_id' => $entregas[0]]);

                $migradas++;
                $conflictos++;

                \Log::warning("Venta en múltiples entregas: venta_id=$ventaId", [
                    'entregas_anteriores' => $entregas,
                    'asignada_a' => $entregas[0],
                ]);
            }
        }

        \Log::info("Migración pivot → FK completada", [
            'ventas_migradas' => $migradas,
            'conflictos_resueltos' => $conflictos,
        ]);
    }
};
