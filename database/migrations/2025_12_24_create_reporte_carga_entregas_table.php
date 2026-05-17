<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Crear tabla pivot para vincular múltiples entregas a un reporte
     *
     * PROBLEMA RESUELTO:
     * - Reporte consolidado = 1 reporte con múltiples entregas
     * - Reporte individual = 1 reporte con 1 entrega
     * - Necesitamos Many-to-Many entre reporte_cargas y entregas
     *
     * ESTRUCTURA:
     * reporte_cargas (1) ←→ (N) reporte_carga_entregas (M) ←→ (N) entregas
     *
     * BENEFICIOS:
     * ✅ Un reporte puede tener múltiples entregas
     * ✅ Una entrega puede estar en múltiples reportes (si se divide)
     * ✅ Auditoría completa
     * ✅ Fácil de imprimir o verificar
     */
    public function up(): void
    {
        Schema::create('reporte_carga_entregas', function (Blueprint $table) {
            $table->id();

            // Relaciones
            $table->unsignedBigInteger('reporte_carga_id');
            $table->unsignedBigInteger('entrega_id');

            // Información del vínculo
            $table->integer('orden')->default(1);  // Para mantener orden en reportes consolidados
            $table->boolean('incluida_en_carga')->default(false);  // Si fue incluida en la carga física
            $table->text('notas')->nullable();  // Observaciones específicas para esta entrega

            // Foreign keys
            $table->foreign('reporte_carga_id')
                ->references('id')
                ->on('reporte_cargas')
                ->onDelete('cascade');

            $table->foreign('entrega_id')
                ->references('id')
                ->on('entregas')
                ->onDelete('cascade');

            // Índices
            $table->index(['reporte_carga_id', 'orden']);
            $table->index(['entrega_id', 'reporte_carga_id']);
            $table->unique(['reporte_carga_id', 'entrega_id']);  // Evitar duplicados

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reporte_carga_entregas');
    }
};
