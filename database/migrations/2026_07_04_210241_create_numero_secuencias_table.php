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
        Schema::create('numero_secuencias', function (Blueprint $table) {
            $table->id();
            $table->string('tipo'); // 'VENTA', 'PROFORMA', 'COMPRA', etc.
            $table->date('fecha'); // Fecha para resetear secuencia diaria
            $table->bigInteger('secuencial')->default(0); // Contador que se incrementa
            $table->timestamps();

            // Índice único: por tipo + fecha (una secuencia por día/tipo)
            $table->unique(['tipo', 'fecha']);
            // Índice para búsquedas rápidas por tipo
            $table->index(['tipo', 'fecha']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('numero_secuencias');
    }
};
