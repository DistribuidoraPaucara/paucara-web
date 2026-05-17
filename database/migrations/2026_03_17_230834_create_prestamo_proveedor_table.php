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
        Schema::create('prestamo_proveedor', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prestable_id')->constrained('prestables')->onDelete('restrict');
            $table->foreignId('proveedor_id')->constrained('proveedores')->onDelete('restrict');
            $table->integer('cantidad');
            $table->boolean('es_compra'); // true=compra, false=préstamo
            $table->decimal('precio_unitario', 12, 2)->nullable(); // si es compra
            $table->string('numero_documento')->nullable(); // factura, remisión, etc
            $table->date('fecha_prestamo');
            $table->date('fecha_esperada_devolucion')->nullable(); // opcional
            $table->enum('estado', ['ACTIVO', 'COMPLETAMENTE_DEVUELTO', 'PARCIALMENTE_DEVUELTO'])->default('ACTIVO');
            $table->timestamps();

            // Índices
            $table->index(['proveedor_id', 'estado']);
            $table->index(['numero_documento']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestamo_proveedor');
    }
};
