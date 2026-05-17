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
        Schema::table('inventario_inicial_borrador_items', function (Blueprint $table) {
            $table->unsignedBigInteger('stock_producto_id')->nullable()->after('precio_costo');
            $table->foreign('stock_producto_id')
                ->references('id')
                ->on('stock_productos')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventario_inicial_borrador_items', function (Blueprint $table) {
            $table->dropForeign(['stock_producto_id']);
            $table->dropColumn('stock_producto_id');
        });
    }
};
