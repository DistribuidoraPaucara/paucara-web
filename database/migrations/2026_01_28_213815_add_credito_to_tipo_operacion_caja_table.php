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
        // ✅ Insertar tipo de operación CREDITO para registrar créditos otorgados
        \Illuminate\Support\Facades\DB::table('tipo_operacion_caja')->insertOrIgnore([
            'codigo' => 'CREDITO',
            'nombre' => 'Crédito Otorgado',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // ✅ Eliminar tipo de operación CREDITO
        \Illuminate\Support\Facades\DB::table('tipo_operacion_caja')
            ->where('codigo', 'CREDITO')
            ->delete();
    }
};
