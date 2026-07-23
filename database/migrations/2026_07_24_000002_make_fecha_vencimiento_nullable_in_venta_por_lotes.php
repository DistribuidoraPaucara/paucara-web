<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Algunos lotes pueden no tener fecha_vencimiento definida
     * Esta migración hace que fecha_vencimiento sea nullable.
     */
    public function up(): void
    {
        Schema::table('venta_por_lotes', function (Blueprint $table) {
            // Cambiar fecha_vencimiento a nullable
            $table->date('fecha_vencimiento')
                ->nullable()
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('venta_por_lotes', function (Blueprint $table) {
            // Revertir a NOT NULL
            $table->date('fecha_vencimiento')
                ->nullable(false)
                ->change();
        });
    }
};
