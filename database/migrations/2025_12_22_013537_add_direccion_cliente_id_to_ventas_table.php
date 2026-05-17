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
        Schema::table('ventas', function (Blueprint $table) {
            if (!Schema::hasColumn('ventas', 'direccion_cliente_id')) {
                $table->unsignedBigInteger('direccion_cliente_id')->nullable()->after('cliente_id');
                $table->foreign('direccion_cliente_id')
                    ->references('id')
                    ->on('direcciones_cliente')
                    ->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            if (Schema::hasColumn('ventas', 'direccion_cliente_id')) {
                $table->dropForeign(['direccion_cliente_id']);
                $table->dropColumn('direccion_cliente_id');
            }
        });
    }
};
