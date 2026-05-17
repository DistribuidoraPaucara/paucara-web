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
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            // Agregar columna de relación con ajustes_inventario
            $table->foreignId('ajuste_inventario_id')
                ->nullable()
                ->constrained('ajustes_inventario')
                ->onDelete('cascade')
                ->after('numero_documento')
                ->comment('Relación con ajuste de inventario');

            // Agregar índice para búsquedas rápidas
            $table->index('ajuste_inventario_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            $table->dropForeignKeyIfExists(['ajuste_inventario_id']);
            $table->dropIndex(['ajuste_inventario_id']);
            $table->dropColumn('ajuste_inventario_id');
        });
    }
};
