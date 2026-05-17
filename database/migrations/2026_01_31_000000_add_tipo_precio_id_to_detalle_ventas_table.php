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
        Schema::table('detalle_ventas', function (Blueprint $table) {
            // ✅ NUEVO: Agregar referencia al tipo de precio seleccionado
            $table->foreignId('tipo_precio_id')->nullable()->constrained('tipos_precio')->onDelete('set null');

            // ✅ NUEVO: Guardar el nombre del tipo de precio para referencia rápida
            $table->string('tipo_precio_nombre')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('detalle_ventas', function (Blueprint $table) {
            $table->dropForeignIdFor('tipo_precios', 'tipo_precio_id');
            $table->dropColumn('tipo_precio_id');
            $table->dropColumn('tipo_precio_nombre');
        });
    }
};
