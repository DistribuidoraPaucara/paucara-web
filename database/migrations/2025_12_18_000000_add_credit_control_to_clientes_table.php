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
        // ✅ Agregar control de crédito a tabla clientes
        Schema::table('clientes', function (Blueprint $table) {
            // Campo para controlar si el cliente puede o no tener créditos
            if (!Schema::hasColumn('clientes', 'puede_tener_credito')) {
                $table->boolean('puede_tener_credito')
                    ->default(false)
                    ->after('limite_credito')
                    ->comment('Indica si el cliente está habilitado para usar crédito');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar columna de control de crédito
        Schema::table('clientes', function (Blueprint $table) {
            if (Schema::hasColumn('clientes', 'puede_tener_credito')) {
                $table->dropColumn('puede_tener_credito');
            }
        });
    }
};
