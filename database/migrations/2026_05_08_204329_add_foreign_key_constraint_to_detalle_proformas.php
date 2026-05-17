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
        Schema::table('detalle_proformas', function (Blueprint $table) {
            // Primero eliminar la llave foránea existente si existe
            $table->dropForeign(['producto_id']);
        });

        // Luego recrearla con la restricción correcta (RESTRICT)
        Schema::table('detalle_proformas', function (Blueprint $table) {
            $table->foreign('producto_id')
                ->references('id')
                ->on('productos')
                ->restrictOnDelete(); // Impide eliminar si hay referencias
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('detalle_proformas', function (Blueprint $table) {
            $table->dropForeign(['producto_id']);

            // Restaurar a la llave foránea original sin restricción
            $table->foreign('producto_id')
                ->references('id')
                ->on('productos');
        });
    }
};
