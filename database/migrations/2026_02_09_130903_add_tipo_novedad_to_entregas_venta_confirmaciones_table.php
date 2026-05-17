<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * ✅ Agregar campos para mejorar reportes de entregas y novedades
     */
    public function up(): void
    {
        Schema::table('entregas_venta_confirmaciones', function (Blueprint $table) {
            // ✅ NUEVO: Tipo de entrega (COMPLETA o NOVEDAD)
            $table->enum('tipo_entrega', ['COMPLETA', 'NOVEDAD'])
                ->nullable()
                ->after('venta_id')
                ->comment('COMPLETA: Entrega sin problemas, NOVEDAD: Con problemas/incidentes');

            // ✅ NUEVO: Tipo de novedad si aplica (CLIENTE_CERRADO, DEVOLUCION_PARCIAL, RECHAZADO)
            $table->enum('tipo_novedad', [
                'CLIENTE_CERRADO',
                'DEVOLUCION_PARCIAL',
                'RECHAZADO'
            ])
                ->nullable()
                ->after('tipo_entrega')
                ->comment('Tipo de novedad registrada en la entrega');

            // ✅ NUEVO: Flag booleano para filtrar rápidamente entregas problemáticas
            $table->boolean('tuvo_problema')
                ->default(false)
                ->after('tipo_novedad')
                ->index()
                ->comment('True si tipo_entrega = NOVEDAD');

            // ✅ Índices para reportes
            $table->index(['tipo_entrega', 'confirmado_en'], 'idx_tipo_entrega_fecha');
            $table->index(['tipo_novedad', 'confirmado_en'], 'idx_tipo_novedad_fecha');
            $table->index('tuvo_problema', 'idx_tuvo_problema');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas_venta_confirmaciones', function (Blueprint $table) {
            $table->dropIndex('idx_tipo_entrega_fecha');
            $table->dropIndex('idx_tipo_novedad_fecha');
            $table->dropIndex('idx_tuvo_problema');
            $table->dropColumn(['tipo_entrega', 'tipo_novedad', 'tuvo_problema']);
        });
    }
};
