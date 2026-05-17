<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public $withouTransactions = true;

    /**
     * Run the migrations.
     *
     * REFACTORIZACIÓN CRÍTICA: Eliminar FKs redundantes
     *
     * ANTES (CONFUSO):
     * ┌─ entregas.venta_id ────────────────────────────┐
     * ├─ entregas.proforma_id ─ (Legacy, deprecado)   │
     * └─ reporte_cargas.entrega_id ──────────────────┘
     *     ADEMÁS: reporte_carga_entregas (pivot N:N)
     *
     * DESPUÉS (CLARO):
     * ├─ entrega_venta (pivot) ← Entrega has many Ventas
     * ├─ reporte_cargas.entrega_id ← NULL, usar pivot reporte_carga_entregas
     * └─ entregas.proforma_id ← Opcional para legacy
     *
     * ESTRATEGIA:
     * 1. Conservar datos: Si una entrega tiene venta_id, migramos al pivot
     * 2. Eliminar FKs conflictivos
     * 3. Mantener compatibilidad con reportes existentes
     *
     * NOTA: Esta migración es reversible, pero la reversión NO recupera datos
     * migrados al pivot.
     */
    public function up(): void
    {
        \Log::info('Migrando: 2025_12_27_refactor_entregas_remove_redundant_fks');

        // NOTA: Los cambios de refactorización ya fueron hechos parcialmente en migraciones anteriores
        // Esta migración verifica el estado actual y solo hace los pasos necesarios

        // Verificar estado actual
        $venta_id_existe = Schema::hasColumn('entregas', 'venta_id');
        $proforma_id_existe = Schema::hasColumn('entregas', 'proforma_id');
        $entrega_venta_existe = Schema::hasTable('entrega_venta');

        \Log::info("Estado: venta_id=$venta_id_existe, proforma_id=$proforma_id_existe, entrega_venta=$entrega_venta_existe");

        if ($venta_id_existe && $entrega_venta_existe) {
            // Paso 1: Migrar datos si aún existen
            try {
                DB::statement('
                    INSERT INTO entrega_venta (entrega_id, venta_id, orden, created_at, updated_at)
                    SELECT id, venta_id, 1, NOW(), NOW()
                    FROM entregas
                    WHERE venta_id IS NOT NULL
                    ON CONFLICT (entrega_id, venta_id) DO NOTHING
                ');
                \Log::info('Datos migrados a pivot');
            } catch (\Exception $e) {
                \Log::warning('Error migrando datos: ' . $e->getMessage());
            }

            // Paso 2-3: Eliminar venta_id
            try {
                // Primero FK
                DB::statement('ALTER TABLE entregas DROP CONSTRAINT IF EXISTS entregas_venta_id_foreign');
                // Luego columna
                DB::statement('ALTER TABLE entregas DROP COLUMN IF EXISTS venta_id');
                \Log::info('venta_id y su FK eliminadas');
            } catch (\Exception $e) {
                \Log::warning('Error eliminando venta_id: ' . $e->getMessage());
            }
        }

        // Paso 4: Eliminar FK de reporte_cargas si existe
        try {
            DB::statement('ALTER TABLE reporte_cargas DROP CONSTRAINT IF EXISTS reporte_cargas_entrega_id_foreign');
            \Log::info('FK reporte_cargas.entrega_id eliminada');
        } catch (\Exception $e) {
            \Log::warning('FK reporte_cargas no existe o ya eliminada: ' . $e->getMessage());
        }

        \Log::info('Migración completada');
    }

    /**
     * Reverse the migrations.
     *
     * ADVERTENCIA: Esta reversión NO recuperará datos migrados al pivot
     * Se proporciona solo para compatibilidad con `php artisan migrate:rollback`
     */
    public function down(): void
    {
        // Paso 1: Recrear columna venta_id en entregas
        Schema::table('entregas', function (Blueprint $table) {
            if (!Schema::hasColumn('entregas', 'venta_id')) {
                $table->unsignedBigInteger('venta_id')
                    ->nullable()
                    ->after('proforma_id')
                    ->comment('DEPRECATED - Usar pivot entrega_venta');
            }
        });

        // Paso 2: Recrear FK (con datos del pivot si es necesario)
        // Nota: Si hay múltiples ventas por entrega, esto puede fallar
        try {
            DB::statement('
                UPDATE entregas e
                SET venta_id = (
                    SELECT venta_id FROM entrega_venta ev
                    WHERE ev.entrega_id = e.id
                    ORDER BY ev.orden
                    LIMIT 1
                )
                WHERE EXISTS (
                    SELECT 1 FROM entrega_venta ev
                    WHERE ev.entrega_id = e.id
                )
            ');
        } catch (\Exception $e) {
            \Log::warning('Error recuperando venta_id: ' . $e->getMessage());
        }

        // Paso 3: Recrear la FK
        Schema::table('entregas', function (Blueprint $table) {
            $table->foreign('venta_id')
                ->references('id')
                ->on('ventas')
                ->onDelete('cascade');
        });

        // Paso 4: Recrear FK en reporte_cargas
        Schema::table('reporte_cargas', function (Blueprint $table) {
            $table->foreign('entrega_id')
                ->references('id')
                ->on('entregas')
                ->onDelete('cascade');
        });
    }
};
