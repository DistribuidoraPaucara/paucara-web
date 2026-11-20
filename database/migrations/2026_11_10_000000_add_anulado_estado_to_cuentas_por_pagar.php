<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Permite el estado ANULADO en cuentas_por_pagar: al anular una compra sin pagos activos
 * su cuenta por pagar se marca como ANULADO (se conserva para el historial en vez de borrarla).
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE cuentas_por_pagar DROP CONSTRAINT IF EXISTS cuentas_por_pagar_estado_check');
        DB::statement("ALTER TABLE cuentas_por_pagar ADD CONSTRAINT cuentas_por_pagar_estado_check
            CHECK (estado::text IN ('PENDIENTE', 'PAGADO', 'VENCIDO', 'PARCIAL', 'ANULADO'))");
    }

    public function down(): void
    {
        // Falla si ya existen cuentas ANULADAS: hay que reasignarles otro estado antes de revertir
        DB::statement('ALTER TABLE cuentas_por_pagar DROP CONSTRAINT IF EXISTS cuentas_por_pagar_estado_check');
        DB::statement("ALTER TABLE cuentas_por_pagar ADD CONSTRAINT cuentas_por_pagar_estado_check
            CHECK (estado::text IN ('PENDIENTE', 'PAGADO', 'VENCIDO', 'PARCIAL'))");
    }
};
