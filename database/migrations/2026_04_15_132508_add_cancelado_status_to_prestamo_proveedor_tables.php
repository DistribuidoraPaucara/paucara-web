<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Para PostgreSQL: Cambiar el tipo de dato de la columna estado
        // Usar TEXT temporalmente, agregar CANCELADO, luego recrear el check constraint

        // 1. Cambiar prestamo_proveedor.estado a TEXT
        DB::statement("ALTER TABLE prestamo_proveedor ALTER COLUMN estado TYPE TEXT");

        // 2. Cambiar prestamo_proveedor_detalle.estado a TEXT
        DB::statement("ALTER TABLE prestamo_proveedor_detalle ALTER COLUMN estado TYPE TEXT");

        // 3. Eliminar constraints antiguos
        DB::statement("ALTER TABLE prestamo_proveedor DROP CONSTRAINT IF EXISTS prestamo_proveedor_estado_check");
        DB::statement("ALTER TABLE prestamo_proveedor_detalle DROP CONSTRAINT IF EXISTS prestamo_proveedor_detalle_estado_check");

        // 4. Crear nuevos check constraints que incluyan CANCELADO
        DB::statement("ALTER TABLE prestamo_proveedor ADD CONSTRAINT prestamo_proveedor_estado_check CHECK (estado IN ('ACTIVO', 'COMPLETAMENTE_DEVUELTO', 'PARCIALMENTE_DEVUELTO', 'CANCELADO'))");

        DB::statement("ALTER TABLE prestamo_proveedor_detalle ADD CONSTRAINT prestamo_proveedor_detalle_estado_check CHECK (estado IN ('ACTIVO', 'COMPLETAMENTE_DEVUELTO', 'PARCIALMENTE_DEVUELTO', 'CANCELADO'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir a los estados originales
        DB::statement("ALTER TABLE prestamo_proveedor DROP CONSTRAINT IF EXISTS prestamo_proveedor_estado_check");
        DB::statement("ALTER TABLE prestamo_proveedor_detalle DROP CONSTRAINT IF EXISTS prestamo_proveedor_detalle_estado_check");

        DB::statement("ALTER TABLE prestamo_proveedor ADD CONSTRAINT prestamo_proveedor_estado_check CHECK (estado IN ('ACTIVO', 'COMPLETAMENTE_DEVUELTO', 'PARCIALMENTE_DEVUELTO'))");
        DB::statement("ALTER TABLE prestamo_proveedor_detalle ADD CONSTRAINT prestamo_proveedor_detalle_estado_check CHECK (estado IN ('ACTIVO', 'COMPLETAMENTE_DEVUELTO', 'PARCIALMENTE_DEVUELTO'))");
    }
};
