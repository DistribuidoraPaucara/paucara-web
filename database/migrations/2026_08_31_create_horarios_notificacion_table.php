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
        Schema::create('horarios_notificacion', function (Blueprint $table) {
            $table->id();

            // Relación con notificación recurrente
            $table->foreignId('notificacion_recurrente_id')
                  ->constrained('notificaciones_recurrentes')
                  ->onDelete('cascade');

            // Horario
            $table->time('hora');
            $table->boolean('activo')->default(true);

            // Seguimiento (cuando fue enviada por última vez a esta hora específica)
            $table->timestamp('ultimo_envio')->nullable();

            $table->timestamps();

            // Índices
            $table->index('notificacion_recurrente_id');
            $table->index('hora');
            $table->index('activo');

            // Unique: una notificación no debe tener 2 horarios iguales
            $table->unique(['notificacion_recurrente_id', 'hora']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('horarios_notificacion');
    }
};
