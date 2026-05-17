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
        Schema::create('reserva_stock', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proforma_id')->constrained('proformas')->onDelete('cascade');
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->integer('cantidad');
            $table->foreignId('almacen_id')->constrained('almacenes')->onDelete('cascade');
            $table->timestamp('fecha_vencimiento_reserva')->nullable();
            $table->timestamps();

            // Índices para búsquedas rápidas
            $table->index(['proforma_id', 'producto_id']);
            $table->index(['almacen_id', 'fecha_vencimiento_reserva']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reserva_stock');
    }
};
