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
        Schema::table('compra_prestable_detalles', function (Blueprint $table) {
            $table->unsignedBigInteger('prestable_padre_id')->nullable()->after('prestable_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('compra_prestable_detalles', function (Blueprint $table) {
            $table->dropColumn('prestable_padre_id');
        });
    }
};
