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
        Schema::create('envios', function (Blueprint $table) {
            $table->id();
            $table->string('numero_envio')->unique();
            $table->foreignId('venta_id')->constrained('ventas');
            $table->foreignId('vehiculo_id')->constrained('vehiculos');
            $table->foreignId('chofer_id')->constrained('users');

            // Fechas del proceso
            $table->datetime('fecha_programada');
            $table->datetime('fecha_salida')->nullable();
            $table->datetime('fecha_entrega')->nullable();

            // Estados del envío
            $table->enum('estado', ['PROGRAMADO', 'EN_PREPARACION', 'EN_RUTA', 'ENTREGADO', 'CANCELADO'])
                ->default('PROGRAMADO');

            // Información de entrega
            $table->text('direccion_entrega');
            $table->decimal('coordenadas_lat', 10, 8)->nullable();
            $table->decimal('coordenadas_lng', 11, 8)->nullable();
            $table->text('observaciones')->nullable();

            // Confirmación de entrega
            $table->string('foto_entrega')->nullable();
            $table->text('firma_cliente')->nullable(); // Base64 de la firma
            $table->string('receptor_nombre')->nullable();
            $table->string('receptor_documento')->nullable();

            $table->timestamps();

            // Índices para optimización
            $table->index(['estado', 'fecha_programada']);
            $table->index(['vehiculo_id', 'fecha_programada']);
            $table->index(['chofer_id', 'fecha_programada']);
            $table->index('fecha_programada');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('envios');
    }
};
