<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadosLogisticaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar tablas existentes
        DB::table('historial_estados')->truncate();
        DB::table('mapeos_estado')->truncate();
        DB::table('transiciones_estado')->truncate();
        DB::table('estados_logistica')->truncate();

        // PROFORMA STATES
        $proformaStates = [
            ['codigo' => 'BORRADOR', 'nombre' => 'Borrador', 'color' => '#9CA3AF', 'icono' => '📝', 'orden' => 0, 'permite_edicion' => true, 'es_estado_final' => false],
            ['codigo' => 'PENDIENTE', 'nombre' => 'Pendiente de Aprobación', 'color' => '#FFC107', 'icono' => '⌛', 'orden' => 1],
            ['codigo' => 'APROBADA', 'nombre' => 'Aprobada', 'color' => '#28A745', 'icono' => '✅', 'orden' => 2, 'requiere_aprobacion' => true],
            ['codigo' => 'RECHAZADA', 'nombre' => 'Rechazada', 'color' => '#DC3545', 'icono' => '✖️', 'orden' => 3, 'es_estado_final' => true, 'permite_edicion' => false],
            ['codigo' => 'CONVERTIDA', 'nombre' => 'Convertida a Venta', 'color' => '#17A2B8', 'icono' => '🔃', 'orden' => 4, 'es_estado_final' => true, 'permite_edicion' => false],
            ['codigo' => 'EN_RUTA', 'nombre' => 'En Ruta', 'color' => '#2196F3', 'icono' => '🚚', 'orden' => 5],
            ['codigo' => 'VENCIDA', 'nombre' => 'Vencida', 'color' => '#6C757D', 'icono' => '✖️', 'orden' => 6, 'es_estado_final' => true, 'permite_edicion' => false],
        ];

        // VENTA LOGISTIC STATES
        $ventaStates = [
            ['codigo' => 'PENDIENTE_RETIRO', 'nombre' => 'Pendiente de Retiro', 'color' => '#FFC107', 'icono' => '⌛', 'orden' => 0],
            ['codigo' => 'PENDIENTE_ENVIO', 'nombre' => 'Pendiente de Envío', 'color' => '#FF9800', 'icono' => '⏰', 'orden' => 1],
            ['codigo' => 'SIN_ENTREGA', 'nombre' => 'Sin Entrega Asignada', 'color' => '#E0E0E0', 'icono' => '✖️🚚', 'orden' => 2],
            ['codigo' => 'PROGRAMADO', 'nombre' => 'Entrega Programada', 'color' => '#FFC107', 'icono' => '📆', 'orden' => 3],
            ['codigo' => 'EN_PREPARACION', 'nombre' => 'En Preparación', 'color' => '#9C27B0', 'icono' => '📦', 'orden' => 4],
            ['codigo' => 'EN_TRANSITO', 'nombre' => 'En Tránsito', 'color' => '#2196F3', 'icono' => '🚚', 'orden' => 5],
            ['codigo' => 'ENTREGADA', 'nombre' => 'Entregada', 'color' => '#28A745', 'icono' => '✅', 'orden' => 6, 'es_estado_final' => true, 'permite_edicion' => false],
            ['codigo' => 'PROBLEMAS', 'nombre' => 'Con Problemas', 'color' => '#FF5722', 'icono' => '☢️', 'orden' => 7],
            ['codigo' => 'CANCELADA', 'nombre' => 'Cancelada', 'color' => '#6C757D', 'icono' => '✖️', 'orden' => 8, 'es_estado_final' => true, 'permite_edicion' => false],
            ['codigo' => 'RETIRADO', 'nombre' => 'Retirado', 'color' => '#28A745', 'icono' => '✅🚚', 'orden' => 9, 'es_estado_final' => true, 'permite_edicion' => false],
        ];

        // ENTREGA (DELIVERY) STATES
        $entregaStates = [
            ['codigo' => 'PROGRAMADO', 'nombre' => 'Programado', 'color' => '#FFC107', 'icono' => '⌚', 'orden' => 1],
            ['codigo' => 'ASIGNADA', 'nombre' => 'Asignada a Chofer', 'color' => '#0275D8', 'icono' => '✅', 'orden' => 2],
            ['codigo' => 'PREPARACION_CARGA', 'nombre' => 'Preparación de Carga', 'color' => '#9C27B0', 'icono' => '📦', 'orden' => 3],
            ['codigo' => 'EN_CARGA', 'nombre' => 'En Carga', 'color' => '#673AB7', 'icono' => '📦', 'orden' => 4],
            ['codigo' => 'LISTO_PARA_ENTREGA', 'nombre' => 'Listo para Entrega', 'color' => '#3F51B5', 'icono' => '✅', 'orden' => 5],
            ['codigo' => 'EN_CAMINO', 'nombre' => 'En Camino', 'color' => '#2196F3', 'icono' => '🛤️🚚', 'orden' => 6],
            ['codigo' => 'EN_TRANSITO', 'nombre' => 'En Tránsito', 'color' => '#03A9F4', 'icono' => '🛤️🚚', 'orden' => 7],
            ['codigo' => 'LLEGO', 'nombre' => 'Llegó a Destino', 'color' => '#00BCD4', 'icono' => '📍', 'orden' => 8],
            ['codigo' => 'ENTREGADO', 'nombre' => 'Entregado', 'color' => '#28A745', 'icono' => '✅', 'orden' => 9, 'es_estado_final' => true, 'permite_edicion' => false],
            ['codigo' => 'NOVEDAD', 'nombre' => 'Con Novedad', 'color' => '#FF9800', 'icono' => '⚠️', 'orden' => 10],
            ['codigo' => 'RECHAZADO', 'nombre' => 'Rechazado', 'color' => '#F44336', 'icono' => '✖️', 'orden' => 11, 'es_estado_final' => true, 'permite_edicion' => false],
            ['codigo' => 'CANCELADA', 'nombre' => 'Cancelada', 'color' => '#6C757D', 'icono' => '✖️', 'orden' => 12, 'es_estado_final' => true, 'permite_edicion' => false],
        ];

        // VEHICLE STATES
        $vehiculoStates = [
            ['codigo' => 'DISPONIBLE', 'nombre' => 'Disponible', 'color' => '#28A745', 'icono' => '✅', 'orden' => 1],
            ['codigo' => 'EN_RUTA', 'nombre' => 'En Ruta', 'color' => '#2196F3', 'icono' => '🛤️🚚', 'orden' => 2],
            ['codigo' => 'MANTENIMIENTO', 'nombre' => 'En Mantenimiento', 'color' => '#FFC107', 'icono' => '⚙️', 'orden' => 3],
            ['codigo' => 'FUERA_SERVICIO', 'nombre' => 'Fuera de Servicio', 'color' => '#DC3545', 'icono' => '🚧', 'orden' => 4],
        ];

        // PAYMENT STATES
        $pagoStates = [
            ['codigo' => 'PENDIENTE', 'nombre' => 'Pendiente', 'color' => '#FFC107', 'icono' => '⏳', 'orden' => 1],
            ['codigo' => 'PARCIAL', 'nombre' => 'Pago Parcial', 'color' => '#FF9800', 'icono' => '🌓', 'orden' => 2],
            ['codigo' => 'PAGADO', 'nombre' => 'Pagado Completo', 'color' => '#28A745', 'icono' => '✅', 'orden' => 3, 'es_estado_final' => true, 'permite_edicion' => false],
            ['codigo' => 'VENCIDO', 'nombre' => 'Vencido', 'color' => '#DC3545', 'icono' => '✖️', 'orden' => 4],
            ['codigo' => 'ANULADO', 'nombre' => 'Anulado', 'color' => '#6C757D', 'icono' => '✖️', 'orden' => 5, 'es_estado_final' => true, 'permite_edicion' => false],
        ];

        // Insert all states
        foreach (['proforma', 'venta_logistica', 'entrega', 'vehiculo', 'pago'] as $categoria) {
            $states = match ($categoria) {
                'proforma'        => $proformaStates,
                'venta_logistica' => $ventaStates,
                'entrega'         => $entregaStates,
                'vehiculo'        => $vehiculoStates,
                'pago'            => $pagoStates,
            };

            foreach ($states as $state) {
                DB::table('estados_logistica')->insert([
                    'codigo'              => $state['codigo'],
                    'categoria'           => $categoria,
                    'nombre'              => $state['nombre'],
                    'color'               => $state['color'],
                    'icono'               => $state['icono'],
                    'orden'               => $state['orden'],
                    'es_estado_final'     => $state['es_estado_final'] ?? false,
                    'permite_edicion'     => $state['permite_edicion'] ?? true,
                    'requiere_aprobacion' => $state['requiere_aprobacion'] ?? false,
                    'created_at'          => now(),
                    'updated_at'          => now(),
                ]);
            }
        }

        // Create transitions for PROFORMA
        $this->createProformaTransitions();

        // Create transitions for ENTREGA
        $this->createEntregaTransitions();

        // Create transitions for VENTA_LOGISTICA
        $this->createVentaTransitions();

        // Create transitions for VEHICULO
        $this->createVehiculoTransitions();

        // Create mappings: ENTREGA -> VENTA
        $this->createEntregaVentaMappings();
    }

    private function createProformaTransitions()
    {
        $states = DB::table('estados_logistica')
            ->where('categoria', 'proforma')
            ->get()
            ->keyBy('codigo');

        $transitions = [
            ['origen' => 'BORRADOR', 'destino' => 'PENDIENTE', 'requiere_permiso' => 'submitProforma'],
            ['origen' => 'BORRADOR', 'destino' => 'BORRADOR'],  // Permite continuar editando en borrador
            ['origen' => 'PENDIENTE', 'destino' => 'APROBADA', 'requiere_permiso' => 'approveProforma'],
            ['origen' => 'PENDIENTE', 'destino' => 'RECHAZADA', 'requiere_permiso' => 'rejectProforma'],
            ['origen' => 'APROBADA', 'destino' => 'CONVERTIDA'],
            ['origen' => 'APROBADA', 'destino' => 'VENCIDA', 'automatica' => true],
        ];

        foreach ($transitions as $transition) {
            DB::table('transiciones_estado')->insert([
                'estado_origen_id'  => $states[$transition['origen']]->id,
                'estado_destino_id' => $states[$transition['destino']]->id,
                'categoria'         => 'proforma',
                'requiere_permiso'  => $transition['requiere_permiso'] ?? null,
                'automatica'        => $transition['automatica'] ?? false,
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);
        }
    }

    private function createEntregaTransitions()
    {
        $states = DB::table('estados_logistica')
            ->where('categoria', 'entrega')
            ->get()
            ->keyBy('codigo');

        $transitions = [
            // Legacy workflow
            ['origen' => 'PROGRAMADO', 'destino' => 'ASIGNADA'],
            ['origen' => 'ASIGNADA', 'destino' => 'EN_CAMINO'],
            ['origen' => 'EN_CAMINO', 'destino' => 'LLEGO'],
            ['origen' => 'LLEGO', 'destino' => 'ENTREGADO'],

            // New loading workflow
            ['origen' => 'PROGRAMADO', 'destino' => 'PREPARACION_CARGA'],
            ['origen' => 'PREPARACION_CARGA', 'destino' => 'EN_CARGA'],
            ['origen' => 'EN_CARGA', 'destino' => 'LISTO_PARA_ENTREGA'],
            ['origen' => 'LISTO_PARA_ENTREGA', 'destino' => 'EN_TRANSITO'],
            ['origen' => 'EN_TRANSITO', 'destino' => 'ENTREGADO'],

            // Alternative paths
            ['origen' => 'PROGRAMADO', 'destino' => 'CANCELADA'],
            ['origen' => 'ASIGNADA', 'destino' => 'CANCELADA'],
            ['origen' => 'EN_CAMINO', 'destino' => 'CANCELADA'],
            ['origen' => 'LLEGO', 'destino' => 'CANCELADA'],
            ['origen' => 'PREPARACION_CARGA', 'destino' => 'CANCELADA'],
            ['origen' => 'EN_CARGA', 'destino' => 'CANCELADA'],
            ['origen' => 'LISTO_PARA_ENTREGA', 'destino' => 'CANCELADA'],
            ['origen' => 'EN_TRANSITO', 'destino' => 'CANCELADA'],

            // Issue handling
            ['origen' => 'EN_CAMINO', 'destino' => 'NOVEDAD'],
            ['origen' => 'LLEGO', 'destino' => 'NOVEDAD'],
            ['origen' => 'EN_TRANSITO', 'destino' => 'NOVEDAD'],
            ['origen' => 'LLEGO', 'destino' => 'RECHAZADO'],
            ['origen' => 'EN_TRANSITO', 'destino' => 'RECHAZADO'],
            ['origen' => 'NOVEDAD', 'destino' => 'ENTREGADO'],
            ['origen' => 'NOVEDAD', 'destino' => 'CANCELADA'],
            ['origen' => 'NOVEDAD', 'destino' => 'EN_CAMINO'], // Retry
        ];

        foreach ($transitions as $transition) {
            DB::table('transiciones_estado')->insert([
                'estado_origen_id'  => $states[$transition['origen']]->id,
                'estado_destino_id' => $states[$transition['destino']]->id,
                'categoria'         => 'entrega',
                'automatica'        => $transition['automatica'] ?? false,
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);
        }
    }

    private function createVentaTransitions()
    {
        $states = DB::table('estados_logistica')
            ->where('categoria', 'venta_logistica')
            ->get()
            ->keyBy('codigo');

        $transitions = [
            // Transiciones desde PENDIENTE_RETIRO (para PICKUP)
            ['origen' => 'PENDIENTE_RETIRO', 'destino' => 'PROGRAMADO'],
            ['origen' => 'PENDIENTE_RETIRO', 'destino' => 'CANCELADA'],
            // Transiciones desde PENDIENTE_ENVIO (para DELIVERY)
            ['origen' => 'PENDIENTE_ENVIO', 'destino' => 'EN_PREPARACION'],
            ['origen' => 'PENDIENTE_ENVIO', 'destino' => 'CANCELADA'],
            // Transiciones existentes
            ['origen' => 'SIN_ENTREGA', 'destino' => 'PROGRAMADO'],
            ['origen' => 'SIN_ENTREGA', 'destino' => 'CANCELADA'],
            ['origen' => 'PROGRAMADO', 'destino' => 'EN_PREPARACION'],
            ['origen' => 'PROGRAMADO', 'destino' => 'CANCELADA'],
            ['origen' => 'EN_PREPARACION', 'destino' => 'EN_TRANSITO'],
            ['origen' => 'EN_PREPARACION', 'destino' => 'CANCELADA'],
            ['origen' => 'EN_TRANSITO', 'destino' => 'ENTREGADA'],
            ['origen' => 'EN_TRANSITO', 'destino' => 'PROBLEMAS'],
            ['origen' => 'EN_TRANSITO', 'destino' => 'CANCELADA'],
            ['origen' => 'PROBLEMAS', 'destino' => 'ENTREGADA'],
            ['origen' => 'PROBLEMAS', 'destino' => 'CANCELADA'],
        ];

        foreach ($transitions as $transition) {
            DB::table('transiciones_estado')->insert([
                'estado_origen_id'  => $states[$transition['origen']]->id,
                'estado_destino_id' => $states[$transition['destino']]->id,
                'categoria'         => 'venta_logistica',
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);
        }
    }

    private function createVehiculoTransitions()
    {
        $states = DB::table('estados_logistica')
            ->where('categoria', 'vehiculo')
            ->get()
            ->keyBy('codigo');

        $transitions = [
            ['origen' => 'DISPONIBLE', 'destino' => 'EN_RUTA'],
            ['origen' => 'DISPONIBLE', 'destino' => 'MANTENIMIENTO'],
            ['origen' => 'EN_RUTA', 'destino' => 'DISPONIBLE'],
            ['origen' => 'EN_RUTA', 'destino' => 'MANTENIMIENTO'],
            ['origen' => 'MANTENIMIENTO', 'destino' => 'DISPONIBLE'],
            ['origen' => 'MANTENIMIENTO', 'destino' => 'FUERA_SERVICIO'],
            ['origen' => 'FUERA_SERVICIO', 'destino' => 'DISPONIBLE'],
        ];

        foreach ($transitions as $transition) {
            DB::table('transiciones_estado')->insert([
                'estado_origen_id'  => $states[$transition['origen']]->id,
                'estado_destino_id' => $states[$transition['destino']]->id,
                'categoria'         => 'vehiculo',
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);
        }
    }

    private function createEntregaVentaMappings()
    {
        $estados = DB::table('estados_logistica')->get()->keyBy('codigo');

        $mappings = [
            ['origen' => 'PROGRAMADO', 'destino' => 'PROGRAMADO', 'prioridad' => 1],
            ['origen' => 'ASIGNADA', 'destino' => 'PROGRAMADO', 'prioridad' => 1],
            ['origen' => 'PREPARACION_CARGA', 'destino' => 'EN_PREPARACION', 'prioridad' => 2],
            ['origen' => 'EN_CARGA', 'destino' => 'EN_PREPARACION', 'prioridad' => 2],
            ['origen' => 'LISTO_PARA_ENTREGA', 'destino' => 'EN_PREPARACION', 'prioridad' => 2],
            ['origen' => 'EN_CAMINO', 'destino' => 'EN_TRANSITO', 'prioridad' => 3],
            ['origen' => 'EN_TRANSITO', 'destino' => 'EN_TRANSITO', 'prioridad' => 3],
            ['origen' => 'LLEGO', 'destino' => 'EN_TRANSITO', 'prioridad' => 3],
            ['origen' => 'ENTREGADO', 'destino' => 'ENTREGADA', 'prioridad' => 4],
            ['origen' => 'NOVEDAD', 'destino' => 'PROBLEMAS', 'prioridad' => 5],
            ['origen' => 'RECHAZADO', 'destino' => 'PROBLEMAS', 'prioridad' => 5],
            ['origen' => 'CANCELADA', 'destino' => 'CANCELADA', 'prioridad' => 6],
        ];

        foreach ($mappings as $mapping) {
            DB::table('mapeos_estado')->insert([
                'categoria_origen'  => 'entrega',
                'estado_origen_id'  => $estados[$mapping['origen']]->id,
                'categoria_destino' => 'venta_logistica',
                'estado_destino_id' => $estados[$mapping['destino']]->id,
                'prioridad'         => $mapping['prioridad'],
                'activo'            => true,
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);
        }
    }
}
