<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Detalles de devoluciones por tipo de canastilla
     * Registra cuánto se devolvió de cada tipo, daños, etc.
     */
    public function up(): void
    {
        Schema::create('devolucion_evento_detalle', function (Blueprint $table) {
            $table->id();
            $table->foreignId('devolucion_evento_id')
                ->constrained('devolucion_evento')
                ->cascadeOnDelete()
                ->comment('La devolución a la que pertenece este detalle');
            $table->foreignId('prestamo_evento_detalle_id')
                ->constrained('prestamo_evento_detalle')
                ->restrictOnDelete()
                ->comment('El detalle del préstamo que se está devolviendo');
            $table->integer('cantidad_devuelta')
                ->comment('Cantidad de este tipo devuelto');
            $table->integer('cantidad_dañada_parcial')->default(0)
                ->comment('Cantidad dañada pero útil');
            $table->integer('cantidad_dañada_total')->default(0)
                ->comment('Cantidad completamente dañada (no retorna)');
            $table->decimal('monto_cobrado_daño', 12, 2)->default(0)
                ->comment('Monto cobrado por daños de este tipo');
            $table->decimal('monto_garantia_devuelta', 12, 2)->default(0)
                ->comment('Garantía devuelta para este tipo');
            $table->timestamps();

            // Índices para búsquedas
            $table->index('devolucion_evento_id');
            $table->index('prestamo_evento_detalle_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devolucion_evento_detalle');
    }
};
