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
        DB::table('tipo_operacion_caja')->insertOrIgnore([
            [
                'codigo' => 'DEVOLUCION',
                'nombre' => 'Devolución',
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('tipo_operacion_caja')
            ->where('codigo', 'DEVOLUCION')
            ->delete();
    }
};
