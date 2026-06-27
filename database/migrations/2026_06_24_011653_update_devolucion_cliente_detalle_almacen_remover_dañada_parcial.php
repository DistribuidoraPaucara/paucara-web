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
        Schema::table('devolucion_cliente_detalle_almacenes', function (Blueprint $table) {
            $table->dropColumn('cantidad_dañada_parcial');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('devolucion_cliente_detalle_almacenes', function (Blueprint $table) {
            $table->integer('cantidad_dañada_parcial')->unsigned()->default(0)->after('cantidad_devuelta');
        });
    }
};
