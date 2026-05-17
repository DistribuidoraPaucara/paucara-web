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
        Schema::table('ventas', function (Blueprint $table) {
            // ✅ Agregar relación a empresa de logística
            $table->foreignId('empresa_logistica_id')
                ->nullable()
                ->after('estado_logistico_id')
                ->constrained('empresas')
                ->comment('Empresa de logística seleccionada para el envío');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropForeignKey(['empresa_logistica_id']);
            $table->dropColumn('empresa_logistica_id');
        });
    }
};
