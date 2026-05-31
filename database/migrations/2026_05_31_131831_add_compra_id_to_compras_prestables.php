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
        Schema::table('compras_prestables', function (Blueprint $table) {
            $table->foreignId('compra_id')
                ->nullable()
                ->constrained('compras')
                ->onDelete('set null')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('compras_prestables', function (Blueprint $table) {
            $table->dropForeignKeyIfExists(['compra_id']);
            $table->dropColumn('compra_id');
        });
    }
};
