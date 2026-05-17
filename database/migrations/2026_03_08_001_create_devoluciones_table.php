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
        Schema::create('devoluciones', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique(); // DEV-2026-0001
            $table->date('fecha');
            $table->enum('tipo', ['DEVOLUCION', 'CAMBIO']);

            // Relaciones
            $table->foreignId('venta_id')->constrained('ventas')->onDelete('cascade');
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('restrict');
            $table->foreignId('usuario_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('caja_id')->nullable()->constrained('cajas')->onDelete('set null');

            // Datos de devolucion
            $table->string('motivo');
            $table->decimal('subtotal_devuelto', 18, 2);
            $table->decimal('total_devuelto', 18, 2);

            // Reembolso
            $table->enum('tipo_reembolso', ['EFECTIVO', 'CREDITO']);
            $table->decimal('monto_reembolso', 18, 2)->default(0);

            // Solo para CAMBIO
            $table->decimal('subtotal_cambio', 18, 2)->nullable();
            $table->decimal('diferencia', 18, 2)->nullable(); // positivo: cliente paga, negativo: se devuelve

            $table->text('observaciones')->nullable();
            $table->softDeletes();
            $table->timestamps();

            // Indices
            $table->index('venta_id');
            $table->index('cliente_id');
            $table->index('usuario_id');
            $table->index('fecha');
            $table->index('tipo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devoluciones');
    }
};
