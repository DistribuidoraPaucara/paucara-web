<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Refactorizar prestable_stock para separar préstamos por tipo de deudor
     * y trackear devoluciones independientemente
     */
    public function up(): void
    {
        Schema::table('prestable_stock', function (Blueprint $table) {
            // Remover columnas antiguas
            $table->dropColumn([
                'cantidad_en_prestamo_cliente',
                'cantidad_que_debo_devolver',
                'cantidad_vendida',
            ]);

            // Agregar nuevas columnas para prestamos a CLIENTES
            $table->integer('cantidad_prestamo_cliente_activo')->default(0)
                ->after('cantidad_disponible')
                ->comment('Canastillas en poder de clientes (sin devolver)');
            $table->integer('cantidad_prestamo_cliente_devuelto')->default(0)
                ->after('cantidad_prestamo_cliente_activo')
                ->comment('Canastillas que clientes ya devolvieron');

            // Agregar nuevas columnas para prestamos a EVENTOS
            $table->integer('cantidad_prestamo_evento_activo')->default(0)
                ->after('cantidad_prestamo_cliente_devuelto')
                ->comment('Canastillas en poder de eventos (sin devolver)');
            $table->integer('cantidad_prestamo_evento_devuelto')->default(0)
                ->after('cantidad_prestamo_evento_activo')
                ->comment('Canastillas que eventos ya devolvieron');

            // Agregar nuevas columnas para prestamos a PROVEEDORES
            $table->integer('cantidad_prestamo_proveedor_activo')->default(0)
                ->after('cantidad_prestamo_evento_devuelto')
                ->comment('Canastillas en poder del proveedor (debo devolver)');
            $table->integer('cantidad_prestamo_proveedor_devuelto')->default(0)
                ->after('cantidad_prestamo_proveedor_activo')
                ->comment('Canastillas que el proveedor ya devolvió');

            // Agregar índices para búsquedas rápidas
            $table->index('cantidad_prestamo_cliente_activo');
            $table->index('cantidad_prestamo_evento_activo');
            $table->index('cantidad_prestamo_proveedor_activo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestable_stock', function (Blueprint $table) {
            // Remover nuevas columnas
            $table->dropColumn([
                'cantidad_prestamo_cliente_activo',
                'cantidad_prestamo_cliente_devuelto',
                'cantidad_prestamo_evento_activo',
                'cantidad_prestamo_evento_devuelto',
                'cantidad_prestamo_proveedor_activo',
                'cantidad_prestamo_proveedor_devuelto',
            ]);

            // Restaurar columnas antiguas
            $table->integer('cantidad_en_prestamo_cliente')->default(0)
                ->after('cantidad_disponible');
            $table->integer('cantidad_que_debo_devolver')->default(0)
                ->after('cantidad_en_prestamo_cliente');
            $table->integer('cantidad_vendida')->default(0)
                ->after('cantidad_que_debo_devolver');

            // Restaurar índices antiguos
            $table->dropIndex(['cantidad_prestamo_cliente_activo']);
            $table->dropIndex(['cantidad_prestamo_evento_activo']);
            $table->dropIndex(['cantidad_prestamo_proveedor_activo']);
        });
    }
};
