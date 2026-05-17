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
        if (!Schema::hasTable('capabilities')) {
            Schema::create('capabilities', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique()->comment('Identificador único de la capacidad (ej: ventas, clientes)');
                $table->string('label')->comment('Etiqueta amigable para la UI');
                $table->text('description')->nullable()->comment('Descripción detallada de qué hace esta capacidad');
                $table->string('icon')->nullable()->comment('Emoji o icono para la UI');
                $table->integer('order')->default(0)->comment('Orden de visualización');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('capabilities');
    }
};
