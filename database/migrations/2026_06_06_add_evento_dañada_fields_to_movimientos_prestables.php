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
        Schema::table('movimientos_prestables', function (Blueprint $table) {
            // ✅ NUEVO: Campos para registrar cantidades dañadas por evento
            if (!Schema::hasColumn('movimientos_prestables', 'cantidad_evento_dañada_anterior')) {
                $table->integer('cantidad_evento_dañada_anterior')->default(0)->after('prestamo_evento_anterior');
            }
            if (!Schema::hasColumn('movimientos_prestables', 'cantidad_evento_dañada_posterior')) {
                $table->integer('cantidad_evento_dañada_posterior')->default(0)->after('prestamo_evento_posterior');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_prestables', function (Blueprint $table) {
            if (Schema::hasColumn('movimientos_prestables', 'cantidad_evento_dañada_anterior')) {
                $table->dropColumn('cantidad_evento_dañada_anterior');
            }
            if (Schema::hasColumn('movimientos_prestables', 'cantidad_evento_dañada_posterior')) {
                $table->dropColumn('cantidad_evento_dañada_posterior');
            }
        });
    }
};
