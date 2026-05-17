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
        // ✅ Agregar politica_pago a tabla proformas
        Schema::table('proformas', function (Blueprint $table) {
            $table->string('politica_pago')
                  ->default('CONTRA_ENTREGA')
                  ->after('tipo_entrega')
                  ->comment('Política de pago: CONTRA_ENTREGA, ANTICIPADO_100, MEDIO_MEDIO, CREDITO');

            // Agregar índice para búsquedas frecuentes
            $table->index('politica_pago');
            $table->index(['cliente_id', 'politica_pago']);
            $table->index(['estado_proforma_id', 'politica_pago']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proformas', function (Blueprint $table) {
            $table->dropIndex(['politica_pago']);
            $table->dropIndex(['cliente_id', 'politica_pago']);
            $table->dropIndex(['estado_proforma_id', 'politica_pago']);
            $table->dropColumn('politica_pago');
        });
    }
};
