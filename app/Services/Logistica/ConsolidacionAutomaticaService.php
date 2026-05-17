<?php

namespace App\Services\Logistica;

use App\Models\Entrega;
use App\Models\Venta;
use App\Models\Vehiculo;
use App\Models\Empleado;
use App\Models\Zona;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * ConsolidacionAutomaticaService
 *
 * FASE 4 - CONSOLIDACIÓN AUTOMÁTICA
 *
 * Responsabilidades:
 * ✓ Obtener ventas pendientes de envío agrupadas por zona
 * ✓ Asignar automáticamente vehículos y choferes disponibles
 * ✓ Crear entregas consolidadas inteligentemente
 * ✓ Reportar resultados de consolidación
 *
 * Algoritmo:
 * 1. Obtener todas las ventas sin entrega (SIN_ENTREGA, PENDIENTE_ENVIO)
 * 2. Agrupar por zona/localidad
 * 3. Para cada zona:
 *    a. Calcular peso/volumen total
 *    b. Encontrar vehículos disponibles con capacidad suficiente
 *    c. Encontrar choferes disponibles
 *    d. Si ambos existen → Crear entrega consolidada
 *    e. Si no → Marcar como "requiere asignación manual"
 * 4. Retornar reporte con éxitos y pendientes
 */
class ConsolidacionAutomaticaService
{
    private CrearEntregaPorLocalidadService $crearEntregaService;
    private SincronizacionVentaEntregaService $sincronizadorService;

    public function __construct(
        CrearEntregaPorLocalidadService $crearEntregaService,
        SincronizacionVentaEntregaService $sincronizadorService,
    ) {
        $this->crearEntregaService = $crearEntregaService;
        $this->sincronizadorService = $sincronizadorService;
    }

    /**
     * Ejecutar consolidación automática de todas las ventas pendientes
     *
     * @return array Reporte de consolidación
     */
    public function consolidarAutomatico(): array
    {
        try {
            Log::info('Iniciando consolidación automática de entregas');

            // 1. Obtener ventas pendientes de envío
            $ventasDisponibles = $this->obtenerVentasPendientes();

            if ($ventasDisponibles->isEmpty()) {
                Log::info('No hay ventas pendientes de consolidación');
                return [
                    'success' => true,
                    'message' => 'No hay ventas pendientes de consolidación',
                    'entregas_creadas' => [],
                    'ventas_pendientes' => [],
                    'errores' => [],
                    'total_entregas_creadas' => 0,
                    'total_ventas_pendientes' => 0,
                ];
            }

            // 2. Agrupar por zona
            $ventasPorZona = $this->agruparPorZona($ventasDisponibles);

            Log::info('Ventas agrupadas por zona', [
                'zonas' => $ventasPorZona->keys(),
                'total_ventas' => $ventasDisponibles->count(),
            ]);

            // 3. Procesar cada zona
            $entregasCreadas = [];
            $ventasPendientes = [];
            $errores = [];

            foreach ($ventasPorZona as $zonaId => $ventasZona) {
                try {
                    $resultado = $this->procesarZona($zonaId, $ventasZona);

                    if ($resultado['tipo'] === 'exito') {
                        $entregasCreadas[] = $resultado['data'];
                    } else {
                        $ventasPendientes = array_merge($ventasPendientes, $resultado['data']);
                    }
                } catch (Exception $e) {
                    Log::error('Error procesando zona', [
                        'zona_id' => $zonaId,
                        'error' => $e->getMessage(),
                    ]);

                    $errores[] = [
                        'zona_id' => $zonaId,
                        'mensaje' => $e->getMessage(),
                        'ventas' => $ventasZona->pluck('numero')->toArray(),
                    ];

                    // Agregar las ventas al listado de pendientes
                    $ventasPendientes = array_merge(
                        $ventasPendientes,
                        $ventasZona->map(fn($v) => $this->formatoVentaPendiente($v))->toArray()
                    );
                }
            }

            $reporte = [
                'success' => true,
                'message' => 'Consolidación automática completada',
                'entregas_creadas' => $entregasCreadas,
                'ventas_pendientes' => $ventasPendientes,
                'errores' => $errores,
                'total_entregas_creadas' => count($entregasCreadas),
                'total_ventas_pendientes' => count($ventasPendientes),
                'total_errores' => count($errores),
            ];

            Log::info('Consolidación automática completada', [
                'entregas_creadas' => count($entregasCreadas),
                'ventas_pendientes' => count($ventasPendientes),
                'errores' => count($errores),
            ]);

            return $reporte;

        } catch (Exception $e) {
            Log::error('Error en consolidación automática', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => 'Error en consolidación automática: ' . $e->getMessage(),
                'entregas_creadas' => [],
                'ventas_pendientes' => [],
                'errores' => [
                    [
                        'tipo' => 'error_general',
                        'mensaje' => $e->getMessage(),
                    ]
                ],
            ];
        }
    }

    /**
     * Obtener todas las ventas pendientes de envío con estado documento válido
     *
     * @return Collection
     */
    private function obtenerVentasPendientes(): Collection
    {
        return Venta::where('requiere_envio', true)
            ->whereIn('estado_logistico', ['SIN_ENTREGA', 'PENDIENTE_ENVIO', ''])
            ->with(['cliente', 'detalles.producto'])
            ->orderBy('cliente_id')
            ->get();
    }

    /**
     * Agrupar ventas por zona
     *
     * @param Collection $ventas
     * @return Collection Grouped by zona_id
     */
    private function agruparPorZona(Collection $ventas): Collection
    {
        return $ventas->groupBy(function ($venta) {
            return $venta->cliente->zona_id ?? 0;
        });
    }

    /**
     * Procesar consolidación para una zona específica
     *
     * @param int|null $zonaId
     * @param Collection $ventasZona
     * @return array Resultado del procesamiento
     */
    private function procesarZona(?int $zonaId, Collection $ventasZona): array
    {
        // Calcular métricas
        $metricas = $this->calcularMetricas($ventasZona);

        Log::info('Procesando zona', [
            'zona_id' => $zonaId,
            'ventas_count' => $ventasZona->count(),
            'peso_total' => $metricas['peso_total'],
            'volumen_total' => $metricas['volumen_total'],
        ]);

        // Obtener vehículos disponibles con capacidad suficiente
        $vehiculosDisponibles = $this->obtenerVehiculosDisponibles($metricas['peso_total']);

        if ($vehiculosDisponibles->isEmpty()) {
            Log::warning('No hay vehículos disponibles para zona', [
                'zona_id' => $zonaId,
                'peso_total' => $metricas['peso_total'],
            ]);

            return [
                'tipo' => 'pendiente',
                'data' => $ventasZona->map(fn($v) => $this->formatoVentaPendiente($v, 'Sin vehículos disponibles'))->toArray(),
            ];
        }

        // Obtener choferes disponibles
        $choferesDisponibles = $this->obtenerChoferesDisponibles();

        if ($choferesDisponibles->isEmpty()) {
            Log::warning('No hay choferes disponibles para zona', [
                'zona_id' => $zonaId,
            ]);

            return [
                'tipo' => 'pendiente',
                'data' => $ventasZona->map(fn($v) => $this->formatoVentaPendiente($v, 'Sin choferes disponibles'))->toArray(),
            ];
        }

        // Seleccionar mejor vehículo y chofer
        $vehiculoSeleccionado = $vehiculosDisponibles->first();
        $choferSeleccionado = $choferesDisponibles->first();

        try {
            // Crear entrega consolidada
            $entrega = $this->crearEntregaService->crearEntregaConsolidada(
                ventaIds: $ventasZona->pluck('id')->toArray(),
                vehiculoId: $vehiculoSeleccionado->id,
                choferId: $choferSeleccionado->id,
                zonaId: $zonaId,
                datos: [
                    'observaciones' => "Consolidación automática de {$ventasZona->count()} ventas",
                ]
            );

            Log::info('Entrega consolidada creada automáticamente', [
                'entrega_id' => $entrega->id,
                'numero_entrega' => $entrega->numero_entrega,
                'zona_id' => $zonaId,
                'ventas_count' => $ventasZona->count(),
                'vehiculo_placa' => $vehiculoSeleccionado->placa,
                'chofer_nombre' => $choferSeleccionado->nombre,
            ]);

            return [
                'tipo' => 'exito',
                'data' => [
                    'id' => $entrega->id,
                    'numero_entrega' => $entrega->numero_entrega,
                    'zona_id' => $zonaId,
                    'ventas_count' => $ventasZona->count(),
                    'ventas' => $ventasZona->map(fn($v) => [
                        'id' => $v->id,
                        'numero' => $v->numero,
                        'cliente' => $v->cliente->nombre,
                        'total' => $v->total,
                    ])->toArray(),
                    'vehiculo' => [
                        'id' => $vehiculoSeleccionado->id,
                        'placa' => $vehiculoSeleccionado->placa,
                    ],
                    'chofer' => [
                        'id' => $choferSeleccionado->id,
                        'nombre' => $choferSeleccionado->nombre,
                    ],
                    'peso_kg' => $metricas['peso_total'],
                    'volumen_m3' => $metricas['volumen_total'],
                ],
            ];
        } catch (Exception $e) {
            Log::error('Error creando entrega consolidada', [
                'zona_id' => $zonaId,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Calcular peso y volumen total de ventas
     *
     * @param Collection $ventas
     * @return array
     */
    /**
     * ✅ ACTUALIZADO: Calcular métricas de ventas
     *
     * Ahora usa peso_total_estimado (pre-calculado al crear venta)
     * en lugar de iterar sobre detalles
     *
     * VENTAJAS:
     * - Performance: O(n) en lugar de O(n*m)
     * - Auditabilidad: Peso persistido y auditable
     * - Consistencia: Mismo peso que se usa en validaciones
     */
    private function calcularMetricas(Collection $ventas): array
    {
        $pesoTotal = $ventas->reduce(function ($sum, $venta) {
            // ✅ NUEVO: Usar peso_total_estimado pre-calculado
            // Si es null (ventas antiguas), usar 0
            $peso = $venta->peso_total_estimado ?? 0;
            return $sum + $peso;
        }, 0);

        $volumenTotal = $ventas->reduce(function ($sum, $venta) {
            $volumen = 0;
            if ($venta->detalles) {
                foreach ($venta->detalles as $detalle) {
                    $volumenPorUnidad = $detalle->producto?->volumen_m3 ?? 0.1;
                    $volumen += $detalle->cantidad * $volumenPorUnidad;
                }
            }
            return $sum + $volumen;
        }, 0);

        return [
            'peso_total' => $pesoTotal,
            'volumen_total' => $volumenTotal,
        ];
    }

    /**
     * Obtener vehículos disponibles con capacidad suficiente
     *
     * @param float $pesoRequerido
     * @return Collection
     */
    private function obtenerVehiculosDisponibles(float $pesoRequerido): Collection
    {
        return Vehiculo::where('estado', 'DISPONIBLE')
            ->where('capacidad_kg', '>=', $pesoRequerido)
            ->orderBy('capacidad_kg')
            ->get();
    }

    /**
     * Obtener choferes disponibles
     *
     * @return Collection
     */
    private function obtenerChoferesDisponibles(): Collection
    {
        return Empleado::where('estado', 'activo')
            ->where('rol', 'chofer')
            ->orWhere('rol', 'like', '%chofer%')
            ->get();
    }

    /**
     * Formatear venta pendiente para reporte
     *
     * @param Venta $venta
     * @param string|null $motivo
     * @return array
     */
    private function formatoVentaPendiente(Venta $venta, ?string $motivo = null): array
    {
        return [
            'id' => $venta->id,
            'numero' => $venta->numero,
            'cliente' => $venta->cliente->nombre,
            'total' => $venta->total,
            'motivo' => $motivo ?? 'Requiere asignación manual',
        ];
    }
}
