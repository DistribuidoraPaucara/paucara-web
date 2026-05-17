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
        Schema::create('devolucion_proveedor_prestamo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prestamo_proveedor_id')->constrained('prestamo_proveedor')->onDelete('restrict');
            $table->integer('cantidad_devuelta'); // cantidad devuelta al proveedor
            $table->text('observaciones')->nullable(); // estado, notas, etc
            $table->date('fecha_devolucion');
            $table->timestamps();

            // Índices
            $table->index(['prestamo_proveedor_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devolucion_proveedor_prestamo');
    }
};
