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
        Schema::table('entregas', function (Blueprint $table) {
            // Cambiar la relación de chofer_id de choferes_legacy a empleados
            // Primero eliminar la constraint existente
            $table->dropForeign(['chofer_id']);

            // Agregar nueva constraint apuntando a empleados
            $table->foreign('chofer_id')
                ->references('id')
                ->on('empleados')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            // Revertir a la constraint original
            $table->dropForeign(['chofer_id']);

            $table->foreign('chofer_id')
                ->references('id')
                ->on('choferes_legacy')
                ->onDelete('set null');
        });
    }
};
