<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ruta;
use App\Models\RutaDetalle;
use App\Services\Logistica\RutaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RutaApiController extends Controller
{
    protected $rutaService;

    public function __construct(RutaService $rutaService)
    {
        $this->rutaService = $rutaService;
        $this->middleware('auth:sanctum');
    }

    /**
     * Listar rutas con filtros
     */
    public function index(Request $request)
    {
        $query = Ruta::with(['localidad', 'chofer.user', 'vehiculo']);

        // Filtro por fecha
        if ($request->has('fecha') && $request->fecha) {
            $query->whereDate('fecha_ruta', $request->fecha);
        } else {
            // Por defecto, mostrar de hoy
            $query->whereDate('fecha_ruta', today());
        }

        // Filtro por localidad
        if ($request->has('localidad_id') && $request->localidad_id) {
            $query->where('localidad_id', $request->localidad_id);
        }

        // Filtro por estado
        if ($request->has('estado') && $request->estado) {
            $query->where('estado', $request->estado);
        }

        // Filtro por chofer
        if ($request->has('chofer_id') && $request->chofer_id) {
            $query->where('chofer_id', $request->chofer_id);
        }

        $rutas = $query->orderBy('fecha_ruta', 'desc')
            ->orderBy('codigo', 'asc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $rutas,
        ]);
    }

    /**
     * Planificar rutas automáticamente para una fecha
     */
    public function planificar(Request $request)
    {
        $request->validate([
            'fecha' => 'required|date',
        ]);

        try {
            $fecha = Carbon::parse($request->fecha);

            $rutasCreadas = DB::transaction(function () use ($fecha) {
                return $this->rutaService->planificarRutasDiarias($fecha);
            });

            if (empty($rutasCreadas)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No hay entregas pendientes para planificar en la fecha especificada.',
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Se planificaron ' . count($rutasCreadas) . ' rutas automáticamente con optimización de distancia.',
                'data' => [
                    'total_rutas' => count($rutasCreadas),
                    'rutas' => $rutasCreadas,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al planificar rutas: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener detalle de una ruta
     */
    public function show(Ruta $ruta)
    {
        $ruta->load(['localidad', 'chofer.user', 'vehiculo', 'detalles.cliente']);

        return response()->json([
            'success' => true,
            'data' => [
                'id'                  => $ruta->id,
                'codigo'              => $ruta->codigo,
                'fecha_ruta'          => $ruta->fecha_ruta,
                'estado'              => $ruta->estado,
                'localidad'           => $ruta->localidad,
                'chofer'              => $ruta->chofer?->user,
                'vehiculo'            => $ruta->vehiculo,
                'cantidad_paradas'    => $ruta->cantidad_paradas ?? 0,
                'distancia_km'        => $ruta->distancia_km ?? 0,
                'tiempo_estimado_min' => $ruta->tiempo_estimado_minutos ?? 0,
                'hora_salida'         => $ruta->hora_salida,
                'hora_llegada'        => $ruta->hora_llegada,
                'detalles'            => $ruta->detalles->map(function ($detalle) {
                    return [
                        'id'                    => $detalle->id,
                        'secuencia'             => $detalle->secuencia,
                        'cliente_nombre'        => $detalle->cliente->nombre ?? 'N/A',
                        'direccion_entrega'     => $detalle->direccion_entrega,
                        'estado'                => $detalle->estado,
                        'latitud'               => $detalle->latitud,
                        'longitud'              => $detalle->longitud,
                        'hora_entrega_estimada' => $detalle->horaEntregaEstimada,
                        'hora_entrega_real'     => $detalle->horaEntregaReal,
                    ];
                }),
            ],
        ]);
    }

    /**
     * Obtener detalles de una ruta
     */
    public function obtenerDetalles(Ruta $ruta)
    {
        $detalles = $ruta->detalles()
            ->with('cliente')
            ->orderBy('secuencia', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $detalles->map(function ($detalle) {
                return [
                    'id'                    => $detalle->id,
                    'ruta_id'               => $detalle->ruta_id,
                    'cliente_id'            => $detalle->cliente_id,
                    'cliente_nombre'        => $detalle->cliente->nombre ?? 'N/A',
                    'secuencia'             => $detalle->secuencia,
                    'direccion_entrega'     => $detalle->direccion_entrega,
                    'latitud'               => $detalle->latitud,
                    'longitud'              => $detalle->longitud,
                    'estado'                => $detalle->estado,
                    'estado_texto'          => $detalle->estadoTexto,
                    'hora_entrega_estimada' => $detalle->horaEntregaEstimada?->format('H:i'),
                    'hora_entrega_real'     => $detalle->horaEntregaReal?->format('H:i'),
                    'intentos_entrega'      => $detalle->intentosEntrega,
                    'razon_no_entrega'      => $detalle->razonNoEntrega,
                    'fue_on_time'           => $detalle->fueOnTime,
                ];
            }),
        ]);
    }

    /**
     * Actualizar estado de una ruta
     */
    public function actualizarEstado(Request $request, Ruta $ruta)
    {
        $request->validate([
            'estado' => 'required|in:planificada,en_progreso,completada,cancelada',
        ]);

        try {
            DB::transaction(function () use ($request, $ruta) {
                $cambios = ['estado' => $request->estado];

                if ($request->estado === 'en_progreso' && !$ruta->hora_salida) {
                    $cambios['hora_salida'] = now();
                }

                if ($request->estado === 'completada' && !$ruta->hora_llegada) {
                    $cambios['hora_llegada'] = now();
                }

                $ruta->update($cambios);

                // Emitir evento de ruta modificada
                event(new \App\Events\RutaModificada($ruta, $request->estado, 'estado'));
            });

            return response()->json([
                'success' => true,
                'message' => 'Estado de ruta actualizado correctamente.',
                'data' => $ruta->fresh(['localidad', 'chofer.user', 'vehiculo']),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar estado: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Completar un detalle de ruta (parada)
     */
    public function completarDetalle(Request $request, Ruta $ruta, RutaDetalle $detalle)
    {
        $request->validate([
            'estado'  => 'required|in:entregado,no_entregado,reprogramado',
            'razon'   => 'nullable|string|max:500',
            'latitud' => 'nullable|numeric',
            'longitud' => 'nullable|numeric',
        ]);

        try {
            DB::transaction(function () use ($request, $detalle) {
                $cambios = [
                    'estado'             => $request->estado,
                    'hora_entrega_real'  => now(),
                    'intentos_entrega'   => $detalle->intentosEntrega + 1,
                ];

                if ($request->has('razon')) {
                    $cambios['razon_no_entrega'] = $request->razon;
                }

                if ($request->has('latitud') && $request->has('longitud')) {
                    $cambios['latitud'] = $request->latitud;
                    $cambios['longitud'] = $request->longitud;
                }

                $detalle->update($cambios);

                // Emitir evento de parada actualizada
                event(new \App\Events\RutaDetalleActualizado($detalle, $request->estado));
            });

            return response()->json([
                'success' => true,
                'message' => 'Entrega registrada correctamente.',
                'data' => $detalle->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar entrega: ' . $e->getMessage(),
            ], 500);
        }
    }
}
