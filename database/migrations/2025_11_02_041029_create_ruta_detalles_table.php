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
        Schema::create('ruta_detalles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ruta_id');
            $table->unsignedBigInteger('cliente_id');
            $table->unsignedBigInteger('envio_id')->nullable(); // Referencia al envío
            $table->integer('secuencia'); // Orden de entrega en la ruta (1, 2, 3...)
            $table->string('direccion_entrega');
            $table->decimal('latitud', 10, 8)->nullable();
            $table->decimal('longitud', 11, 8)->nullable();
            $table->enum('estado', ['pendiente', 'en_transito', 'entregado', 'no_entregado', 'reprogramado'])->default('pendiente');
            $table->time('hora_entrega_estimada')->nullable();
            $table->time('hora_entrega_real')->nullable();
            $table->text('observaciones')->nullable();
            $table->string('foto_entrega')->nullable(); // URL de foto de comprobante
            $table->string('firma_cliente')->nullable(); // Firma digital o path
            $table->string('razon_no_entrega')->nullable(); // Si no se entregó
            $table->integer('intentos_entrega')->default(0);

            // Relaciones
            $table->foreign('ruta_id')->references('id')->on('rutas')->onDelete('cascade');
            $table->foreign('cliente_id')->references('id')->on('clientes')->onDelete('cascade');
            $table->foreign('envio_id')->references('id')->on('envios')->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ruta_detalles');
    }
};
