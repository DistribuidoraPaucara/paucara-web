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
        Schema::create('prestamo_ubicaciones', function (Blueprint $table) {
            $table->id();

            $table->foreignId('prestamo_cliente_id')
                ->nullable()
                ->constrained('prestamo_cliente')
                ->cascadeOnDelete();

            $table->foreignId('prestamo_evento_id')
                ->nullable()
                ->constrained('prestamo_evento')
                ->cascadeOnDelete();

            $table->foreignId('direccion_cliente_id')
                ->nullable()
                ->constrained('direcciones_cliente')
                ->nullOnDelete();

            $table->foreignId('localidad_id')
                ->nullable()
                ->constrained('localidades')
                ->nullOnDelete();

            $table->boolean('es_ubicacion_manual')->default(false);

            $table->string('direccion')->nullable();

            $table->timestamps();

            // Índices
            $table->index('prestamo_cliente_id');
            $table->index('prestamo_evento_id');
            $table->index('direccion_cliente_id');
            $table->index('localidad_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestamo_ubicaciones');
    }
};
