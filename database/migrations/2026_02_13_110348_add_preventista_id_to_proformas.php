<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agregar preventista_id para asignar proforma a un usuario preventista
     */
    public function up(): void
    {
        Schema::table('proformas', function (Blueprint $table) {
            // ✅ FK a users (preventista responsable de la proforma)
            $table->foreignId('preventista_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->after('usuario_creador_id');

            // ✅ Índice para búsquedas rápidas
            $table->index('preventista_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proformas', function (Blueprint $table) {
            $table->dropForeignKey(['preventista_id']);
            $table->dropIndex(['preventista_id']);
            $table->dropColumn('preventista_id');
        });
    }
};
