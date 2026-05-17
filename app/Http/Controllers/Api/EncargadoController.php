<?php

namespace App\Http\Controllers\Api;

use App\Models\Entrega;
use App\Models\Proforma;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class EncargadoController extends Controller
{
    /**
     * GET /api/encargado/dashboard
     * Obtener estadísticas del dashboard del encargado
     * También accesible como GET /api/encargado/dashboard/stats
     */
    public function dashboard()
    {
        try {
            $proformasPendientes = Proforma::where('estado', Proforma::PENDIENTE)->count();
            $entregasEnPreparacion = Entrega::where('estado', Entrega::ESTADO_ASIGNADA)->count();
            $entregasEnTransito = Entrega::whereIn('estado', [
                Entrega::ESTADO_EN_CAMINO,
                Entrega::ESTADO_LLEGO,
            ])->count();

            $entregasEntregadasHoy = Entrega::where('estado', Entrega::ESTADO_ENTREGADO)
                ->whereDate('fecha_entrega', today())
                ->count();

            $entregasConNovedad = Entrega::where('estado', Entrega::ESTADO_NOVEDAD)->count();

            // Formato para ser compatible con ambos tipos de llamadas
            // Si se llama desde /api/encargado/dashboard/stats retorna sin "success" y "data"
            // Si se llama desde /api/encargado/dashboard retorna con formato completo
            $statsData = [
                'proformas_pendientes' => $proformasPendientes,
                'entregas_asignadas' => $entregasEnPreparacion,
                'entregas_en_transito' => $entregasEnTransito,
                'entregas_entregadas_hoy' => $entregasEntregadasHoy,
                'entregas_con_novedad' => $entregasConNovedad,
                'total_entregas_activas' => $entregasEnPreparacion + $entregasEnTransito,
            ];

            return response()->json($statsData);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener dashboard',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/encargado/proformas/pendientes
     * Obtener proformas pendientes de aprobación
     */
    public function proformasPendientes(Request $request)
    {
        try {
            $proformas = Proforma::where('estado', Proforma::PENDIENTE)
                ->with(['cliente', 'detalles', 'usuarioCreador'])
                ->when($request->estado, function ($q) use ($request) {
                    return $q->where('estado', $request->estado);
                })
                ->when($request->cliente_id, function ($q) use ($request) {
                    return $q->where('cliente_id', $request->cliente_id);
                })
                ->when($request->fecha_desde, function ($q) use ($request) {
                    return $q->whereDate('fecha', '>=', $request->fecha_desde);
                })
                ->when($request->fecha_hasta, function ($q) use ($request) {
                    return $q->whereDate('fecha', '<=', $request->fecha_hasta);
                })
                ->latest('fecha')
                ->paginate($request->per_page ?? 15);

            return response()->json($proformas);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener proformas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/encargado/proformas/{id}/aprobar
     * Aprobar una proforma
     */
    public function aprobarProforma(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'observaciones' => 'nullable|string',
            ]);

            $proforma = Proforma::findOrFail($id);

            if (!$proforma->puedeAprobarse()) {
                return response()->json([
                    'success' => false,
                    'message' => 'La proforma no puede ser aprobada en este estado',
                ], 422);
            }

            $proforma->update([
                'estado' => Proforma::APROBADA,
                'usuario_aprobador_id' => Auth::user()->id,
                'fecha_aprobacion' => now(),
                'observaciones' => $validated['observaciones'] ?? $proforma->observaciones,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Proforma aprobada',
                'data' => $proforma->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al aprobar proforma',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/encargado/proformas/{id}/rechazar
     * Rechazar una proforma
     */
    public function rechazarProforma(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'motivo' => 'required|string|max:500',
            ]);

            $proforma = Proforma::findOrFail($id);

            if (!$proforma->puedeRechazarse()) {
                return response()->json([
                    'success' => false,
                    'message' => 'La proforma no puede ser rechazada en este estado',
                ], 422);
            }

            $proforma->update([
                'estado' => Proforma::RECHAZADA,
                'usuario_aprobador_id' => Auth::user()->id,
                'fecha_aprobacion' => now(),
                'observaciones_rechazo' => $validated['motivo'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Proforma rechazada',
                'data' => $proforma->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al rechazar proforma',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/encargado/entregas/asignadas
     * Obtener entregas listas para procesar (en estado ASIGNADA)
     */
    public function entregasAsignadas(Request $request)
    {
        try {
            $entregas = Entrega::where('estado', Entrega::ESTADO_ASIGNADA)
                ->with([
                    'ventas.cliente',
                    'chofer',
                    'vehiculo',
                ])
                ->when($request->estado, function ($q) use ($request) {
                    return $q->where('estado', $request->estado);
                })
                ->when($request->chofer_id, function ($q) use ($request) {
                    return $q->where('chofer_id', $request->chofer_id);
                })
                ->when($request->vehiculo_id, function ($q) use ($request) {
                    return $q->where('vehiculo_id', $request->vehiculo_id);
                })
                ->when($request->fecha_desde, function ($q) use ($request) {
                    return $q->whereDate('fecha_asignacion', '>=', $request->fecha_desde);
                })
                ->when($request->fecha_hasta, function ($q) use ($request) {
                    return $q->whereDate('fecha_asignacion', '<=', $request->fecha_hasta);
                })
                ->latest('fecha_asignacion')
                ->paginate($request->per_page ?? 15);

            return response()->json($entregas);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener entregas asignadas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/encargado/entregas/{id}/procesar-carga
     * Procesar carga del vehículo (marcar como lista para salida)
     */
    public function procesarCargaVehiculo(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'observaciones' => 'nullable|string',
            ]);

            $entrega = Entrega::findOrFail($id);

            if ($entrega->estado !== Entrega::ESTADO_ASIGNADA) {
                return response()->json([
                    'success' => false,
                    'message' => 'La entrega debe estar en estado ASIGNADA',
                ], 422);
            }

            if (!$entrega->chofer_id || !$entrega->vehiculo_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Debe asignar chofer y vehículo antes',
                ], 422);
            }

            // Cambiar a EN_CAMINO y registrar fecha de inicio
            $entrega->update([
                'estado' => Entrega::ESTADO_EN_CAMINO,
                'fecha_inicio' => now(),
            ]);

            $entrega->cambiarEstado(
                Entrega::ESTADO_EN_CAMINO,
                'Carga procesada. Vehículo listo para salir. ' . ($validated['observaciones'] ?? ''),
                Auth::user()
            );

            return response()->json([
                'success' => true,
                'message' => 'Carga procesada',
                'data' => $entrega->fresh()->load(['chofer', 'vehiculo']),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar carga',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/encargado/entregas
     * Listar todas las entregas con filtros
     */
    public function indexAdmin(Request $request)
    {
        try {
            $query = Entrega::with([
                'ventas.cliente',
                'chofer',
                'vehiculo',
            ])
                ->when($request->estado, function ($q) use ($request) {
                    return $q->where('estado', $request->estado);
                })
                ->when($request->chofer_id, function ($q) use ($request) {
                    return $q->where('chofer_id', $request->chofer_id);
                })
                ->when($request->vehiculo_id, function ($q) use ($request) {
                    return $q->where('vehiculo_id', $request->vehiculo_id);
                })
                ->when($request->cliente_id, function ($q) use ($request) {
                    return $q->whereHas('ventas.cliente', function ($query) use ($request) {
                        $query->where('cliente_id', $request->cliente_id);
                    });
                })
                ->when($request->fecha_desde, function ($q) use ($request) {
                    return $q->whereDate('fecha_asignacion', '>=', $request->fecha_desde);
                })
                ->when($request->fecha_hasta, function ($q) use ($request) {
                    return $q->whereDate('fecha_asignacion', '<=', $request->fecha_hasta);
                });

            $entregas = $query->latest('fecha_asignacion')->paginate($request->per_page ?? 15);

            return response()->json([
                'success' => true,
                'data' => $entregas,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al listar entregas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/encargado/entregas/{id}/asignar
     * Asignar chofer y vehículo a una entrega
     */
    public function asignarEntrega(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'chofer_id' => 'required|exists:choferes_legacy,id',
                'vehiculo_id' => 'required|exists:vehiculos,id',
                'observaciones' => 'nullable|string',
            ]);

            $entrega = Entrega::findOrFail($id);

            if ($entrega->estado !== Entrega::ESTADO_ASIGNADA) {
                return response()->json([
                    'success' => false,
                    'message' => 'Solo se pueden asignar entregas en estado ASIGNADA',
                ], 422);
            }

            $entrega->update([
                'chofer_id' => $validated['chofer_id'],
                'vehiculo_id' => $validated['vehiculo_id'],
                'fecha_asignacion' => now(),
                'observaciones' => $validated['observaciones'] ?? $entrega->observaciones,
            ]);

            $entrega->cambiarEstado(
                Entrega::ESTADO_ASIGNADA,
                'Asignado chofer y vehículo',
                Auth::user()
            );

            return response()->json([
                'success' => true,
                'message' => 'Entrega asignada',
                'data' => $entrega->fresh()->load(['chofer', 'vehiculo']),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al asignar entrega',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/encargado/entregas/activas
     * Obtener entregas activas en tiempo real para el mapa
     */
    public function entregasActivas()
    {
        try {
            $entregas = Entrega::whereIn('estado', [
                // Sistema antiguo
                Entrega::ESTADO_EN_CAMINO,
                Entrega::ESTADO_LLEGO,
                // Sistema nuevo - Flujo de Carga
                Entrega::ESTADO_LISTO_PARA_ENTREGA,
                Entrega::ESTADO_EN_TRANSITO,
            ])
                ->with([
                    'ventas.cliente',
                    'chofer.empleado',
                    'vehiculo',
                    'ubicaciones' => function ($query) {
                        $query->latest('timestamp')->limit(1);
                    },
                ])
                ->latest('fecha_inicio')
                ->get()
                ->map(function ($entrega) {
                    $ultimaUbicacion = $entrega->ubicaciones->first();

                    // ✅ ACTUALIZADO: Devolver TODAS las ventas agrupadas, no solo la primera
                    $ventasConMetadatos = $entrega->ventas->map(function ($venta) {
                        return [
                            'id' => $venta->id,
                            'numero' => $venta->numero,
                            'cliente' => [
                                'id' => $venta->cliente?->id,
                                'nombre' => $venta->cliente?->razon_social ?? $venta->cliente?->nombres,
                                'telefono' => $venta->cliente?->telefono,
                            ],
                            'total' => (float) $venta->total,
                            'estado_logistico' => $venta->estado_logistico,
                            'fecha_entrega_comprometida' => $venta->fecha_entrega_comprometida,
                            'cantidad_items' => $venta->detalles?->sum('cantidad') ?? 0,
                            // Metadatos del pivot (orden, confirmación)
                            'orden' => $venta->pivot?->orden ?? 1,
                            'confirmado_por' => $venta->pivot?->confirmado_por,
                            'fecha_confirmacion' => $venta->pivot?->fecha_confirmacion,
                            'notas' => $venta->pivot?->notas,
                        ];
                    })->sortBy('orden')->values();

                    // Calcular totales consolidados
                    $totalConsolidado = $ventasConMetadatos->sum('total');
                    $cantidadVentas = $ventasConMetadatos->count();

                    // Datos del chofer con null safety
                    $choferData = null;
                    if ($entrega->chofer) {
                        $choferData = [
                            'id' => $entrega->chofer->id,
                            'nombre' => $entrega->chofer->empleado?->nombre ?? $entrega->chofer->name,
                            'telefono' => $entrega->chofer->empleado?->telefono,
                        ];
                    }

                    // Datos del vehículo con null safety
                    $vehiculoData = null;
                    if ($entrega->vehiculo) {
                        $vehiculoData = [
                            'id' => $entrega->vehiculo->id,
                            'placa' => $entrega->vehiculo->placa,
                            'marca' => $entrega->vehiculo->marca,
                        ];
                    }

                    return [
                        'id' => $entrega->id,
                        'numero_entrega' => $entrega->numero_entrega,
                        'estado' => $entrega->estado,

                        // ✅ NUEVO: Información consolidada
                        'total_consolidado' => (float) $totalConsolidado,
                        'cantidad_ventas' => $cantidadVentas,
                        'clientes_nombres' => $ventasConMetadatos->pluck('cliente.nombre')->unique()->values()->toArray(),

                        // ✅ NUEVO: Array de todas las ventas
                        'ventas' => $ventasConMetadatos,

                        'chofer' => $choferData,
                        'vehiculo' => $vehiculoData,
                        'ubicacion_actual' => $ultimaUbicacion ? [
                            'latitud' => (float) $ultimaUbicacion->latitud,
                            'longitud' => (float) $ultimaUbicacion->longitud,
                            'velocidad' => $ultimaUbicacion->velocidad,
                            'timestamp' => $ultimaUbicacion->timestamp,
                        ] : null,
                        'fecha_inicio' => $entrega->fecha_inicio,
                        'fecha_llegada' => $entrega->fecha_llegada,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $entregas,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener entregas activas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
