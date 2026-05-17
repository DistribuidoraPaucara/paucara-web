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
        Schema::table('tipos_pago', function (Blueprint $table) {
            // Indicar si este tipo de pago es crédito
            $table->boolean('es_credito')->default(false)->after('activo');
        });

        // Actualizar tipos de pago existentes basado en código
        \Illuminate\Support\Facades\DB::table('tipos_pago')
            ->where('codigo', 'CREDITO')
            ->update(['es_credito' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tipos_pago', function (Blueprint $table) {
            $table->dropColumn('es_credito');
        });
    }
};
