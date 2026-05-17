<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class EstadosLogisticaPickupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Agregar estados específicos para la funcionalidad de pickup (retiro en almacén).
     */
    public function run(): void
    {
        // Obtener los estados existentes para obtener su ID
        $existingStates = DB::table('estados_logistica')
            ->where('categoria', 'venta_logistica')
            ->get()
            ->keyBy('codigo');

        // Nuevos estados para pickup
        $pickupStates = [
            [
                'codigo' => 'PENDIENTE_RETIRO',
                'nombre' => 'Pendiente de Retiro',
                'descripcion' => 'Pedido está listo para ser retirado por el cliente en almacén',
                'color' => '#FFC107',
                'icono' => 'store',
                'orden' => 2, // Después de SIN_ENTREGA
                'es_estado_final' => false,
                'permite_edicion' => true,
                'requiere_aprobacion' => false,
            ],
            [
                'codigo' => 'RETIRADO',
                'nombre' => 'Retirado',
                'descripcion' => 'El cliente retiró su pedido del almacén',
                'color' => '#4CAF50',
                'icono' => 'check-circle',
                'orden' => 5, // Al final de los estados activos, antes de PROBLEMAS/CANCELADA
                'es_estado_final' => true,
                'permite_edicion' => false,
                'requiere_aprobacion' => false,
            ],
        ];

        // Insertar los nuevos estados
        foreach ($pickupStates as $state) {
            // Solo insertar si no existe
            $exists = DB::table('estados_logistica')
                ->where('codigo', $state['codigo'])
                ->where('categoria', 'venta_logistica')
                ->exists();

            if (!$exists) {
                DB::table('estados_logistica')->insert([
                    'codigo' => $state['codigo'],
                    'categoria' => 'venta_logistica',
                    'nombre' => $state['nombre'],
                    'descripcion' => $state['descripcion'] ?? null,
                    'color' => $state['color'],
                    'icono' => $state['icono'],
                    'orden' => $state['orden'],
                    'es_estado_final' => $state['es_estado_final'],
                    'permite_edicion' => $state['permite_edicion'],
                    'requiere_aprobacion' => $state['requiere_aprobacion'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Crear transiciones para PICKUP si la tabla transiciones_estado existe
        if (Schema::hasTable('transiciones_estado')) {
            $this->createPickupTransitions();
        }
    }

    /**
     * Crear transiciones de estado válidas para el flujo de pickup.
     */
    private function createPickupTransitions(): void
    {
        $states = DB::table('estados_logistica')
            ->where('categoria', 'venta_logistica')
            ->get()
            ->keyBy('codigo');

        // Transiciones para pickup
        $transitions = [
            // De SIN_ENTREGA a PENDIENTE_RETIRO (cuando se prepara para pickup)
            ['origen' => 'SIN_ENTREGA', 'destino' => 'PENDIENTE_RETIRO', 'requiere_permiso' => null],

            // De PENDIENTE_RETIRO a RETIRADO (confirmación de retiro)
            ['origen' => 'PENDIENTE_RETIRO', 'destino' => 'RETIRADO', 'requiere_permiso' => null],

            // De PENDIENTE_RETIRO a PROBLEMAS (si hay inconvenientes)
            ['origen' => 'PENDIENTE_RETIRO', 'destino' => 'PROBLEMAS', 'requiere_permiso' => null],

            // De PROBLEMAS a PENDIENTE_RETIRO (reagendar pickup)
            ['origen' => 'PROBLEMAS', 'destino' => 'PENDIENTE_RETIRO', 'requiere_permiso' => null],
        ];

        foreach ($transitions as $transition) {
            // Verificar que ambos estados existan
            if (!isset($states[$transition['origen']]) || !isset($states[$transition['destino']])) {
                continue;
            }

            // Solo crear si no existe
            $exists = DB::table('transiciones_estado')
                ->where('estado_origen_id', $states[$transition['origen']]->id)
                ->where('estado_destino_id', $states[$transition['destino']]->id)
                ->where('categoria', 'venta_logistica')
                ->exists();

            if (!$exists) {
                DB::table('transiciones_estado')->insert([
                    'estado_origen_id' => $states[$transition['origen']]->id,
                    'estado_destino_id' => $states[$transition['destino']]->id,
                    'categoria' => 'venta_logistica',
                    'requiere_permiso' => $transition['requiere_permiso'],
                    'automatica' => false,
                    'notificar' => true,
                    'activa' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
