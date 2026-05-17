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
        // Eliminar constraint existente
        DB::statement('ALTER TABLE entregas DROP CONSTRAINT IF EXISTS entregas_estado_check');

        // Recrear constraint con PROGRAMADO incluido
        DB::statement("
            ALTER TABLE entregas
            ADD CONSTRAINT entregas_estado_check
            CHECK (estado IN ('PROGRAMADO', 'ASIGNADA', 'EN_CAMINO', 'LLEGO', 'ENTREGADO', 'NOVEDAD', 'CANCELADA'))
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar constraint
        DB::statement('ALTER TABLE entregas DROP CONSTRAINT IF EXISTS entregas_estado_check');

        // Recrear constraint sin PROGRAMADO
        DB::statement("
            ALTER TABLE entregas
            ADD CONSTRAINT entregas_estado_check
            CHECK (estado IN ('ASIGNADA', 'EN_CAMINO', 'LLEGO', 'ENTREGADO', 'NOVEDAD', 'CANCELADA'))
        ");
    }
};
