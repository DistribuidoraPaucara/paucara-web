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
        Schema::table('ventas', function (Blueprint $table) {
            // Index para reportes por período - optimiza groupBy y orderBy en fechas
            $table->index(['fecha', 'estado_documento_id'], 'idx_ventas_fecha_estado');

            // Index para reportes por vendedor y estado de pago
            $table->index(['usuario_id', 'estado_pago', 'fecha'], 'idx_ventas_usuario_estado_fecha');

            // Index para búsquedas por cliente
            $table->index(['cliente_id', 'fecha'], 'idx_ventas_cliente_fecha');
        });

        Schema::table('detalle_ventas', function (Blueprint $table) {
            // Index compuesto para reportes por cliente-producto
            $table->index(['venta_id', 'producto_id'], 'idx_detalle_ventas_venta_producto');

            // Index para búsquedas rápidas por cliente-producto
            $table->index(['producto_id'], 'idx_detalle_ventas_producto');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropIndex('idx_ventas_fecha_estado');
            $table->dropIndex('idx_ventas_usuario_estado_fecha');
            $table->dropIndex('idx_ventas_cliente_fecha');
        });

        Schema::table('detalle_ventas', function (Blueprint $table) {
            $table->dropIndex('idx_detalle_ventas_venta_producto');
            $table->dropIndex('idx_detalle_ventas_producto');
        });
    }
};
