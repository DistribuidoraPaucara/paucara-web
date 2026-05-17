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
        Schema::create('devolucion_cliente_detalle', function (Blueprint $table) {
            $table->id();
            $table->foreignId('devolucion_cliente_id')
                ->constrained('devolucion_cliente')
                ->cascadeOnDelete();
            $table->foreignId('prestamo_cliente_detalle_id')
                ->constrained('prestamo_cliente_detalle')
                ->restrictOnDelete();
            $table->integer('cantidad_devuelta');
            $table->integer('cantidad_dañada_parcial')->default(0);
            $table->integer('cantidad_dañada_total')->default(0);
            $table->decimal('monto_cobrado_daño', 12, 2)->default(0);
            $table->decimal('monto_garantia_devuelta', 12, 2)->default(0);
            $table->timestamps();

            $table->index('devolucion_cliente_id');
            $table->index('prestamo_cliente_detalle_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devolucion_cliente_detalle');
    }
};
