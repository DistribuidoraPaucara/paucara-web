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
        Schema::create('prestamo_cliente_detalle', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prestamo_cliente_id')->constrained('prestamo_cliente')->restrictOnDelete();
            $table->foreignId('prestable_id')->constrained('prestables')->restrictOnDelete();
            $table->integer('cantidad_prestada');
            $table->decimal('precio_unitario', 12, 2)->nullable();
            $table->decimal('precio_prestamo', 12, 2)->nullable();
            $table->enum('estado', ['ACTIVO', 'COMPLETAMENTE_DEVUELTO', 'PARCIALMENTE_DEVUELTO'])->default('ACTIVO');
            $table->timestamps();

            // Índices
            $table->index(['prestamo_cliente_id']);
            $table->index(['prestable_id']);
            $table->index(['estado']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestamo_cliente_detalle');
    }
};
