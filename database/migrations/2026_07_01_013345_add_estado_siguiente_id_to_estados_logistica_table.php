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
            // Agregar FK al estado siguiente
            $table->foreignId('estado_siguiente_id')
                ->nullable()
                ->after('estado_anterior_id')
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
            $table->dropForeignIdFor('estados_logistica', 'estado_siguiente_id');
            $table->dropColumn('estado_siguiente_id');
        });
    }
};
