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
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            // Agregar FK a mermas_inventario si no existe
            if (! Schema::hasColumn('movimientos_inventario', 'merma_inventario_id')) {
                $table->foreignId('merma_inventario_id')
                    ->nullable()
                    ->constrained('mermas_inventario')
                    ->cascadeOnDelete()
                    ->after('ajuste_inventario_id');

                $table->index('merma_inventario_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            if (Schema::hasColumn('movimientos_inventario', 'merma_inventario_id')) {
                $table->dropForeignIdFor('mermas_inventario', 'merma_inventario_id');
                $table->dropColumn('merma_inventario_id');
            }
        });
    }
};
