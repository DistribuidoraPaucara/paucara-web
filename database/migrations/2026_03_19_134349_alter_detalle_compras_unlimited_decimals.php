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
        Schema::table('detalle_compras', function (Blueprint $table) {
            // Permitir hasta 10 decimales (18 dígitos totales)
            $table->decimal('precio_unitario', 18, 10)->change();
            $table->decimal('descuento', 18, 10)->change();
            $table->decimal('subtotal', 18, 10)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('detalle_compras', function (Blueprint $table) {
            // Revertir a decimal(10,4)
            $table->decimal('precio_unitario', 10, 4)->change();
            $table->decimal('descuento', 10, 4)->change();
            $table->decimal('subtotal', 10, 4)->change();
        });
    }
};
