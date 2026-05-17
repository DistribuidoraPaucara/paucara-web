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
        Schema::create('productos_relacionado_prestables', function (Blueprint $table) {
            $table->id();

            // Foreign Keys
            $table->foreignId('prestable_id')
                ->constrained('prestables')
                ->cascadeOnDelete();

            $table->foreignId('producto_id')
                ->constrained('productos')
                ->cascadeOnDelete();

            // Opcional: información adicional
            $table->text('descripcion')->nullable()
                ->comment('Descripción de la relación o variante');
            $table->boolean('es_principal')->default(false)
                ->comment('Indica si es el producto principal del prestable');
            $table->integer('orden')->default(0)
                ->comment('Orden de visualización');

            $table->timestamps();

            // Índices
            $table->unique(['prestable_id', 'producto_id']);
            $table->index('prestable_id');
            $table->index('producto_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos_relacionado_prestables');
    }
};
