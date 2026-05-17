<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * ✅ Agregar columna updated_at a tabla historial_estados
     * Esta columna es necesaria para el Eloquent model que usa timestamps
     */
    public function up(): void
    {
        Schema::table('historial_estados', function (Blueprint $table) {
            // Agregar updated_at si no existe
            if (!Schema::hasColumn('historial_estados', 'updated_at')) {
                $table->timestamp('updated_at')
                    ->default(now())
                    ->after('created_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('historial_estados', function (Blueprint $table) {
            if (Schema::hasColumn('historial_estados', 'updated_at')) {
                $table->dropColumn('updated_at');
            }
        });
    }
};
