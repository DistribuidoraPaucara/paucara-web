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
        Schema::table('pagos', function (Blueprint $table) {
            // ✅ NUEVO: Agregar caja_id para saber a qué caja pertenece el pago
            $table->foreignId('caja_id')
                ->nullable()
                ->after('cuenta_por_cobrar_id')
                ->constrained('cajas')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pagos', function (Blueprint $table) {
            $table->dropForeignIdFor('Caja');
            $table->dropColumn('caja_id');
        });
    }
};
