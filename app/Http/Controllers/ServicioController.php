<?php

namespace App\Http\Controllers;

use App\DTOs\Servicio\CrearServicioDTO;
use App\Http\Traits\ApiInertiaUnifiedResponse;
use App\Models\Cliente;
use App\Models\Servicio;
use App\Models\TipoPago;
use App\Services\Servicio\ServicioService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * ServicioController - Gestión de Servicios (Inyecciones, consultas, etc.)
 *
 * THIN Controller Pattern:
 * ✓ HTTP concerns solamente
 * ✓ Delega lógica a ServicioService
 * ✓ Respuestas unificadas (Web + API)
 */
class ServicioController extends Controller
{
    use ApiInertiaUnifiedResponse;

    public function __construct(
        private ServicioService $servicioService,
    ) {
        $this->middleware('caja.abierta')->only(['create', 'store']);
    }

    /**
     * Listar servicios
     *
     * GET /servicios
     */
    public function index(Request $request): JsonResponse | InertiaResponse | RedirectResponse
    {
        try {
            $isApiRequest = $request->expectsJson();

            $perPage = $request->input('per_page', 20);
            $sortBy = $request->input('sort_by', 'fecha');
            $sortOrder = $request->input('sort_order', 'desc');

            $query = Servicio::query()->with(['cliente', 'usuario', 'tipoPago']);

            // Filtros
            if ($clienteId = $request->input('cliente_id')) {
                $query->where('cliente_id', $clienteId);
            }

            if ($fechaDesde = $request->input('fecha_desde')) {
                $query->where('fecha', '>=', $fechaDesde);
            }

            if ($fechaHasta = $request->input('fecha_hasta')) {
                $query->where('fecha', '<=', $fechaHasta);
            }

            $servicios = $query
                ->orderBy($sortBy, $sortOrder)
                ->paginate($perPage)
                ->appends($request->query());

            if ($isApiRequest) {
                return response()->json($servicios);
            }

            return Inertia::render('servicios/index', [
                'servicios' => $servicios,
                'filters' => $request->all(),
            ]);
        } catch (\Exception $e) {
            return $this->respondError('Error al listar servicios', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Mostrar formulario para crear servicio
     *
     * GET /servicios/create
     */
    public function create(): InertiaResponse | JsonResponse | RedirectResponse
    {
        try {
            // Obtener cliente GENERAL por defecto
            $clienteGeneral = Cliente::where('activo', true)
                ->where('codigo_cliente', 'GENERAL')
                ->first();

            $defaultClienteId = $clienteGeneral?->id ?? null;
            $defaultClienteName = $clienteGeneral ? ($clienteGeneral->nombre ?? $clienteGeneral->razon_social) : null;

            // Obtener tipos de pago activos
            $tiposPago = TipoPago::activos()
                ->get(['id', 'codigo', 'nombre'])
                ->toArray();

            return Inertia::render('servicios/create', [
                'defaultClienteId' => $defaultClienteId,
                'defaultClienteName' => $defaultClienteName,
                'tiposPago' => $tiposPago,
            ]);
        } catch (\Exception $e) {
            return $this->respondError('Error al cargar formulario', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Crear servicio
     *
     * POST /servicios
     */
    public function store(Request $request): JsonResponse | RedirectResponse
    {
        try {
            \Log::info('🔍 ServicioController::store INICIADO', [
                'cliente_id' => $request->input('cliente_id'),
                'monto' => $request->input('monto'),
            ]);

            // Validar datos
            $request->validate([
                'cliente_id' => 'nullable|exists:clientes,id',
                'descripcion' => 'required|string|max:255',
                'monto' => 'required|numeric|min:0.01',
                'tipo_pago_id' => 'required|exists:tipos_pago,id',
                'observaciones' => 'nullable|string|max:500',
            ]);

            \Log::info('✅ ServicioController::store - Validación exitosa');

            // Crear DTO
            $dto = CrearServicioDTO::fromRequest($request);

            \Log::info('📦 ServicioController::store - DTO creado', [
                'descripcion' => $dto->descripcion,
                'monto' => $dto->monto,
            ]);

            // Obtener caja del middleware
            $cajaId = $request->attributes->get('caja_id');

            \Log::info('💳 ServicioController::store - Caja ID', ['caja_id' => $cajaId]);

            // Procesar servicio
            $servicio = $this->servicioService->crear($dto, $cajaId);

            \Log::info('🎉 ServicioController::store - Servicio creado exitosamente', [
                'servicio_id' => $servicio->id,
                'numero' => $servicio->numero,
            ]);

            // Responder
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Servicio registrado exitosamente',
                    'servicio' => $servicio,
                ], 201);
            }

            return redirect()
                ->route('servicios.show', $servicio)
                ->with('success', 'Servicio registrado exitosamente');
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('❌ ServicioController::store - Error de validación', [
                'errors' => $e->errors(),
            ]);
            return $this->respondError('Validación fallida', $e->errors(), 422);
        } catch (\Exception $e) {
            \Log::error('❌ ServicioController::store - Excepción', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return $this->respondError('Error al crear servicio', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Mostrar detalle de servicio
     *
     * GET /servicios/{id}
     */
    public function show(Servicio $servicio): InertiaResponse | JsonResponse | RedirectResponse
    {
        try {
            $servicio->load(['cliente', 'usuario', 'tipoPago', 'caja']);

            if (request()->expectsJson()) {
                return response()->json($servicio);
            }

            return Inertia::render('servicios/show', [
                'servicio' => $servicio->toArray(),
            ]);
        } catch (\Exception $e) {
            return $this->respondError('Error al cargar servicio', ['error' => $e->getMessage()], 500);
        }
    }
}
