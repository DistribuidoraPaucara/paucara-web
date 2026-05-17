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
        // 1. Copiar datos de almacenes a almacenes_prestables
        DB::statement("
            INSERT INTO almacenes_prestables
            (empresa_id, nombre, direccion, ubicacion_fisica, requiere_transporte_externo, responsable, telefono, activo, created_at, updated_at)
            SELECT empresa_id, nombre, direccion, ubicacion_fisica, requiere_transporte_externo, responsable, telefono, activo, created_at, updated_at
            FROM almacenes
        ");

        // 2. Cambiar FK en prestable_stock
        Schema::table('prestable_stock', function (Blueprint $table) {
            // Primero eliminar la FK existente
            $table->dropForeign(['almacen_id']);

            // Cambiar el nombre de la columna
            $table->renameColumn('almacen_id', 'almacenes_prestables_id');

            // Agregar la nueva FK
            $table->foreign('almacenes_prestables_id')
                ->references('id')
                ->on('almacenes_prestables')
                ->cascadeOnDelete();
        });

        // 3. Actualizar el índice único
        Schema::table('prestable_stock', function (Blueprint $table) {
            $table->dropUnique(['prestable_id', 'almacen_id']);
            $table->unique(['prestable_id', 'almacenes_prestables_id']);
        });

        // 4. Actualizar el índice de búsqueda
        Schema::table('prestable_stock', function (Blueprint $table) {
            $table->dropIndex(['prestable_id', 'almacen_id']);
            $table->index(['prestable_id', 'almacenes_prestables_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. Revertir cambios en prestable_stock
        Schema::table('prestable_stock', function (Blueprint $table) {
            // Eliminar la FK nueva
            $table->dropForeign(['almacenes_prestables_id']);

            // Cambiar nombre de columna de vuelta
            $table->renameColumn('almacenes_prestables_id', 'almacen_id');

            // Restaurar la FK antigua
            $table->foreign('almacen_id')
                ->references('id')
                ->on('almacenes')
                ->cascadeOnDelete();
        });

        // 2. Restaurar índice único
        Schema::table('prestable_stock', function (Blueprint $table) {
            $table->dropUnique(['prestable_id', 'almacenes_prestables_id']);
            $table->unique(['prestable_id', 'almacen_id']);
        });

        // 3. Restaurar índice de búsqueda
        Schema::table('prestable_stock', function (Blueprint $table) {
            $table->dropIndex(['prestable_id', 'almacenes_prestables_id']);
            $table->index(['prestable_id', 'almacen_id']);
        });

        // 4. Eliminar datos de almacenes_prestables
        DB::statement('TRUNCATE TABLE almacenes_prestables');
    }
};
