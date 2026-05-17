<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * ✅ Actualizar enum tipo_entrega para usar CON_NOVEDAD en lugar de NOVEDAD
     * ✅ Agregar NO_CONTACTADO a tipo_novedad
     */
    public function up(): void
    {
        // ✅ PASO 1: Remover las restricciones CHECK PRIMERO (antes de actualizar datos)
        DB::statement("ALTER TABLE entregas_venta_confirmaciones DROP CONSTRAINT IF EXISTS entregas_venta_confirmaciones_tipo_entrega_check");
        DB::statement("ALTER TABLE entregas_venta_confirmaciones DROP CONSTRAINT IF EXISTS entregas_venta_confirmaciones_tipo_novedad_check");

        // ✅ PASO 2: Convertir valores NOVEDAD a CON_NOVEDAD
        DB::statement("UPDATE entregas_venta_confirmaciones SET tipo_entrega = 'CON_NOVEDAD' WHERE tipo_entrega = 'NOVEDAD'");

        // ✅ PASO 3: Corregir RECHAZADA a RECHAZADO
        DB::statement("UPDATE entregas_venta_confirmaciones SET tipo_novedad = 'RECHAZADO' WHERE tipo_novedad = 'RECHAZADA'");

        // ✅ PASO 4: Agregar nueva restricción para tipo_entrega con CON_NOVEDAD
        DB::statement("ALTER TABLE entregas_venta_confirmaciones ADD CONSTRAINT entregas_venta_confirmaciones_tipo_entrega_check CHECK (tipo_entrega IN ('COMPLETA', 'CON_NOVEDAD'))");

        // ✅ PASO 5: Agregar nueva restricción para tipo_novedad - agregar NO_CONTACTADO
        // Permitir NULL para registros sin novedad
        DB::statement("ALTER TABLE entregas_venta_confirmaciones ADD CONSTRAINT entregas_venta_confirmaciones_tipo_novedad_check CHECK (tipo_novedad IS NULL OR tipo_novedad IN ('CLIENTE_CERRADO', 'DEVOLUCION_PARCIAL', 'RECHAZADO', 'NO_CONTACTADO'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // ✅ Remover las restricciones CHECK PRIMERO
        DB::statement("ALTER TABLE entregas_venta_confirmaciones DROP CONSTRAINT IF EXISTS entregas_venta_confirmaciones_tipo_entrega_check");
        DB::statement("ALTER TABLE entregas_venta_confirmaciones DROP CONSTRAINT IF EXISTS entregas_venta_confirmaciones_tipo_novedad_check");

        // ✅ Revertir los cambios (volver a NOVEDAD y remover NO_CONTACTADO)
        DB::statement("UPDATE entregas_venta_confirmaciones SET tipo_entrega = 'NOVEDAD' WHERE tipo_entrega = 'CON_NOVEDAD'");

        // ✅ Revertir RECHAZADO a RECHAZADA
        DB::statement("UPDATE entregas_venta_confirmaciones SET tipo_novedad = 'RECHAZADA' WHERE tipo_novedad = 'RECHAZADO'");

        // ✅ Agregar las restricciones antiguas
        DB::statement("ALTER TABLE entregas_venta_confirmaciones ADD CONSTRAINT entregas_venta_confirmaciones_tipo_entrega_check CHECK (tipo_entrega IN ('COMPLETA', 'NOVEDAD'))");
        DB::statement("ALTER TABLE entregas_venta_confirmaciones ADD CONSTRAINT entregas_venta_confirmaciones_tipo_novedad_check CHECK (tipo_novedad IS NULL OR tipo_novedad IN ('CLIENTE_CERRADO', 'DEVOLUCION_PARCIAL', 'RECHAZADA'))");
    }
};
