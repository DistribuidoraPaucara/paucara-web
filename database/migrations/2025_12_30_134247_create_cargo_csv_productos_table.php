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
        Schema::create('cargo_csv_productos', function (Blueprint $table) {
            $table->id();

            // Usuario que realizó la carga
            $table->foreignId('usuario_id')->constrained('users')->cascadeOnDelete();

            // Información del archivo
            $table->string('nombre_archivo');
            $table->string('hash_archivo', 64)->unique(); // SHA256 para deduplicación

            // Estadísticas
            $table->integer('cantidad_filas')->default(0);
            $table->integer('cantidad_validas')->default(0);
            $table->integer('cantidad_errores')->default(0);

            // Estado del procesamiento
            $table->enum('estado', ['pendiente', 'procesado', 'cancelado', 'revertido'])->default('pendiente');

            // JSON fields para trazabilidad
            $table->longText('datos_json')->nullable(); // CSV original completo
            $table->longText('errores_json')->nullable(); // Errores de validación por fila
            $table->longText('cambios_json')->nullable(); // Detalles: productos creados/actualizados

            // Información de reversión
            $table->foreignId('revertido_por_usuario_id')->nullable()->constrained('users');
            $table->dateTime('fecha_reversion')->nullable();
            $table->text('motivo_reversion')->nullable();

            // Timestamps
            $table->timestamps();

            // Índices para búsqueda rápida
            $table->index(['usuario_id']);
            $table->index(['estado']);
            $table->index(['created_at']);
            $table->index(['hash_archivo']); // Para deduplicación
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cargo_csv_productos');
    }
};
