<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agregar estado BORRADOR para proformas en edición
     */
    public function up(): void
    {
        // ✅ Agregar BORRADOR como estado inicial para proformas
        DB::table('estados_logistica')->insertOrIgnore([
            'codigo'              => 'BORRADOR',
            'categoria'           => 'proforma',
            'nombre'              => 'Borrador',
            'color'               => '#9CA3AF',
            'icono'               => '📝',
            'orden'               => 0,
            'es_estado_final'     => false,
            'permite_edicion'     => true,
            'requiere_aprobacion' => false,
            'activo'              => true,
            'created_at'          => now(),
            'updated_at'          => now(),
        ]);

        // ✅ Agregar transición BORRADOR → PENDIENTE
        $estadoBorrador = DB::table('estados_logistica')
            ->where('codigo', 'BORRADOR')
            ->where('categoria', 'proforma')
            ->first();

        $estadoPendiente = DB::table('estados_logistica')
            ->where('codigo', 'PENDIENTE')
            ->where('categoria', 'proforma')
            ->first();

        if ($estadoBorrador && $estadoPendiente) {
            DB::table('transiciones_estado')->insertOrIgnore([
                'estado_origen_id'  => $estadoBorrador->id,
                'estado_destino_id' => $estadoPendiente->id,
                'categoria'         => 'proforma',
                'requiere_permiso'  => 'submitProforma',
                'automatica'        => false,
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // ✅ Eliminar la transición BORRADOR → PENDIENTE
        $estadoBorrador = DB::table('estados_logistica')
            ->where('codigo', 'BORRADOR')
            ->where('categoria', 'proforma')
            ->first();

        $estadoPendiente = DB::table('estados_logistica')
            ->where('codigo', 'PENDIENTE')
            ->where('categoria', 'proforma')
            ->first();

        if ($estadoBorrador && $estadoPendiente) {
            DB::table('transiciones_estado')
                ->where('estado_origen_id', $estadoBorrador->id)
                ->where('estado_destino_id', $estadoPendiente->id)
                ->delete();
        }

        // ✅ Eliminar estado BORRADOR
        DB::table('estados_logistica')
            ->where('codigo', 'BORRADOR')
            ->where('categoria', 'proforma')
            ->delete();
    }
};
