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
        Schema::create('reservas_stock', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->foreignId('almacen_id')->constrained('almacenes')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('tipo_reserva'); // 'venta', 'orden', 'transferencia', 'manual'
            $table->string('referencia_tipo')->nullable(); // 'venta', 'orden_compra', etc.
            $table->unsignedBigInteger('referencia_id')->nullable(); // ID de la venta, orden, etc.
            $table->decimal('cantidad_reservada', 12, 4);
            $table->decimal('cantidad_utilizada', 12, 4)->default(0);
            $table->enum('estado', ['activa', 'parcialmente_utilizada', 'utilizada', 'liberada', 'vencida'])->default('activa');
            $table->timestamp('fecha_vencimiento')->nullable();
            $table->text('motivo')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamp('fecha_liberacion')->nullable();
            $table->foreignId('liberado_por')->nullable()->constrained('users');
            $table->timestamps();

            // Índices para optimización
            $table->index(['producto_id', 'almacen_id']);
            $table->index(['estado', 'fecha_vencimiento']);
            $table->index(['referencia_tipo', 'referencia_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservas_stock');
    }
};
