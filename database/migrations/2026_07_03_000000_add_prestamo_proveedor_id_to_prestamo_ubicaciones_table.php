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
        Schema::table('prestamo_ubicaciones', function (Blueprint $table) {
            $table->foreignId('prestamo_proveedor_id')
                ->nullable()
                ->after('prestamo_evento_id')
                ->constrained('prestamo_proveedor')
                ->cascadeOnDelete();

            $table->index('prestamo_proveedor_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestamo_ubicaciones', function (Blueprint $table) {
            $table->dropIndex(['prestamo_proveedor_id']);
            $table->dropForeign(['prestamo_proveedor_id']);
            $table->dropColumn('prestamo_proveedor_id');
        });
    }
};
