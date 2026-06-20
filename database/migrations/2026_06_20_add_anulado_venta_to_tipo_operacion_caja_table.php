<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Agregar tipo de operación ANULADO-VENTA para marcar ventas anuladas
     */
    public function up(): void
    {
        DB::table('tipo_operacion_caja')->insertOrIgnore([
            'codigo' => 'ANULADO-VENTA',
            'nombre' => 'Venta Anulada',
            'direccion' => null,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('tipo_operacion_caja')
            ->where('codigo', 'ANULADO-VENTA')
            ->delete();
    }
};
