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
        // Crear tabla rutas si no existe
        if (!Schema::hasTable('rutas')) {
            Schema::create('rutas', function (Blueprint $table) {
                $table->id();
                $table->string('codigo')->unique();
                $table->date('fecha_ruta');
                $table->unsignedBigInteger('zona_id');
                $table->unsignedBigInteger('chofer_id');
                $table->unsignedBigInteger('vehiculo_id')->nullable();
                $table->enum('estado', ['planificada', 'en_progreso', 'completada', 'cancelada'])->default('planificada');
                $table->integer('cantidad_paradas')->default(0);
                $table->time('hora_salida')->nullable();
                $table->time('hora_llegada')->nullable();
                $table->decimal('distancia_km', 8, 2)->nullable();
                $table->integer('tiempo_estimado_minutos')->nullable();
                $table->integer('tiempo_real_minutos')->nullable();
                $table->text('observaciones')->nullable();
                $table->json('ruta_gps')->nullable();
                $table->unsignedBigInteger('creado_por')->nullable();

                // Relaciones
                $table->foreign('zona_id')->references('id')->on('zonas')->onDelete('cascade');
                $table->foreign('chofer_id')->references('id')->on('empleados')->onDelete('cascade');
                $table->foreign('vehiculo_id')->references('id')->on('vehiculos')->onDelete('set null');
                $table->foreign('creado_por')->references('id')->on('users')->onDelete('set null');

                $table->timestamps();
                $table->softDeletes();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rutas');
    }
};
