<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('proformas', function (Blueprint $table) {
            // Verificar si las columnas ya existen (por si acaso)
            $columns = DB::getSchemaBuilder()->getColumnListing('proformas');

            // CAMPOS DE ENTREGA (de la migración anterior que falló)
            if (!in_array('fecha_entrega_solicitada', $columns)) {
                $table->date('fecha_entrega_solicitada')->nullable()->after('observaciones');
            }
            if (!in_array('hora_entrega_solicitada', $columns)) {
                $table->time('hora_entrega_solicitada')->nullable()->after('fecha_entrega_solicitada');
            }
            if (!in_array('direccion_entrega_solicitada_id', $columns)) {
                $table->foreignId('direccion_entrega_solicitada_id')->nullable()
                    ->after('hora_entrega_solicitada')
                    ->constrained('direcciones_cliente')
                    ->onDelete('set null');
            }

            if (!in_array('fecha_entrega_confirmada', $columns)) {
                $table->date('fecha_entrega_confirmada')->nullable()->after('direccion_entrega_solicitada_id');
            }
            if (!in_array('hora_entrega_confirmada', $columns)) {
                $table->time('hora_entrega_confirmada')->nullable()->after('fecha_entrega_confirmada');
            }
            if (!in_array('direccion_entrega_confirmada_id', $columns)) {
                $table->foreignId('direccion_entrega_confirmada_id')->nullable()
                    ->after('hora_entrega_confirmada')
                    ->constrained('direcciones_cliente')
                    ->onDelete('set null');
            }

            if (!in_array('coordinacion_completada', $columns)) {
                $table->boolean('coordinacion_completada')->default(false)->after('direccion_entrega_confirmada_id');
            }
            if (!in_array('comentario_coordinacion', $columns)) {
                $table->text('comentario_coordinacion')->nullable()->after('coordinacion_completada');
            }

            // NUEVOS CAMPOS DE RASTREO Y CONTROL
            if (!in_array('coordinacion_actualizada_en', $columns)) {
                $table->timestamp('coordinacion_actualizada_en')->nullable()->after('comentario_coordinacion');
            }
            if (!in_array('coordinacion_actualizada_por_id', $columns)) {
                $table->foreignId('coordinacion_actualizada_por_id')->nullable()
                    ->after('coordinacion_actualizada_en')
                    ->constrained('users')
                    ->nullOnDelete();
            }
            if (!in_array('motivo_cambio_entrega', $columns)) {
                $table->string('motivo_cambio_entrega')->nullable()->after('coordinacion_actualizada_por_id');
            }

            // CONTROL DE INTENTOS DE CONTACTO
            if (!in_array('numero_intentos_contacto', $columns)) {
                $table->integer('numero_intentos_contacto')->default(0)->after('motivo_cambio_entrega');
            }
            if (!in_array('fecha_ultimo_intento', $columns)) {
                $table->timestamp('fecha_ultimo_intento')->nullable()->after('numero_intentos_contacto');
            }
            if (!in_array('resultado_ultimo_intento', $columns)) {
                $table->string('resultado_ultimo_intento')->nullable()
                    ->after('fecha_ultimo_intento')
                    ->comment('Valores: "Aceptado", "No contactado", "Rechazado", "Reagendar"');
            }

            // DATOS DE ENTREGA REALIZADA
            if (!in_array('entregado_en', $columns)) {
                $table->timestamp('entregado_en')->nullable()->after('resultado_ultimo_intento');
            }
            if (!in_array('entregado_a', $columns)) {
                $table->string('entregado_a')->nullable()->after('entregado_en')
                    ->comment('Nombre de quién recibió la entrega');
            }
            if (!in_array('observaciones_entrega', $columns)) {
                $table->text('observaciones_entrega')->nullable()->after('entregado_a')
                    ->comment('Observaciones sobre la entrega realizada');
            }

            // ÍNDICES para búsquedas y performance
            // Solo crear índices si no existen
            if (!$this->indexExists('proformas', 'proformas_estado_fecha_entrega_solicitada_index')) {
                $table->index(['estado', 'fecha_entrega_solicitada']);
            }
            if (!$this->indexExists('proformas', 'proformas_estado_fecha_entrega_confirmada_index')) {
                $table->index(['estado', 'fecha_entrega_confirmada']);
            }
            if (!$this->indexExists('proformas', 'proformas_coordinacion_actualizada_en_index')) {
                $table->index('coordinacion_actualizada_en');
            }
            if (!$this->indexExists('proformas', 'proformas_resultado_ultimo_intento_index')) {
                $table->index('resultado_ultimo_intento');
            }
            if (!$this->indexExists('proformas', 'proformas_entregado_en_index')) {
                $table->index('entregado_en');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proformas', function (Blueprint $table) {
            $columns = DB::getSchemaBuilder()->getColumnListing('proformas');

            // Eliminar índices
            try {
                $table->dropIndex(['estado', 'fecha_entrega_solicitada']);
            } catch (\Exception $e) {}
            try {
                $table->dropIndex(['estado', 'fecha_entrega_confirmada']);
            } catch (\Exception $e) {}
            try {
                $table->dropIndex(['coordinacion_actualizada_en']);
            } catch (\Exception $e) {}
            try {
                $table->dropIndex(['resultado_ultimo_intento']);
            } catch (\Exception $e) {}
            try {
                $table->dropIndex(['entregado_en']);
            } catch (\Exception $e) {}

            // Eliminar foreign keys
            try {
                $table->dropForeignKeyIfExists('proformas_direccion_entrega_solicitada_id_foreign');
            } catch (\Exception $e) {}
            try {
                $table->dropForeignKeyIfExists('proformas_direccion_entrega_confirmada_id_foreign');
            } catch (\Exception $e) {}
            try {
                $table->dropForeignKeyIfExists('proformas_coordinacion_actualizada_por_id_foreign');
            } catch (\Exception $e) {}

            // Eliminar columnas
            $columnsToDelete = [
                'fecha_entrega_solicitada',
                'hora_entrega_solicitada',
                'direccion_entrega_solicitada_id',
                'fecha_entrega_confirmada',
                'hora_entrega_confirmada',
                'direccion_entrega_confirmada_id',
                'coordinacion_completada',
                'comentario_coordinacion',
                'coordinacion_actualizada_en',
                'coordinacion_actualizada_por_id',
                'motivo_cambio_entrega',
                'numero_intentos_contacto',
                'fecha_ultimo_intento',
                'resultado_ultimo_intento',
                'entregado_en',
                'entregado_a',
                'observaciones_entrega',
            ];

            foreach ($columnsToDelete as $column) {
                if (in_array($column, $columns)) {
                    try {
                        $table->dropColumn($column);
                    } catch (\Exception $e) {}
                }
            }
        });
    }

    /**
     * Verificar si un índice existe en PostgreSQL
     */
    private function indexExists($table, $indexName)
    {
        try {
            $result = DB::select(
                "SELECT EXISTS(SELECT 1 FROM pg_indexes WHERE indexname = ? AND tablename = ?) as exists",
                [$indexName, $table]
            );
            return $result[0]->exists ?? false;
        } catch (\Exception $e) {
            return false;
        }
    }
};
