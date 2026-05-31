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
            $table->foreignId('almacenes_prestables_id')
                ->nullable()
                ->after('proveedor_id')
                ->constrained('almacenes_prestables')
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
            $table->dropForeignKeyIfExists(['almacenes_prestables_id']);
            $table->dropColumn('almacenes_prestables_id');
        });
    }
};
