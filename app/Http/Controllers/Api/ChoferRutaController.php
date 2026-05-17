<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ruta;
use App\Models\RutaDetalle;
use App\Services\Logistica\RutaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;

/**
 * API endpoints para la app móvil del chofer
 * Todas las rutas requieren autenticación y rol de Chofer
 */
class ChoferRutaController extends Controller
{
    protected $rutaService;

    public function __construct(RutaService $rutaService)
    {
        $this->rutaService = $rutaService;
        $this->middleware('auth:sanctum,web');
        $this->middleware(function ($request, $next) {
            // Verificar que sea un chofer
            if (!Auth::user()->hasRole('Chofer')) {
                return response()->json([
                    'message' => 'No tienes permisos para acceder a este recurso.',
                    'status' => 'error',
                ], 403);
            }

            return $next($request);
        });
    }

    /**
     * Obtener ruta del día del chofer
     * GET /api/chofer/rutas/hoy
     */
    public function rutasHoy()
    {
        $chofer = Auth::user()->empleado;

        if (!$chofer) {
            return response()->json([
                'message' => 'No hay datos de empleado asociados.',
                'status' => 'error',
            ], 400);
        }

        $rutas = Ruta::where('chofer_id', $chofer->id)
            ->whereDate('fecha_ruta', today())
            ->with(['zona', 'detalles.cliente'])
            ->orderBy('hora_salida')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $rutas->map(fn($ruta) => [
                'id' => $ruta->id,
                'codigo' => $ruta->codigo,
                'zona' => $ruta->zona->nombre,
                'estado' => $ruta->estado,
                'cantidad_paradas' => $ruta->cantidad_paradas,
                'hora_salida' => $ruta->hora_salida,
                'hora_llegada' => $ruta->hora_llegada,
                'progreso' => $ruta->obtenerProgreso(),
            ]),
        ]);
    }

    /**
     * Obtener detalles completos de una ruta
     * GET /api/chofer/rutas/{id}
     */
    public function verRuta(Ruta $ruta)
    {
        $this->autorizarChofer($ruta);

        $ruta->load(['zona', 'detalles.cliente', 'detalles.envio']);

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $ruta->id,
                'codigo' => $ruta->codigo,
                'zona' => $ruta->zona->nombre,
                'estado' => $ruta->estado,
                'cantidad_paradas' => $ruta->cantidad_paradas,
                'hora_salida' => $ruta->hora_salida,
                'hora_llegada' => $ruta->hora_llegada,
                'distancia_km' => $ruta->distancia_km,
                'progreso' => $ruta->obtenerProgreso(),
                'entregas' => $ruta->detalles
                    ->sortBy('secuencia')
                    ->map(fn($detalle) => [
                        'id' => $detalle->id,
                        'secuencia' => $detalle->secuencia,
                        'cliente' => [
                            'id' => $detalle->cliente->id,
                            'nombre' => $detalle->cliente->nombre,
                            'direccion' => $detalle->direccion_entrega,
                            'latitud' => $detalle->latitud,
                            'longitud' => $detalle->longitud,
                            'telefono' => $detalle->cliente->telefono,
                        ],
                        'estado' => $detalle->estado,
                        'hora_estimada' => $detalle->hora_entrega_estimada,
                        'hora_real' => $detalle->hora_entrega_real,
                        'observaciones' => $detalle->observaciones,
                        'intentos' => $detalle->intentos_entrega,
                    ]),
            ],
        ]);
    }

    /**
     * Iniciar ruta (cambiar estado a en_progreso)
     * POST /api/chofer/rutas/{id}/iniciar
     */
    public function iniciarRuta(Ruta $ruta)
    {
        $this->autorizarChofer($ruta);

        try {
            $this->rutaService->iniciarRuta($ruta);

            return response()->json([
                'status' => 'success',
                'message' => 'Ruta iniciada correctamente.',
                'data' => $ruta->refresh(),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Completar ruta (cambiar estado a completada)
     * POST /api/chofer/rutas/{id}/completar
     */
    public function completarRuta(Ruta $ruta)
    {
        $this->autorizarChofer($ruta);

        try {
            $this->rutaService->completarRuta($ruta);

            return response()->json([
                'status' => 'success',
                'message' => 'Ruta completada correctamente.',
                'data' => $ruta->refresh(),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Registrar entrega (marcar como entregada, no entregada, etc)
     * POST /api/chofer/entregas/{id}/registrar
     */
    public function registrarEntrega(Request $request, RutaDetalle $detalle)
    {
        $this->autorizarEntrega($detalle);

        $request->validate([
            'estado' => 'required|in:entregado,no_entregado,reprogramado',
            'razon' => 'required_if:estado,no_entregado,reprogramado|string|max:500',
            'foto' => 'nullable|image|max:5120',
            'firma' => 'nullable|string',
            'observaciones' => 'nullable|string|max:500',
        ]);

        try {
            $datos = $request->only(['estado', 'razon', 'firma', 'observaciones']);

            if ($request->hasFile('foto')) {
                $path = $request->file('foto')->store('entregas', 'public');
                $datos['foto_entrega'] = $path;
            }

            $this->rutaService->registrarEntrega($detalle, $datos);

            return response()->json([
                'status' => 'success',
                'message' => 'Entrega registrada correctamente.',
                'data' => $detalle->refresh(),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Obtener entregas pendientes de una ruta
     * GET /api/chofer/rutas/{id}/pendientes
     */
    public function entregarPendientes(Ruta $ruta)
    {
        $this->autorizarChofer($ruta);

        $pendientes = $ruta->entregarPendientes()
            ->map(fn($detalle) => [
                'id' => $detalle->id,
                'secuencia' => $detalle->secuencia,
                'cliente' => [
                    'nombre' => $detalle->cliente->nombre,
                    'direccion' => $detalle->direccion_entrega,
                    'latitud' => $detalle->latitud,
                    'longitud' => $detalle->longitud,
                    'telefono' => $detalle->cliente->telefono,
                ],
                'hora_estimada' => $detalle->hora_entrega_estimada,
            ]);

        return response()->json([
            'status' => 'success',
            'data' => $pendientes,
        ]);
    }

    /**
     * Actualizar ubicación GPS del chofer
     * POST /api/chofer/ubicacion
     */
    public function actualizarUbicacion(Request $request)
    {
        $request->validate([
            'latitud' => 'required|numeric|between:-90,90',
            'longitud' => 'required|numeric|between:-180,180',
            'ruta_id' => 'required|exists:rutas,id',
        ]);

        try {
            $chofer = Auth::user()->empleado;
            $ruta = Ruta::findOrFail($request->ruta_id);

            // Verificar que sea su ruta
            if ($ruta->chofer_id !== $chofer->id) {
                return response()->json([
                    'message' => 'No tienes permisos para esta ruta.',
                    'status' => 'error',
                ], 403);
            }

            // Actualizar ubicación del chofer (si existe tabla de tracking)
            $chofer->update([
                'latitud' => $request->latitud,
                'longitud' => $request->longitud,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Ubicación actualizada correctamente.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Obtener estadísticas de ruta en vivo
     * GET /api/chofer/rutas/{id}/estadisticas
     */
    public function estadisticas(Ruta $ruta)
    {
        $this->autorizarChofer($ruta);

        return response()->json([
            'status' => 'success',
            'data' => $this->rutaService->obtenerEstadisticas($ruta),
        ]);
    }

    /**
     * Autorizar que el chofer puede ver esta ruta
     */
    private function autorizarChofer(Ruta $ruta): void
    {
        $chofer = Auth::user()->empleado;

        if ($ruta->chofer_id !== $chofer->id) {
            throw new Exception('No tienes permisos para esta ruta.', 403);
        }
    }

    /**
     * Autorizar que el chofer puede registrar esta entrega
     */
    private function autorizarEntrega(RutaDetalle $detalle): void
    {
        $chofer = Auth::user()->empleado;
        $ruta = $detalle->ruta;

        if ($ruta->chofer_id !== $chofer->id) {
            throw new Exception('No tienes permisos para esta entrega.', 403);
        }
    }
}
