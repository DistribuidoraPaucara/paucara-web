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
        Schema::table('rutas', function (Blueprint $table) {
            // Hacer zona_id nullable
            $table->unsignedBigInteger('zona_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rutas', function (Blueprint $table) {
            // Revert zona_id to NOT NULL
            $table->unsignedBigInteger('zona_id')->nullable(false)->change();
        });
    }
};
