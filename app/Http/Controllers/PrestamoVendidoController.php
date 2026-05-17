<?php

namespace App\Http\Controllers;

use App\Models\PrestamoVendido;
use App\Models\PrestamoVendidoDetalle;
use App\Services\PrestamoVendidoService;
use App\Services\ImpresionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PrestamoVendidoController extends Controller
{
    public function __construct(
        private PrestamoVendidoService $service,
        private ImpresionService $impresionService
    ) {}

    /**
     * GET /api/prestamos-vendidos
     * Listar todas las ventas con paginación
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = PrestamoVendido::with(['cliente', 'usuario', 'detalles.prestable'])
                ->orderBy('created_at', 'desc');

            // Filtros
            if ($request->filled('estado')) {
                $query->where('estado', $request->string('estado'));
            }

            if ($request->filled('cliente_id')) {
                $query->where('cliente_id', $request->integer('cliente_id'));
            }

            if ($request->filled('usuario_id')) {
                $query->where('usuario_id', $request->integer('usuario_id'));
            }

            if ($request->filled('fecha_desde')) {
                $query->whereDate('fecha_venta', '>=', $request->date('fecha_desde'));
            }

            if ($request->filled('fecha_hasta')) {
                $query->whereDate('fecha_venta', '<=', $request->date('fecha_hasta'));
            }

            if ($request->filled('buscar')) {
                $buscar = $request->string('buscar');
                $query->where(function ($q) use ($buscar) {
                    $q->where('numero_venta', 'ilike', "%{$buscar}%")
                        ->orWhereHas('cliente', function ($q2) use ($buscar) {
                            $q2->where('nombre', 'ilike', "%{$buscar}%");
                        });
                });
            }

            $ventas = $query->paginate($request->integer('per_page', 20));

            return response()->json([
                'success' => true,
                'data' => $ventas,
            ]);
        } catch (\Exception $e) {
            Log::error('Error listando ventas de prestables', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * GET /prestamos/ventas/{venta}
     * Mostrar detalle de una venta (página web)
     */
    public function showWeb(PrestamoVendido $venta)
    {
        try {
            $venta->load(['cliente', 'usuario', 'detalles.prestable', 'detalles.almacen']);

            return Inertia::render('prestamos/ventas/show', [
                'venta' => $venta,
            ]);
        } catch (\Exception $e) {
            Log::error('Error obteniendo venta para web', [
                'venta_id' => $venta->id,
                'error' => $e->getMessage(),
            ]);
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * GET /api/prestamos-vendidos/{venta}
     * Obtener detalle de una venta
     */
    public function show(PrestamoVendido $venta): JsonResponse
    {
        try {
            $venta->load(['cliente', 'usuario', 'detalles.prestable', 'detalles.almacen']);

            return response()->json([
                'success' => true,
                'data' => $venta,
            ]);
        } catch (\Exception $e) {
            Log::error('Error obteniendo venta', ['venta_id' => $venta->id, 'error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * POST /api/prestamos-vendidos
     * Crear nueva venta
     *
     * Si se envían detalles, se crea directamente como CONFIRMADA
     * Si NO se envían detalles, se crea en estado BORRADOR
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'cliente_id' => 'nullable|exists:clientes,id',
                'observaciones' => 'nullable|string|max:1000',
                'detalles' => 'nullable|array',
                'detalles.*.prestable_id' => 'required|exists:prestables,id',
                'detalles.*.almacenes_prestables_id' => 'required|exists:almacenes_prestables,id',
                'detalles.*.cantidad' => 'required|integer|min:1',
                'detalles.*.precio_unitario' => 'required|numeric|min:0',
                'detalles.*.observaciones' => 'nullable|string|max:500',
            ]);

            // Crear venta
            $venta = $this->service->crearVenta([
                'cliente_id' => $validated['cliente_id'] ?? null,
                'usuario_id' => auth()->id(),
                'observaciones' => $validated['observaciones'] ?? null,
                'ip_usuario' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            // Si hay detalles, agregarlos y confirmar venta inmediatamente
            if (!empty($validated['detalles'])) {
                foreach ($validated['detalles'] as $detalle) {
                    $this->service->agregarDetalle(
                        venta: $venta,
                        prestableId: $detalle['prestable_id'],
                        almacenId: $detalle['almacenes_prestables_id'],
                        cantidad: $detalle['cantidad'],
                        precioUnitario: $detalle['precio_unitario'],
                        observaciones: $detalle['observaciones'] ?? null,
                    );
                }

                // Confirmar la venta directamente
                $venta = $this->service->confirmarVenta($venta);
            }

            // Cargar relaciones para la respuesta
            $venta->load(['detalles.prestable', 'cliente', 'usuario']);

            return response()->json([
                'success' => true,
                'message' => $validated['detalles'] ? 'Venta creada y confirmada exitosamente' : 'Venta creada en borrador',
                'data' => $venta,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creando venta', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * POST /api/prestamos-vendidos/{venta}/agregar-detalle
     * Agregar detalle a una venta
     */
    public function agregarDetalle(Request $request, PrestamoVendido $venta): JsonResponse
    {
        try {
            // Validar que la venta esté en BORRADOR
            if ($venta->estado !== 'BORRADOR') {
                return response()->json([
                    'success' => false,
                    'message' => 'No se pueden agregar detalles a una venta confirmada o cancelada',
                ], 422);
            }

            $validated = $request->validate([
                'prestable_id' => 'required|exists:prestables,id',
                'almacenes_prestables_id' => 'required|exists:almacenes_prestables,id',
                'cantidad' => 'required|integer|min:1',
                'precio_unitario' => 'required|numeric|min:0',
                'observaciones' => 'nullable|string|max:500',
            ]);

            $detalle = $this->service->agregarDetalle(
                venta: $venta,
                prestableId: $validated['prestable_id'],
                almacenId: $validated['almacenes_prestables_id'],
                cantidad: $validated['cantidad'],
                precioUnitario: $validated['precio_unitario'],
                observaciones: $validated['observaciones'] ?? null,
            );

            // Recargar venta con relaciones actualizadas
            $venta->refresh();
            $venta->load(['detalles.prestable', 'cliente', 'usuario']);

            return response()->json([
                'success' => true,
                'message' => 'Detalle agregado exitosamente',
                'data' => [
                    'detalle' => $detalle,
                    'venta' => $venta,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error agregando detalle', ['venta_id' => $venta->id, 'error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * DELETE /api/prestamos-vendidos/{venta}/detalles/{detalle}
     * Eliminar un detalle de una venta
     */
    public function eliminarDetalle(PrestamoVendido $venta, PrestamoVendidoDetalle $detalle): JsonResponse
    {
        try {
            // Validar que sea detalle de esta venta
            if ($detalle->prestamo_vendido_id !== $venta->id) {
                return response()->json(['success' => false, 'message' => 'Detalle no pertenece a esta venta'], 422);
            }

            // Validar que la venta esté en BORRADOR
            if ($venta->estado !== 'BORRADOR') {
                return response()->json([
                    'success' => false,
                    'message' => 'No se pueden eliminar detalles de una venta confirmada o cancelada',
                ], 422);
            }

            $detalle->delete();
            $venta->refresh();
            $venta->load(['detalles.prestable', 'cliente', 'usuario']);

            return response()->json([
                'success' => true,
                'message' => 'Detalle eliminado exitosamente',
                'data' => $venta,
            ]);
        } catch (\Exception $e) {
            Log::error('Error eliminando detalle', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * POST /api/prestamos-vendidos/{venta}/confirmar
     * Confirmar una venta (actualiza stock, registra movimientos)
     */
    public function confirmar(PrestamoVendido $venta): JsonResponse
    {
        try {
            if ($venta->estado !== 'BORRADOR') {
                return response()->json([
                    'success' => false,
                    'message' => 'Solo se pueden confirmar ventas en estado BORRADOR',
                ], 422);
            }

            $ventaConfirmada = $this->service->confirmarVenta($venta);
            $ventaConfirmada->load(['detalles.prestable', 'cliente', 'usuario']);

            return response()->json([
                'success' => true,
                'message' => 'Venta confirmada exitosamente',
                'data' => $ventaConfirmada,
            ]);
        } catch (\Exception $e) {
            Log::error('Error confirmando venta', ['venta_id' => $venta->id, 'error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * POST /api/prestamos-vendidos/{venta}/cancelar
     * Cancelar una venta (revierte stock)
     */
    public function cancelar(Request $request, PrestamoVendido $venta): JsonResponse
    {
        try {
            if ($venta->estado === 'CANCELADA') {
                return response()->json([
                    'success' => false,
                    'message' => 'La venta ya está cancelada',
                ], 422);
            }

            $validated = $request->validate([
                'motivo' => 'required|string|max:500',
            ]);

            $ventaCancelada = $this->service->cancelarVenta($venta, $validated['motivo']);

            return response()->json([
                'success' => true,
                'message' => 'Venta cancelada exitosamente',
                'data' => $ventaCancelada,
            ]);
        } catch (\Exception $e) {
            Log::error('Error cancelando venta', ['venta_id' => $venta->id, 'error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * GET /api/prestamos-vendidos/{venta}/imprimir
     * Imprimir venta en formato especificado
     *
     * @param PrestamoVendido $venta
     * @param Request $request (formato: TICKET_80|A4, accion: stream|download)
     */
    public function imprimir(Request $request, PrestamoVendido $venta)
    {
        try {
            $formato = $request->query('formato', 'A4');
            $accion = $request->query('accion', 'stream');

            Log::info('Imprimiendo venta de prestables', [
                'venta_id' => $venta->id,
                'numero_venta' => $venta->numero_venta,
                'formato' => $formato,
                'accion' => $accion,
            ]);

            // Usar ImpresionService para generar el PDF
            $pdf = $this->impresionService->generarPDF('prestamos_vendidos', $venta, $formato);

            $nombreArchivo = "venta-prestables_{$venta->numero_venta}_{$formato}.pdf";

            return $accion === 'download'
                ? $pdf->download($nombreArchivo)
                : $pdf->stream($nombreArchivo);
        } catch (\Exception $e) {
            Log::error('Error imprimiendo venta', ['venta_id' => $venta->id, 'error' => $e->getMessage()]);
            return back()->with('error', 'Error al imprimir: ' . $e->getMessage());
        }
    }

    /**
     * GET /api/prestamos-vendidos/{venta}/descargar-pdf
     * Descargar PDF de la venta (formato por defecto A4)
     */
    public function descargarPdf(PrestamoVendido $venta)
    {
        try {
            $venta->load(['cliente', 'usuario', 'detalles.prestable', 'detalles.almacen']);

            $pdf = Pdf::loadView('prestamos.venta-pdf', [
                'venta' => $venta,
                'formato' => 'A4',
            ]);

            return $pdf->download("venta-prestables-{$venta->numero_venta}.pdf");
        } catch (\Exception $e) {
            Log::error('Error generando PDF de venta', ['venta_id' => $venta->id, 'error' => $e->getMessage()]);
            return back()->with('error', 'Error al generar PDF: ' . $e->getMessage());
        }
    }
}
