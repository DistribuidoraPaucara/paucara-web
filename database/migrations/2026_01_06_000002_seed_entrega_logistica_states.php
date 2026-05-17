<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * FASE 1: SEED ESTADOS ENTREGA_LOGISTICA
 *
 * OBJETIVO: Insertar estados normalizados para entregas en estados_logistica
 *
 * CATEGORÍA: 'entrega_logistica'
 *
 * ESTADOS (en orden de flujo):
 * 1. PROGRAMADO - Estado inicial, entrega programada
 * 2. ASIGNADA - Asignada a chofer y vehículo
 * 3. PREPARACION_CARGA - Reporte generado, awaiting confirmación de carga
 * 4. EN_CARGA - Carga física en progreso
 * 5. LISTO_PARA_ENTREGA - Carga completada, lista para partir
 * 6. EN_TRANSITO - GPS activo, en ruta
 * 7. LLEGO - Llegó a destino
 * 8. ENTREGADO - Entrega confirmada
 * 9. NOVEDAD - Problema/incidencia
 * 10. CANCELADA - Cancelada
 */
return new class extends Migration
{
    public function up(): void
    {
        // Definir estados de entrega
        $estadosEntrega = [
            // FLUJO PRINCIPAL
            [
                'codigo' => 'PROGRAMADO',
                'nombre' => 'Programada',
                'descripcion' => 'Entrega programada, awaiting asignación de recursos',
                'orden' => 1,
                'color' => '#FFC107', // Amarillo - Pendiente
                'icono' => 'calendar',
                'es_estado_final' => false,
                'permite_edicion' => true,
                'requiere_aprobacion' => false,
            ],
            [
                'codigo' => 'ASIGNADA',
                'nombre' => 'Asignada',
                'descripcion' => 'Asignada a chofer y vehículo',
                'orden' => 2,
                'color' => '#2196F3', // Azul - Activo
                'icono' => 'truck',
                'es_estado_final' => false,
                'permite_edicion' => true,
                'requiere_aprobacion' => false,
            ],
            [
                'codigo' => 'PREPARACION_CARGA',
                'nombre' => 'Preparación de Carga',
                'descripcion' => 'Reporte generado, awaiting confirmación física de carga',
                'orden' => 3,
                'color' => '#FF9800', // Naranja - En proceso
                'icono' => 'box',
                'es_estado_final' => false,
                'permite_edicion' => true,
                'requiere_aprobacion' => true,
            ],
            [
                'codigo' => 'EN_CARGA',
                'nombre' => 'En Carga',
                'descripcion' => 'Carga física en progreso',
                'orden' => 4,
                'color' => '#FF9800', // Naranja - En proceso
                'icono' => 'package',
                'es_estado_final' => false,
                'permite_edicion' => false,
                'requiere_aprobacion' => false,
            ],
            [
                'codigo' => 'LISTO_PARA_ENTREGA',
                'nombre' => 'Listo para Entrega',
                'descripcion' => 'Carga completada, lista para que chofer inicie viaje',
                'orden' => 5,
                'color' => '#4CAF50', // Verde - Listo
                'icono' => 'check-circle',
                'es_estado_final' => false,
                'permite_edicion' => false,
                'requiere_aprobacion' => false,
            ],
            [
                'codigo' => 'EN_TRANSITO',
                'nombre' => 'En Tránsito',
                'descripcion' => 'En ruta hacia cliente con GPS activo',
                'orden' => 6,
                'color' => '#00BCD4', // Cyan - En movimiento
                'icono' => 'navigation',
                'es_estado_final' => false,
                'permite_edicion' => false,
                'requiere_aprobacion' => false,
            ],
            [
                'codigo' => 'LLEGO',
                'nombre' => 'Llegó',
                'descripcion' => 'Llegó a destino, awaiting confirmación de entrega',
                'orden' => 7,
                'color' => '#4CAF50', // Verde - Casi completado
                'icono' => 'location-on',
                'es_estado_final' => false,
                'permite_edicion' => false,
                'requiere_aprobacion' => false,
            ],
            [
                'codigo' => 'ENTREGADO',
                'nombre' => 'Entregado',
                'descripcion' => 'Entrega confirmada con firma o evidencia',
                'orden' => 8,
                'color' => '#4CAF50', // Verde - Completado
                'icono' => 'check-double',
                'es_estado_final' => true,
                'permite_edicion' => false,
                'requiere_aprobacion' => false,
            ],

            // ESTADOS ALTERNATIVOS
            [
                'codigo' => 'NOVEDAD',
                'nombre' => 'Con Novedad',
                'descripcion' => 'Problema o incidencia en la entrega',
                'orden' => 9,
                'color' => '#F44336', // Rojo - Alerta
                'icono' => 'alert-circle',
                'es_estado_final' => false,
                'permite_edicion' => true,
                'requiere_aprobacion' => false,
            ],
            [
                'codigo' => 'CANCELADA',
                'nombre' => 'Cancelada',
                'descripcion' => 'Entrega cancelada',
                'orden' => 10,
                'color' => '#9E9E9E', // Gris - Cancelado
                'icono' => 'close-circle',
                'es_estado_final' => true,
                'permite_edicion' => false,
                'requiere_aprobacion' => false,
            ],
            [
                'codigo' => 'RECHAZADO',
                'nombre' => 'Rechazada',
                'descripcion' => 'Rechazada en entrega por cliente',
                'orden' => 9,
                'color' => '#F44336', // Rojo - Rechazo
                'icono' => 'close',
                'es_estado_final' => false,
                'permite_edicion' => true,
                'requiere_aprobacion' => false,
            ],
        ];

        // Insertar estados, evitando duplicados
        foreach ($estadosEntrega as $estado) {
            DB::table('estados_logistica')->updateOrInsert(
                [
                    'codigo' => $estado['codigo'],
                    'categoria' => 'entrega_logistica',
                ],
                array_merge($estado, [
                    'categoria' => 'entrega_logistica',
                    'activo' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );

            \Log::info("✅ Estado insertado/actualizado: {$estado['codigo']}");
        }

        // Definir transiciones válidas entre estados de entrega
        $this->createTransiciones();

        // Definir mapeos de estado: entrega_logistica → venta_logistica
        $this->createMapeos();
    }

    public function down(): void
    {
        // Eliminar estados entrega_logistica
        DB::table('estados_logistica')
            ->where('categoria', 'entrega_logistica')
            ->delete();

        // Eliminar transiciones
        DB::table('transiciones_estado')
            ->where('categoria', 'entrega_logistica')
            ->delete();

        // Eliminar mapeos
        DB::table('mapeos_estado')
            ->where('categoria_origen', 'entrega_logistica')
            ->delete();
    }

    /**
     * Crear transiciones válidas entre estados de entrega
     */
    private function createTransiciones(): void
    {
        $transiciones = [
            // PROGRAMADO → ...
            ['origen' => 'PROGRAMADO', 'destino' => 'ASIGNADA', 'automatica' => false],
            ['origen' => 'PROGRAMADO', 'destino' => 'CANCELADA', 'automatica' => false],

            // ASIGNADA → ...
            ['origen' => 'ASIGNADA', 'destino' => 'PREPARACION_CARGA', 'automatica' => false],
            ['origen' => 'ASIGNADA', 'destino' => 'CANCELADA', 'automatica' => false],

            // PREPARACION_CARGA → ...
            ['origen' => 'PREPARACION_CARGA', 'destino' => 'EN_CARGA', 'automatica' => false],
            ['origen' => 'PREPARACION_CARGA', 'destino' => 'CANCELADA', 'automatica' => false],

            // EN_CARGA → ...
            ['origen' => 'EN_CARGA', 'destino' => 'LISTO_PARA_ENTREGA', 'automatica' => false],
            ['origen' => 'EN_CARGA', 'destino' => 'CANCELADA', 'automatica' => false],

            // LISTO_PARA_ENTREGA → ...
            ['origen' => 'LISTO_PARA_ENTREGA', 'destino' => 'EN_TRANSITO', 'automatica' => false],
            ['origen' => 'LISTO_PARA_ENTREGA', 'destino' => 'CANCELADA', 'automatica' => false],

            // EN_TRANSITO → ...
            ['origen' => 'EN_TRANSITO', 'destino' => 'LLEGO', 'automatica' => false],
            ['origen' => 'EN_TRANSITO', 'destino' => 'NOVEDAD', 'automatica' => false],
            ['origen' => 'EN_TRANSITO', 'destino' => 'CANCELADA', 'automatica' => false],

            // LLEGO → ...
            ['origen' => 'LLEGO', 'destino' => 'ENTREGADO', 'automatica' => false],
            ['origen' => 'LLEGO', 'destino' => 'RECHAZADO', 'automatica' => false],
            ['origen' => 'LLEGO', 'destino' => 'NOVEDAD', 'automatica' => false],

            // NOVEDAD → ...
            ['origen' => 'NOVEDAD', 'destino' => 'ASIGNADA', 'automatica' => false],
            ['origen' => 'NOVEDAD', 'destino' => 'CANCELADA', 'automatica' => false],

            // RECHAZADO → ...
            ['origen' => 'RECHAZADO', 'destino' => 'ASIGNADA', 'automatica' => false],
            ['origen' => 'RECHAZADO', 'destino' => 'CANCELADA', 'automatica' => false],
        ];

        foreach ($transiciones as $trans) {
            $estadoOrigen = DB::table('estados_logistica')
                ->where('codigo', $trans['origen'])
                ->where('categoria', 'entrega_logistica')
                ->first();

            $estadoDestino = DB::table('estados_logistica')
                ->where('codigo', $trans['destino'])
                ->where('categoria', 'entrega_logistica')
                ->first();

            if ($estadoOrigen && $estadoDestino) {
                DB::table('transiciones_estado')->updateOrInsert(
                    [
                        'estado_origen_id' => $estadoOrigen->id,
                        'estado_destino_id' => $estadoDestino->id,
                        'categoria' => 'entrega_logistica',
                    ],
                    [
                        'automatica' => $trans['automatica'],
                        'notificar' => true,
                        'activa' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }

        \Log::info("✅ Transiciones de entrega_logistica creadas");
    }

    /**
     * Crear mapeos de estado: entrega_logistica → venta_logistica
     *
     * Cuando el estado de una entrega cambia, la venta también debe cambiar
     */
    private function createMapeos(): void
    {
        $mapeos = [
            ['entrega' => 'PROGRAMADO', 'venta' => 'PENDIENTE_ENVIO'],
            ['entrega' => 'ASIGNADA', 'venta' => 'PENDIENTE_ENVIO'],
            ['entrega' => 'PREPARACION_CARGA', 'venta' => 'PREPARANDO'],
            ['entrega' => 'EN_CARGA', 'venta' => 'PREPARANDO'],
            ['entrega' => 'LISTO_PARA_ENTREGA', 'venta' => 'EN_PREPARACION'],
            ['entrega' => 'EN_TRANSITO', 'venta' => 'EN_TRANSITO'],
            ['entrega' => 'LLEGO', 'venta' => 'EN_TRANSITO'],
            ['entrega' => 'ENTREGADO', 'venta' => 'ENTREGADO'],
            ['entrega' => 'NOVEDAD', 'venta' => 'PROBLEMAS'],
            ['entrega' => 'RECHAZADO', 'venta' => 'PROBLEMAS'],
            ['entrega' => 'CANCELADA', 'venta' => 'CANCELADA'],
        ];

        foreach ($mapeos as $mapeo) {
            $estadoEntrega = DB::table('estados_logistica')
                ->where('codigo', $mapeo['entrega'])
                ->where('categoria', 'entrega_logistica')
                ->first();

            $estadoVenta = DB::table('estados_logistica')
                ->where('codigo', $mapeo['venta'])
                ->where('categoria', 'venta_logistica')
                ->first();

            if ($estadoEntrega && $estadoVenta) {
                DB::table('mapeos_estado')->updateOrInsert(
                    [
                        'categoria_origen' => 'entrega_logistica',
                        'estado_origen_id' => $estadoEntrega->id,
                        'categoria_destino' => 'venta_logistica',
                    ],
                    [
                        'estado_destino_id' => $estadoVenta->id,
                        'prioridad' => 100,
                        'activo' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }

        \Log::info("✅ Mapeos de entrega_logistica → venta_logistica creados");
    }
};
