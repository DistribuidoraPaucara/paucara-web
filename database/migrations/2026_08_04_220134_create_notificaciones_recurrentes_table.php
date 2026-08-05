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
        Schema::create('notificaciones_recurrentes', function (Blueprint $table) {
            $table->id();

            // Contenido
            $table->string('titulo', 255);
            $table->text('descripcion');
            $table->enum('tipo', ['promocion', 'informativo', 'evento', 'oferta', 'otro'])->default('informativo');

            // Recurrencia
            $table->enum('frecuencia', ['una_vez', 'diario', 'semanal', 'mensual'])->default('diario');
            $table->time('hora_envio')->default('08:00'); // Hora del día para enviar
            $table->json('dias_semana')->nullable(); // Para semanal: [1,3,5] = Lun, Mié, Vie
            $table->integer('dia_mes')->nullable(); // Para mensual: día del mes (1-31)

            // Vigencia
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->timestamp('ultimo_envio')->nullable();
            $table->boolean('activo')->default(true);

            // Seguimiento
            $table->integer('total_enviadas')->default(0);
            $table->integer('vistas')->default(0);

            // Administrador
            $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade');

            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('activo');
            $table->index('frecuencia');
            $table->index('fecha_inicio');
            $table->index('fecha_fin');
            $table->index('ultimo_envio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notificaciones_recurrentes');
    }
};
