<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Convierte la columna entregador (string) en una relación con el modelo User (rol chofer)
     */
    public function up(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            // Agregar nueva columna entregador_id como foreign key a users
            $table->unsignedBigInteger('entregador_id')
                ->nullable()
                ->after('chofer_id')
                ->comment('ID del usuario con rol chofer que realiza la entrega');

            // Agregar foreign key constraint
            $table->foreign('entregador_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            // Eliminar foreign key
            $table->dropForeign(['entregador_id']);
            // Eliminar columna
            $table->dropColumn('entregador_id');
        });
    }
};
