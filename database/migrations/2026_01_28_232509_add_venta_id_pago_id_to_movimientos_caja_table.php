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
            // ✅ Agregar referencias a venta y pago para análisis de rango
            $table->unsignedBigInteger('venta_id')->nullable()->after('tipo_pago_id');
            $table->unsignedBigInteger('pago_id')->nullable()->after('venta_id');

            // ✅ Agregar foreign keys (opcionales, para integridad referencial)
            $table->foreign('venta_id')->references('id')->on('ventas')->onDelete('set null');
            $table->foreign('pago_id')->references('id')->on('pagos')->onDelete('set null');

            // ✅ Agregar índices para búsquedas rápidas
            $table->index('venta_id');
            $table->index('pago_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_caja', function (Blueprint $table) {
            // Eliminar foreign keys primero
            $table->dropForeign(['venta_id']);
            $table->dropForeign(['pago_id']);

            // Eliminar índices
            $table->dropIndex(['venta_id']);
            $table->dropIndex(['pago_id']);

            // Eliminar columnas
            $table->dropColumn(['venta_id', 'pago_id']);
        });
    }
};
