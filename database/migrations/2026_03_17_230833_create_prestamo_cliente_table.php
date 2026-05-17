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
        Schema::create('prestamo_cliente', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prestable_id')->constrained('prestables')->onDelete('restrict');
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('restrict');
            $table->foreignId('venta_id')->nullable()->constrained('ventas')->onDelete('set null'); // opcional
            $table->foreignId('chofer_id')->nullable()->constrained('users')->onDelete('set null'); // responsable
            $table->integer('cantidad');
            $table->boolean('es_venta'); // true=venta, false=préstamo
            $table->decimal('precio_unitario', 12, 2)->nullable(); // si es venta
            $table->decimal('precio_prestamo', 12, 2)->nullable(); // si es préstamo
            $table->decimal('monto_garantia', 12, 2)->default(0); // garantía total
            $table->date('fecha_prestamo');
            $table->date('fecha_esperada_devolucion')->nullable(); // opcional
            $table->enum('estado', ['ACTIVO', 'COMPLETAMENTE_DEVUELTO', 'PARCIALMENTE_DEVUELTO'])->default('ACTIVO');
            $table->timestamps();

            // Índices
            $table->index(['cliente_id', 'estado']);
            $table->index(['chofer_id', 'estado']);
            $table->index(['venta_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestamo_cliente');
    }
};
