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
        Schema::create('detalle_devoluciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('devolucion_id')->constrained('devoluciones')->onDelete('cascade');
            $table->foreignId('detalle_venta_id')->constrained('detalle_ventas')->onDelete('restrict');
            $table->foreignId('producto_id')->constrained('productos')->onDelete('restrict');

            $table->decimal('cantidad_devuelta', 10, 6);
            $table->decimal('precio_unitario', 18, 2);
            $table->decimal('subtotal', 18, 2);

            $table->timestamps();

            $table->index(['devolucion_id', 'producto_id']);
        });

        Schema::create('detalle_cambios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('devolucion_id')->constrained('devoluciones')->onDelete('cascade');
            $table->foreignId('producto_id')->constrained('productos')->onDelete('restrict');

            $table->decimal('cantidad', 10, 6);
            $table->decimal('precio_unitario', 18, 2);
            $table->decimal('subtotal', 18, 2);

            $table->timestamps();

            $table->index(['devolucion_id', 'producto_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_cambios');
        Schema::dropIfExists('detalle_devoluciones');
    }
};
