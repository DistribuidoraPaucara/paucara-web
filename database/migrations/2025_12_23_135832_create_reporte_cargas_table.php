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
        Schema::create('reporte_cargas', function (Blueprint $table) {
            $table->id();

            // Relaciones principales
            $table->unsignedBigInteger('entrega_id')->nullable();
            $table->unsignedBigInteger('vehiculo_id')->nullable();
            $table->unsignedBigInteger('venta_id')->nullable();

            // Información del reporte
            $table->string('numero_reporte')->unique();
            $table->text('descripcion')->nullable();
            $table->decimal('peso_total_kg', 10, 2)->default(0);
            $table->decimal('volumen_total_m3', 10, 2)->nullable();

            // Control y auditoría
            $table->unsignedBigInteger('generado_por')->nullable(); // user_id
            $table->unsignedBigInteger('confirmado_por')->nullable(); // user_id
            $table->timestamp('fecha_generacion')->useCurrent();
            $table->timestamp('fecha_confirmacion')->nullable();

            // Estado
            $table->enum('estado', ['PENDIENTE', 'CONFIRMADO', 'ENTREGADO', 'CANCELADO'])->default('PENDIENTE');

            // Índices
            $table->foreign('entrega_id')->references('id')->on('entregas')->onDelete('cascade');
            $table->foreign('vehiculo_id')->references('id')->on('vehiculos')->onDelete('set null');
            $table->foreign('venta_id')->references('id')->on('ventas')->onDelete('set null');
            $table->foreign('generado_por')->references('id')->on('users')->onDelete('set null');
            $table->foreign('confirmado_por')->references('id')->on('users')->onDelete('set null');

            $table->index(['entrega_id', 'estado']);
            $table->index(['vehiculo_id', 'fecha_generacion']);
            $table->index(['generado_por', 'fecha_generacion']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reporte_cargas');
    }
};
