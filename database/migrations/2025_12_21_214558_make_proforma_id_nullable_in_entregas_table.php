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
        Schema::table('entregas', function (Blueprint $table) {
            // Hacer proforma_id nullable para soportar entregas desde ventas
            $table->unsignedBigInteger('proforma_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entregas', function (Blueprint $table) {
            $table->unsignedBigInteger('proforma_id')->nullable(false)->change();
        });
    }
};
