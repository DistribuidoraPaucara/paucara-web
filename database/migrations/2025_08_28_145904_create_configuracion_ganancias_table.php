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
        Schema::create('configuracion_ganancias', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('producto_id');
            $table->foreignId('tipo_precio_id')->constrained('tipos_precio')->onDelete('cascade')->onUpdate('cascade');
            $table->string('tipo_precio', 20)->nullable();
            $table->decimal('margen_minimo', 8, 2)->default(0);
            $table->decimal('margen_maximo', 8, 2)->nullable();
            $table->decimal('porcentaje_ganancia_esperado', 5, 2)->default(0);
            $table->decimal('precio_base_referencia', 10, 2)->nullable();
            $table->boolean('calcular_automatico')->default(true);
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->foreign('producto_id')->references('id')->on('productos')->onDelete('cascade');
            $table->unique(['producto_id', 'tipo_precio']);
            $table->index(['tipo_precio', 'activo']);

        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('configuracion_ganancias');
    }
};
