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
        Schema::table('cajas_auditoria', function (Blueprint $table) {
            // Agregar columna modo para distinguir entre bloqueo duro y advertencia suave
            $table->string('modo')->default('hard-block')->after('accion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cajas_auditoria', function (Blueprint $table) {
            $table->dropColumn('modo');
        });
    }
};
