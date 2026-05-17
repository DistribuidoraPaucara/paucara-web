<?php

namespace App\Http\Controllers;

use App\DTOs\Logistica\CrearRutaDTO;
use App\Exceptions\DomainException;
use App\Exceptions\Venta\EstadoInvalidoException;
use App\Http\Traits\ApiInertiaUnifiedResponse;
use App\Models\Empleado;
use App\Models\Vehiculo;
use App\Services\Logistica\RutaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * RutaController - REFACTORIZADO (THIN Controller Pattern)
 *
 * Responsabilidades:
 * ✓ Manejo de HTTP request/response
 * ✓ Autenticación/Autorización
 * ✓ Renderización de vistas
 *
 * Delegadas a RutaService:
 * ✗ Planificación de rutas
 * ✗ Optimización de rutas
 * ✗ Cambios de estado
 * ✗ Asignación de recursos
 */
class RutaController extends Controller
{
    use ApiInertiaUnifiedResponse;

    public function __construct(
        private RutaService $rutaService,
    ) {
        $this->middleware('permission:rutas.index')->only('index');
        $this->middleware('permission:rutas.show')->only('show');
        $this->middleware('permission:rutas.create')->only('create', 'store');
        $this->middleware('permission:rutas.planificar')->only('planificar');
    }

    /**
     * Listar rutas con filtros
     */
    public function index(Request $request): JsonResponse|InertiaResponse
    {
        try {
            $filtros = [
                'fecha' => $request->input('fecha'),
                'estado' => $request->input('estado'),
                'chofer_id' => $request->input('chofer_id'),
            ];

            $rutasPaginadas = $this->rutaService->listar(
                array_filter($filtros)
            );

            return $this->respondPaginated(
                $rutasPaginadas,
                'Rutas/Index',
                [
                    'filtros' => $filtros,
                    'choferes' => Empleado::where('tipo', 'CHOFER')->select('id', 'nombre')->get(),
                ]
            );

        } catch (\Exception $e) {
            return $this->respondError('Error al obtener rutas');
        }
    }

    /**
     * Mostrar formulario de creación manual
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('Rutas/Create', [
            'choferes' => Empleado::where('tipo', 'CHOFER')
                ->select('id', 'nombre')
                ->get(),
            'vehiculos' => Vehiculo::where('operativo', true)
                ->select('id', 'placa', 'capacidad')
                ->get(),
        ]);
    }

    /**
     * Crear una ruta manualmente
     *
     * POST /rutas
     *
     * Body:
     * {
     *   "zona_id": 1,
     *   "entrega_ids": [1, 2, 3],
     *   "fecha": "2025-12-08",
     *   "chofer_id": 5,
     *   "vehiculo_id": 10
     * }
     */
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        try {
            $dto = new CrearRutaDTO(
                zona_id: (int) $request->input('zona_id'),
                entrega_ids: (array) $request->input('entrega_ids', []),
                fecha: $request->input('fecha'),
                chofer_id: $request->input('chofer_id') ? (int) $request->input('chofer_id') : null,
                vehiculo_id: $request->input('vehiculo_id') ? (int) $request->input('vehiculo_id') : null,
            );

            $dto->validarDetalles();

            $rutaDTO = $this->rutaService->crear($dto);

            return $this->respondSuccess(
                data: $rutaDTO,
                message: 'Ruta creada exitosamente',
                redirectTo: route('rutas.show', $rutaDTO->id),
                statusCode: 201,
            );

        } catch (\InvalidArgumentException $e) {
            return $this->respondError($e->getMessage(), statusCode: 422);

        } catch (DomainException $e) {
            return $this->respondError($e->getMessage());

        } catch (\Exception $e) {
            return $this->respondError('Error al crear ruta');
        }
    }

    /**
     * Mostrar detalle de ruta con entregas
     */
    public function show(int $id): JsonResponse|InertiaResponse
    {
        try {
            $rutaDTO = $this->rutaService->obtener($id);

            return $this->respondShow(
                data: $rutaDTO,
                inertiaComponent: 'Rutas/Show',
            );

        } catch (\Exception $e) {
            return $this->respondNotFound('Ruta no encontrada');
        }
    }

    /**
     * Planificar rutas para un día
     *
     * POST /rutas/planificar
     *
     * Body:
     * {
     *   "fecha": "2025-12-08"
     * }
     *
     * FLUJO:
     * 1. RutaService::planificar($fecha)
     * 2. Obtiene Entregas PENDIENTES
     * 3. Agrupa por zona
     * 4. Optimiza orden (Nearest Neighbor)
     * 5. Crea Rutas
     * 6. Emite eventos
     */
    public function planificar(Request $request): JsonResponse|RedirectResponse
    {
        try {
            $fecha = $request->input('fecha', today());
            $fecha = \Carbon\Carbon::parse($fecha);

            $rutasCreadas = $this->rutaService->planificar($fecha);

            if (empty($rutasCreadas)) {
                return $this->respondError(
                    message: 'No hay entregas para planificar en esa fecha',
                    statusCode: 422,
                );
            }

            return $this->respondSuccess(
                data: ['rutas' => $rutasCreadas],
                message: sprintf(
                    '%d rutas planificadas exitosamente',
                    count($rutasCreadas)
                ),
                redirectTo: route('rutas.index'),
            );

        } catch (\Exception $e) {
            return $this->respondError($e->getMessage());
        }
    }

    /**
     * Asignar chofer y vehículo a una ruta
     *
     * POST /rutas/{id}/asignar
     */
    public function asignarRecursos(Request $request, int $id): JsonResponse|RedirectResponse
    {
        try {
            $choferId = $request->input('chofer_id');
            $vehiculoId = $request->input('vehiculo_id');

            if (!$choferId || !$vehiculoId) {
                throw new \InvalidArgumentException('Chofer y vehículo son requeridos');
            }

            $rutaDTO = $this->rutaService->asignarRecursos(
                $id,
                (int) $choferId,
                (int) $vehiculoId,
            );

            return $this->respondSuccess(
                data: $rutaDTO,
                message: 'Recursos asignados exitosamente',
                redirectTo: route('rutas.show', $id),
            );

        } catch (\InvalidArgumentException $e) {
            return $this->respondError($e->getMessage(), statusCode: 422);

        } catch (\Exception $e) {
            return $this->respondError($e->getMessage());
        }
    }

    /**
     * Cambiar estado de una ruta
     *
     * PATCH /rutas/{id}/estado
     *
     * Body:
     * {
     *   "estado": "EN_PROCESO"
     * }
     */
    public function cambiarEstado(Request $request, int $id): JsonResponse|RedirectResponse
    {
        try {
            $estado = $request->input('estado');

            if (!$estado) {
                throw new \InvalidArgumentException('Estado es requerido');
            }

            $rutaDTO = $this->rutaService->cambiarEstado($id, $estado);

            return $this->respondSuccess(
                data: $rutaDTO,
                message: "Ruta marcada como {$estado}",
                redirectTo: route('rutas.show', $id),
            );

        } catch (EstadoInvalidoException $e) {
            return $this->respondError($e->getMessage(), statusCode: 422);

        } catch (\InvalidArgumentException $e) {
            return $this->respondError($e->getMessage(), statusCode: 422);

        } catch (\Exception $e) {
            return $this->respondError($e->getMessage());
        }
    }

    /**
     * Generar matriz de distancias para optimización
     *
     * GET /rutas/{id}/matriz-distancias
     *
     * Retorna matriz de distancias entre entregas
     */
    public function matrizDistancias(int $id): JsonResponse
    {
        try {
            $rutaDTO = $this->rutaService->obtener($id);

            // TODO: Calcular matriz de distancias desde ubicaciones
            // Por ahora retornar estructura

            return response()->json([
                'success' => true,
                'ruta_id' => $id,
                'entregas' => count($rutaDTO->detalles),
                'matriz' => [],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }
}
