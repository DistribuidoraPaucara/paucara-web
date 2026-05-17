<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migrar datos existentes de prestamo_cliente a prestamo_cliente_detalle
        // Solo migrar aquellos que tengan prestable_id no nulo
        DB::statement('
            INSERT INTO prestamo_cliente_detalle
            (prestamo_cliente_id, prestable_id, cantidad_prestada, precio_unitario, precio_prestamo, estado, created_at, updated_at)
            SELECT
                id,
                prestable_id,
                COALESCE(cantidad, 0),
                precio_unitario,
                precio_prestamo,
                estado,
                NOW(),
                NOW()
            FROM prestamo_cliente
            WHERE prestable_id IS NOT NULL
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // En rollback, simplemente dejamos los datos
        // No hacemos nada - la tabla prestamo_cliente_detalle se eliminará en la migración 0
    }
};
