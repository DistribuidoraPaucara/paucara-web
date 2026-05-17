<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Agregar nuevos tipos de operación de caja para pagos de sueldos y anticipos
        DB::table('tipo_operacion_caja')->upsert([
            ['codigo' => 'PAGO_SUELDO', 'nombre' => 'Pago de Sueldo'],
            ['codigo' => 'ANTICIPO', 'nombre' => 'Anticipo'],
        ], ['codigo'], ['nombre']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('tipo_operacion_caja')
            ->whereIn('codigo', ['PAGO_SUELDO', 'ANTICIPO'])
            ->delete();
    }
};
