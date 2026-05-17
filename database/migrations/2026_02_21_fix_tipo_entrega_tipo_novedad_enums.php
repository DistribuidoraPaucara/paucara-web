<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * ✅ FIX: Actualizar CHECK constraints de tipo_entrega y tipo_novedad
     * - tipo_entrega: cambiar NOVEDAD → CON_NOVEDAD
     * - tipo_novedad: agregar NO_CONTACTADO, cambiar RECHAZADO → RECHAZADA
     */
    public function up(): void
    {
        // 1. Remover constraints ANTES de actualizar datos
        DB::statement('ALTER TABLE "entregas_venta_confirmaciones" DROP CONSTRAINT IF EXISTS "entregas_venta_confirmaciones_tipo_entrega_check"');
        DB::statement('ALTER TABLE "entregas_venta_confirmaciones" DROP CONSTRAINT IF EXISTS "entregas_venta_confirmaciones_tipo_novedad_check"');

        // 2. Ahora cambiar valores existentes RECHAZADO → RECHAZADA
        DB::table('entregas_venta_confirmaciones')
            ->where('tipo_novedad', 'RECHAZADO')
            ->update(['tipo_novedad' => 'RECHAZADA']);

        // 3. Agregar nuevo constraint para tipo_entrega con CON_NOVEDAD
        DB::statement('ALTER TABLE "entregas_venta_confirmaciones" ADD CONSTRAINT "entregas_venta_confirmaciones_tipo_entrega_check" CHECK ("tipo_entrega" IN (\'COMPLETA\', \'CON_NOVEDAD\', \'NOVEDAD\'))');

        // 4. Agregar nuevo constraint para tipo_novedad con NO_CONTACTADO y RECHAZADA
        DB::statement('ALTER TABLE "entregas_venta_confirmaciones" ADD CONSTRAINT "entregas_venta_confirmaciones_tipo_novedad_check" CHECK ("tipo_novedad" IS NULL OR "tipo_novedad" IN (\'CLIENTE_CERRADO\', \'DEVOLUCION_PARCIAL\', \'RECHAZADA\', \'NO_CONTACTADO\'))');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remover constraints nuevos
        DB::statement('ALTER TABLE "entregas_venta_confirmaciones" DROP CONSTRAINT IF EXISTS "entregas_venta_confirmaciones_tipo_entrega_check"');
        DB::statement('ALTER TABLE "entregas_venta_confirmaciones" DROP CONSTRAINT IF EXISTS "entregas_venta_confirmaciones_tipo_novedad_check"');

        // Revertir cambios de datos
        DB::table('entregas_venta_confirmaciones')
            ->where('tipo_novedad', 'RECHAZADA')
            ->update(['tipo_novedad' => 'RECHAZADO']);

        // Agregar constraints originales
        DB::statement('ALTER TABLE "entregas_venta_confirmaciones" ADD CONSTRAINT "entregas_venta_confirmaciones_tipo_entrega_check" CHECK ("tipo_entrega" IN (\'COMPLETA\', \'NOVEDAD\'))');
        DB::statement('ALTER TABLE "entregas_venta_confirmaciones" ADD CONSTRAINT "entregas_venta_confirmaciones_tipo_novedad_check" CHECK ("tipo_novedad" IN (\'CLIENTE_CERRADO\', \'DEVOLUCION_PARCIAL\', \'RECHAZADO\'))');
    }
};
