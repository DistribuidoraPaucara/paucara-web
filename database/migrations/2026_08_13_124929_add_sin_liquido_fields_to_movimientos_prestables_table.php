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
        Schema::table('movimientos_prestables', function (Blueprint $table) {
            $table->unsignedBigInteger('cantidad_sin_liquido_anterior')->default(0)->nullable()->after('cantidad_dañada_registrada');
            $table->unsignedBigInteger('cantidad_sin_liquido_posterior')->default(0)->nullable()->after('cantidad_sin_liquido_anterior');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_prestables', function (Blueprint $table) {
            $table->dropColumn(['cantidad_sin_liquido_anterior', 'cantidad_sin_liquido_posterior']);
        });
    }
};
