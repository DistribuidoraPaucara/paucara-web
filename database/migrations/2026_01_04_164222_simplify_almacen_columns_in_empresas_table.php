<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Eliminar FK para almacen_id_principal si existe
        DB::statement("
            ALTER TABLE empresas
            DROP CONSTRAINT IF EXISTS empresas_almacen_id_principal_foreign
        ");

        Schema::table('empresas', function (Blueprint $table) {
            // Eliminar almacen_id_principal
            $table->dropColumn('almacen_id_principal');

            // Renombrar almacen_id_venta a almacen_id
            $table->renameColumn('almacen_id_venta', 'almacen_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            // Restaurar almacen_id_principal
            $table->foreignId('almacen_id_principal')
                ->nullable()
                ->constrained('almacenes')
                ->nullOnDelete();

            // Renombrar almacen_id de vuelta a almacen_id_venta
            $table->renameColumn('almacen_id', 'almacen_id_venta');
        });
    }
};
