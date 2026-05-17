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
        Schema::table('entregas', function (Blueprint $table) {
            // Agregar campos solo si no existen
            if (!Schema::hasColumn('entregas', 'fecha_programada')) {
                $table->datetime('fecha_programada')->nullable()->after('fecha_entrega');
            }
            if (!Schema::hasColumn('entregas', 'direccion_entrega')) {
                $table->text('direccion_entrega')->nullable()->after('direccion_cliente_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            $table->dropColumn(['fecha_programada', 'direccion_entrega']);
        });
    }
};
