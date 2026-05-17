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
        Schema::create('entrega_cambios_estado', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('entrega_id')
                ->comment('ID de la entrega');
            $table->string('estado_anterior')
                ->comment('Estado anterior');
            $table->string('estado_nuevo')
                ->comment('Estado nuevo');
            $table->text('razon')->nullable()
                ->comment('Razón del cambio de estado');
            $table->unsignedBigInteger('usuario_id')->nullable()
                ->comment('ID del usuario que realizó el cambio');
            $table->timestamps();

            // Índices
            $table->foreign('entrega_id')
                ->references('id')
                ->on('entregas')
                ->onDelete('cascade');

            $table->foreign('usuario_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            $table->index('entrega_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entrega_cambios_estado');
    }
};
