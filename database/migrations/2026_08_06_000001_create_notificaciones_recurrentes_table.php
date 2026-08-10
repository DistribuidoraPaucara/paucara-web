<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notificaciones_recurrentes', function (Blueprint $table) {
            $table->id();
            $table->string('titulo', 255);
            $table->longText('descripcion');
            $table->enum('tipo', ['promocion', 'evento', 'informativo', 'oferta'])->default('informativo');

            // Recurrencia
            $table->enum('frecuencia', ['una_vez', 'diario', 'semanal', 'mensual'])->default('una_vez');
            $table->time('hora_envio'); // HH:mm
            $table->json('dias_semana')->nullable(); // ["lunes", "martes"] para semanal
            $table->unsignedSmallInteger('dia_mes')->nullable(); // 1-31 para mensual

            // Vigencia
            $table->date('fecha_inicio');
            $table->date('fecha_fin')->nullable();
            $table->boolean('activo')->default(true);

            // Estadísticas
            $table->unsignedInteger('total_enviadas')->default(0);
            $table->unsignedInteger('vistas')->default(0);
            $table->timestamp('ultimo_envio')->nullable();

            // Auditoría
            $table->foreignId('usuario_id')->constrained('users');
            $table->timestamps();

            // Índices para optimización
            $table->index(['activo', 'hora_envio']);
            $table->index(['frecuencia', 'activo']);
            $table->index(['fecha_inicio', 'fecha_fin']);
            $table->index('tipo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notificaciones_recurrentes');
    }
};
