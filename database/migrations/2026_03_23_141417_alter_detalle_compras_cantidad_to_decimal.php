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
        Schema::table('detalle_compras', function (Blueprint $table) {
            // Cambiar cantidad de integer a decimal(18, 6)
            // MySQL NO almacena ceros innecesarios:
            // - 10 se guarda como 10 (no 10.000000)
            // - 10.3525255 se guarda como 10.352526 (máx 6 decimales)
            $table->decimal('cantidad', 18, 6)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('detalle_compras', function (Blueprint $table) {
            // Revertir a integer si es necesario
            $table->integer('cantidad')->change();
        });
    }
};
