<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('tipo_operacion_caja')->insertOrIgnore([
            ['codigo' => 'SERVICIO', 'nombre' => 'Servicio'],
        ]);
    }

    public function down(): void
    {
        DB::table('tipo_operacion_caja')->where('codigo', 'SERVICIO')->delete();
    }
};
