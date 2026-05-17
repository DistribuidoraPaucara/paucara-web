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
        Schema::create('reportes_productos_danados', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('venta_id');
            $table->unsignedBigInteger('cliente_id');
            $table->unsignedBigInteger('usuario_id'); // Usuario que reporta (preventista/cliente)
            $table->text('observaciones');
            $table->enum('estado', ['pendiente', 'en_revision', 'aprobado', 'rechazado'])->default('pendiente');
            $table->text('notas_respuesta')->nullable();
            $table->date('fecha_reporte')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Índices para queries rápidas
            $table->index('venta_id');
            $table->index('cliente_id');
            $table->index('usuario_id');
            $table->index('estado');
            $table->index('fecha_reporte');

            // Relaciones
            $table->foreign('venta_id')->references('id')->on('ventas')->onDelete('cascade');
            $table->foreign('cliente_id')->references('id')->on('clientes')->onDelete('cascade');
            $table->foreign('usuario_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reportes_productos_danados');
    }
};
