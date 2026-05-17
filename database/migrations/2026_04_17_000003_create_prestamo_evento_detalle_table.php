<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Detalles de cada tipo de canastilla en un préstamo de evento
     */
    public function up(): void
    {
        Schema::create('prestamo_evento_detalle', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prestamo_evento_id')
                ->constrained('prestamo_evento')
                ->restrictOnDelete()
                ->comment('El préstamo al que pertenece este detalle');
            $table->foreignId('prestable_id')
                ->constrained('prestables')
                ->restrictOnDelete()
                ->comment('Tipo de canastilla prestada');
            $table->integer('cantidad_prestada')
                ->comment('Cantidad de este tipo de canastilla prestada');
            $table->decimal('monto_garantia', 12, 2)->default(0)
                ->comment('Garantía por este tipo');
            $table->enum('estado', ['ACTIVO', 'COMPLETAMENTE_DEVUELTO', 'PARCIALMENTE_DEVUELTO'])->default('ACTIVO')
                ->comment('Estado de devolución para este prestable');
            $table->timestamps();

            // Índices para búsquedas
            $table->index('prestamo_evento_id');
            $table->index('prestable_id');
            $table->index('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestamo_evento_detalle');
    }
};
