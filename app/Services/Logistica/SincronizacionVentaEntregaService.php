<?php

namespace App\Services\Logistica;

use App\Models\Entrega;
use App\Models\Venta;
use Illuminate\Support\Facades\Log;

/**
 * SincronizacionVentaEntregaService
 *
 * Responsable de mantener sincronizado el estado logístico de las ventas
 * con los estados de las entregas asociadas.
 *
 * NOTA: A partir de la refactorización de Fase 3 (Q1 2026), el mapeo de estados
 * está centralizado en la tabla `mapeos_estado` de la BD y se accede a través
 * de `EstadoLogisticoService::mapearEstado()`.
 *
 * Mapeo de Estados (Centralizado en BD):
 * ┌─────────────────────────────────────────────────────────────┐
 * │ ESTADO ENTREGA → (mapeo BD) → ESTADO VENTA LOGÍSTICA        │
 * ├─────────────────────────────────────────────────────────────┤
 * │ PROGRAMADO/ASIGNADA → PROGRAMADO                            │
 * │ PREPARACION_CARGA/EN_CARGA/LISTO → EN_PREPARACION           │
 * │ EN_CAMINO/EN_TRANSITO/LLEGO → EN_TRANSITO                   │
 * │ ENTREGADO → ENTREGADA                                        │
 * │ NOVEDAD/RECHAZADO → PROBLEMAS                               │
 * │ CANCELADA → CANCELADA                                        │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Estados Logísticos de Venta (7 estados finales):
 * - SIN_ENTREGA: No tiene entregas asignadas
 * - PROGRAMADO: Tiene entregas programadas
 * - EN_PREPARACION: Tiene entregas en preparación de carga
 * - EN_TRANSITO: Tiene entregas en tránsito
 * - ENTREGADA: Todas las entregas han sido entregadas
 * - PROBLEMAS: Una o más entregas con novedad/rechazo
 * - CANCELADA: Todas las entregas fueron canceladas
 */
class SincronizacionVentaEntregaService
{
    protected EstadoLogisticoService $estadoService;

    public function __construct(EstadoLogisticoService $estadoService)
    {
        $this->estadoService = $estadoService;
    }

    /**
     * Estados válidos de logística en venta
     * (Mantiene referencia local por backward-compatibility)
     */
    private const ESTADOS_LOGISTICOS = [
        'SIN_ENTREGA',          // Sin entregas
        'PROGRAMADO',           // En espera de asignación
        'EN_PREPARACION',       // Preparando carga
        'EN_TRANSITO',          // En camino
        'ENTREGADA',            // Entregada exitosamente
        'PROBLEMAS',            // Con novedad o rechazo
        'CANCELADA',            // Cancelada
    ];

    /**
     * Actualizar estado logístico de la venta cuando se crea una entrega
     *
     * FASE 3 - REFACTORIZACIÓN:
     * Ahora sincroniza TODAS las ventas asociadas a una entrega
     * (No solo una venta via venta_id)
     */
    public function alCrearEntrega(Entrega $entrega): void
    {
        // Sincronizar con todas las ventas asociadas (via pivot entrega_venta)
        $ventas = $entrega->ventas()->get();

        foreach ($ventas as $venta) {
            try {
                // Determinar nuevo estado logístico
                $nuevoEstado = $this->determinarEstadoLogistico($venta);

                Log::info('Sincronización: Entrega creada (vía pivot)', [
                    'venta_id' => $venta->id,
                    'numero_venta' => $venta->numero,
                    'entrega_id' => $entrega->id,
                    'estado_anterior' => $venta->estado_logistico,
                    'estado_nuevo' => $nuevoEstado,
                ]);

                // Obtener el ID del estado nuevo desde estados_logistica
                $nuevoEstadoLogisticoId = \App\Models\EstadoLogistica::where('codigo', $nuevoEstado)
                    ->where('categoria', 'venta_logistica')
                    ->value('id');

                if (!$nuevoEstadoLogisticoId) {
                    Log::error('Estado logístico no encontrado en BD', [
                        'codigo' => $nuevoEstado,
                        'venta_id' => $venta->id,
                    ]);
                    continue;
                }

                // Actualizar solo si cambió el estado
                if ($venta->estado_logistico_id !== $nuevoEstadoLogisticoId) {
                    // Obtener estado anterior
                    $estadoAnteriorObj = null;
                    if ($venta->estado_logistico_id) {
                        $estadoAnteriorObj = \App\Models\EstadoLogistica::find($venta->estado_logistico_id);
                    }

                    // Obtener estado nuevo
                    $estadoNuevoObj = \App\Models\EstadoLogistica::find($nuevoEstadoLogisticoId);

                    // Actualizar la venta
                    $venta->update(['estado_logistico_id' => $nuevoEstadoLogisticoId]);

                    // Disparar evento de cambio de estado
                    event(new \App\Events\VentaEstadoCambiado(
                        $venta,
                        $estadoAnteriorObj,
                        $estadoNuevoObj,
                        "Sincronización automática al crear entrega {$entrega->id}"
                    ));

                    Log::info('✅ Evento VentaEstadoCambiado disparado (alCrearEntrega)', [
                        'venta_id' => $venta->id,
                        'estado_anterior_id' => $estadoAnteriorObj?->id,
                        'estado_nuevo_id' => $estadoNuevoObj?->id,
                    ]);
                }
            } catch (\Exception $e) {
                Log::warning('Error sincronizando venta al crear entrega', [
                    'venta_id' => $venta->id,
                    'entrega_id' => $entrega->id,
                    'error' => $e->getMessage(),
                ]);
                // Continuar sincronizando otras ventas
            }
        }
    }

    /**
     * Actualizar estado logístico cuando cambia el estado de la entrega
     *
     * FASE 3 - REFACTORIZACIÓN:
     * Ahora sincroniza TODAS las ventas asociadas a una entrega
     * Se llama desde Entrega::boot() cuando cambia el estado
     */
    public function alCambiarEstadoEntrega(
        Entrega $entrega,
        string $estadoAnterior,
        string $estadoNuevo,
        ?\App\Models\Venta $ventaEspecifica = null
    ): void {
        // Si se proporciona una venta específica (para backward compatibility)
        if ($ventaEspecifica) {
            try {
                $nuevoEstadoVenta = $this->determinarEstadoLogistico($ventaEspecifica);

                Log::info('Sincronización: Estado de entrega cambió (venta específica)', [
                    'venta_id' => $ventaEspecifica->id,
                    'entrega_id' => $entrega->id,
                    'estado_entrega_anterior' => $estadoAnterior,
                    'estado_entrega_nuevo' => $estadoNuevo,
                    'estado_venta_anterior' => $ventaEspecifica->estado_logistico,
                    'estado_venta_nuevo' => $nuevoEstadoVenta,
                ]);

                // Obtener el ID del estado nuevo desde estados_logistica
                $nuevoEstadoLogisticoId = \App\Models\EstadoLogistica::where('codigo', $nuevoEstadoVenta)
                    ->where('categoria', 'venta_logistica')
                    ->value('id');

                if ($nuevoEstadoLogisticoId && $ventaEspecifica->estado_logistico_id !== $nuevoEstadoLogisticoId) {
                    // Obtener estado anterior para el evento
                    $estadoAnteriorObj = null;
                    if ($ventaEspecifica->estado_logistico_id) {
                        $estadoAnteriorObj = \App\Models\EstadoLogistica::find($ventaEspecifica->estado_logistico_id);
                    }

                    // Obtener estado nuevo
                    $estadoNuevoObj = \App\Models\EstadoLogistica::find($nuevoEstadoLogisticoId);

                    // ✅ Actualizar el campo correcto: estado_logistico_id (no estado_logistico)
                    $ventaEspecifica->update(['estado_logistico_id' => $nuevoEstadoLogisticoId]);

                    // Disparar evento de cambio de estado
                    event(new \App\Events\VentaEstadoCambiado(
                        $ventaEspecifica,
                        $estadoAnteriorObj,
                        $estadoNuevoObj,
                        "Sincronización automática desde entrega {$entrega->id}"
                    ));

                    Log::info('✅ Evento VentaEstadoCambiado disparado (venta específica)', [
                        'venta_id' => $ventaEspecifica->id,
                        'estado_anterior_id' => $estadoAnteriorObj?->id,
                        'estado_nuevo_id' => $estadoNuevoObj?->id,
                    ]);
                }
            } catch (\Exception $e) {
                Log::warning('Error sincronizando venta específica', [
                    'venta_id' => $ventaEspecifica->id,
                    'entrega_id' => $entrega->id,
                    'error' => $e->getMessage(),
                ]);
            }
            return;
        }

        // Sincronizar TODAS las ventas asociadas (nuevo flujo N:M)
        $ventas = $entrega->ventas()->get();

        foreach ($ventas as $venta) {
            try {
                // Determinar nuevo estado logístico de venta
                $nuevoEstadoVenta = $this->determinarEstadoLogistico($venta);

                Log::info('Sincronización: Estado de entrega cambió (vía pivot)', [
                    'venta_id' => $venta->id,
                    'numero_venta' => $venta->numero,
                    'entrega_id' => $entrega->id,
                    'estado_entrega_anterior' => $estadoAnterior,
                    'estado_entrega_nuevo' => $estadoNuevo,
                    'estado_venta_anterior' => $venta->estado_logistico,
                    'estado_venta_nuevo' => $nuevoEstadoVenta,
                ]);

                // Obtener el ID del estado nuevo desde estados_logistica
                $nuevoEstadoLogisticoId = \App\Models\EstadoLogistica::where('codigo', $nuevoEstadoVenta)
                    ->where('categoria', 'venta_logistica')
                    ->value('id');

                if (!$nuevoEstadoLogisticoId) {
                    Log::error('Estado logístico no encontrado en BD', [
                        'codigo' => $nuevoEstadoVenta,
                        'venta_id' => $venta->id,
                    ]);
                    continue;
                }

                // Actualizar solo si cambió el estado
                if ($venta->estado_logistico_id !== $nuevoEstadoLogisticoId) {
                    // Obtener estado anterior para el evento
                    $estadoAnteriorObj = null;
                    if ($venta->estado_logistico_id) {
                        $estadoAnteriorObj = \App\Models\EstadoLogistica::find($venta->estado_logistico_id);
                    }

                    // Obtener estado nuevo
                    $estadoNuevoObj = \App\Models\EstadoLogistica::find($nuevoEstadoLogisticoId);

                    // Actualizar la venta
                    $venta->update(['estado_logistico_id' => $nuevoEstadoLogisticoId]);

                    // Disparar evento de cambio de estado
                    event(new \App\Events\VentaEstadoCambiado(
                        $venta,
                        $estadoAnteriorObj,
                        $estadoNuevoObj,
                        "Sincronización automática desde entrega {$entrega->id}"
                    ));

                    Log::info('✅ Evento VentaEstadoCambiado disparado', [
                        'venta_id' => $venta->id,
                        'estado_anterior_id' => $estadoAnteriorObj?->id,
                        'estado_nuevo_id' => $estadoNuevoObj?->id,
                    ]);
                }
            } catch (\Exception $e) {
                Log::warning('Error sincronizando venta al cambiar estado entrega', [
                    'venta_id' => $venta->id,
                    'entrega_id' => $entrega->id,
                    'error' => $e->getMessage(),
                ]);
                // Continuar sincronizando otras ventas
            }
        }
    }

    /**
     * Determinar el estado logístico de una venta basado en sus entregas
     *
     * FASE 3 - REFACTORIZACIÓN:
     * Ahora busca entregas en AMBAS relaciones:
     * 1. Relación N:M via pivot entrega_venta (FASE 1 Legacy)
     * 2. Relación 1:N directa vía FK entrega_id (FASE 3 Actual)
     *
     * Una venta puede estar en múltiples entregas consolidadas
     *
     * Lógica:
     * 1. Si no tiene entregas → SIN_ENTREGA
     * 2. Si alguna está en PROBLEMAS → PROBLEMAS
     * 3. Si todas están CANCELADAS → CANCELADA
     * 4. Si todas están ENTREGADAS → ENTREGADA
     * 5. Si alguna está EN_TRANSITO → EN_TRANSITO
     * 6. Si alguna está EN_PREPARACION → EN_PREPARACION
     * 7. Si alguna está PROGRAMADO → PROGRAMADO
     * 8. Por defecto → PROGRAMADO
     */
    public function determinarEstadoLogistico(Venta $venta): string
    {
        // Obtener entregas de AMBAS relaciones:
        // 1. Relación N:M via pivot (FASE 1 - Legacy)
        $entregasLegacy = $venta->entregas()
            ->select('entregas.id', 'entregas.estado')
            ->get();

        // 2. Relación 1:N directa vía FK (FASE 3 - Actual)
        $entregasDirecta = \App\Models\Entrega::where('id', $venta->entrega_id)
            ->select('id', 'estado')
            ->get();

        // Combinar ambas relaciones (evitando duplicados por id)
        $entregas = $entregasLegacy->merge($entregasDirecta)->unique('id');

        // Si no hay entregas en ninguna relación
        if ($entregas->isEmpty()) {
            return 'SIN_ENTREGA';
        }

        $estados = $entregas->pluck('estado')->toArray();

        // Obtener estados únicos
        $estadosUnicos = array_unique($estados);

        // Prioridad: PROBLEMAS > CANCELADA > ENTREGADA > EN_TRANSITO > EN_PREPARACION > PROGRAMADO

        // 1. Si alguna tiene problemas
        if (
            in_array('NOVEDAD', $estadosUnicos) ||
            in_array('RECHAZADO', $estadosUnicos)
        ) {
            return 'PROBLEMAS';
        }

        // 2. Si todas están canceladas
        if (count($estadosUnicos) === 1 && in_array('CANCELADA', $estadosUnicos)) {
            return 'CANCELADA';
        }

        // 3. Si todas están entregadas
        if (count($estadosUnicos) === 1 && in_array('ENTREGADO', $estadosUnicos)) {
            return 'ENTREGADA';
        }

        // 4. Si alguna está en tránsito
        if (
            in_array('EN_TRANSITO', $estadosUnicos) ||
            in_array('EN_CAMINO', $estadosUnicos) ||
            in_array('LLEGO', $estadosUnicos)
        ) {
            return 'EN_TRANSITO';
        }

        // 5. Si alguna está en preparación
        if (
            in_array('PREPARACION_CARGA', $estadosUnicos) ||
            in_array('EN_CARGA', $estadosUnicos) ||
            in_array('LISTO_PARA_ENTREGA', $estadosUnicos)
        ) {
            return 'EN_PREPARACION';
        }

        // 6. Por defecto PROGRAMADO
        return 'PROGRAMADO';
    }

    /**
     * Obtener información de entregas para una venta
     *
     * FASE 3 - ACTUALIZADO:
     * Ahora usa relación belongsToMany via pivot entrega_venta
     */
    public function obtenerDetalleEntregas(Venta $venta): array
    {
        // Obtener entregas con sus metadatos del pivot
        $entregas = $venta->entregas()
            ->select('entregas.id', 'entregas.numero_entrega', 'entregas.estado', 'entregas.fecha_programada', 'entregas.chofer_id', 'entregas.vehiculo_id', 'entrega_venta.orden', 'entrega_venta.fecha_confirmacion')
            ->with(['chofer:id,nombre', 'vehiculo:id,placa'])
            ->get();

        return [
            'total_entregas' => $entregas->count(),
            'estado_logistico_actual' => $venta->estado_logistico,
            'estado_logistico_calculado' => $this->determinarEstadoLogistico($venta),
            'entregas' => $entregas->map(function ($entrega) {
                return [
                    'id' => $entrega->id,
                    'numero_entrega' => $entrega->numero_entrega,
                    'orden' => $entrega->pivot->orden ?? null,  // Orden en la consolidación
                    'estado' => $entrega->estado,
                    'estado_logistico_venta' => self::$mapeoEstados[$entrega->estado] ?? 'DESCONOCIDO',
                    'fecha_programada' => $entrega->fecha_programada,
                    'cargada' => $entrega->pivot->fecha_confirmacion ? true : false,
                    'fecha_confirmacion_carga' => $entrega->pivot->fecha_confirmacion,
                    'chofer' => $entrega->chofer?->nombre ?? 'Sin asignar',
                    'vehiculo' => $entrega->vehiculo?->placa ?? 'Sin asignar',
                ];
            })->toArray(),
        ];
    }

    /**
     * Resincronizar estados de todas las ventas (útil para auditoría)
     * Solo debe ejecutarse si se detectan inconsistencias
     */
    public function resincronizarTodas(): array
    {
        $ventasActualizadas = [];
        $ventasConError = [];

        $ventas = Venta::whereHas('entregas')->get();

        foreach ($ventas as $venta) {
            try {
                $estadoAntiguo = $venta->estado_logistico;
                $estadoNuevo = $this->determinarEstadoLogistico($venta);

                if ($estadoAntiguo !== $estadoNuevo) {
                    $venta->update(['estado_logistico' => $estadoNuevo]);

                    $ventasActualizadas[] = [
                        'venta_id' => $venta->id,
                        'numero' => $venta->numero,
                        'estado_anterior' => $estadoAntiguo,
                        'estado_nuevo' => $estadoNuevo,
                    ];

                    Log::info('Resincronización: Venta actualizada', [
                        'venta_id' => $venta->id,
                        'numero' => $venta->numero,
                        'estado_anterior' => $estadoAntiguo,
                        'estado_nuevo' => $estadoNuevo,
                    ]);
                }
            } catch (\Exception $e) {
                $ventasConError[] = [
                    'venta_id' => $venta->id,
                    'numero' => $venta->numero,
                    'error' => $e->getMessage(),
                ];

                Log::error('Error resincronizando venta', [
                    'venta_id' => $venta->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return [
            'total_procesadas' => count($ventasActualizadas) + count($ventasConError),
            'total_actualizadas' => count($ventasActualizadas),
            'total_errores' => count($ventasConError),
            'actualizadas' => $ventasActualizadas,
            'errores' => $ventasConError,
        ];
    }

    /**
     * Obtener estadísticas de entregas por estado logístico
     */
    public function obtenerEstadisticas(): array
    {
        $estadisticas = [];

        foreach (self::ESTADOS_LOGISTICOS as $estado) {
            $count = Venta::where('estado_logistico', $estado)
                ->whereHas('entregas')
                ->count();

            $estadisticas[$estado] = $count;
        }

        return $estadisticas;
    }
}
