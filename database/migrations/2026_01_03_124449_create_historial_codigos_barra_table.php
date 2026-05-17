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
        Schema::create('historial_codigos_barra', function (Blueprint $table) {
            $table->id();

            // Relación con código de barra
            $table->unsignedBigInteger('codigo_barra_id');
            $table->foreign('codigo_barra_id')
                ->references('id')
                ->on('codigos_barra')
                ->onDelete('cascade');

            // Relación con producto (desnormalizado para consultas rápidas)
            $table->unsignedBigInteger('producto_id');
            $table->foreign('producto_id')
                ->references('id')
                ->on('productos')
                ->onDelete('cascade');

            // Información del cambio
            $table->enum('tipo_evento', [
                'CREADO',
                'ACTUALIZADO',
                'MARCADO_PRINCIPAL',
                'DESMARCADO_PRINCIPAL',
                'INACTIVADO',
                'REACTIVADO',
            ])->default('ACTUALIZADO');

            // Valores antes/después (JSON para flexibilidad)
            $table->json('valores_anteriores')->nullable();
            $table->json('valores_nuevos')->nullable();

            // Campos específicos para búsquedas rápidas
            $table->string('codigo_anterior')->nullable();
            $table->string('codigo_nuevo')->nullable();
            $table->boolean('es_principal_anterior')->nullable();
            $table->boolean('es_principal_nuevo')->nullable();
            $table->boolean('activo_anterior')->nullable();
            $table->boolean('activo_nuevo')->nullable();

            // Razón/Motivo del cambio
            $table->string('razon', 255)->nullable();
            $table->text('descripcion')->nullable();

            // Usuario que realizó el cambio
            $table->unsignedBigInteger('usuario_id')->nullable();
            $table->foreign('usuario_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            $table->string('usuario_nombre')->nullable(); // Para casos sin usuario

            // Timestamps
            $table->timestamp('fecha_evento')->useCurrent();
            $table->timestamps();

            // Índices
            $table->index('codigo_barra_id');
            $table->index('producto_id');
            $table->index('usuario_id');
            $table->index('tipo_evento');
            $table->index('fecha_evento');
            $table->index(['producto_id', 'fecha_evento']);
            $table->index(['codigo_barra_id', 'tipo_evento']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_codigos_barra');
    }
};
