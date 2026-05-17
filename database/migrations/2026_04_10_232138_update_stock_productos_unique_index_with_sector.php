<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Actualizar el índice UNIQUE de stock_productos para incluir sector_id
     *
     * ✨ Cambio: (producto_id, almacen_id, lote) → (producto_id, almacen_id, sector_id, lote)
     *
     * Esto permite:
     * ✅ Mismo lote en diferentes almacenes: Producto A, Lote 26075L, Almacén A (100u) + Almacén B (200u) = 300u
     * ✅ Mismo lote en diferentes sectores del MISMO almacén: Almacén A, Sector C + Sector D
     * ❌ Impide duplicados: (prod, almacén, sector, lote) debe ser único
     */
    public function up(): void
    {
        Schema::table('stock_productos', function (Blueprint $table) {
            // Eliminar el índice UNIQUE antiguo que no incluía sector_id
            $table->dropUnique('uq_stock_producto_lote');

            // Crear nuevo índice UNIQUE con sector_id incluido
            $table->unique(
                ['producto_id', 'almacen_id', 'sector_id', 'lote'],
                'uq_stock_producto_sector_lote'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_productos', function (Blueprint $table) {
            // Revertir: eliminar el nuevo índice UNIQUE
            $table->dropUnique('uq_stock_producto_sector_lote');

            // Restaurar el índice antiguo (sin sector_id)
            $table->unique(
                ['producto_id', 'almacen_id', 'lote'],
                'uq_stock_producto_lote'
            );
        });
    }
};
