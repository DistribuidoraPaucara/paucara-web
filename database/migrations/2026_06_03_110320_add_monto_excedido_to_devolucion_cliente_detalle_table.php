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
        Schema::table('devolucion_cliente_detalle', function (Blueprint $table) {
            $table->decimal('monto_excedido_detalle', 12, 2)->default(0)->after('monto_garantia_devuelta');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('devolucion_cliente_detalle', function (Blueprint $table) {
            $table->dropColumn('monto_excedido_detalle');
        });
    }
};
