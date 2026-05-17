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
            // Agregar restricción UNIQUE para evitar duplicados en la combinación producto_id + tipo_precio_id
            // Solo considera registros activos (where activo = 1)
            $table->unique(
                ['producto_id', 'tipo_precio_id'],
                'uq_precios_producto_id_tipo'
            )->where('activo', true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('precios_producto', function (Blueprint $table) {
            // Eliminar la restricción UNIQUE
            $table->dropUnique('uq_precios_producto_id_tipo');
        });
    }
};
