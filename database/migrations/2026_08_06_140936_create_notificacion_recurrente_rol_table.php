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
        Schema::create('notificacion_recurrente_rol', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notificacion_recurrente_id')
                ->constrained('notificaciones_recurrentes')
                ->onDelete('cascade');
            $table->foreignId('role_id')
                ->constrained('roles')
                ->onDelete('cascade');
            $table->timestamps();

            // Evitar duplicados
            $table->unique(['notificacion_recurrente_id', 'role_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notificacion_recurrente_rol');
    }
};
