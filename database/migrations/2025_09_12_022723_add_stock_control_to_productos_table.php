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
        Schema::table('productos', function (Blueprint $table) {
            // Verificar si las columnas ya existen antes de crearlas
            if (! Schema::hasColumn('productos', 'stock_minimo')) {
                $table->integer('stock_minimo')->default(0)->comment('Stock mínimo para alertas');
            }
            if (! Schema::hasColumn('productos', 'stock_maximo')) {
                $table->integer('stock_maximo')->nullable()->comment('Stock máximo recomendado');
            }
            if (! Schema::hasColumn('productos', 'controlar_stock')) {
                $table->boolean('controlar_stock')->default(true)->comment('Si debe controlar stock o es servicio');
            }
            if (! Schema::hasColumn('productos', 'permitir_venta_sin_stock')) {
                $table->boolean('permitir_venta_sin_stock')->default(false)->comment('Permitir venta aunque no haya stock');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropColumn(['stock_minimo', 'stock_maximo', 'controlar_stock', 'permitir_venta_sin_stock']);
        });
    }
};
