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
        Schema::create('detalle_pago_egresos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('egreso_id')->constrained('egresos')->onDelete('cascade');
            $table->foreignId('tipo_pago_id')->constrained('tipos_pago');
            $table->decimal('monto', 12, 2);
            $table->timestamp('fecha_pago');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_pago_egresos');
    }
};
