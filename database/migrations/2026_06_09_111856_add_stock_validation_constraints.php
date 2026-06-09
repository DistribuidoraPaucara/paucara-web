<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ✅ Agregar constraints a stock_productos (PostgreSQL)
        // Estos constraints previenen inconsistencias de datos a nivel de BD

        try {
            DB::statement('ALTER TABLE stock_productos ADD CONSTRAINT chk_cantidad_no_negativa CHECK (cantidad >= 0)');
        } catch (\Exception $e) {
            // Ya existe, ignorar
        }

        try {
            DB::statement('ALTER TABLE stock_productos ADD CONSTRAINT chk_cantidad_reservada_no_negativa CHECK (cantidad_reservada >= 0)');
        } catch (\Exception $e) {
            // Ya existe, ignorar
        }

        try {
            DB::statement('ALTER TABLE stock_productos ADD CONSTRAINT chk_cantidad_disponible_no_negativa CHECK (cantidad_disponible >= 0)');
        } catch (\Exception $e) {
            // Ya existe, ignorar
        }

        try {
            DB::statement('ALTER TABLE stock_productos ADD CONSTRAINT chk_suma_consistente CHECK (cantidad = (cantidad_disponible + cantidad_reservada))');
        } catch (\Exception $e) {
            // Ya existe, ignorar
        }

        // ✅ Agregar constraints a movimientos_inventario (PostgreSQL)
        // Nota: Estos constraints validan la auditoría de antes/después
        try {
            DB::statement('ALTER TABLE movimientos_inventario ADD CONSTRAINT chk_suma_anterior CHECK (cantidad_total_anterior = (cantidad_disponible_anterior + cantidad_reservada_anterior))');
        } catch (\Exception $e) {
            // Ya existe, ignorar
        }

        try {
            DB::statement('ALTER TABLE movimientos_inventario ADD CONSTRAINT chk_suma_posterior CHECK (cantidad_total_posterior = (cantidad_disponible_posterior + cantidad_reservada_posterior))');
        } catch (\Exception $e) {
            // Ya existe, ignorar
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remover constraints (PostgreSQL)
        DB::statement('ALTER TABLE stock_productos DROP CONSTRAINT IF EXISTS chk_cantidad_no_negativa');
        DB::statement('ALTER TABLE stock_productos DROP CONSTRAINT IF EXISTS chk_cantidad_reservada_no_negativa');
        DB::statement('ALTER TABLE stock_productos DROP CONSTRAINT IF EXISTS chk_cantidad_disponible_no_negativa');
        DB::statement('ALTER TABLE stock_productos DROP CONSTRAINT IF EXISTS chk_suma_consistente');

        DB::statement('ALTER TABLE movimientos_inventario DROP CONSTRAINT IF EXISTS chk_suma_anterior');
        DB::statement('ALTER TABLE movimientos_inventario DROP CONSTRAINT IF EXISTS chk_suma_posterior');
    }
};
