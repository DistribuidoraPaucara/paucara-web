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
        Schema::table('prestable_stock', function (Blueprint $table) {
            // Cantidades dañadas por tipo de devolución
            $table->integer('cantidad_cliente_dañada')->default(0)->after('cantidad_cliente_devuelto');
            $table->integer('cantidad_evento_dañada')->default(0)->after('cantidad_evento_devuelto');
            $table->integer('cantidad_proveedor_dañada')->default(0)->after('cantidad_proveedor_devuelto');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestable_stock', function (Blueprint $table) {
            $table->dropColumn([
                'cantidad_cliente_dañada',
                'cantidad_evento_dañada',
                'cantidad_proveedor_dañada',
            ]);
        });
    }
};
