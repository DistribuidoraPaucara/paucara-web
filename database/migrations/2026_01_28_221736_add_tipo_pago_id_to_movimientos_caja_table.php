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
        Schema::table('movimientos_caja', function (Blueprint $table) {
            // ✅ Agregar columna para registrar tipo de pago (EFECTIVO, TRANSFERENCIA, CREDITO, etc)
            $table->foreignId('tipo_pago_id')
                ->nullable()
                ->after('tipo_operacion_id')
                ->constrained('tipos_pago')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_caja', function (Blueprint $table) {
            $table->dropForeignKeyIfExists(['tipo_pago_id']);
            $table->dropColumn('tipo_pago_id');
        });
    }
};
