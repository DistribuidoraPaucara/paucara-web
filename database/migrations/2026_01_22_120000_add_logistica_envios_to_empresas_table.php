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
        Schema::table('empresas', function (Blueprint $table) {
            // ✅ Agregar columna para habilitar/deshabilitar logística de envíos
            $table->boolean('logistica_envios')->default(false)->after('activo')->comment('¿Habilita envíos con empresa logística?');

            // Índice para búsquedas rápidas
            $table->index('logistica_envios');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            $table->dropIndex(['logistica_envios']);
            $table->dropColumn('logistica_envios');
        });
    }
};
