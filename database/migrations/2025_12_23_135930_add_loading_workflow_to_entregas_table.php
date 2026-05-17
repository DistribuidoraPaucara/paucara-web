<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            // Nuevos estados para el flujo de carga
            // PROGRAMADO → PREPARACION_CARGA → EN_CARGA → LISTO_PARA_ENTREGA → EN_TRANSITO → ENTREGADO
            $table->unsignedBigInteger('reporte_carga_id')->nullable()->after('estado');

            // Auditoría del flujo de carga
            $table->unsignedBigInteger('confirmado_carga_por')->nullable()->after('reporte_carga_id');
            $table->timestamp('fecha_confirmacion_carga')->nullable()->after('confirmado_carga_por');

            $table->unsignedBigInteger('iniciada_entrega_por')->nullable()->after('fecha_confirmacion_carga');
            $table->timestamp('fecha_inicio_entrega')->nullable()->after('iniciada_entrega_por');

            // Seguimiento de entrega (para GPS, actualización de estado)
            $table->decimal('latitud_actual', 10, 8)->nullable()->after('fecha_inicio_entrega');
            $table->decimal('longitud_actual', 11, 8)->nullable()->after('latitud_actual');
            $table->timestamp('fecha_ultima_ubicacion')->nullable()->after('longitud_actual');

            // Foreign keys
            $table->foreign('reporte_carga_id')->references('id')->on('reporte_cargas')->onDelete('set null');
            $table->foreign('confirmado_carga_por')->references('id')->on('users')->onDelete('set null');
            $table->foreign('iniciada_entrega_por')->references('id')->on('users')->onDelete('set null');

            // Índices
            $table->index(['reporte_carga_id', 'estado']);
            $table->index(['confirmado_carga_por', 'fecha_confirmacion_carga']);
            $table->index(['estado', 'fecha_inicio_entrega']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            $table->dropForeign(['reporte_carga_id']);
            $table->dropForeign(['confirmado_carga_por']);
            $table->dropForeign(['iniciada_entrega_por']);

            $table->dropIndex(['reporte_carga_id', 'estado']);
            $table->dropIndex(['confirmado_carga_por', 'fecha_confirmacion_carga']);
            $table->dropIndex(['estado', 'fecha_inicio_entrega']);

            $table->dropColumn([
                'reporte_carga_id',
                'confirmado_carga_por',
                'fecha_confirmacion_carga',
                'iniciada_entrega_por',
                'fecha_inicio_entrega',
                'latitud_actual',
                'longitud_actual',
                'fecha_ultima_ubicacion',
            ]);
        });
    }
};
