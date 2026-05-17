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
        Schema::table('sectores', function (Blueprint $table) {
            $table->dropUnique('uq_almacen_sector_generico');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sectores', function (Blueprint $table) {
            $table->unique(['almacen_id', 'es_generico'], 'uq_almacen_sector_generico');
        });
    }
};
