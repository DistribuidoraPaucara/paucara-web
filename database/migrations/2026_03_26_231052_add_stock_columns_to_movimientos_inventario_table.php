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
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            // ✅ NUEVO (2026-03-26): Columnas para registrar cómo cada movimiento afecta las 3 métricas de stock
            $table->decimal('cantidad_total_anterior', 10, 2)->nullable()->default(0)->comment('Cantidad total ANTES del movimiento');
            $table->decimal('cantidad_total_posterior', 10, 2)->nullable()->default(0)->comment('Cantidad total DESPUÉS del movimiento');
            $table->decimal('cantidad_disponible_anterior', 10, 2)->nullable()->default(0)->comment('Cantidad disponible ANTES del movimiento');
            $table->decimal('cantidad_disponible_posterior', 10, 2)->nullable()->default(0)->comment('Cantidad disponible DESPUÉS del movimiento');
            $table->decimal('cantidad_reservada_anterior', 10, 2)->nullable()->default(0)->comment('Cantidad reservada ANTES del movimiento');
            $table->decimal('cantidad_reservada_posterior', 10, 2)->nullable()->default(0)->comment('Cantidad reservada DESPUÉS del movimiento');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            $table->dropColumn([
                'cantidad_total_anterior',
                'cantidad_total_posterior',
                'cantidad_disponible_anterior',
                'cantidad_disponible_posterior',
                'cantidad_reservada_anterior',
                'cantidad_reservada_posterior',
            ]);
        });
    }
};
