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
        Schema::table('productos', function (Blueprint $table) {
            $table->boolean('permite_venta_sin_stock')
                ->default(false)
                ->after('es_producto_comida')
                ->comment('Permite vender este producto sin stock (ej: servicios, inyectables en farmacias)');

            $table->index(['permite_venta_sin_stock', 'activo'], 'idx_productos_venta_sin_stock');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropIndex('idx_productos_venta_sin_stock');
            $table->dropColumn('permite_venta_sin_stock');
        });
    }
};
