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
        Schema::table('cuentas_por_cobrar', function (Blueprint $table) {
            // Hacer venta_id nullable para créditos manuales sin venta registrada
            $table->unsignedBigInteger('venta_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cuentas_por_cobrar', function (Blueprint $table) {
            // Revertir venta_id a NOT NULL
            $table->unsignedBigInteger('venta_id')->change();
        });
    }
};
