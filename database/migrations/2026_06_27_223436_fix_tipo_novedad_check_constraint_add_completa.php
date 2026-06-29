<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ✅ FIX: Agregar 'COMPLETA' al constraint de tipo_novedad
     * tipo_novedad ahora puede ser: COMPLETA, CLIENTE_CERRADO, DEVOLUCION_PARCIAL, RECHAZADO, NO_CONTACTADO, ANULACION_CAJA
     */
    public function up(): void
    {
        DB::statement('
            ALTER TABLE "entregas_venta_confirmaciones"
            DROP CONSTRAINT IF EXISTS "entregas_venta_confirmaciones_tipo_novedad_check"
        ');

        DB::statement('
            ALTER TABLE "entregas_venta_confirmaciones"
            ADD CONSTRAINT "entregas_venta_confirmaciones_tipo_novedad_check"
            CHECK (tipo_novedad IS NULL OR tipo_novedad IN (\'COMPLETA\', \'CLIENTE_CERRADO\', \'DEVOLUCION_PARCIAL\', \'RECHAZADO\', \'NO_CONTACTADO\', \'ANULACION_CAJA\'))
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('
            ALTER TABLE "entregas_venta_confirmaciones"
            DROP CONSTRAINT IF EXISTS "entregas_venta_confirmaciones_tipo_novedad_check"
        ');

        DB::statement('
            ALTER TABLE "entregas_venta_confirmaciones"
            ADD CONSTRAINT "entregas_venta_confirmaciones_tipo_novedad_check"
            CHECK (tipo_novedad IS NULL OR tipo_novedad IN (\'CLIENTE_CERRADO\', \'DEVOLUCION_PARCIAL\', \'RECHAZADO\', \'NO_CONTACTADO\', \'ANULACION_CAJA\'))
        ');
    }
};
