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
        Schema::table('prestamo_cliente', function (Blueprint $table) {
            $table->boolean('es_evento')->default(false)->after('es_venta');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestamo_cliente', function (Blueprint $table) {
            $table->dropColumn('es_evento');
        });
    }
};
