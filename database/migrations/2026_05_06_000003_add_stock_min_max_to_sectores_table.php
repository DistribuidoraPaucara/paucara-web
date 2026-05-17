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
        Schema::table('sectores', function (Blueprint $table) {
            // Stock mínimo y máximo por sector (capacidad del sector)
            $table->integer('stock_minimo')->default(0)->after('descripcion');
            $table->integer('stock_maximo')->default(999999)->after('stock_minimo');

            // Índice para queries rápidas
            $table->index(['almacen_id', 'stock_minimo', 'stock_maximo']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sectores', function (Blueprint $table) {
            $table->dropIndex(['almacen_id', 'stock_minimo', 'stock_maximo']);
            $table->dropColumn(['stock_minimo', 'stock_maximo']);
        });
    }
};
