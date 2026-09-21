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
            // Agregar venta_id si no existe
            if (!Schema::hasColumn('movimientos_prestables', 'venta_id')) {
                $table->foreignId('venta_id')->nullable()->constrained('ventas')->nullOnDelete()->after('referencia_id')->index();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_prestables', function (Blueprint $table) {
            if (Schema::hasColumn('movimientos_prestables', 'venta_id')) {
                $table->dropForeignKey(['venta_id']);
                $table->dropColumn('venta_id');
            }
        });
    }
};
