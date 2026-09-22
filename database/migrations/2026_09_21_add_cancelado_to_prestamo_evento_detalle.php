<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE prestamo_evento_detalle DROP CONSTRAINT prestamo_evento_detalle_estado_check");
        DB::statement("ALTER TABLE prestamo_evento_detalle ADD CONSTRAINT prestamo_evento_detalle_estado_check CHECK (estado IN ('ACTIVO', 'COMPLETAMENTE_DEVUELTO', 'PARCIALMENTE_DEVUELTO', 'CANCELADO'))");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE prestamo_evento_detalle DROP CONSTRAINT prestamo_evento_detalle_estado_check");
        DB::statement("ALTER TABLE prestamo_evento_detalle ADD CONSTRAINT prestamo_evento_detalle_estado_check CHECK (estado IN ('ACTIVO', 'COMPLETAMENTE_DEVUELTO', 'PARCIALMENTE_DEVUELTO'))");
    }
};
