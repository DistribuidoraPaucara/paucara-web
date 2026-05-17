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
            // ✅ Eliminar el índice único anterior que solo tenía (producto_id, tipo_precio_id)
            $table->dropUnique('uq_precios_producto_id_tipo');

            // ✅ Agregar nuevo índice único que incluya unidad_medida_id
            // Permite múltiples precios del mismo tipo pero con diferentes unidades
            $table->unique(
                ['producto_id', 'tipo_precio_id', 'unidad_medida_id'],
                'uq_precios_producto_id_tipo_unidad'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('precios_producto', function (Blueprint $table) {
            // Revertir al índice anterior
            $table->dropUnique('uq_precios_producto_id_tipo_unidad');

            $table->unique(
                ['producto_id', 'tipo_precio_id'],
                'uq_precios_producto_id_tipo'
            );
        });
    }
};
