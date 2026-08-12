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
        Schema::table('prestamo_cliente_detalle', function (Blueprint $table) {
            $table->integer('con_liquido')->default(0)->after('cantidad_prestada')->comment('Canastillas/embases que van con líquido');
            $table->integer('sin_liquido')->default(0)->after('con_liquido')->comment('Canastillas/embases que van sin líquido');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestamo_cliente_detalle', function (Blueprint $table) {
            $table->dropColumn(['con_liquido', 'sin_liquido']);
        });
    }
};
