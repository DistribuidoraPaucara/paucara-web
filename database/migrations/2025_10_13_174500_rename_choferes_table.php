<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Solo renombrar la tabla si existe (usando el nombre correcto "chofers")
        if (Schema::hasTable('chofers')) {
            Schema::rename('chofers', 'choferes_legacy');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Solo renombrar de vuelta si existe la tabla legacy
        if (Schema::hasTable('choferes_legacy')) {
            Schema::rename('choferes_legacy', 'chofers');
        }
    }
};
