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
        Schema::table('prestable_condiciones', function (Blueprint $table) {
            $table->dropColumn('monto_daño_parcial');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestable_condiciones', function (Blueprint $table) {
            $table->decimal('monto_daño_parcial', 12, 2)->after('monto_garantia');
        });
    }
};
