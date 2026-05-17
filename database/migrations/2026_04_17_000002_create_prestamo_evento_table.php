<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabla para registrar préstamos de canastillas para eventos
     * Similar a prestamo_cliente pero para eventos
     */
    public function up(): void
    {
        Schema::create('prestamo_evento', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('evento_id')
                ->nullable()
                ->comment('El evento que toma las canastillas');
            $table->string('nombre_evento')
                ->comment('Nombre del evento (para auditoría si se elimina)');
            $table->foreignId('chofer_id')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null')
                ->comment('Chofer responsable del préstamo');
            $table->integer('cantidad')
                ->comment('Cantidad total de canastillas (suma de detalles)');
            $table->decimal('monto_garantia', 12, 2)->default(0)
                ->comment('Garantía total exigida');
            $table->date('fecha_prestamo')
                ->comment('Fecha en que se prestó');
            $table->date('fecha_esperada_devolucion')
                ->nullable()
                ->comment('Fecha comprometida para devolución');
            $table->enum('estado', ['ACTIVO', 'COMPLETAMENTE_DEVUELTO', 'PARCIALMENTE_DEVUELTO', 'VENCIDO'])->default('ACTIVO')
                ->comment('Estado del préstamo (puede vencer)');
            $table->timestamps();

            // Índices para búsquedas rápidas
            $table->index(['evento_id', 'estado']);
            $table->index(['chofer_id', 'estado']);
            $table->index('fecha_prestamo');
            $table->index('fecha_esperada_devolucion');
            $table->index('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestamo_evento');
    }
};
