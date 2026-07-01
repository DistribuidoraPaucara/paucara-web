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
        Schema::table('estados_logistica', function (Blueprint $table) {
            // Agregar FK al estado anterior
            $table->foreignId('estado_anterior_id')
                ->nullable()
                ->after('icono')
                ->constrained('estados_logistica')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('estados_logistica', function (Blueprint $table) {
            $table->dropForeignIdFor('estados_logistica', 'estado_anterior_id');
            $table->dropColumn('estado_anterior_id');
        });
    }
};
