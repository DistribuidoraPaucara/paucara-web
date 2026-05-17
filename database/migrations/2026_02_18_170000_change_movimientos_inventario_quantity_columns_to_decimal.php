<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * ✅ NUEVO (2026-02-18): Cambiar cantidad, cantidad_anterior y cantidad_posterior
     * de INTEGER a DECIMAL para soportar productos fraccionados.
     *
     * Ejemplo: Venta de 25 unidades de un producto fraccionado (1 caja = 56 unidades)
     * debe guardar cantidad = -0.44642857 (no -0 o 0)
     */
    public function up(): void
    {
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            // Cambiar de integer a decimal(14, 6) para permitir hasta 99,999,999.999999
            // con 6 decimales para precisión en conversiones
            // Permitir nullable porque la tabla puede tener datos legacy con NULLs
            $table->decimal('cantidad', 14, 6)->nullable()->change();
            $table->decimal('cantidad_anterior', 14, 6)->nullable()->change();
            $table->decimal('cantidad_posterior', 14, 6)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            // Revertir a integer
            $table->integer('cantidad')->change();
            $table->integer('cantidad_anterior')->change();
            $table->integer('cantidad_posterior')->change();
        });
    }
};
