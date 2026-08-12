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
            $table->unsignedBigInteger('cantidad_sin_liquido')->default(0)->after('cantidad_disponible')
                ->comment('Cantidad de unidades sin líquido (vacías)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestable_stock', function (Blueprint $table) {
            $table->dropColumn('cantidad_sin_liquido');
        });
    }
};
