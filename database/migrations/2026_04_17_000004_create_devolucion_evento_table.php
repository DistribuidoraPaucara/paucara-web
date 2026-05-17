<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabla para registrar devoluciones de préstamos de eventos
     * Puede haber múltiples devoluciones parciales por préstamo
     */
    public function up(): void
    {
        Schema::create('devolucion_evento', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prestamo_evento_id')
                ->constrained('prestamo_evento')
                ->restrictOnDelete()
                ->comment('El préstamo del que se devuelven canastillas');
            $table->date('fecha_devolucion')
                ->comment('Fecha en que se devolvieron las canastillas');
            $table->integer('cantidad_total_devuelta')
                ->comment('Cantidad total devuelta en esta devolución');
            $table->decimal('monto_cobrado_daño_total', 12, 2)->default(0)
                ->comment('Total cobrado por daños en esta devolución');
            $table->decimal('monto_garantia_devuelta_total', 12, 2)->default(0)
                ->comment('Total de garantía devuelta en esta devolución');
            $table->text('observaciones')
                ->nullable()
                ->comment('Observaciones sobre el estado de las canastillas');
            $table->foreignId('chofer_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->comment('Chofer que registró la devolución');
            $table->timestamps();

            // Índices para búsquedas
            $table->index('prestamo_evento_id');
            $table->index('chofer_id');
            $table->index('fecha_devolucion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devolucion_evento');
    }
};
