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
        Schema::create('detalles_pago_venta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venta_id')->constrained('ventas')->cascadeOnDelete();
            $table->foreignId('tipo_pago_id')->constrained('tipos_pago');
            $table->decimal('monto', 12, 2);
            $table->string('referencia')->nullable(); // número de transferencia, cheque, etc.
            $table->timestamp('fecha_pago')->nullable();
            $table->string('comprobante')->nullable(); // foto/URL del recibo
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalles_pago_venta');
    }
};
