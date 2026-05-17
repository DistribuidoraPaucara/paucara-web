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
        Schema::create('zonas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique(); // Ej: "Zona Norte", "Zona Sur"
            $table->string('codigo')->unique()->nullable(); // Ej: "ZN", "ZS"
            $table->text('descripcion')->nullable(); // Descripción de la zona
            $table->json('localidades')->nullable(); // Array de localidades: ["La Paz", "Cochabamba"]
            $table->decimal('latitud_centro', 10, 8)->nullable(); // Coordenada centro de zona
            $table->decimal('longitud_centro', 11, 8)->nullable();
            $table->integer('tiempo_estimado_entrega')->nullable(); // Minutos promedio para entregas en zona
            $table->boolean('activa')->default(true);
            $table->unsignedBigInteger('preventista_id')->nullable(); // Preventista responsable de zona
            $table->foreign('preventista_id')->references('id')->on('empleados')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes(); // Para poder restaurar zonas eliminadas
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('zonas');
    }
};
