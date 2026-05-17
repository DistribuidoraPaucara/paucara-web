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
        Schema::table('movimientos_prestables', function (Blueprint $table) {
            // Agregar columnas para registrar cantidades dañadas en devoluciones
            // Estas cantidades NO afectan el stock, solo son registro de auditoría
            $table->integer('cantidad_dañada_parcial')->default(0)->after('cantidad')->comment('Cantidad devuelta con daño parcial (no afecta stock)');
            $table->integer('cantidad_dañada_total')->default(0)->after('cantidad_dañada_parcial')->comment('Cantidad devuelta con daño total (no afecta stock)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_prestables', function (Blueprint $table) {
            $table->dropColumn(['cantidad_dañada_parcial', 'cantidad_dañada_total']);
        });
    }
};
