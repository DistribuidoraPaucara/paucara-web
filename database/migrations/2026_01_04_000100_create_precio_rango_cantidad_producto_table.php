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
        Schema::create('precio_rango_cantidad_producto', function (Blueprint $table) {
            $table->id();

            // Relaciones
            $table->foreignId('empresa_id')
                ->constrained('empresas')
                ->cascadeOnDelete();

            $table->foreignId('producto_id')
                ->constrained('productos')
                ->cascadeOnDelete();

            $table->foreignId('tipo_precio_id')
                ->constrained('tipos_precio')
                ->restrictOnDelete();

            // Rango de cantidad
            $table->integer('cantidad_minima')
                ->unsigned()
                ->comment('Cantidad mínima para aplicar este rango');

            $table->integer('cantidad_maxima')
                ->unsigned()
                ->nullable()
                ->comment('Cantidad máxima (NULL = sin límite)');

            // Vigencia
            $table->date('fecha_vigencia_inicio')
                ->nullable()
                ->comment('Fecha desde cuando es válido este rango');

            $table->date('fecha_vigencia_fin')
                ->nullable()
                ->comment('Fecha hasta cuando es válido este rango');

            // Control
            $table->boolean('activo')
                ->default(true)
                ->index();

            $table->integer('orden')
                ->default(0)
                ->comment('Orden de aplicación de rangos');

            $table->timestamps();

            // Índices
            $table->unique(['empresa_id', 'producto_id', 'cantidad_minima']);
            $table->index(['empresa_id', 'producto_id', 'activo']);
            $table->index(['cantidad_minima', 'cantidad_maxima']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('precio_rango_cantidad_producto');
    }
};
