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
            // ✅ Agregar tipo_pago_id para asociar tipo de pago a movimientos
            if (!Schema::hasColumn('movimientos_caja', 'tipo_pago_id')) {
                $table->foreignId('tipo_pago_id')->nullable()->constrained('tipos_pago')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_caja', function (Blueprint $table) {
            if (Schema::hasColumn('movimientos_caja', 'tipo_pago_id')) {
                $table->dropForeign(['tipo_pago_id']);
                $table->dropColumn('tipo_pago_id');
            }
        });
    }
};
