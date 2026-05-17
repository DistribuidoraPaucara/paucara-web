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
        Schema::table('tipo_operacion_caja', function (Blueprint $table) {
            // ✅ NUEVO: Columna para clasificar operaciones como ENTRADA/SALIDA/AJUSTE
            // Esto permite filtrar mejor en CierreCajaService sin lógica hardcodeada
            $table->enum('direccion', ['ENTRADA', 'SALIDA', 'AJUSTE', 'ESPECIAL'])
                ->nullable()
                ->after('nombre')
                ->comment('Dirección del flujo de dinero: ENTRADA (ingresos), SALIDA (egresos), AJUSTE (especiales)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tipo_operacion_caja', function (Blueprint $table) {
            $table->dropColumn('direccion');
        });
    }
};
