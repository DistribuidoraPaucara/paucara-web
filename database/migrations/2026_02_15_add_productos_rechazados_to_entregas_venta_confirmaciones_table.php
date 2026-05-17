<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ✅ Agregar soporte para devoluciones parciales de productos
     * Cuando el cliente solo acepta parte de la venta y rechaza otros productos
     */
    public function up(): void
    {
        Schema::table('entregas_venta_confirmaciones', function (Blueprint $table) {
            // ✅ NUEVO: Array JSON con productos rechazados
            // Estructura: [
            //   { "producto_id": 5, "producto_nombre": "Pepsi 2L", "cantidad": 2, "precio_unitario": 8.50, "subtotal": 17.00 },
            //   { "producto_id": 10, "producto_nombre": "Sprite 1.5L", "cantidad": 1, "precio_unitario": 6.00, "subtotal": 6.00 }
            // ]
            $table->json('productos_devueltos')->nullable()
                ->comment('Array JSON con productos que fueron rechazados/devueltos');

            // ✅ NUEVO: Total del monto devuelto (suma de subtotales de productos rechazados)
            $table->decimal('monto_devuelto', 12, 2)->nullable()
                ->comment('Suma total de productos rechazados/devueltos');

            // ✅ NUEVO: Total del monto aceptado (total de venta - monto_devuelto)
            $table->decimal('monto_aceptado', 12, 2)->nullable()
                ->comment('Total de venta que fue aceptado por el cliente (total - devuelto)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas_venta_confirmaciones', function (Blueprint $table) {
            $table->dropColumn(['productos_devueltos', 'monto_devuelto', 'monto_aceptado']);
        });
    }
};
