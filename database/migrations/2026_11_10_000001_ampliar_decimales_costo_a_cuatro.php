<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * El costo de compra puede tener hasta 4 decimales. Los precios de venta comparten la columna
 * precios_producto.precio, pero se siguen redondeando a 2 decimales en PrecioProducto::saving.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE precios_producto ALTER COLUMN precio TYPE numeric(18,4)');
        DB::statement('ALTER TABLE productos ALTER COLUMN precio_compra TYPE numeric(18,4)');
        DB::statement('ALTER TABLE stock_productos ALTER COLUMN precio_costo TYPE numeric(14,4)');
        DB::statement('ALTER TABLE historial_precios ALTER COLUMN valor_anterior TYPE numeric(14,4)');
        DB::statement('ALTER TABLE historial_precios ALTER COLUMN valor_nuevo TYPE numeric(14,4)');
    }

    public function down(): void
    {
        // Redondea a 2 decimales los costos que tengan más
        DB::statement('ALTER TABLE precios_producto ALTER COLUMN precio TYPE numeric(18,2)');
        DB::statement('ALTER TABLE productos ALTER COLUMN precio_compra TYPE numeric(18,2)');
        DB::statement('ALTER TABLE stock_productos ALTER COLUMN precio_costo TYPE numeric(10,2)');
        DB::statement('ALTER TABLE historial_precios ALTER COLUMN valor_anterior TYPE numeric(10,2)');
        DB::statement('ALTER TABLE historial_precios ALTER COLUMN valor_nuevo TYPE numeric(10,2)');
    }
};
