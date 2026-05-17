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
        // PostgreSQL: Modificar el CHECK constraint para agregar VENTA_PRESTABLE

        // 1. Eliminar el constraint existente
        DB::statement("ALTER TABLE movimientos_prestables DROP CONSTRAINT IF EXISTS movimientos_prestables_tipo_check");

        // 2. Crear nuevo constraint que incluya VENTA_PRESTABLE
        DB::statement("ALTER TABLE movimientos_prestables ADD CONSTRAINT movimientos_prestables_tipo_check CHECK (tipo IN ('AJUSTE_DIRECTO', 'AJUSTE_RELATIVO', 'ENTRADA', 'SALIDA', 'CONSUMO_RESERVA', 'DISTRIBUCION_RESERVA', 'LIBERACION_RESERVA', 'VENTA_PRESTABLE'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir el constraint a su estado original
        DB::statement("ALTER TABLE movimientos_prestables DROP CONSTRAINT IF EXISTS movimientos_prestables_tipo_check");
        DB::statement("ALTER TABLE movimientos_prestables ADD CONSTRAINT movimientos_prestables_tipo_check CHECK (tipo IN ('AJUSTE_DIRECTO', 'AJUSTE_RELATIVO', 'ENTRADA', 'SALIDA', 'CONSUMO_RESERVA', 'DISTRIBUCION_RESERVA', 'LIBERACION_RESERVA'))");
    }
};
