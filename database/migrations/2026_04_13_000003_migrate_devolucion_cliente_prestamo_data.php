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
        // Migrar datos de devolucion_cliente_prestamo a las nuevas tablas
        DB::transaction(function () {
            // Obtener todos los registros de devolucion_cliente_prestamo con la información del prestamo
            $viejas = DB::table('devolucion_cliente_prestamo')
                ->join('prestamo_cliente_detalle as pcd',
                       'devolucion_cliente_prestamo.prestamo_cliente_detalle_id', '=', 'pcd.id')
                ->select(
                    'devolucion_cliente_prestamo.*',
                    'pcd.prestamo_cliente_id'
                )
                ->orderBy('pcd.prestamo_cliente_id')
                ->orderBy('devolucion_cliente_prestamo.fecha_devolucion')
                ->orderBy('devolucion_cliente_prestamo.id')
                ->get();

            if ($viejas->isEmpty()) {
                return; // No hay datos que migrar
            }

            // Agrupar por (prestamo_cliente_id + fecha_devolucion + chofer_id)
            $grupos = $viejas->groupBy(function ($row) {
                return $row->prestamo_cliente_id . '|' . $row->fecha_devolucion . '|' . ($row->chofer_id ?? 'null');
            });

            foreach ($grupos as $key => $filas) {
                $primera = $filas->first();

                // Crear cabecera en devolucion_cliente
                $cabecera_id = DB::table('devolucion_cliente')->insertGetId([
                    'prestamo_cliente_id'           => $primera->prestamo_cliente_id,
                    'fecha_devolucion'              => $primera->fecha_devolucion,
                    'monto_cobrado_daño_total'      => $filas->sum('monto_cobrado_daño'),
                    'monto_garantia_devuelta_total' => $filas->sum('monto_garantia_devuelta'),
                    'observaciones'                 => $primera->observaciones,
                    'chofer_id'                     => $primera->chofer_id,
                    'created_at'                    => $primera->created_at ?? now(),
                    'updated_at'                    => $primera->updated_at ?? now(),
                ]);

                // Crear detalles en devolucion_cliente_detalle
                foreach ($filas as $fila) {
                    DB::table('devolucion_cliente_detalle')->insert([
                        'devolucion_cliente_id'       => $cabecera_id,
                        'prestamo_cliente_detalle_id' => $fila->prestamo_cliente_detalle_id,
                        'cantidad_devuelta'           => $fila->cantidad_devuelta,
                        'cantidad_dañada_parcial'     => $fila->cantidad_dañada_parcial,
                        'cantidad_dañada_total'       => $fila->cantidad_dañada_total,
                        'monto_cobrado_daño'          => $fila->monto_cobrado_daño,
                        'monto_garantia_devuelta'     => $fila->monto_garantia_devuelta,
                        'created_at'                  => now(),
                        'updated_at'                  => now(),
                    ]);
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar datos migrados
        DB::table('devolucion_cliente_detalle')->truncate();
        DB::table('devolucion_cliente')->truncate();
    }
};
