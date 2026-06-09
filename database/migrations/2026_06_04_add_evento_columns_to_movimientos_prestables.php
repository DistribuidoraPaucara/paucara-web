<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('movimientos_prestables', function (Blueprint $table) {
            // Agregar columnas para préstamos a eventos
            $table->integer('prestamo_evento_anterior')->default(0)->after('prestamo_proveedor_anterior');
            $table->integer('prestamo_evento_posterior')->default(0)->after('prestamo_proveedor_posterior');

            // Agregar columnas para compras
            $table->integer('compra_anterior')->default(0)->after('vendida_anterior');
            $table->integer('compra_posterior')->default(0)->after('vendida_posterior');

            // Agregar índices
            $table->index('prestamo_evento_anterior');
            $table->index('prestamo_evento_posterior');
            $table->index('compra_anterior');
            $table->index('compra_posterior');
        });
    }

    public function down(): void
    {
        Schema::table('movimientos_prestables', function (Blueprint $table) {
            $table->dropColumn([
                'prestamo_evento_anterior',
                'prestamo_evento_posterior',
                'compra_anterior',
                'compra_posterior',
            ]);
        });
    }
};
