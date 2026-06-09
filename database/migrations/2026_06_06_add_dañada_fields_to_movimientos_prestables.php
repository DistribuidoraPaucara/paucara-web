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
        Schema::table('movimientos_prestables', function (Blueprint $table) {
            // ✅ NUEVO: Campos para registrar cantidades dañadas por cliente
            $table->integer('cantidad_cliente_dañada_anterior')->default(0)->after('prestamo_cliente_anterior');
            $table->integer('cantidad_cliente_dañada_posterior')->default(0)->after('prestamo_cliente_posterior');

            // ✅ NUEVO: Campos para registrar cantidades dañadas por proveedor
            $table->integer('cantidad_proveedor_dañada_anterior')->default(0)->after('prestamo_proveedor_anterior');
            $table->integer('cantidad_proveedor_dañada_posterior')->default(0)->after('prestamo_proveedor_posterior');

            // ✅ NUEVO: Campos para registrar cantidades dañadas por evento
            $table->integer('cantidad_evento_dañada_anterior')->default(0)->after('prestamo_evento_anterior');
            $table->integer('cantidad_evento_dañada_posterior')->default(0)->after('prestamo_evento_posterior');

            // ✅ NUEVO: Cantidad de daño registrado en este movimiento (para auditoría)
            $table->integer('cantidad_dañada_registrada')->default(0)->after('cantidad');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_prestables', function (Blueprint $table) {
            $table->dropColumn([
                'cantidad_cliente_dañada_anterior',
                'cantidad_cliente_dañada_posterior',
                'cantidad_proveedor_dañada_anterior',
                'cantidad_proveedor_dañada_posterior',
                'cantidad_evento_dañada_anterior',
                'cantidad_evento_dañada_posterior',
                'cantidad_dañada_registrada',
            ]);
        });
    }
};
