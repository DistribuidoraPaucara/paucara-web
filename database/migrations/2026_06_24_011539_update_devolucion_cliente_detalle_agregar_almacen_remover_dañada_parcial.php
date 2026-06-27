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
        Schema::table('devolucion_cliente_detalle', function (Blueprint $table) {
            // Agregar almacén
            $table->foreignId('almacenes_prestables_id')
                ->nullable()
                ->after('prestamo_cliente_detalle_id')
                ->constrained('almacenes_prestables')
                ->onDelete('restrict');

            // Remover cantidad_dañada_parcial
            $table->dropColumn('cantidad_dañada_parcial');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('devolucion_cliente_detalle', function (Blueprint $table) {
            $table->dropForeign(['almacenes_prestables_id']);
            $table->dropColumn('almacenes_prestables_id');
            $table->integer('cantidad_dañada_parcial')->unsigned()->default(0)->after('cantidad_devuelta');
        });
    }
};
