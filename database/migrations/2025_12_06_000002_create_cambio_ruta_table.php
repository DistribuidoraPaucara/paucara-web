<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Tabla de auditoría para rastrear cambios en rutas
     * (cancelaciones, adiciones, cambios de chofer, etc.)
     */
    public function up(): void
    {
        Schema::create('cambio_ruta', function (Blueprint $table) {
            $table->id();

            // Referencia a la ruta modificada
            $table->foreignId('ruta_id')
                ->constrained('rutas')
                ->onDelete('cascade');

            // Tipo de cambio realizado
            $table->enum('tipo', [
                'PARADA_AGREGADA',      // Se agregó una nueva parada
                'PARADA_ELIMINADA',     // Se canceló una parada
                'PARADA_REPROGRAMADA',  // Se movió a otra fecha
                'CHOFER_CAMBIADO',      // Se asignó otro chofer
                'VEHICULO_CAMBIADO',    // Se cambió el vehículo
                'ZONA_CAMBIADA',        // Se cambió la zona
                'RUTA_CANCELADA'        // Se canceló toda la ruta
            ]);

            // Razón del cambio
            $table->text('razon')->nullable();

            // Usuario que realizó el cambio
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            // Impacto del cambio
            $table->decimal('impacto_km', 10, 2)->nullable();      // Km adicionales/menos
            $table->integer('impacto_minutos')->nullable();        // Minutos adicionales/menos

            // Detalles del cambio (JSON para flexibilidad)
            $table->json('detalles')->nullable();  // ej: { "parada_id": 5, "secuencia_anterior": 3 }

            // Fecha del cambio
            $table->timestamp('fecha_cambio')->useCurrent();

            // Índices
            $table->index('ruta_id');
            $table->index('user_id');
            $table->index('fecha_cambio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cambio_ruta');
    }
};
