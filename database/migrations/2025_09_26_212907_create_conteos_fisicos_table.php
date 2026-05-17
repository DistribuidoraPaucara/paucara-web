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
        Schema::create('conteos_fisicos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_conteo')->unique(); // CF-2025-001
            $table->foreignId('almacen_id')->constrained('almacenes')->onDelete('cascade');
            $table->foreignId('creado_por')->constrained('users');
            $table->foreignId('supervisado_por')->nullable()->constrained('users');
            $table->string('tipo_conteo'); // 'ciclico', 'general', 'por_categoria', 'spot'
            $table->enum('estado', ['planificado', 'en_progreso', 'finalizado', 'aprobado', 'cancelado'])->default('planificado');
            $table->date('fecha_programada');
            $table->timestamp('fecha_inicio')->nullable();
            $table->timestamp('fecha_finalizacion')->nullable();
            $table->timestamp('fecha_aprobacion')->nullable();
            $table->text('descripcion')->nullable();
            $table->text('observaciones')->nullable();
            $table->json('filtros')->nullable(); // categorías, productos específicos, etc.
            $table->decimal('total_productos_esperados', 10, 0)->default(0);
            $table->decimal('total_productos_contados', 10, 0)->default(0);
            $table->decimal('total_diferencias', 10, 0)->default(0);
            $table->decimal('valor_diferencias', 12, 2)->default(0);
            $table->boolean('ajustes_aplicados')->default(false);
            $table->timestamps();

            // Índices
            $table->index(['almacen_id', 'estado']);
            $table->index(['fecha_programada', 'tipo_conteo']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conteos_fisicos');
    }
};
