<?php

namespace App\Http\Controllers;

use App\Models\CompraPrestable;
use App\Models\CompraPrestableDetalle;
use App\Services\CompraPrestableService;
use App\Services\ImpresionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CompraPrestableController extends Controller
{
    public function __construct(
        private CompraPrestableService $service,
        private ImpresionService $impresionService
    ) {}

    /**
     * GET /api/compras-prestables
     * Listar todas las compras con paginación
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = CompraPrestable::with(['proveedor', 'usuario', 'detalles.prestable'])
                ->orderBy('created_at', 'desc');

            // Filtros
            if ($request->filled('estado')) {
                $query->where('estado', $request->string('estado'));
            }

            if ($request->filled('proveedor_id')) {
                $query->where('proveedor_id', $request->integer('proveedor_id'));
            }

            if ($request->filled('usuario_id')) {
                $query->where('usuario_id', $request->integer('usuario_id'));
            }

            if ($request->filled('fecha_desde')) {
                $query->whereDate('fecha_compra', '>=', $request->date('fecha_desde'));
            }

            if ($request->filled('fecha_hasta')) {
                $query->whereDate('fecha_compra', '<=', $request->date('fecha_hasta'));
            }

            if ($request->filled('buscar')) {
                $buscar = $request->string('buscar');
                $query->where(function ($q) use ($buscar) {
                    $q->where('numero_compra', 'ilike', "%{$buscar}%")
                        ->orWhereHas('proveedor', function ($q2) use ($buscar) {
                            $q2->where('nombre', 'ilike', "%{$buscar}%");
                        });
                });
            }

            $compras = $query->paginate($request->integer('per_page', 20));

            return response()->json([
                'success' => true,
                'data' => $compras,
            ]);
        } catch (\Exception $e) {
            Log::error('Error listando compras de prestables', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * GET /prestamos/compras/{compra}
     * Mostrar detalle de una compra (página web)
     */
    public function show(CompraPrestable $compra)
    {
        try {
            $compra->load(['proveedor', 'usuario', 'detalles.prestable', 'detalles.almacen']);

            return Inertia::render('prestamos/compras/show', [
                'compra' => $compra,
            ]);
        } catch (\Exception $e) {
            Log::error('Error obteniendo compra para web', [
                'compra_id' => $compra->id,
                'error' => $e->getMessage(),
            ]);
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * GET /api/compras-prestables/{compra}
     * Obtener detalle de una compra (API JSON)
     */
    public function showApi(CompraPrestable $compra): JsonResponse
    {
        try {
            $compra->load(['proveedor', 'usuario', 'detalles.prestable', 'detalles.almacen']);

            return response()->json([
                'success' => true,
                'data' => $compra,
            ]);
        } catch (\Exception $e) {
            Log::error('Error obteniendo compra', ['compra_id' => $compra->id, 'error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * POST /api/compras-prestables
     * Crear nueva compra
     *
     * Si se envían detalles, se crea directamente como CONFIRMADA
     * Si NO se envían detalles, se crea en estado BORRADOR
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'proveedor_id' => 'nullable|exists:proveedores,id',
                'observaciones' => 'nullable|string|max:1000',
                'detalles' => 'nullable|array',
                'detalles.*.prestable_id' => 'required|exists:prestables,id',
                'detalles.*.almacen_id' => 'nullable|integer',
                'detalles.*.almacenes_prestables_id' => 'nullable|integer',
                'detalles.*.cantidad' => 'required|integer|min:1',
                'detalles.*.precio_unitario' => 'required|numeric|min:0',
                'detalles.*.observaciones' => 'nullable|string|max:500',
            ]);

            // Crear compra
            $compra = $this->service->crearCompra([
                'proveedor_id' => $validated['proveedor_id'] ?? null,
                'usuario_id' => auth()->id(),
                'observaciones' => $validated['observaciones'] ?? null,
                'ip_usuario' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            // Si hay detalles, agregarlos y confirmar compra inmediatamente
            if (!empty($validated['detalles'])) {
                foreach ($validated['detalles'] as $detalle) {
                    $almacenId = $detalle['almacen_id'] ?? $detalle['almacenes_prestables_id'] ?? null;
                    if (!$almacenId) {
                        throw new \Exception('Detalle inválido: almacén requerido');
                    }
                    $existeAlmacenPrestable = DB::table('almacenes_prestables')->where('id', (int) $almacenId)->exists();
                    if (!$existeAlmacenPrestable) {
                        throw new \Exception("Detalle inválido: almacén prestable {$almacenId} no existe");
                    }

                    $this->service->agregarDetalle(
                        compra: $compra,
                        prestableId: $detalle['prestable_id'],
                        almacenId: (int) $almacenId,
                        cantidad: $detalle['cantidad'],
                        precioUnitario: $detalle['precio_unitario'],
                        observaciones: $detalle['observaciones'] ?? null,
                    );
                }

                // Confirmar la compra directamente
                $compra = $this->service->confirmarCompra($compra);
            }

            // Cargar relaciones para la respuesta
            $compra->load(['detalles.prestable', 'proveedor', 'usuario']);

            return response()->json([
                'success' => true,
                'message' => $validated['detalles'] ? 'Compra creada y confirmada exitosamente' : 'Compra creada en borrador',
                'data' => $compra,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creando compra', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * POST /api/compras-prestables/{compra}/agregar-detalle
     * Agregar detalle a una compra
     */
    public function agregarDetalle(Request $request, CompraPrestable $compra): JsonResponse
    {
        try {
            // Validar que la compra esté en BORRADOR
            if ($compra->estado !== 'BORRADOR') {
                return response()->json([
                    'success' => false,
                    'message' => 'No se pueden agregar detalles a una compra confirmada o cancelada',
                ], 422);
            }

            $validated = $request->validate([
                'prestable_id' => 'required|exists:prestables,id',
                'almacen_id' => 'nullable|integer',
                'almacenes_prestables_id' => 'nullable|integer',
                'cantidad' => 'required|integer|min:1',
                'precio_unitario' => 'required|numeric|min:0',
                'observaciones' => 'nullable|string|max:500',
            ]);

            $almacenId = $validated['almacen_id'] ?? $validated['almacenes_prestables_id'] ?? null;
            if (!$almacenId) {
                return response()->json([
                    'success' => false,
                    'message' => 'almacen_id o almacenes_prestables_id es requerido',
                ], 422);
            }

            $existeAlmacenPrestable = DB::table('almacenes_prestables')->where('id', (int) $almacenId)->exists();
            if (!$existeAlmacenPrestable) {
                return response()->json([
                    'success' => false,
                    'message' => "Almacén prestable {$almacenId} no existe",
                ], 422);
            }

            $detalle = $this->service->agregarDetalle(
                compra: $compra,
                prestableId: $validated['prestable_id'],
                almacenId: (int) $almacenId,
                cantidad: $validated['cantidad'],
                precioUnitario: $validated['precio_unitario'],
                observaciones: $validated['observaciones'] ?? null,
            );

            // Recargar compra con relaciones actualizadas
            $compra->refresh();
            $compra->load(['detalles.prestable', 'proveedor', 'usuario']);

            return response()->json([
                'success' => true,
                'message' => 'Detalle agregado exitosamente',
                'data' => [
                    'detalle' => $detalle,
                    'compra' => $compra,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error agregando detalle', ['compra_id' => $compra->id, 'error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * DELETE /api/compras-prestables/{compra}/detalles/{detalle}
     * Eliminar un detalle de una compra
     */
    public function eliminarDetalle(CompraPrestable $compra, CompraPrestableDetalle $detalle): JsonResponse
    {
        try {
            // Validar que sea detalle de esta compra
            if ($detalle->compra_prestable_id !== $compra->id) {
                return response()->json(['success' => false, 'message' => 'Detalle no pertenece a esta compra'], 422);
            }

            // Validar que la compra esté en BORRADOR
            if ($compra->estado !== 'BORRADOR') {
                return response()->json([
                    'success' => false,
                    'message' => 'No se pueden eliminar detalles de una compra confirmada o cancelada',
                ], 422);
            }

            $detalle->delete();
            $compra->refresh();
            $compra->load(['detalles.prestable', 'proveedor', 'usuario']);

            return response()->json([
                'success' => true,
                'message' => 'Detalle eliminado exitosamente',
                'data' => $compra,
            ]);
        } catch (\Exception $e) {
            Log::error('Error eliminando detalle', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * POST /api/compras-prestables/{compra}/confirmar
     * Confirmar una compra (actualiza stock, registra movimientos)
     */
    public function confirmar(CompraPrestable $compra): JsonResponse
    {
        try {
            if ($compra->estado !== 'BORRADOR') {
                return response()->json([
                    'success' => false,
                    'message' => 'Solo se pueden confirmar compras en estado BORRADOR',
                ], 422);
            }

            $compraConfirmada = $this->service->confirmarCompra($compra);
            $compraConfirmada->load(['detalles.prestable', 'proveedor', 'usuario']);

            return response()->json([
                'success' => true,
                'message' => 'Compra confirmada exitosamente',
                'data' => $compraConfirmada,
            ]);
        } catch (\Exception $e) {
            Log::error('Error confirmando compra', ['compra_id' => $compra->id, 'error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * POST /api/compras-prestables/{compra}/cancelar
     * Cancelar una compra (revierte stock)
     */
    public function cancelar(Request $request, CompraPrestable $compra): JsonResponse
    {
        try {
            if ($compra->estado === 'CANCELADA') {
                return response()->json([
                    'success' => false,
                    'message' => 'La compra ya está cancelada',
                ], 422);
            }

            $validated = $request->validate([
                'motivo' => 'required|string|max:500',
            ]);

            $compraCancel = $this->service->cancelarCompra($compra, $validated['motivo']);

            return response()->json([
                'success' => true,
                'message' => 'Compra cancelada exitosamente',
                'data' => $compraCancel,
            ]);
        } catch (\Exception $e) {
            Log::error('Error cancelando compra', ['compra_id' => $compra->id, 'error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * GET /api/compras-prestables/{compra}/imprimir
     * Imprimir compra en formato especificado
     *
     * @param CompraPrestable $compra
     * @param Request $request (formato: TICKET_80|A4, accion: stream|download)
     */
    public function imprimir(Request $request, CompraPrestable $compra)
    {
        try {
            $formato = $request->query('formato', 'A4');
            $accion = $request->query('accion', 'stream');

            Log::info('Imprimiendo compra de prestables', [
                'compra_id' => $compra->id,
                'numero_compra' => $compra->numero_compra,
                'formato' => $formato,
                'accion' => $accion,
            ]);

            // Usar ImpresionService para generar el PDF
            $pdf = $this->impresionService->generarPDF('compras_prestables', $compra, $formato);

            $nombreArchivo = "compra-prestables_{$compra->numero_compra}_{$formato}.pdf";

            return $accion === 'download'
                ? $pdf->download($nombreArchivo)
                : $pdf->stream($nombreArchivo);
        } catch (\Exception $e) {
            Log::error('Error imprimiendo compra', ['compra_id' => $compra->id, 'error' => $e->getMessage()]);
            return back()->with('error', 'Error al imprimir: ' . $e->getMessage());
        }
    }
}
