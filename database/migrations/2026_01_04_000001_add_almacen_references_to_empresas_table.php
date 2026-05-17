<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agrega referencias de almacenes a la tabla empresas para parametrizar
     * la búsqueda de stock por almacén según la empresa.
     *
     * - almacen_id_principal: almacén por defecto para búsquedas de stock
     * - almacen_id_venta: almacén específico para la "Sala de Ventas" por empresa
     */
    public function up(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            // Almacén principal para búsquedas de stock generales
            $table->unsignedBigInteger('almacen_id_principal')->nullable()->after('es_principal');
            $table->foreign('almacen_id_principal')
                ->references('id')
                ->on('almacenes')
                ->onDelete('set null')
                ->onUpdate('cascade');

            // Almacén de venta (Sala de Ventas o equivalente)
            $table->unsignedBigInteger('almacen_id_venta')->nullable()->after('almacen_id_principal');
            $table->foreign('almacen_id_venta')
                ->references('id')
                ->on('almacenes')
                ->onDelete('set null')
                ->onUpdate('cascade');

            // Índices para mejor rendimiento en búsquedas
            $table->index('almacen_id_principal');
            $table->index('almacen_id_venta');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('empresas', function (Blueprint $table) {
            $table->dropForeignKeyIfExists('empresas_almacen_id_principal_foreign');
            $table->dropForeignKeyIfExists('empresas_almacen_id_venta_foreign');
            $table->dropIndex(['almacen_id_principal']);
            $table->dropIndex(['almacen_id_venta']);
            $table->dropColumn(['almacen_id_principal', 'almacen_id_venta']);
        });
    }
};
