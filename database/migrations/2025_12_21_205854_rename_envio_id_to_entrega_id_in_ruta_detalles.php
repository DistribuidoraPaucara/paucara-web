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
        // El FK ya fue eliminado en migración 2025_12_06_232000_make_envio_id_nullable
        // Solo renombrar la columna
        if (Schema::hasColumn('ruta_detalles', 'envio_id')) {
            Schema::table('ruta_detalles', function (Blueprint $table) {
                $table->renameColumn('envio_id', 'entrega_id');
            });

            // Agregar nuevo foreign key a entregas
            Schema::table('ruta_detalles', function (Blueprint $table) {
                $table->foreign('entrega_id')->references('id')->on('entregas')->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('ruta_detalles', 'entrega_id')) {
            Schema::table('ruta_detalles', function (Blueprint $table) {
                // Drop foreign key constraint en entrega_id
                $table->dropForeign(['entrega_id']);

                // Rename column back: entrega_id → envio_id
                $table->renameColumn('entrega_id', 'envio_id');
            });
        }
    }
};
