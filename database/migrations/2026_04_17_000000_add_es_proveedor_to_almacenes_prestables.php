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
        Schema::table('almacenes_prestables', function (Blueprint $table) {
            // Agregar columna para identificar si es almacén de proveedor
            $table->boolean('es_proveedor')->default(false)
                ->after('activo')
                ->comment('Indica si este almacén pertenece a un proveedor (true) o es de la distribuidora (false)');

            // Agregar índice para búsquedas rápidas
            $table->index('es_proveedor');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('almacenes_prestables', function (Blueprint $table) {
            $table->dropIndex(['es_proveedor']);
            $table->dropColumn('es_proveedor');
        });
    }
};
