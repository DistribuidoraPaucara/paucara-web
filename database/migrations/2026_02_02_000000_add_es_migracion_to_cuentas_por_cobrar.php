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
            // Marcar si es una CxC creada por migración
            $table->boolean('es_migracion')->default(false)->after('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cuentas_por_cobrar', function (Blueprint $table) {
            $table->dropColumn('es_migracion');
        });
    }
};
