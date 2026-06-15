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
        Schema::table('entregas_venta_confirmaciones', function (Blueprint $table) {
            // ✅ Actualizar tipo_confirmacion para aceptar valores específicos
            // COMPLETA, RECHAZADO, CLIENTE_CERRADO, DEVOLUCION_PARCIAL, NO_CONTACTADO
            $table->string('tipo_confirmacion')->nullable()->change();

            // ✅ Deprecar tipo_novedad (mantener para compatibilidad temporal)
            // Se debe usar tipo_confirmacion en su lugar
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas_venta_confirmaciones', function (Blueprint $table) {
            // Revertir cambios si es necesario
            $table->string('tipo_confirmacion')->nullable()->change();
        });
    }
};
