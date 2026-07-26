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
        Schema::table('detalle_egresos', function (Blueprint $table) {
            $table->foreignId('tipo_operacion_caja_id')->nullable()->constrained('tipo_operacion_caja');
            $table->decimal('monto_efectivo', 12, 2)->default(0);
            $table->decimal('monto_transferencia', 12, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('detalle_egresos', function (Blueprint $table) {
            $table->dropForeignIdFor('tipo_operacion_caja', 'tipo_operacion_caja_id');
            $table->dropColumn(['tipo_operacion_caja_id', 'monto_efectivo', 'monto_transferencia']);
        });
    }
};
