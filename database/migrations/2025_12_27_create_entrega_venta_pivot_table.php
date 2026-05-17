<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * NUEVA ARQUITECTURA: Entrega contiene múltiples Ventas
     *
     * Antes (INCORRECTO):
     * ├─ Entrega #1 → Venta #1001
     * ├─ Entrega #2 → Venta #1002
     * └─ Entrega #3 → Venta #1003
     * (Luego se consolidaban en ReporteCarga)
     *
     * Ahora (CORRECTO):
     * └─ Entrega #100 (asignada a Vehículo + Chofer)
     *    ├─ Venta #1001
     *    ├─ Venta #1002
     *    └─ Venta #1003
     *
     * Esta tabla pivot vincula una Entrega con sus Ventas
     * Una Entrega = Un viaje con múltiples clientes
     * Un Chofer + Vehículo + Ruta = Una Entrega
     */
    public function up(): void
    {
        Schema::create('entrega_venta', function (Blueprint $table) {
            $table->id();

            // Relaciones
            $table->unsignedBigInteger('entrega_id');
            $table->unsignedBigInteger('venta_id');

            // Metadatos del vínculo
            $table->integer('orden')->default(1);  // Orden de carga/entrega
            $table->unsignedBigInteger('confirmado_por')->nullable();  // Usuario que confirmó carga
            $table->timestamp('fecha_confirmacion')->nullable();  // Cuándo se confirmó
            $table->text('notas')->nullable();  // Observaciones específicas

            // Foreign keys
            $table->foreign('entrega_id')
                ->references('id')
                ->on('entregas')
                ->onDelete('cascade');

            $table->foreign('venta_id')
                ->references('id')
                ->on('ventas')
                ->onDelete('restrict');  // No permitir eliminar venta si está en entrega

            $table->foreign('confirmado_por')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            // Índices
            $table->index(['entrega_id', 'orden']);  // Para obtener ventas de una entrega en orden
            $table->index(['venta_id', 'entrega_id']);  // Para verificar si venta está en entrega
            $table->unique(['entrega_id', 'venta_id']);  // Evitar duplicados

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entrega_venta');
    }
};
