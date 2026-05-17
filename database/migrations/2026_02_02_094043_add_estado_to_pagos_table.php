<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Agregar campo estado para rastrear pagos REGISTRADOS vs ANULADOS
     */
    public function up(): void
    {
        Schema::table('pagos', function (Blueprint $table) {
            // Agregar campo estado con valores: REGISTRADO, ANULADO
            $table->string('estado')->default('REGISTRADO')->after('moneda_id');

            // Índice para búsquedas rápidas
            $table->index('estado');
        });

        // Actualizar pagos existentes a REGISTRADO (por defecto ya está)
        // No necesario porque el default es REGISTRADO
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pagos', function (Blueprint $table) {
            $table->dropIndex(['estado']);
            $table->dropColumn('estado');
        });
    }
};
