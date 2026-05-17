<?php

namespace App\Http\Controllers;

use App\DTOs\Venta\CrearDevolucionDTO;
use App\Http\Traits\ApiInertiaUnifiedResponse;
use App\Models\Devolucion;
use App\Models\TipoPago;
use App\Models\Venta;
use App\Services\Venta\DevolucionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * DevolucionController - Gestión de Devoluciones y Cambios
 *
 * THIN Controller Pattern:
 * ✓ HTTP concerns solamente
 * ✓ Delega lógica a DevolucionService
 * ✓ Respuestas unificadas (Web + API)
 */
class DevolucionController extends Controller
{
    use ApiInertiaUnifiedResponse;

    public function __construct(
        private DevolucionService $devolucionService,
    ) {
        // El middleware 'auth' se aplica en las rutas
        // Solo aplicamos 'caja.abierta' al método store
        $this->middleware('caja.abierta')->only(['store']);
    }

    /**
     * Listar devoluciones
     *
     * GET /devoluciones
     *
     * @param Request $request
     * @return JsonResponse | InertiaResponse | RedirectResponse
     */
    public function index(Request $request): JsonResponse | InertiaResponse | RedirectResponse
    {
        try {
            $isApiRequest = $request->expectsJson();

            $sortBy = $request->input('sort_by', 'fecha');
            $sortOrder = $request->input('sort_order', 'desc');
            $perPage = $request->input('per_page', 20);

            // Validar campos permitidos
            $sortAllowed = ['id', 'numero', 'fecha', 'tipo', 'cliente_id', 'total_devuelto'];
            $sortBy = in_array($sortBy, $sortAllowed) ? $sortBy : 'fecha';
            $sortOrder = in_array($sortOrder, ['asc', 'desc']) ? $sortOrder : 'desc';

            $query = Devolucion::query()->with(['cliente', 'venta']);

            // Filtros
            if ($clienteId = $request->input('cliente_id')) {
                $query->where('cliente_id', $clienteId);
            }

            if ($ventaId = $request->input('venta_id')) {
                $query->where('venta_id', $ventaId);
            }

            if ($tipo = $request->input('tipo')) {
                $query->where('tipo', $tipo);
            }

            if ($numero = $request->input('numero')) {
                $query->where('numero', 'ilike', "%{$numero}%");
            }

            if ($fechaDesde = $request->input('fecha_desde')) {
                $query->where('fecha', '>=', $fechaDesde);
            }

            if ($fechaHasta = $request->input('fecha_hasta')) {
                $query->where('fecha', '<=', $fechaHasta);
            }

            $devoluciones = $query
                ->orderBy($sortBy, $sortOrder)
                ->paginate($perPage)
                ->appends($request->query());

            if ($isApiRequest) {
                return response()->json($devoluciones);
            }

            return Inertia::render('devoluciones/index', [
                'devoluciones' => $devoluciones,
                'filters' => $request->all(),
            ]);
        } catch (\Exception $e) {
            return $this->respondError('Error al listar devoluciones', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Mostrar formulario para crear devolución desde una venta
     *
     * GET /devoluciones/create?venta_id=123
     * GET /ventas/{venta}/devolucion/nueva
     *
     * @param Venta $venta
     * @return InertiaResponse | JsonResponse | RedirectResponse
     */
    public function create(Venta $venta): InertiaResponse | JsonResponse | RedirectResponse
    {
        try {
            // Cargar detalles, cliente y productos
            $venta->load(['detalles.producto', 'cliente']);

            // Preparar datos para el formulario
            $ventaData = [
                'id' => $venta->id,
                'numero' => $venta->numero,
                'fecha' => $venta->fecha,
                'total' => $venta->total,
                'cliente_id' => $venta->cliente_id,
                'cliente_nombre' => $venta->cliente?->nombre ?? $venta->cliente?->razon_social ?? 'Cliente No Disponible',
                'detalles' => $venta->detalles->map(fn($detalle) => [
                    'id' => $detalle->id,
                    'producto_id' => $detalle->producto_id,
                    'producto_nombre' => $detalle->producto->nombre,
                    'cantidad' => $detalle->cantidad,
                    'precio_unitario' => $detalle->precio_unitario,
                    'subtotal' => $detalle->subtotal,
                ])->toArray(),
            ];

            // Obtener catálogo de productos para el cambio
            $productos = \App\Models\Producto::where('activo', true)
                ->orderBy('nombre')
                ->get(['id', 'nombre', 'sku', 'precio_venta'])
                ->toArray();

            // Obtener tipos de pago activos
            $tiposPago = TipoPago::activos()
                ->get(['id', 'codigo', 'nombre'])
                ->toArray();

            return Inertia::render('devoluciones/create', [
                'venta' => $ventaData,
                'productos' => $productos,
                'tiposPago' => $tiposPago,
            ]);
        } catch (\Exception $e) {
            return $this->respondError('Error al cargar formulario de devolución', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Crear devolución/cambio
     *
     * POST /devoluciones
     *
     * @param Request $request
     * @return JsonResponse | RedirectResponse
     */
    public function store(Request $request): JsonResponse | RedirectResponse
    {
        try {
            \Log::info('🔍 DevolucionController::store INICIADO', [
                'request_path' => $request->path(),
                'venta_id' => $request->input('venta_id'),
                'tipo' => $request->input('tipo'),
                'detalles_count' => count($request->input('detalles', [])),
            ]);

            // Validar datos básicos
            $request->validate([
                'tipo' => 'required|in:DEVOLUCION,CAMBIO',
                'venta_id' => 'required|exists:ventas,id',
                'cliente_id' => 'required|exists:clientes,id',
                'motivo' => 'required|string|max:255',
                'tipo_reembolso' => 'required|in:EFECTIVO,CREDITO',
                'tipo_pago_id' => 'required_if:tipo_reembolso,EFECTIVO|nullable|exists:tipos_pago,id',
                'detalles' => 'required|array|min:1',
                'detalles.*.detalle_venta_id' => 'required|integer|exists:detalle_ventas,id',
                'detalles.*.producto_id' => 'required|integer|exists:productos,id',
                'detalles.*.cantidad_devuelta' => 'required|numeric|min:0.01',
                'detalles.*.precio_unitario' => 'required|numeric|min:0',
                'detalles_cambio' => 'nullable|array',
                'detalles_cambio.*.producto_id' => 'required_with:detalles_cambio|integer|exists:productos,id',
                'detalles_cambio.*.cantidad' => 'required_with:detalles_cambio|numeric|min:0.01',
                'detalles_cambio.*.precio_unitario' => 'required_with:detalles_cambio|numeric|min:0',
                'observaciones' => 'nullable|string|max:500',
            ]);

            \Log::info('✅ DevolucionController::store - Validación exitosa');

            // Crear DTO
            $dto = CrearDevolucionDTO::fromRequest($request);

            \Log::info('📦 DevolucionController::store - DTO creado', [
                'tipo' => $dto->tipo,
                'venta_id' => $dto->venta_id,
                'detalles_count' => count($dto->detalles),
            ]);

            // Obtener caja abierta del middleware CheckCajaAbierta
            $cajaId = $request->attributes->get('caja_id');

            \Log::info('💳 DevolucionController::store - Caja ID', ['caja_id' => $cajaId]);

            // Procesar devolución
            $devolucion = $this->devolucionService->crear($dto, $cajaId);

            \Log::info('🎉 DevolucionController::store - Devolución creada exitosamente', [
                'devolucion_id' => $devolucion->id,
                'devolucion_numero' => $devolucion->numero,
            ]);

            // Responder según tipo de cliente
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Devolución creada exitosamente',
                    'devolucion' => $devolucion->load(['detalles', 'detallesCambio']),
                ], 201);
            }

            return redirect()
                ->route('devoluciones.show', $devolucion)
                ->with('success', 'Devolución creada exitosamente');
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('❌ DevolucionController::store - Error de validación', [
                'errors' => $e->errors(),
            ]);
            return $this->respondError('Validación fallida', $e->errors(), 422);
        } catch (\Exception $e) {
            \Log::error('❌ DevolucionController::store - Excepción', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return $this->respondError(
                'Error al crear devolución',
                ['error' => $e->getMessage()],
                500
            );
        }
    }

    /**
     * Mostrar detalle de devolución
     *
     * GET /devoluciones/{id}
     *
     * @param Devolucion $devolucion
     * @return InertiaResponse | JsonResponse | RedirectResponse
     */
    public function show(Devolucion $devolucion): InertiaResponse | JsonResponse | RedirectResponse
    {
        try {
            // Cargar relaciones
            $devolucion->load([
                'venta' => fn($q) => $q->select('id', 'numero', 'fecha', 'total'),
                'cliente',
                'usuario',
                'detalles.producto',
                'detallesCambio.producto',
            ]);

            if (request()->expectsJson()) {
                return response()->json($devolucion);
            }

            return Inertia::render('devoluciones/show', [
                'devolucion' => $devolucion,
            ]);
        } catch (\Exception $e) {
            return $this->respondError('Error al cargar devolución', ['error' => $e->getMessage()], 500);
        }
    }
}
