<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ✅ NUEVO: Agregar 'ENTRADA_COMPRA_PRODUCTO' al CHECK constraint de tipo
        // Cuando se reciben productos del proveedor, se incrementa cantidad_disponible
        DB::statement("ALTER TABLE movimientos_prestables DROP CONSTRAINT IF EXISTS movimientos_prestables_tipo_check");

        DB::statement("ALTER TABLE movimientos_prestables ADD CONSTRAINT movimientos_prestables_tipo_check CHECK (tipo IN ('AJUSTE_DIRECTO', 'AJUSTE_RELATIVO', 'ENTRADA', 'SALIDA', 'CONSUMO_RESERVA', 'DISTRIBUCION_RESERVA', 'LIBERACION_RESERVA', 'VENTA_PRESTABLE', 'VENTA_PRODUCTO', 'ENTRADA_COMPRA_PRODUCTO'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE movimientos_prestables DROP CONSTRAINT IF EXISTS movimientos_prestables_tipo_check");

        DB::statement("ALTER TABLE movimientos_prestables ADD CONSTRAINT movimientos_prestables_tipo_check CHECK (tipo IN ('AJUSTE_DIRECTO', 'AJUSTE_RELATIVO', 'ENTRADA', 'SALIDA', 'CONSUMO_RESERVA', 'DISTRIBUCION_RESERVA', 'LIBERACION_RESERVA', 'VENTA_PRESTABLE', 'VENTA_PRODUCTO'))");
    }
};
