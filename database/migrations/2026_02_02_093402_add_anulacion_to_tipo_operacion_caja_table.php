<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Agregar tipo de operación ANULACION para reversiones de pagos y otros movimientos
     */
    public function up(): void
    {
        // Insertar tipo de operación ANULACION si no existe
        DB::table('tipo_operacion_caja')->insertOrIgnore([
            'codigo' => 'ANULACION',
            'nombre' => 'Anulación',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar tipo de operación ANULACION
        DB::table('tipo_operacion_caja')
            ->where('codigo', 'ANULACION')
            ->delete();
    }
};
