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
        Schema::table('stock_productos', function (Blueprint $table) {
            $table->decimal('precio_costo', 10, 2)->nullable()->after('fecha_vencimiento');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_productos', function (Blueprint $table) {
            $table->dropColumn('precio_costo');
        });
    }
};
