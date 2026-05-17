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
        Schema::table('inventario_inicial_borrador_items', function (Blueprint $table) {
            // Eliminar la restricción única antigua que no incluía lote
            $table->dropUnique('inventario_inicial_borrador_items_borrador_id_producto_id_almac');

            // Agregar nueva restricción única que incluya lote
            $table->unique(['borrador_id', 'producto_id', 'almacen_id', 'lote'], 'inventario_inicial_borrador_items_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventario_inicial_borrador_items', function (Blueprint $table) {
            // Revertir: eliminar la nueva restricción
            $table->dropUnique('inventario_inicial_borrador_items_unique');

            // Restaurar la antigua restricción
            $table->unique(['borrador_id', 'producto_id', 'almacen_id'], 'inventario_inicial_borrador_items_borrador_id_producto_id_almac');
        });
    }
};
