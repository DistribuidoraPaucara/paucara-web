<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * ✅ Sincronizar pago_id en movimientos_caja basándose en numero_documento
     * Extraer ID de pagos del formato "PAGO-<id>" en numero_documento
     */
    public function up(): void
    {
        // ✅ Sincronizar pago_id usando PostgreSQL syntax
        // Extraer número del formato "PAGO-123" usando SUBSTRING
        \Illuminate\Support\Facades\DB::statement("
            UPDATE movimientos_caja mc
            SET pago_id = CAST(
                SUBSTRING(mc.numero_documento FROM POSITION('-' IN mc.numero_documento) + 1)
                AS BIGINT
            )
            WHERE mc.numero_documento LIKE 'PAGO-%'
            AND mc.pago_id IS NULL
            AND SUBSTRING(mc.numero_documento FROM POSITION('-' IN mc.numero_documento) + 1) ~ '^[0-9]+$'
        ");

        \Illuminate\Support\Facades\Log::info('✅ Migración: pago_id sincronizado en movimientos_caja desde numero_documento');
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
