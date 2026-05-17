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
        Schema::table('proformas', function (Blueprint $table) {
            // Solicitud inicial del cliente (lo que pide)
            $table->date('fecha_entrega_solicitada')->nullable()->after('observaciones');
            $table->time('hora_entrega_solicitada')->nullable()->after('fecha_entrega_solicitada');
            $table->foreignId('direccion_entrega_solicitada_id')->nullable()
                ->after('hora_entrega_solicitada')
                ->constrained('direcciones_cliente')
                ->onDelete('set null');

            // Confirmación del vendedor (lo que aprueba después de coordinación)
            $table->date('fecha_entrega_confirmada')->nullable()->after('direccion_entrega_solicitada_id');
            $table->time('hora_entrega_confirmada')->nullable()->after('fecha_entrega_confirmada');
            $table->foreignId('direccion_entrega_confirmada_id')->nullable()
                ->after('hora_entrega_confirmada')
                ->constrained('direcciones_cliente')
                ->onDelete('set null');

            // Auditoría de coordinación
            $table->boolean('coordinacion_completada')->default(false)->after('direccion_entrega_confirmada_id');
            $table->text('comentario_coordinacion')->nullable()->after('coordinacion_completada');

            // Índices para performance
            $table->index(['estado', 'fecha_entrega_solicitada']);
            $table->index(['estado', 'fecha_entrega_confirmada']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proformas', function (Blueprint $table) {
            $table->dropForeign(['direccion_entrega_solicitada_id']);
            $table->dropForeign(['direccion_entrega_confirmada_id']);
            $table->dropIndex(['estado', 'fecha_entrega_solicitada']);
            $table->dropIndex(['estado', 'fecha_entrega_confirmada']);
            $table->dropColumn([
                'fecha_entrega_solicitada',
                'hora_entrega_solicitada',
                'direccion_entrega_solicitada_id',
                'fecha_entrega_confirmada',
                'hora_entrega_confirmada',
                'direccion_entrega_confirmada_id',
                'coordinacion_completada',
                'comentario_coordinacion',
            ]);
        });
    }
};
