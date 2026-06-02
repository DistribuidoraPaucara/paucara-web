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
        Schema::table('prestamo_evento_detalle', function (Blueprint $table) {
            $table->json('almacenes_ids')->nullable()->after('cantidad');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestamo_evento_detalle', function (Blueprint $table) {
            $table->dropColumn('almacenes_ids');
        });
    }
};
