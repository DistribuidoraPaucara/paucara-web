<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * ✅ NUEVO (2026-02-18): Agregar unidad base para registrar qué unidad se usó en almacenamiento
     * Permite rastrear conversiones completas: unidad_venta_id → unidad_base_id con factor_conversion
     */
    public function up(): void
    {
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            $table->unsignedBigInteger('unidad_base_id')
                ->nullable()
                ->after('unidad_venta_id')
                ->comment('ID de unidad base (almacenamiento) cuando se aplica conversión');

            // FK a unidades_medida
            $table->foreign('unidad_base_id')
                ->references('id')
                ->on('unidades_medida')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            // Eliminar FK antes de eliminar columna
            $table->dropForeign(['unidad_base_id']);

            // Eliminar columna
            $table->dropColumn('unidad_base_id');
        });
    }
};
