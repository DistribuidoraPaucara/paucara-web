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
        Schema::create('devolucion_cliente', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prestamo_cliente_id')
                ->constrained('prestamo_cliente')
                ->restrictOnDelete();
            $table->date('fecha_devolucion');
            $table->decimal('monto_cobrado_daño_total', 12, 2)->default(0);
            $table->decimal('monto_garantia_devuelta_total', 12, 2)->default(0);
            $table->text('observaciones')->nullable();
            $table->foreignId('chofer_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamps();

            $table->index('prestamo_cliente_id');
            $table->index('chofer_id');
            $table->index('fecha_devolucion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devolucion_cliente');
    }
};
