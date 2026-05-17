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
        // ⚠️ CAMBIO CRÍTICO: INTEGER → DECIMAL
        // Hacer en horario de bajo tráfico

        // 1. stock_productos
        Schema::table('stock_productos', function (Blueprint $table) {
            $table->decimal('cantidad', 15, 6)->default(0)->change();
            $table->decimal('cantidad_reservada', 15, 6)->default(0)->change();
            $table->decimal('cantidad_disponible', 15, 6)->default(0)->change();
        });

        // 2. detalle_ventas
        Schema::table('detalle_ventas', function (Blueprint $table) {
            $table->decimal('cantidad', 15, 6)->change();
        });

        // 3. detalle_proformas
        Schema::table('detalle_proformas', function (Blueprint $table) {
            $table->decimal('cantidad', 15, 6)->change();
        });

        // 4. detalle_compras (si existe)
        if (Schema::hasTable('detalle_compras')) {
            Schema::table('detalle_compras', function (Blueprint $table) {
                $table->decimal('cantidad', 15, 6)->change();
            });
        }

        // 5. detalles_pedido (si existe)
        if (Schema::hasTable('detalles_pedido')) {
            Schema::table('detalles_pedido', function (Blueprint $table) {
                $table->decimal('cantidad', 15, 6)->change();
            });
        }

        // 6. movimientos_inventario (si existe)
        if (Schema::hasTable('movimientos_inventario')) {
            Schema::table('movimientos_inventario', function (Blueprint $table) {
                $table->decimal('cantidad_anterior', 15, 6)->nullable()->change();
                $table->decimal('cantidad', 15, 6)->change();
                $table->decimal('cantidad_posterior', 15, 6)->nullable()->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // ⚠️ ADVERTENCIA: Al revertir, decimales se truncarán a enteros
        // Los datos podrían perder precisión

        // 1. stock_productos
        Schema::table('stock_productos', function (Blueprint $table) {
            $table->integer('cantidad')->default(0)->change();
            $table->integer('cantidad_reservada')->default(0)->change();
            $table->integer('cantidad_disponible')->default(0)->change();
        });

        // 2. detalle_ventas
        Schema::table('detalle_ventas', function (Blueprint $table) {
            $table->integer('cantidad')->change();
        });

        // 3. detalle_proformas
        Schema::table('detalle_proformas', function (Blueprint $table) {
            $table->integer('cantidad')->change();
        });

        // 4. detalle_compras
        if (Schema::hasTable('detalle_compras')) {
            Schema::table('detalle_compras', function (Blueprint $table) {
                $table->integer('cantidad')->change();
            });
        }

        // 5. detalles_pedido
        if (Schema::hasTable('detalles_pedido')) {
            Schema::table('detalles_pedido', function (Blueprint $table) {
                $table->integer('cantidad')->change();
            });
        }

        // 6. movimientos_inventario
        if (Schema::hasTable('movimientos_inventario')) {
            Schema::table('movimientos_inventario', function (Blueprint $table) {
                $table->integer('cantidad_anterior')->nullable()->change();
                $table->integer('cantidad')->change();
                $table->integer('cantidad_posterior')->nullable()->change();
            });
        }
    }
};
