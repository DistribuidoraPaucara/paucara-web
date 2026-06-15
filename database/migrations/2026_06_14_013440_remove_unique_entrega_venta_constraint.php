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
        Schema::table('entregas_venta_confirmaciones', function (Blueprint $table) {
            // ✅ Remover restricción única para permitir N confirmaciones por venta (historial de intentos)
            $table->dropUnique('unique_entrega_venta');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas_venta_confirmaciones', function (Blueprint $table) {
            // ✅ Recrear restricción si es necesario revertir
            $table->unique(['entrega_id', 'venta_id'], 'unique_entrega_venta');
        });
    }
};
