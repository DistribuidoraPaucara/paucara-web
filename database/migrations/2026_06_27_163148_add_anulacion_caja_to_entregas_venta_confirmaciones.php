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
        // ✅ NUEVO (2026-06-27): Agregar ANULACION_CAJA como valor válido a las restricciones CHECK
        // Para PostgreSQL, necesitamos actualizar las restricciones CHECK

        // 1️⃣ Primero, eliminar las restricciones CHECK existentes
        \Illuminate\Support\Facades\DB::statement("
            ALTER TABLE entregas_venta_confirmaciones
            DROP CONSTRAINT IF EXISTS entregas_venta_confirmaciones_tipo_novedad_check
        ");

        \Illuminate\Support\Facades\DB::statement("
            ALTER TABLE entregas_venta_confirmaciones
            DROP CONSTRAINT IF EXISTS entregas_venta_confirmaciones_tipo_confirmacion_check
        ");

        // 2️⃣ Limpiar valores NULL o inválidos
        \Illuminate\Support\Facades\DB::statement("
            UPDATE entregas_venta_confirmaciones
            SET tipo_novedad = NULL
            WHERE tipo_novedad NOT IN ('CLIENTE_CERRADO', 'DEVOLUCION_PARCIAL', 'RECHAZADO', 'NO_CONTACTADO')
            AND tipo_novedad IS NOT NULL
        ");

        \Illuminate\Support\Facades\DB::statement("
            UPDATE entregas_venta_confirmaciones
            SET tipo_confirmacion = NULL
            WHERE tipo_confirmacion NOT IN ('COMPLETA', 'RECHAZADO', 'CLIENTE_CERRADO', 'DEVOLUCION_PARCIAL', 'NO_CONTACTADO')
            AND tipo_confirmacion IS NOT NULL
        ");

        // 3️⃣ Agregar las nuevas restricciones CHECK con ANULACION_CAJA
        // ✅ tipo_entrega: COMPLETA | CON_NOVEDAD (NO NOVEDAD)
        try {
            \Illuminate\Support\Facades\DB::statement("
                ALTER TABLE entregas_venta_confirmaciones
                ADD CONSTRAINT entregas_venta_confirmaciones_tipo_entrega_check
                CHECK (tipo_entrega IN ('COMPLETA', 'CON_NOVEDAD'))
            ");
        } catch (\Exception $e) {
            // Si la restricción ya existe, ignorar
        }

        // ✅ tipo_novedad: Incluir ANULACION_CAJA
        try {
            \Illuminate\Support\Facades\DB::statement("
                ALTER TABLE entregas_venta_confirmaciones
                ADD CONSTRAINT entregas_venta_confirmaciones_tipo_novedad_check
                CHECK (tipo_novedad IS NULL OR tipo_novedad IN ('CLIENTE_CERRADO', 'DEVOLUCION_PARCIAL', 'RECHAZADO', 'NO_CONTACTADO', 'ANULACION_CAJA'))
            ");
        } catch (\Exception $e) {
            // Si la restricción ya existe, ignorar
        }

        // ✅ tipo_confirmacion: Incluir ANULACION_CAJA
        try {
            \Illuminate\Support\Facades\DB::statement("
                ALTER TABLE entregas_venta_confirmaciones
                ADD CONSTRAINT entregas_venta_confirmaciones_tipo_confirmacion_check
                CHECK (tipo_confirmacion IN ('COMPLETA', 'RECHAZADO', 'CLIENTE_CERRADO', 'DEVOLUCION_PARCIAL', 'NO_CONTACTADO', 'ANULACION_CAJA') OR tipo_confirmacion IS NULL)
            ");
        } catch (\Exception $e) {
            // Si la restricción ya existe, ignorar
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // ✅ Revertir cambios: eliminar ANULACION_CAJA de las restricciones
        \Illuminate\Support\Facades\DB::statement("
            ALTER TABLE entregas_venta_confirmaciones
            DROP CONSTRAINT IF EXISTS entregas_venta_confirmaciones_tipo_novedad_check
        ");

        \Illuminate\Support\Facades\DB::statement("
            ALTER TABLE entregas_venta_confirmaciones
            ADD CONSTRAINT entregas_venta_confirmaciones_tipo_novedad_check
            CHECK (tipo_novedad IN ('CLIENTE_CERRADO', 'DEVOLUCION_PARCIAL', 'RECHAZADO'))
        ");

        \Illuminate\Support\Facades\DB::statement("
            ALTER TABLE entregas_venta_confirmaciones
            DROP CONSTRAINT IF EXISTS entregas_venta_confirmaciones_tipo_confirmacion_check
        ");

        \Illuminate\Support\Facades\DB::statement("
            ALTER TABLE entregas_venta_confirmaciones
            ADD CONSTRAINT entregas_venta_confirmaciones_tipo_confirmacion_check
            CHECK (tipo_confirmacion IN ('COMPLETA', 'RECHAZADO', 'CLIENTE_CERRADO', 'DEVOLUCION_PARCIAL', 'NO_CONTACTADO'))
        ");
    }
};
