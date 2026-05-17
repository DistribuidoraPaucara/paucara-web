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
        Schema::table('historial_precios', function (Blueprint $table) {
            $table->unsignedBigInteger('tipo_precio_id')->nullable()->after('usuario');
            $table->foreign('tipo_precio_id')->references('id')->on('tipos_precio')->onDelete('set null');
            $table->index('tipo_precio_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('historial_precios', function (Blueprint $table) {
            $table->dropForeign(['tipo_precio_id']);
            $table->dropColumn('tipo_precio_id');
        });
    }
};
