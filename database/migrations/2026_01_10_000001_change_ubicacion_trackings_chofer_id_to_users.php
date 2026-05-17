<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Cambia la FK de chofer_id de choferes_legacy a users
     */
    public function up(): void
    {
        Schema::table('ubicacion_trackings', function (Blueprint $table) {
            // Eliminar la constraint anterior
            $table->dropForeign(['chofer_id']);

            // Agregar la nueva constraint apuntando a users
            $table->foreign('chofer_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ubicacion_trackings', function (Blueprint $table) {
            // Revertir al estado anterior
            $table->dropForeign(['chofer_id']);

            $table->foreign('chofer_id')
                ->references('id')
                ->on('choferes_legacy');
        });
    }
};
