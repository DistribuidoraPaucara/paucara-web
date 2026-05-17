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
        Schema::create('entregas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proforma_id')->constrained('proformas');
            $table->foreignId('chofer_id')->nullable()->constrained('empleados');
            $table->foreignId('vehiculo_id')->nullable()->constrained('vehiculos');
            $table->foreignId('direccion_cliente_id')->nullable()->constrained('direcciones_cliente');

            $table->enum('estado', [
                'ASIGNADA',
                'EN_CAMINO',
                'LLEGO',
                'ENTREGADO',
                'NOVEDAD',
                'CANCELADA'
            ])->default('ASIGNADA');

            $table->timestamp('fecha_asignacion')->nullable();
            $table->timestamp('fecha_inicio')->nullable();
            $table->timestamp('fecha_llegada')->nullable();
            $table->timestamp('fecha_entrega')->nullable();

            $table->text('observaciones')->nullable();
            $table->string('motivo_novedad')->nullable();

            $table->string('firma_digital_url')->nullable();
            $table->string('foto_entrega_url')->nullable();
            $table->timestamp('fecha_firma_entrega')->nullable();

            $table->timestamps();

            // Índices para performance
            $table->index('estado');
            $table->index('chofer_id');
            $table->index('fecha_asignacion');
            $table->index('proforma_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entregas');
    }
};
