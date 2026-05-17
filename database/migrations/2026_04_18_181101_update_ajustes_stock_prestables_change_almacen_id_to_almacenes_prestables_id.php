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
        Schema::table('ajustes_stock_prestables', function (Blueprint $table) {
            // Eliminar la foreign key antigua
            $table->dropForeign(['almacen_id']);
            // Eliminar la columna
            $table->dropColumn('almacen_id');
        });

        Schema::table('ajustes_stock_prestables', function (Blueprint $table) {
            // Agregar la columna correcta con foreign key
            $table->foreignId('almacenes_prestables_id')
                ->after('prestable_stock_id')
                ->constrained('almacenes_prestables')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ajustes_stock_prestables', function (Blueprint $table) {
            // Eliminar la foreign key nueva
            $table->dropForeign(['almacenes_prestables_id']);
            // Eliminar la columna
            $table->dropColumn('almacenes_prestables_id');
        });

        Schema::table('ajustes_stock_prestables', function (Blueprint $table) {
            // Restaurar la columna antigua
            $table->foreignId('almacen_id')
                ->after('prestable_stock_id')
                ->constrained('almacenes')
                ->onDelete('cascade');
        });
    }
};
