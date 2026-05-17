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
            // Agregar caja_id después de almacen_id
            $table->unsignedBigInteger('caja_id')->nullable()->after('almacen_id');

            // Crear índice para búsquedas rápidas
            $table->index('caja_id');

            // Relación con la tabla cajas
            $table->foreign('caja_id')
                ->references('id')
                ->on('cajas')
                ->onDelete('set null'); // Si se elimina caja, poner NULL (por seguridad)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropForeign(['caja_id']);
            $table->dropIndex(['caja_id']);
            $table->dropColumn('caja_id');
        });
    }
};
