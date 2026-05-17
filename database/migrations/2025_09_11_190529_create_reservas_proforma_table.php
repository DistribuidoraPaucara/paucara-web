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
        Schema::create('reservas_proforma', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proforma_id')->constrained()->nullable()->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('stock_producto_id')->constrained('stock_productos')->onDelete('cascade');
            $table->integer('cantidad_reservada');
            $table->timestamp('fecha_reserva')->useCurrent();
            $table->timestamp('fecha_expiracion')->nullable();
            $table->enum('estado', ['ACTIVA', 'LIBERADA', 'CONSUMIDA'])->default('ACTIVA');
            $table->timestamps();

            $table->index(['proforma_id', 'stock_producto_id']);
            $table->index(['estado', 'fecha_expiracion']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservas_proforma');
    }
};
