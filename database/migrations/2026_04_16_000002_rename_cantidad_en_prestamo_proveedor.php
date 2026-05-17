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
        Schema::table('prestable_stock', function (Blueprint $table) {
            $table->renameColumn('cantidad_en_prestamo_proveedor', 'cantidad_que_debo_devolver');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestable_stock', function (Blueprint $table) {
            $table->renameColumn('cantidad_que_debo_devolver', 'cantidad_en_prestamo_proveedor');
        });
    }
};
