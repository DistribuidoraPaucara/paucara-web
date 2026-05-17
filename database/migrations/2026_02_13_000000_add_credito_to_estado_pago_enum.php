<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * ✅ NUEVA 2026-02-13: Agregar 'CREDITO' al ENUM estado_pago
     *
     * Permite marcar ventas como "promesa de pago" (crédito)
     * que NO afectan movimientos de caja
     */
    public function up(): void
    {
        // ✅ PostgreSQL: Remover restricción CHECK antigua y crear una nueva con 'CREDITO'
        DB::statement("
            ALTER TABLE entregas_venta_confirmaciones
            DROP CONSTRAINT IF EXISTS entregas_venta_confirmaciones_estado_pago_check
        ");

        // ✅ Agregar nueva restricción CHECK que incluya 'CREDITO'
        DB::statement("
            ALTER TABLE entregas_venta_confirmaciones
            ADD CONSTRAINT entregas_venta_confirmaciones_estado_pago_check
            CHECK (estado_pago IN ('PAGADO', 'PARCIAL', 'NO_PAGADO', 'CREDITO'))
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // PostgreSQL no permite remover valores de ENUM
        // Dejar como está (backward compatible)
        \Log::warning('⚠️ [Migración] No se puede remover CREDITO del ENUM estado_pago. Valor permanecerá en la BD.');
    }
};
