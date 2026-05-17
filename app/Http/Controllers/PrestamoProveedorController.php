<?php

namespace App\Http\Controllers;

use App\Models\AlmacenPrestable;
use App\Models\MovimientoPrestable;
use App\Models\PrestamoProveedor;
use App\Services\ImpresionService;
use App\Services\Prestamos\PrestamoProveedorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PrestamoProveedorController extends Controller
{
    public function __construct(
        private PrestamoProveedorService $prestamoService,
        private ImpresionService $impresionService,
    ) {
    }

    /**
     * GET /api/prestamos-proveedor
     * Listar préstamos de proveedores
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = PrestamoProveedor::with(['detalles.prestable', 'proveedor', 'detalles.devolucionDetalles']);

            // Filtro por proveedor
            if ($request->has('proveedor_id')) {
                $query->where('proveedor_id', $request->integer('proveedor_id'));
            }

            // Filtro por estado
            if ($request->has('estado')) {
                $query->where('estado', $request->string('estado'));
            }

            // Filtro por tipo (compra/préstamo)
            if ($request->has('es_compra')) {
                $query->where('es_compra', $request->boolean('es_compra'));
            }

            $prestamos = $query->orderByDesc('fecha_prestamo')->paginate($request->integer('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $prestamos,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error listando préstamos de proveedor', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error listando préstamos'], 500);
        }
    }

    /**
     * POST /api/prestamos-proveedor
     * Registrar nuevo préstamo/compra de proveedor
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'proveedor_id' => 'required|exists:proveedores,id',
                'compra_id' => 'nullable|exists:compras,id',
                'es_compra' => 'required|boolean',
                'almacen_prestable_id' => 'required|exists:almacenes_prestables,id',
                'monto_garantia' => 'nullable|numeric|min:0',
                'fecha_prestamo' => 'required|date',
                'fecha_esperada_devolucion' => 'nullable|date|after_or_equal:fecha_prestamo',
                'observaciones' => 'nullable|string|max:1000',
                // ✅ Validación para múltiples detalles
                'detalles' => 'required|array|min:1',
                'detalles.*.prestable_id' => 'required|exists:prestables,id',
                'detalles.*.cantidad' => 'required|integer|min:1',
            ]);

            Log::info('✅ Validación exitosa para préstamo de proveedor', [
                'proveedor_id' => $validated['proveedor_id'],
                'almacen_prestable_id' => $validated['almacen_prestable_id'],
                'detalles_count' => count($validated['detalles']),
            ]);

            $prestamo = $this->prestamoService->crearPrestamo($validated);

            if (!$prestamo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error creando préstamo',
                ], 500);
            }

            return response()->json([
                'success' => true,
                'data' => $prestamo->load(['detalles.prestable', 'proveedor']),
                'message' => 'Préstamo registrado exitosamente',
            ], 201);
        } catch (\Exception $e) {
            Log::error('❌ Error creando préstamo de proveedor', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * GET /api/prestamos-proveedor/{prestamo}
     * Ver detalles del préstamo
     */
    public function show(PrestamoProveedor $prestamo): JsonResponse
    {
        try {
            $prestamo->load([
                'detalles.prestable.precios',
                'detalles.prestable.condiciones',
                'proveedor',
                'detalles.devolucionDetalles',
                'devoluciones.detalles',
            ]);
            $resumen = $this->prestamoService->obtenerResumen($prestamo->id);

            return response()->json([
                'success' => true,
                'data' => $prestamo,
                'resumen' => $resumen,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error obteniendo préstamo', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error obteniendo préstamo'], 500);
        }
    }

    /**
     * POST /api/prestamos-proveedor/{prestamo}/devolver
     * Registrar devolución al proveedor
     */
    public function registrarDevolucion(Request $request, PrestamoProveedor $prestamo): JsonResponse
    {
        try {
            // ✅ SIMPLIFICADO: cantidad_devuelta es el TOTAL, cantidad_dañada_total es solo información
            $validated = $request->validate([
                'fecha_devolucion' => 'required|date',
                'monto_cobrado_daño_total' => 'nullable|numeric|min:0',
                'observaciones' => 'nullable|string',
                'detalles' => 'required|array|min:1',
                'detalles.*.prestamo_proveedor_detalle_id' => 'required|exists:prestamo_proveedor_detalle,id',
                'detalles.*.cantidad_devuelta' => 'required|integer|min:0',
                'detalles.*.cantidad_dañada_total' => 'nullable|integer|min:0',
            ]);

            // Validar que todos los detalles pertenecen a este préstamo
            foreach ($validated['detalles'] as $detalleData) {
                $detalle = \App\Models\PrestamoProveedorDetalle::findOrFail($detalleData['prestamo_proveedor_detalle_id']);
                if ($detalle->prestamo_proveedor_id !== $prestamo->id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Uno o más detalles no pertenecen a este préstamo',
                    ], 422);
                }
            }

            // Agregar prestamo_proveedor_id
            $validated['prestamo_proveedor_id'] = $prestamo->id;

            // Registrar devolución
            $devolución = $this->prestamoService->registrarDevolucion($validated);

            if (!$devolución) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error registrando devolución',
                ], 500);
            }

            // Cargar relaciones
            $devolución->load(['detalles.detallePrestamoProveedor.prestable']);

            return response()->json([
                'success' => true,
                'data' => $devolución,
                'message' => 'Devolución registrada exitosamente',
            ], 201);
        } catch (\Exception $e) {
            Log::error('❌ Error registrando devolución a proveedor', [
                'error' => $e->getMessage(),
                'prestamo_id' => $prestamo->id,
            ]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * GET /api/prestamos-proveedor/proveedor/{proveedorId}/activos
     * Listar préstamos activos de un proveedor
     */
    public function obtenerActivosProveedor(int $proveedorId): JsonResponse
    {
        try {
            $activos = $this->prestamoService->obtenerPrestamosActivos($proveedorId);

            return response()->json([
                'success' => true,
                'data' => $activos,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error obteniendo préstamos activos', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error obteniendo préstamos'], 500);
        }
    }

    /**
     * GET /api/prestamos-proveedor/proveedor/{proveedorId}/deuda
     * Obtener deuda total con un proveedor
     */
    public function obtenerDeuda(int $proveedorId): JsonResponse
    {
        try {
            $deuda = $this->prestamoService->obtenerDeudaTotal($proveedorId);

            return response()->json([
                'success' => true,
                'deuda_total' => $deuda,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error obteniendo deuda', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error obteniendo deuda'], 500);
        }
    }

    /**
     * GET /prestamos/proveedores/{prestamo}/imprimir
     * Imprimir información del préstamo en PDF (formatos A4 y TICKET_80)
     */
    public function imprimir(PrestamoProveedor $prestamo, Request $request)
    {
        $formato = $request->input('formato', 'A4');      // A4 | TICKET_80
        $accion  = $request->input('accion', 'download'); // download | stream

        // Cargar relaciones necesarias para la impresión
        $prestamo->load(['detalles.prestable', 'detalles.devolucionDetalles', 'proveedor', 'compra', 'devoluciones.detalles']);

        // Resolver almacén asociado al préstamo desde el movimiento registrado
        $movimiento = MovimientoPrestable::query()
            ->where('referencia_tipo', 'PRESTAMO_PROVEEDOR')
            ->where('referencia_id', $prestamo->id)
            ->latest('id')
            ->first();

        $almacen = null;

        if ($movimiento?->almacenes_prestables_id) {
            $almacen = AlmacenPrestable::query()
                ->select('id', 'nombre')
                ->find($movimiento->almacenes_prestables_id);
        }

        // Atributo dinámico para usar en las vistas de impresión
        $prestamo->setAttribute('almacen_impresion', $almacen);

        // Monto cobrado por daños (acumulado de todas las devoluciones del préstamo)
        $montoCobradoDanioTotal = (float) ($prestamo->devoluciones?->sum('monto_cobrado_daño_total') ?? 0);
        $prestamo->setAttribute('monto_cobrado_danio_total_impresion', $montoCobradoDanioTotal);

        // Generar PDF usando el tipo de documento "prestamo_proveedor"
        $pdf = $this->impresionService->generarPDF('prestamo_proveedor', $prestamo, $formato);

        $nombreArchivo = "prestamo_proveedor_{$prestamo->id}_{$formato}.pdf";

        return $accion === 'stream'
            ? $pdf->stream($nombreArchivo)
            : $pdf->download($nombreArchivo);
    }

    /**
     * POST /api/prestamos-proveedor/{prestamo}/anular
     * Anular préstamo a proveedor
     */
    public function anularPrestamo(Request $request, PrestamoProveedor $prestamo): JsonResponse
    {
        try {
            Log::info('📝 Anulando préstamo a proveedor', [
                'prestamo_id' => $prestamo->id,
                'datos' => $request->all()
            ]);

            // Validar datos
            $datosValidacion = $request->validate([
                'razon_anulacion' => 'nullable|string|max:500',
            ]);

            // Anular préstamo
            $prestamoAnulado = $this->prestamoService->anularPrestamo(
                $prestamo->id,
                $datosValidacion['razon_anulacion'] ?? null
            );

            if (!$prestamoAnulado) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error anulando préstamo',
                ], 500);
            }

            Log::info('✅ Préstamo a proveedor anulado correctamente', [
                'prestamo_id' => $prestamoAnulado->id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $prestamoAnulado->load(['detalles.prestable', 'proveedor']),
                'message' => 'Préstamo anulado exitosamente',
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('⚠️ Validación fallida al anular préstamo', [
                'errores' => $e->errors()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos',
                'errores' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ Error anulando préstamo', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }
}
