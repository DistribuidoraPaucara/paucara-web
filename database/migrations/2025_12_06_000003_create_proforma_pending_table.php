<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Cola de entregas pendientes para reintentos
     * Cuando falla la creación de una proforma, se guarda aquí
     * para reintentar automáticamente cuando haya conexión
     */
    public function up(): void
    {
        Schema::create('proforma_pending', function (Blueprint $table) {
            $table->id();

            // Cliente que realizó el pedido
            $table->foreignId('cliente_id')
                ->constrained('clientes')
                ->onDelete('cascade');

            // Detalles del pedido (JSON)
            // [{ "producto_id": 1, "cantidad": 10, "precio_unitario": 25.50 }, ...]
            $table->json('items');

            // Información de entrega solicitada
            $table->date('fecha_programada');
            $table->time('hora_inicio_preferida')->nullable();
            $table->time('hora_fin_preferida')->nullable();

            // Dirección de entrega
            $table->foreignId('direccion_entrega_id')
                ->nullable()
                ->constrained('direcciones_cliente')
                ->onDelete('set null');

            // Observaciones
            $table->text('observaciones')->nullable();

            // Idempotencia: evitar duplicados
            $table->string('idempotency_key', 100)->unique();

            // Control de reintentos
            $table->integer('intento')->default(1);
            $table->integer('maximo_intentos')->default(5);

            // Si ya se creó la proforma
            $table->foreignId('proforma_id')
                ->nullable()
                ->constrained('proformas')
                ->onDelete('set null');

            // Mensaje de error (si falló)
            $table->text('error_mensaje')->nullable();

            // Estado actual
            $table->enum('estado', [
                'PENDIENTE',    // Esperando reintentar
                'PROCESANDO',   // En proceso de creación
                'EXITOSA',      // Se creó la proforma
                'FALLIDA',      // Falló después de max intentos
                'CANCELADA'     // Cancelada manualmente
            ])->default('PENDIENTE');

            // Timestamps
            $table->timestamp('fecha_intento')->useCurrent();
            $table->timestamp('fecha_proximo_intento')
                ->nullable()
                ->comment('Cuándo se intenta nuevamente');

            $table->timestamps();

            // Índices
            $table->index('cliente_id');
            $table->index('estado');
            $table->index('fecha_intento');
            $table->index('fecha_proximo_intento');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proforma_pending');
    }
};
