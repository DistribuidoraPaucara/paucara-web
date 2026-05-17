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
            // Cambiar de decimal:2 a decimal:4
            $table->decimal('precio_unitario', 10, 4)->change();
            $table->decimal('descuento', 10, 4)->change();
            $table->decimal('subtotal', 10, 4)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('detalle_compras', function (Blueprint $table) {
            // Revertir a decimal:2
            $table->decimal('precio_unitario', 10, 2)->change();
            $table->decimal('descuento', 10, 2)->change();
            $table->decimal('subtotal', 10, 2)->change();
        });
    }
};
