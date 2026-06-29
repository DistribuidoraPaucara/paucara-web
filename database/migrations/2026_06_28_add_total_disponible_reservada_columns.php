<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * ✅ NUEVO (2026-06-28): Agregar columnas para trazabilidad COMPLETA del stock
     *
     * Ahora cada movimiento registra:
     *
     * DEL LOTE ESPECÍFICO:
     * - cantidad_anterior / cantidad_posterior (lote)
     * - cantidad_disponible_anterior / posterior (del lote)
     * - cantidad_reservada_anterior / posterior (del lote)
     *
     * DEL TOTAL DE TODOS LOS LOTES (suma):
     * - cantidad_total_anterior / cantidad_total_posterior (suma de todos)
     * - disponible_total_anterior / disponible_total_posterior (suma de todos) ← NUEVO
     * - reservada_total_anterior / reservada_total_posterior (suma de todos) ← NUEVO
     */
    public function up(): void
    {
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            // ✅ NUEVO: Sumatorias TOTALES de disponible (todos los lotes)
            $table->decimal('disponible_total_anterior', 10, 2)
                ->nullable()
                ->default(0)
                ->comment('Cantidad DISPONIBLE TOTAL (suma de todos los lotes) ANTES del movimiento')
                ->after('cantidad_disponible_posterior');

            $table->decimal('disponible_total_posterior', 10, 2)
                ->nullable()
                ->default(0)
                ->comment('Cantidad DISPONIBLE TOTAL (suma de todos los lotes) DESPUÉS del movimiento')
                ->after('disponible_total_anterior');

            // ✅ NUEVO: Sumatorias TOTALES de reservada (todos los lotes)
            $table->decimal('reservada_total_anterior', 10, 2)
                ->nullable()
                ->default(0)
                ->comment('Cantidad RESERVADA TOTAL (suma de todos los lotes) ANTES del movimiento')
                ->after('cantidad_reservada_posterior');

            $table->decimal('reservada_total_posterior', 10, 2)
                ->nullable()
                ->default(0)
                ->comment('Cantidad RESERVADA TOTAL (suma de todos los lotes) DESPUÉS del movimiento')
                ->after('reservada_total_anterior');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            $table->dropColumn([
                'disponible_total_anterior',
                'disponible_total_posterior',
                'reservada_total_anterior',
                'reservada_total_posterior',
            ]);
        });
    }
};
