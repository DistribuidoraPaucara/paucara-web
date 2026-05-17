<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ✅ Sincronizar tipo_pago_id en movimientos_caja desde tabla ventas
        // Basándose en el numero_documento (número de venta)
        // ✅ Sintaxis PostgreSQL (no MySQL)
        \Illuminate\Support\Facades\DB::statement('
            UPDATE movimientos_caja mc
            SET tipo_pago_id = v.tipo_pago_id
            FROM ventas v
            WHERE mc.numero_documento = v.numero
            AND mc.tipo_operacion_id IN (
                SELECT id FROM tipo_operacion_caja
                WHERE codigo IN (\'VENTA\', \'CREDITO\')
            )
            AND mc.tipo_pago_id IS NULL
            AND v.tipo_pago_id IS NOT NULL
        ');

        \Illuminate\Support\Facades\Log::info('✅ Migración: tipo_pago_id sincronizado en movimientos_caja desde ventas');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // ✅ No deshacer la sincronización (es data, no estructura)
        \Illuminate\Support\Facades\Log::info('⏭️ Migración de sincronización: no se puede deshacer (cambios de data)');
    }
};
