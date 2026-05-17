<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * FASE 1: NORMALIZACIÓN DE ENTREGAS
 *
 * OBJETIVO: Cambiar entregas.estado de ENUM a FK, agregando campos SLA
 *
 * CAMBIOS:
 * 1. Agregar estado_entrega_id (FK a estados_logistica)
 * 2. Agregar campos SLA a entregas (para sincronización con ventas)
 * 3. Migrará datos ENUM → FK automáticamente
 * 4. Mantener entregas.estado (ENUM) por compatibilidad transitoria
 *
 * FLUJO DE TRABAJO:
 * - Esta migration:  Agrega FK + SLA + migra datos
 * - Fase 2 migration: Cambia el código a usar FK
 * - Fase 3 migration: Elimina columna ENUM estado (cuando sea seguro)
 *
 * REVERSIBILIDAD: ✅ Completa
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            // 1. Agregar FK a estados_logistica (categoría: entrega_logistica)
            $table->unsignedBigInteger('estado_entrega_id')
                ->nullable()
                ->after('numero_entrega')
                ->comment('FK a estados_logistica (categoría: entrega_logistica)');

            $table->foreign('estado_entrega_id')
                ->references('id')
                ->on('estados_logistica')
                ->onDelete('restrict');

            // 2. Agregar campos SLA (copiados de venta)
            $table->dateTime('fecha_entrega_comprometida')
                ->nullable()
                ->after('fecha_programada')
                ->comment('SLA comprometido con cliente (copiado de venta)');

            $table->time('ventana_entrega_ini')
                ->nullable()
                ->after('fecha_entrega_comprometida')
                ->comment('Inicio de ventana de entrega comprometida');

            $table->time('ventana_entrega_fin')
                ->nullable()
                ->after('ventana_entrega_ini')
                ->comment('Fin de ventana de entrega comprometida');

            // 3. Índices
            $table->index('estado_entrega_id');
            $table->index('fecha_entrega_comprometida');
        });

        // MIGRACIÓN DE DATOS: ENUM → FK
        // Crear mapeo de estados ENUM a estados_logistica
        $this->migrateEnumToForeignKey();
    }

    public function down(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            // Eliminar FK antes de eliminar columna
            $table->dropForeign(['estado_entrega_id']);
            $table->dropColumn([
                'estado_entrega_id',
                'fecha_entrega_comprometida',
                'ventana_entrega_ini',
                'ventana_entrega_fin',
            ]);
        });
    }

    /**
     * Migrar datos de ENUM (estado) a FK (estado_entrega_id)
     *
     * MAPEO:
     * ENUM 'PROGRAMADO' → estado_logistica.codigo = 'PROGRAMADO'
     * ENUM 'ASIGNADA' → estado_logistica.codigo = 'ASIGNADA'
     * ... etc
     */
    private function migrateEnumToForeignKey(): void
    {
        // Estados que pueden existir en entregas
        $estadosEnum = [
            'PROGRAMADO',
            'ASIGNADA',
            'EN_CAMINO',
            'LLEGO',
            'ENTREGADO',
            'NOVEDAD',
            'CANCELADA',
            'PREPARACION_CARGA',
            'EN_CARGA',
            'LISTO_PARA_ENTREGA',
            'EN_TRANSITO',
            'RECHAZADO',
            'ENTREGADA', // Legacy
        ];

        // Para cada estado ENUM, buscar el ID en estados_logistica
        foreach ($estadosEnum as $codigoEstado) {
            $estadoLogistico = DB::table('estados_logistica')
                ->where('codigo', $codigoEstado)
                ->where('categoria', 'entrega_logistica')
                ->first();

            if ($estadoLogistico) {
                // Actualizar todas las entregas con este estado
                DB::table('entregas')
                    ->where('estado', $codigoEstado)
                    ->update(['estado_entrega_id' => $estadoLogistico->id]);

                \Log::info("✅ Entregas migradas: $codigoEstado → ID {$estadoLogistico->id}");
            } else {
                \Log::warning("⚠️ Estado '$codigoEstado' no encontrado en estados_logistica");
            }
        }

        // Verificar que todas las entregas tengan estado_entrega_id
        $sinEstadoFk = DB::table('entregas')
            ->whereNull('estado_entrega_id')
            ->count();

        if ($sinEstadoFk > 0) {
            \Log::warning("⚠️ $sinEstadoFk entregas sin estado_entrega_id");
        }
    }
};
