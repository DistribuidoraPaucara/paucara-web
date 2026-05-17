<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Limpiar duplicados manteniendo solo el más reciente (por id)
        // para cada combinación de producto_id + tipo_precio_id
        DB::statement('
            DELETE FROM precios_producto
            WHERE id NOT IN (
                SELECT DISTINCT ON (producto_id, tipo_precio_id) id
                FROM precios_producto
                ORDER BY producto_id, tipo_precio_id, id DESC
            )
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No se puede revertir esta limpieza de datos
        // Esta migración es irreversible
    }
};
