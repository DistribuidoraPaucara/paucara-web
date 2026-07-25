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
        Schema::create('detalle_egresos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('egreso_id')->constrained('egresos')->onDelete('cascade');
            $table->string('concepto'); // Descripción del gasto
            $table->integer('cantidad')->default(1);
            $table->decimal('monto_unitario', 12, 2);
            $table->decimal('descuento', 12, 2)->default(0);
            $table->decimal('subtotal', 12, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_egresos');
    }
};
