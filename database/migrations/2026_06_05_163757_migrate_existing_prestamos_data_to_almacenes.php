<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // ============================================================
        // 1. MIGRAR DATOS: prestamo_cliente -> prestamo_cliente_almacenes
        // ============================================================
        DB::statement('
            INSERT INTO prestamo_cliente_almacenes
            (prestamo_cliente_detalle_id, almacenes_prestables_id, cantidad, es_proveedor, created_at, updated_at)
            SELECT
                pcd.id,
                pc.almacenes_prestables_id,
                pcd.cantidad_prestada,
                ap.es_proveedor,
                NOW(),
                NOW()
            FROM prestamo_cliente_detalle pcd
            JOIN prestamo_cliente pc ON pcd.prestamo_cliente_id = pc.id
            JOIN almacenes_prestables ap ON pc.almacenes_prestables_id = ap.id
            WHERE pc.almacenes_prestables_id IS NOT NULL
                AND NOT EXISTS (
                    SELECT 1 FROM prestamo_cliente_almacenes pca
                    WHERE pca.prestamo_cliente_detalle_id = pcd.id
                )
        ');

        // ============================================================
        // 2. MIGRAR DATOS: prestamo_evento (JSON) -> prestamo_evento_almacenes
        // ============================================================
        // Obtener todos los detalles con almacenes_ids JSON
        $eventosDetalles = DB::table('prestamo_evento_detalle')->get();

        foreach ($eventosDetalles as $detalle) {
            $almacenesIds = [];

            if (!empty($detalle->almacenes_ids)) {
                // El campo puede ser JSON array
                $almacenesIds = is_string($detalle->almacenes_ids)
                    ? json_decode($detalle->almacenes_ids, true)
                    : $detalle->almacenes_ids;
            }

            if (is_array($almacenesIds) && !empty($almacenesIds)) {
                foreach ($almacenesIds as $almacenId) {
                    // Obtener info del almacén
                    $almacen = DB::table('almacenes_prestables')->find($almacenId);

                    if ($almacen) {
                        // Verificar que no exista registro duplicado
                        $exists = DB::table('prestamo_evento_almacenes')
                            ->where('prestamo_evento_detalle_id', $detalle->id)
                            ->where('almacenes_prestables_id', $almacenId)
                            ->exists();

                        if (!$exists) {
                            DB::table('prestamo_evento_almacenes')->insert([
                                'prestamo_evento_detalle_id' => $detalle->id,
                                'almacenes_prestables_id' => $almacenId,
                                'cantidad' => $detalle->cantidad,
                                'es_proveedor' => (bool) $almacen->es_proveedor,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        }
                    }
                }
            }
        }

        // ============================================================
        // 3. MIGRAR DATOS: devolucion_cliente_detalle -> devolucion_cliente_detalle_almacenes
        // ============================================================
        // Para cada devolución de cliente, obtener el almacén original del préstamo
        DB::statement('
            INSERT INTO devolucion_cliente_detalle_almacenes
            (devolucion_cliente_detalle_id, almacenes_prestables_id, cantidad_devuelta,
             cantidad_dañada_parcial, cantidad_dañada_total, monto_garantia_devuelta,
             es_proveedor, created_at, updated_at)
            SELECT
                dcd.id,
                pca.almacenes_prestables_id,
                dcd.cantidad_devuelta,
                dcd.cantidad_dañada_parcial,
                dcd.cantidad_dañada_total,
                dcd.monto_garantia_devuelta,
                pca.es_proveedor,
                NOW(),
                NOW()
            FROM devolucion_cliente_detalle dcd
            JOIN prestamo_cliente_detalle pcd ON dcd.prestamo_cliente_detalle_id = pcd.id
            JOIN prestamo_cliente_almacenes pca ON pcd.id = pca.prestamo_cliente_detalle_id
            WHERE NOT EXISTS (
                SELECT 1 FROM devolucion_cliente_detalle_almacenes dcda
                WHERE dcda.devolucion_cliente_detalle_id = dcd.id
            )
        ');

        // ============================================================
        // 4. MIGRAR DATOS: devolucion_evento_detalle -> devolucion_evento_detalle_almacenes
        // ============================================================
        // Para cada devolución de evento, obtener almacenes del préstamo
        $eventoDevoluciones = DB::table('devolucion_evento_detalle')->get();

        foreach ($eventoDevoluciones as $devolucion) {
            $prestamoDet = DB::table('prestamo_evento_detalle')
                ->find($devolucion->prestamo_evento_detalle_id);

            if ($prestamoDet) {
                // Obtener almacenes del préstamo
                $almacenes = DB::table('prestamo_evento_almacenes')
                    ->where('prestamo_evento_detalle_id', $prestamoDet->id)
                    ->get();

                if ($almacenes->count() > 0) {
                    foreach ($almacenes as $almacen) {
                        $exists = DB::table('devolucion_evento_detalle_almacenes')
                            ->where('devolucion_evento_detalle_id', $devolucion->id)
                            ->where('almacenes_prestables_id', $almacen->almacenes_prestables_id)
                            ->exists();

                        if (!$exists) {
                            DB::table('devolucion_evento_detalle_almacenes')->insert([
                                'devolucion_evento_detalle_id' => $devolucion->id,
                                'almacenes_prestables_id' => $almacen->almacenes_prestables_id,
                                'cantidad_devuelta' => $devolucion->cantidad_devuelta,
                                'cantidad_dañada_parcial' => $devolucion->cantidad_dañada_parcial ?? 0,
                                'cantidad_dañada_total' => $devolucion->cantidad_dañada_total ?? 0,
                                'monto_cobrado_daño' => $devolucion->monto_cobrado_daño ?? 0,
                                'monto_garantia_devuelta' => $devolucion->monto_garantia_devuelta ?? 0,
                                'es_proveedor' => (bool) $almacen->es_proveedor,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        }
                    }
                }
            }
        }
    }

    public function down(): void
    {
        // Borrar datos migrados (en orden inverso para respetar FKs)
        DB::table('devolucion_evento_detalle_almacenes')->truncate();
        DB::table('devolucion_cliente_detalle_almacenes')->truncate();
        DB::table('prestamo_evento_almacenes')->truncate();
        DB::table('prestamo_cliente_almacenes')->truncate();
    }
};
