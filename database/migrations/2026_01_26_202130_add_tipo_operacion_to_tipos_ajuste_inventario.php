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
        Schema::table('tipos_ajuste_inventario', function (Blueprint $table) {
            $table->enum('tipo_operacion', ['entrada', 'salida', 'ambos'])->default('ambos')->after('label');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tipos_ajuste_inventario', function (Blueprint $table) {
            $table->dropColumn('tipo_operacion');
        });
    }
};
