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
            // Agregar prestamo_proveedor_id si no existe
            if (!Schema::hasColumn('movimientos_prestables', 'prestamo_proveedor_id')) {
                $table->unsignedBigInteger('prestamo_proveedor_id')->nullable()->after('prestamo_evento_id')->index();
                $table->foreign('prestamo_proveedor_id')->references('id')->on('prestamo_proveedor')->nullOnDelete();
            }

            // Agregar compra_id si no existe
            if (!Schema::hasColumn('movimientos_prestables', 'compra_id')) {
                $table->unsignedBigInteger('compra_id')->nullable()->after('venta_id')->index();
                $table->foreign('compra_id')->references('id')->on('compras')->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_prestables', function (Blueprint $table) {
            $table->dropForeignIdIfExists('prestamo_proveedor_id');
            $table->dropForeignIdIfExists('compra_id');
        });
    }
};
