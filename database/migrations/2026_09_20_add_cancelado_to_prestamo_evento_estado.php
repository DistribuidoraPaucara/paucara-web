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
        // Cambiar estado a TEXT temporalmente para agregar CANCELADO
        DB::statement("ALTER TABLE prestamo_evento ALTER COLUMN estado TYPE text");

        // Eliminar el constraint anterior
        DB::statement("ALTER TABLE prestamo_evento DROP CONSTRAINT IF EXISTS prestamo_evento_estado_check");

        // Crear nuevo constraint con CANCELADO incluido
        DB::statement("ALTER TABLE prestamo_evento ADD CONSTRAINT prestamo_evento_estado_check CHECK (estado IN ('ACTIVO', 'COMPLETAMENTE_DEVUELTO', 'PARCIALMENTE_DEVUELTO', 'VENCIDO', 'CANCELADO'))");

        // Volver a enum
        DB::statement("ALTER TABLE prestamo_evento ALTER COLUMN estado TYPE varchar(50)");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Volver a TEXT temporalmente
        DB::statement("ALTER TABLE prestamo_evento ALTER COLUMN estado TYPE text");

        // Eliminar el constraint actualizado
        DB::statement("ALTER TABLE prestamo_evento DROP CONSTRAINT IF EXISTS prestamo_evento_estado_check");

        // Restaurar el constraint original
        DB::statement("ALTER TABLE prestamo_evento ADD CONSTRAINT prestamo_evento_estado_check CHECK (estado IN ('ACTIVO', 'COMPLETAMENTE_DEVUELTO', 'PARCIALMENTE_DEVUELTO', 'VENCIDO'))");

        // Volver al original
        DB::statement("ALTER TABLE prestamo_evento ALTER COLUMN estado TYPE varchar(50)");
    }
};
