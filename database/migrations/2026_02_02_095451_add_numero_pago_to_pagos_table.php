<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Agregar número único y secuencial de pago para trazabilidad
     */
    public function up(): void
    {
        Schema::table('pagos', function (Blueprint $table) {
            // Agregar número de pago único
            $table->string('numero_pago')->nullable()->unique()->after('id');

            // Índice para búsquedas rápidas
            $table->index('numero_pago');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pagos', function (Blueprint $table) {
            $table->dropUnique(['numero_pago']);
            $table->dropIndex(['numero_pago']);
            $table->dropColumn('numero_pago');
        });
    }
};
