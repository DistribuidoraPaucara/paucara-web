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
        Schema::create('venta_impuestos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venta_id')->constrained('ventas')->onDelete('cascade');
            $table->foreignId('impuesto_id')->constrained('impuestos');
            $table->decimal('base_imponible', 15, 2);     // Monto sobre el cual se calcula el impuesto
            $table->decimal('porcentaje_aplicado', 5, 2); // Porcentaje aplicado al momento de la venta
            $table->decimal('monto_impuesto', 15, 2);     // Monto calculado del impuesto
            $table->timestamps();

            // Índices
            $table->unique(['venta_id', 'impuesto_id']);
            $table->index('venta_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venta_impuestos');
    }
};
