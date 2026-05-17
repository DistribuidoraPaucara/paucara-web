<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ✅ IMPORTANTE: Primero actualizar NULL a 0 antes de hacer NOT NULL
        DB::table('historial_precios')
            ->whereNull('porcentaje_cambio')
            ->update(['porcentaje_cambio' => 0]);

        Schema::table('historial_precios', function (Blueprint $table) {
            $table->decimal('porcentaje_cambio', 10, 2)->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('historial_precios', function (Blueprint $table) {
            $table->decimal('porcentaje_cambio', 5, 2)->change();
        });
    }
};
