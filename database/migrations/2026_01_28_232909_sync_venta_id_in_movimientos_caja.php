<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * ✅ Sincronizar venta_id en movimientos_caja basándose en numero_documento
     * Buscar coincidencia entre movimientos_caja.numero_documento y ventas.numero
     */
    public function up(): void
    {
        // ✅ Sincronizar venta_id usando PostgreSQL syntax (UPDATE...FROM)
        \Illuminate\Support\Facades\DB::statement('
            UPDATE movimientos_caja mc
            SET venta_id = v.id
            FROM ventas v
            WHERE mc.numero_documento = v.numero
            AND mc.venta_id IS NULL
            AND v.id IS NOT NULL
        ');

        \Illuminate\Support\Facades\Log::info('✅ Migración: venta_id sincronizado en movimientos_caja desde ventas basándose en numero_documento');
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
