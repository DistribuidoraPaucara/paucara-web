<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Agregar estados faltantes de venta_logistica que son usados por determinarEstadoLogistico()
     *
     * Estados que necesitamos:
     * - SIN_ENTREGA: La venta no tiene entregas asignadas
     * - PROGRAMADO: Tiene entregas programadas
     * - EN_PREPARACION: Tiene entregas en preparación/carga
     * - EN_TRANSITO: Tiene entregas en tránsito
     * - ENTREGADA: Todas las entregas entregadas
     * - PROBLEMAS: Una o más entregas con problemas
     * - CANCELADA: Todas las entregas canceladas
     *
     * Nota: Los estados PENDIENTE_ENVIO, PREPARANDO, ENVIADO, ENTREGADO, PENDIENTE_RETIRO, RETIRADO
     * ya existen desde las migraciones anteriores
     */
    public function up(): void
    {
        $estadosFaltantes = [
            [
                'codigo' => 'SIN_ENTREGA',
                'categoria' => 'venta_logistica',
                'nombre' => 'Sin Entrega',
                'descripcion' => 'La venta no tiene entregas asignadas',
                'color' => '#9E9E9E',
                'icono' => 'block',
                'orden' => 0,
                'es_estado_final' => false,
                'permite_edicion' => false,
            ],
            [
                'codigo' => 'PROGRAMADO',
                'categoria' => 'venta_logistica',
                'nombre' => 'Programado',
                'descripcion' => 'La venta está programada para ser entregada',
                'color' => '#2196F3',
                'icono' => 'event-note',
                'orden' => 1,
                'es_estado_final' => false,
                'permite_edicion' => false,
            ],
            [
                'codigo' => 'EN_PREPARACION',
                'categoria' => 'venta_logistica',
                'nombre' => 'En Preparación',
                'descripcion' => 'La venta está siendo preparada para su entrega',
                'color' => '#FF9800',
                'icono' => 'build',
                'orden' => 2,
                'es_estado_final' => false,
                'permite_edicion' => false,
            ],
            [
                'codigo' => 'EN_TRANSITO',
                'categoria' => 'venta_logistica',
                'nombre' => 'En Tránsito',
                'descripcion' => 'La venta está siendo transportada',
                'color' => '#4CAF50',
                'icono' => 'directions-car',
                'orden' => 3,
                'es_estado_final' => false,
                'permite_edicion' => false,
            ],
            [
                'codigo' => 'ENTREGADA',
                'categoria' => 'venta_logistica',
                'nombre' => 'Entregada',
                'descripcion' => 'La venta ha sido entregada exitosamente',
                'color' => '#4CAF50',
                'icono' => 'check-circle',
                'orden' => 4,
                'es_estado_final' => true,
                'permite_edicion' => false,
            ],
            [
                'codigo' => 'PROBLEMAS',
                'categoria' => 'venta_logistica',
                'nombre' => 'Con Problemas',
                'descripcion' => 'La venta tiene problemas en su entrega (novedad o rechazo)',
                'color' => '#F44336',
                'icono' => 'error',
                'orden' => 5,
                'es_estado_final' => false,
                'permite_edicion' => true,
            ],
            [
                'codigo' => 'CANCELADA',
                'categoria' => 'venta_logistica',
                'nombre' => 'Cancelada',
                'descripcion' => 'La venta ha sido cancelada',
                'color' => '#757575',
                'icono' => 'cancel',
                'orden' => 6,
                'es_estado_final' => true,
                'permite_edicion' => false,
            ],
        ];

        foreach ($estadosFaltantes as $estado) {
            // Verificar si ya existe
            $exists = DB::table('estados_logistica')
                ->where('codigo', $estado['codigo'])
                ->where('categoria', $estado['categoria'])
                ->exists();

            if (!$exists) {
                DB::table('estados_logistica')->insert(array_merge(
                    $estado,
                    [
                        'activo' => true,
                        'requiere_aprobacion' => false,
                        'metadatos' => null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                ));

                \Log::info('✅ Estado agregado a estados_logistica', [
                    'codigo' => $estado['codigo'],
                    'categoria' => $estado['categoria'],
                ]);
            } else {
                \Log::info('⏭️  Estado ya existe en estados_logistica', [
                    'codigo' => $estado['codigo'],
                    'categoria' => $estado['categoria'],
                ]);
            }
        }
    }

    public function down(): void
    {
        // Eliminar los estados agregados
        $codigos = [
            'SIN_ENTREGA',
            'PROGRAMADO',
            'EN_PREPARACION',
            'EN_TRANSITO',
            'ENTREGADA',
            'PROBLEMAS',
            'CANCELADA',
        ];

        DB::table('estados_logistica')
            ->whereIn('codigo', $codigos)
            ->where('categoria', 'venta_logistica')
            ->delete();
    }
};
