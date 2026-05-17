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
        // Actualizar registros de devoluciones para apuntar a prestamo_cliente_detalle
        // Asumimos que hay 1 detalle por prestamo_cliente (debido a la migración anterior)
        DB::statement('
            UPDATE devolucion_cliente_prestamo
            SET prestamo_cliente_id = (
                SELECT pcd.id FROM prestamo_cliente_detalle pcd
                WHERE pcd.prestamo_cliente_id = devolucion_cliente_prestamo.prestamo_cliente_id
                LIMIT 1
            )
            WHERE EXISTS (
                SELECT 1 FROM prestamo_cliente_detalle pcd
                WHERE pcd.prestamo_cliente_id = devolucion_cliente_prestamo.prestamo_cliente_id
            )
        ');

        // Cambiar el nombre de la columna FK
        Schema::table('devolucion_cliente_prestamo', function (Blueprint $table) {
            // Quitar la FK antigua
            $table->dropForeign(['prestamo_cliente_id']);
            // Renombrar la columna
            $table->renameColumn('prestamo_cliente_id', 'prestamo_cliente_detalle_id');
            // Agregar nueva FK
            $table->foreign('prestamo_cliente_detalle_id')
                ->references('id')
                ->on('prestamo_cliente_detalle')
                ->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('devolucion_cliente_prestamo', function (Blueprint $table) {
            // Quitar la FK nueva
            $table->dropForeign(['prestamo_cliente_detalle_id']);
            // Renombrar columna de vuelta
            $table->renameColumn('prestamo_cliente_detalle_id', 'prestamo_cliente_id');
            // Re-agregar FK vieja
            $table->foreign('prestamo_cliente_id')
                ->references('id')
                ->on('prestamo_cliente')
                ->restrictOnDelete();
        });
    }
};
