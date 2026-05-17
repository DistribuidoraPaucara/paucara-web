<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Entrega;
use App\Services\Logistica\SincronizacionVentaEntregaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

/**
 * VentaLogisticaController
 *
 * Endpoints para obtener información logística de ventas
 * Permite consultar el estado de entregas y tracking
 */
class VentaLogisticaController extends Controller
{
    public function __construct(
        private SincronizacionVentaEntregaService $sincronizador
    ) {
        $this->middleware('permission:ventas.show');
    }

    /**
     * GET /api/ventas/{venta}/logistica
     *
     * Obtener detalle logístico de una venta
     * Incluye: estado actual, entregas asociadas, tracking
     */
    public function show(Venta $venta): JsonResponse
    {
        try {
            $detalle = $venta->obtenerDetalleLogistico();

            return response()->json([
                'success' => true,
                'data' => [
                    'venta_id' => $venta->id,
                    'numero_venta' => $venta->numero,
                    'cliente' => $venta->cliente?->nombre,
                    'estado_logistico' => $venta->estado_logistico,
                    'estado_logistico_label' => $venta->getEstadoLogisticoLabel(),
                    'estado_logistico_color' => $venta->getEstadoLogisticoColor(),
                    'puede_entregar' => $venta->estaBeingDelivered(),
                    'fue_entregada' => $venta->wasDelivered(),
                    'tiene_problemas' => $venta->hasDeliveryProblems(),
                    'detalle' => $detalle,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error obteniendo logística de venta', [
                'venta_id' => $venta->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo información logística',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/ventas/{venta}/entregas
     *
     * Obtener todas las entregas de una venta con su estado actual
     */
    public function entregas(Venta $venta): JsonResponse
    {
        try {
            // ✅ FIXED: Usar entregas_venta_confirmaciones para obtener entregas de la venta
            // Una entrega tiene MUCHAS ventas, no es relación many-to-many
            $entregas = Entrega::whereHas('confirmacionesVentas', function ($query) use ($venta) {
                $query->where('venta_id', $venta->id);
            })
                ->select('entregas.id', 'entregas.numero_entrega', 'entregas.estado', 'entregas.fecha_programada', 'entregas.chofer_id', 'entregas.vehiculo_id', 'entregas.created_at')
                ->with([
                    'chofer:id,name',  // ✅ FIXED: La columna es 'name', no 'nombre'
                    'vehiculo:id,placa,marca,modelo',
                    'historialEstados:id,entrega_id,estado_anterior,estado_nuevo,comentario,created_at',
                    'confirmacionesVentas' => function ($query) use ($venta) {
                        // Solo cargar confirmaciones de ESTA venta específica
                        $query->where('venta_id', $venta->id);
                    },
                ])
                ->orderBy('entregas.created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'venta_id' => $venta->id,
                    'total_entregas' => $entregas->count(),
                    'entregas' => $entregas->map(function ($entrega) {
                        return [
                            'id' => $entrega->id,
                            'numero' => $entrega->numero_entrega ?? "ENG-{$entrega->id}",
                            'estado' => $entrega->estado,
                            'fecha_programada' => $entrega->fecha_programada,
                            'chofer' => [
                                'id' => $entrega->chofer?->id,
                                'nombre' => $entrega->chofer?->name ?? 'Sin asignar',  // ✅ FIXED: 'name' not 'nombre'
                            ],
                            'vehiculo' => [
                                'id' => $entrega->vehiculo?->id,
                                'placa' => $entrega->vehiculo?->placa ?? 'Sin asignar',
                                'descripcion' => $entrega->vehiculo ? "{$entrega->vehiculo->marca} {$entrega->vehiculo->modelo}" : 'N/A',
                            ],
                            'historial_estados' => $entrega->historialEstados->map(function ($h) {
                                return [
                                    'estado_anterior' => $h->estado_anterior,
                                    'estado_nuevo' => $h->estado_nuevo,
                                    'comentario' => $h->comentario,
                                    'fecha' => $h->created_at->format('Y-m-d H:i:s'),
                                ];
                            }),
                            // ✅ NUEVO: Incluir confirmaciones de venta con fotos y productos devueltos
                            'confirmacionesVentas' => $entrega->confirmacionesVentas->map(function ($conf) {
                                // Parsear fotos si es JSON string
                                $fotos = [];
                                if ($conf->fotos) {
                                    if (is_string($conf->fotos)) {
                                        $fotos = json_decode($conf->fotos, true) ?? [];
                                    } elseif (is_array($conf->fotos)) {
                                        $fotos = $conf->fotos;
                                    }
                                }

                                // ✅ NUEVO 2026-02-17: Incluir productos devueltos para DEVOLUCION_PARCIAL
                                $productosDevueltos = [];
                                if ($conf->productos_devueltos) {
                                    if (is_string($conf->productos_devueltos)) {
                                        $productosDevueltos = json_decode($conf->productos_devueltos, true) ?? [];
                                    } elseif (is_array($conf->productos_devueltos)) {
                                        $productosDevueltos = $conf->productos_devueltos;
                                    }
                                }

                                return [
                                    'id' => $conf->id,
                                    'venta_id' => $conf->venta_id,
                                    'fotos' => $fotos,
                                    'firma_digital_url' => $conf->firma_digital_url,
                                    'observaciones_logistica' => $conf->observaciones_logistica,
                                    'tipo_entrega' => $conf->tipo_entrega,
                                    'tipo_novedad' => $conf->tipo_novedad,
                                    'productos_devueltos' => $productosDevueltos,  // ✅ NUEVO: Productos devueltos en DEVOLUCION_PARCIAL
                                    'monto_devuelto' => $conf->monto_devuelto,      // ✅ NUEVO: Monto total devuelto
                                    'monto_aceptado' => $conf->monto_aceptado,      // ✅ NUEVO: Monto aceptado
                                ];
                            }),
                        ];
                    }),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error obteniendo entregas de venta', [
                'venta_id' => $venta->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo entregas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/logistica/estadisticas
     *
     * Obtener estadísticas generales de entregas por estado logístico
     */
    public function estadisticas(): JsonResponse
    {
        try {
            $stats = $this->sincronizador->obtenerEstadisticas();

            return response()->json([
                'success' => true,
                'data' => [
                    'fecha_consulta' => now()->format('Y-m-d H:i:s'),
                    'estadisticas' => $stats,
                    'total_ventas_con_entregas' => collect($stats)->sum(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error obteniendo estadísticas de logística', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo estadísticas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/logistica/resincronizar
     *
     * Resincronizar estados de todas las ventas (admin only)
     * Útil para auditoría o si se detectan inconsistencias
     */
    public function resincronizar(): JsonResponse
    {
        // Verificar permiso de admin
        if (!auth()->user()?->can('admin.panel')) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permiso para ejecutar esta acción',
            ], 403);
        }

        try {
            Log::info('Iniciando resincronización de estados logísticos...');

            $resultado = $this->sincronizador->resincronizarTodas();

            Log::info('Resincronización completada', $resultado);

            return response()->json([
                'success' => true,
                'message' => "Resincronización completada. {$resultado['total_actualizadas']} ventas actualizadas.",
                'data' => $resultado,
            ]);
        } catch (\Exception $e) {
            Log::error('Error en resincronización', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error durante la resincronización',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
