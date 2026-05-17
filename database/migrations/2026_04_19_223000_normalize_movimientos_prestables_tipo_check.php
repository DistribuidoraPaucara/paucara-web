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
        DB::statement("ALTER TABLE movimientos_prestables DROP CONSTRAINT IF EXISTS movimientos_prestables_tipo_check");
        DB::statement("ALTER TABLE movimientos_prestables ADD CONSTRAINT movimientos_prestables_tipo_check CHECK (tipo IN ('AJUSTE_DIRECTO', 'AJUSTE_RELATIVO', 'ENTRADA', 'SALIDA', 'CONSUMO_RESERVA', 'DISTRIBUCION_RESERVA', 'LIBERACION_RESERVA', 'VENTA_PRESTABLE', 'COMPRA_PRESTABLE', 'ANULACION_COMPRA_PRESTABLE', 'ANULACION_VENTA_PRESTABLE'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE movimientos_prestables DROP CONSTRAINT IF EXISTS movimientos_prestables_tipo_check");
        DB::statement("ALTER TABLE movimientos_prestables ADD CONSTRAINT movimientos_prestables_tipo_check CHECK (tipo IN ('AJUSTE_DIRECTO', 'AJUSTE_RELATIVO', 'ENTRADA', 'SALIDA', 'CONSUMO_RESERVA', 'DISTRIBUCION_RESERVA', 'LIBERACION_RESERVA', 'VENTA_PRESTABLE'))");
    }
};
