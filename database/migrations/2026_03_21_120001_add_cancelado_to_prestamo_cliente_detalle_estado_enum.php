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
        // Agregar CANCELADO al CHECK constraint de estado en prestamo_cliente_detalle
        // Primero, eliminar la restricción actual
        DB::statement("
            ALTER TABLE prestamo_cliente_detalle
            DROP CONSTRAINT prestamo_cliente_detalle_estado_check
        ");

        // Luego, agregar la nueva restricción con CANCELADO incluido
        DB::statement("
            ALTER TABLE prestamo_cliente_detalle
            ADD CONSTRAINT prestamo_cliente_detalle_estado_check
            CHECK (estado IN ('ACTIVO', 'COMPLETAMENTE_DEVUELTO', 'PARCIALMENTE_DEVUELTO', 'CANCELADO'))
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir a la restricción original sin CANCELADO
        DB::statement("
            ALTER TABLE prestamo_cliente_detalle
            DROP CONSTRAINT prestamo_cliente_detalle_estado_check
        ");

        DB::statement("
            ALTER TABLE prestamo_cliente_detalle
            ADD CONSTRAINT prestamo_cliente_detalle_estado_check
            CHECK (estado IN ('ACTIVO', 'COMPLETAMENTE_DEVUELTO', 'PARCIALMENTE_DEVUELTO'))
        ");
    }
};
