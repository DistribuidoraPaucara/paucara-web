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
        Schema::table('precios_producto', function (Blueprint $table) {
            // Agregar columna unidad_medida_id para diferenciar precios por unidad
            $table->foreignId('unidad_medida_id')
                ->nullable()
                ->after('tipo_precio_id')
                ->constrained('unidades_medida')
                ->nullOnDelete();

            // Crear índice compuesto para búsquedas rápidas
            $table->index(['producto_id', 'tipo_precio_id', 'unidad_medida_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('precios_producto', function (Blueprint $table) {
            // Eliminar índice
            $table->dropIndex(['producto_id', 'tipo_precio_id', 'unidad_medida_id']);

            // Eliminar columna
            $table->dropConstrainedForeignId('unidad_medida_id');
        });
    }
};
