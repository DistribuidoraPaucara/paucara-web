<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Renombra columnas para mayor claridad semántica:
     * - cliente_activo → cliente_deudor (clientes que me deben devoluciones)
     * - cliente_devuelto → cliente_devuelto (lo que clientes ya devolvieron - historial)
     * - evento_activo → evento_deudor (eventos que me deben devoluciones)
     * - evento_devuelto → evento_devuelto (lo que eventos ya devolvieron - historial)
     * - proveedor_activo → proveedor_acreedor (lo que yo le debo al proveedor)
     * - proveedor_devuelto → proveedor_devuelto (lo que ya devolví al proveedor - historial)
     */
    public function up(): void
    {
        Schema::table('prestable_stock', function (Blueprint $table) {
            // Renombrar columnas de clientes
            $table->renameColumn('cantidad_prestamo_cliente_activo', 'cantidad_cliente_deudor');
            $table->renameColumn('cantidad_prestamo_cliente_devuelto', 'cantidad_cliente_devuelto');

            // Renombrar columnas de eventos
            $table->renameColumn('cantidad_prestamo_evento_activo', 'cantidad_evento_deudor');
            $table->renameColumn('cantidad_prestamo_evento_devuelto', 'cantidad_evento_devuelto');

            // Renombrar columnas de proveedores
            $table->renameColumn('cantidad_prestamo_proveedor_activo', 'cantidad_proveedor_acreedor');
            $table->renameColumn('cantidad_prestamo_proveedor_devuelto', 'cantidad_proveedor_devuelto');
        });

        // Actualizar comentarios con descripción más clara
        Schema::table('prestable_stock', function (Blueprint $table) {
            $table->integer('cantidad_cliente_deudor')->default(0)
                ->change()
                ->comment('Unidades en poder de clientes (sin devolver) - ellos me deben');
            $table->integer('cantidad_cliente_devuelto')->default(0)
                ->change()
                ->comment('Unidades que clientes ya devolvieron - historial');

            $table->integer('cantidad_evento_deudor')->default(0)
                ->change()
                ->comment('Unidades en poder de eventos (sin devolver) - ellos me deben');
            $table->integer('cantidad_evento_devuelto')->default(0)
                ->change()
                ->comment('Unidades que eventos ya devolvieron - historial');

            $table->integer('cantidad_proveedor_acreedor')->default(0)
                ->change()
                ->comment('Unidades en poder del proveedor (yo debo devolver) - yo le debo');
            $table->integer('cantidad_proveedor_devuelto')->default(0)
                ->change()
                ->comment('Unidades que ya devolví al proveedor - historial');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestable_stock', function (Blueprint $table) {
            // Revertir renombramiento
            $table->renameColumn('cantidad_cliente_deudor', 'cantidad_prestamo_cliente_activo');
            $table->renameColumn('cantidad_cliente_devuelto', 'cantidad_prestamo_cliente_devuelto');
            $table->renameColumn('cantidad_evento_deudor', 'cantidad_prestamo_evento_activo');
            $table->renameColumn('cantidad_evento_devuelto', 'cantidad_prestamo_evento_devuelto');
            $table->renameColumn('cantidad_proveedor_acreedor', 'cantidad_prestamo_proveedor_activo');
            $table->renameColumn('cantidad_proveedor_devuelto', 'cantidad_prestamo_proveedor_devuelto');
        });
    }
};
