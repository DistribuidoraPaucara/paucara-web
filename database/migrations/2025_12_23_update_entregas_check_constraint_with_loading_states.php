<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Actualizar la constraint de estados para incluir los nuevos estados del flujo de carga
     * PROGRAMADO → PREPARACION_CARGA → EN_CARGA → LISTO_PARA_ENTREGA → EN_TRANSITO → ENTREGADO
     */
    public function up(): void
    {
        // Eliminar constraint existente
        DB::statement('ALTER TABLE entregas DROP CONSTRAINT IF EXISTS entregas_estado_check');

        // Recrear constraint con todos los estados incluyendo los nuevos del flujo de carga
        DB::statement("
            ALTER TABLE entregas
            ADD CONSTRAINT entregas_estado_check
            CHECK (estado IN (
                'PROGRAMADO',
                'ASIGNADA',
                'PREPARACION_CARGA',
                'EN_CARGA',
                'LISTO_PARA_ENTREGA',
                'EN_CAMINO',
                'EN_TRANSITO',
                'LLEGO',
                'ENTREGADO',
                'NOVEDAD',
                'RECHAZADO',
                'CANCELADA'
            ))
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar constraint
        DB::statement('ALTER TABLE entregas DROP CONSTRAINT IF EXISTS entregas_estado_check');

        // Recrear constraint solo con los estados antiguos
        DB::statement("
            ALTER TABLE entregas
            ADD CONSTRAINT entregas_estado_check
            CHECK (estado IN ('PROGRAMADO', 'ASIGNADA', 'EN_CAMINO', 'LLEGO', 'ENTREGADO', 'NOVEDAD', 'CANCELADA'))
        ");
    }
};
