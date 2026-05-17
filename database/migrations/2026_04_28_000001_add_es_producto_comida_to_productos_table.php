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
            $table->boolean('es_producto_comida')
                ->default(false)
                ->after('es_fraccionado')
                ->comment('Indica si es producto de comida/helado sin control de stock');

            $table->index(['es_producto_comida', 'activo'], 'idx_productos_comida_activo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropIndex('idx_productos_comida_activo');
            $table->dropColumn('es_producto_comida');
        });
    }
};
