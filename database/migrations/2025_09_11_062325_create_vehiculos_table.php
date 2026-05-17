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
        Schema::create('vehiculos', function (Blueprint $table) {
            $table->id();
            $table->string('placa')->unique();
            $table->string('marca');
            $table->string('modelo');
            $table->string('anho')->nullable();
            $table->decimal('capacidad_kg', 8, 2)->nullable();
            $table->decimal('capacidad_volumen', 8, 2)->nullable(); // m³
            $table->enum('estado', ['DISPONIBLE', 'EN_RUTA', 'MANTENIMIENTO', 'FUERA_SERVICIO'])
                ->default('DISPONIBLE');
            $table->foreignId('chofer_asignado_id')->nullable()->constrained('users');
            $table->text('observaciones')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
            // Índices
            $table->index('estado');
            $table->index('chofer_asignado_id');
            $table->index(['activo']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehiculos');
    }
};
