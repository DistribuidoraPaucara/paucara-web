<?php

namespace App\Http\Controllers;

use App\Models\PrestamoEvento;
use App\Services\ImpresionService;
use App\Services\Prestamos\PrestamoEventoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\PrestableStock;

class PrestamoEventoController extends Controller
{
    public function __construct(
        private PrestamoEventoService $prestamoService,
        private ImpresionService $impresionService,
    ) {
    }

    /**
     * GET /api/prestamos-evento
     * Listar préstamos de eventos
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = PrestamoEvento::with([
                'cliente',
                'detalles.prestable',
                'detalles.prestable.condiciones',
                'detalles.prestable.precios',
                'detalles.devoluciones',
                'chofer',
                'venta',
                'devoluciones.detalles',
            ]);

            // Filtro por ID
            if ($request->has('id')) {
                $query->where('id', $request->string('id'));
            }

            // Filtro por chofer
            if ($request->has('chofer_id')) {
                $query->where('chofer_id', $request->integer('chofer_id'));
            }

            // Filtro por estado
            if ($request->has('estado')) {
                $query->where('estado', $request->string('estado'));
            }

            // Filtro por nombre evento (case insensitive)
            if ($request->has('nombre_evento')) {
                $searchTerm = $request->string('nombre_evento');
                $query->whereRaw('LOWER(nombre_evento) LIKE ?', ['%' . strtolower($searchTerm) . '%']);
            }

            // Filtro por encargado evento (case insensitive)
            if ($request->has('encargado_evento')) {
                $searchTerm = $request->string('encargado_evento');
                $query->whereRaw('LOWER(encargado_evento) LIKE ?', ['%' . strtolower($searchTerm) . '%']);
            }

            // Filtro por nombre cliente (relación, case insensitive)
            if ($request->has('nombre_cliente')) {
                $searchTerm = $request->string('nombre_cliente');
                $query->whereHas('cliente', function ($q) use ($searchTerm) {
                    $q->whereRaw('LOWER(nombre) LIKE ?', ['%' . strtolower($searchTerm) . '%'])
                      ->orWhereRaw('LOWER(razon_social) LIKE ?', ['%' . strtolower($searchTerm) . '%']);
                });
            }

            // Filtro por nombre chofer (relación, case insensitive)
            if ($request->has('nombre_chofer')) {
                $searchTerm = $request->string('nombre_chofer');
                $query->whereHas('chofer', function ($q) use ($searchTerm) {
                    $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($searchTerm) . '%']);
                });
            }

            // Filtro por vehículo asignado (case insensitive)
            if ($request->has('vehiculo_asignado')) {
                $searchTerm = $request->string('vehiculo_asignado');
                $query->whereRaw('LOWER(vehiculo_asignado) LIKE ?', ['%' . strtolower($searchTerm) . '%']);
            }

            // Filtro por fecha desde (fecha préstamo)
            if ($request->has('fecha_desde')) {
                $query->whereDate('fecha_prestamo', '>=', $request->string('fecha_desde'));
            }

            // Filtro por fecha hasta (fecha esperada devolución)
            if ($request->has('fecha_hasta')) {
                $query->whereDate('fecha_esperada_devolucion', '<=', $request->string('fecha_hasta'));
            }

            $prestamos = $query->orderByDesc('fecha_prestamo')->paginate($request->integer('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $prestamos,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error listando préstamos de evento', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error listando préstamos'], 500);
        }
    }

    /**
     * POST /api/prestamos-evento
     * Crear nuevo préstamo de evento
     */
    public function store(Request $request): JsonResponse
    {
        try {
            Log::info('📨 Recibiendo solicitud de préstamo a evento', [
                'datos' => $request->all(),
            ]);

            // Validar datos
            $validated = $request->validate([
                'nombre_evento' => 'required|string|max:255',
                'encargado_evento' => 'nullable|string|max:255',
                'vehiculo_asignado' => 'nullable|string|max:255',
                'direccion_evento' => 'nullable|string|max:255',
                'telefono_uno' => 'nullable|string|max:25',
                'telefono_dos' => 'nullable|string|max:25',
                'venta_id' => 'nullable|exists:ventas,id',
                'chofer_id' => 'nullable|exists:users,id',
                'fecha_prestamo' => 'required|date',
                'fecha_entrega' => 'nullable|date|after_or_equal:fecha_prestamo',
                'fecha_esperada_devolucion' => 'nullable|date|after_or_equal:fecha_prestamo',
                'monto_garantia' => 'nullable|numeric|min:0',
                'detalles' => 'required|array|min:1',
                'detalles.*.prestable_id' => 'required|exists:prestables,id',
                'detalles.*.cantidad' => 'required|integer|min:1',
                'detalles.*.almacenes_ids' => 'required|array|min:1',
                'detalles.*.almacenes_ids.*' => 'integer|exists:almacenes_prestables,id',
            ]);

            Log::info('✅ Validación exitosa para préstamo de evento', [
                'nombre_evento' => $validated['nombre_evento'],
                'detalles_count' => count($validated['detalles']),
            ]);

            // Validar stock para cada detalle
            $detalles = $validated['detalles'] ?? [];

            foreach ($detalles as $i => $detalle) {
                $almacenesIds = array_values(array_filter(array_map('intval', (array) ($detalle['almacenes_ids'] ?? []))));
                if (count($almacenesIds) === 0) {
                    return response()->json([
                        'success' => false,
                        'message' => "Detalle {$i}: Debes seleccionar al menos un almacén",
                    ], 422);
                }

                $cantidadDisponible = (int) PrestableStock::where('prestable_id', (int) $detalle['prestable_id'])
                    ->whereIn('almacenes_prestables_id', $almacenesIds)
                    ->sum('cantidad_disponible');

                if ($cantidadDisponible < (int) $detalle['cantidad']) {
                    Log::warning('⚠️ Stock insuficiente en detalle ' . $i, [
                        'prestable_id' => $detalle['prestable_id'],
                        'cantidad_disponible' => $cantidadDisponible,
                        'cantidad_solicitada' => $detalle['cantidad'],
                    ]);
                    return response()->json([
                        'success' => false,
                        'message' => "Detalle {$i}: Stock insuficiente en almacenes seleccionados. Disponible: {$cantidadDisponible}, solicitado: {$detalle['cantidad']}",
                    ], 422);
                }
            }

            Log::info('✅ Stock validado correctamente para todos los detalles');

            // Crear préstamo
            Log::info('💾 Creando préstamo a evento');
            $prestamo = $this->prestamoService->crearPrestamo($validated);

            if (!$prestamo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error creando préstamo',
                ], 500);
            }

            return response()->json([
                'success' => true,
                'data' => $prestamo->load(['cliente', 'detalles.prestable', 'detalles.prestable.condiciones', 'chofer', 'venta']),
                'message' => 'Préstamo a evento creado exitosamente',
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('⚠️ Validación fallida al crear préstamo', [
                'errores' => $e->errors()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos',
                'errores' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ Error creando préstamo a evento', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * GET /api/prestamos-evento/{prestamo}
     * Ver detalles del préstamo
     */
    public function show(PrestamoEvento $prestamo): JsonResponse
    {
        try {
            $prestamo->load([
                'cliente',
                'detalles.prestable',
                'detalles.prestable.condiciones',
                'detalles.prestable.precios',
                'detalles.devoluciones',
                'chofer',
                'venta',
                'devoluciones.detalles',
            ]);
            $resumen = $this->prestamoService->obtenerResumen($prestamo->id);

            return response()->json([
                'success' => true,
                'data' => $prestamo,
                'resumen' => $resumen,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error obteniendo préstamo de evento', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error obteniendo préstamo'], 500);
        }
    }

    /**
     * POST /api/prestamos-evento/{prestamo}/devolver
     * Registrar devolución del evento
     */
    public function registrarDevolucion(Request $request, PrestamoEvento $prestamo): JsonResponse
    {
        try {
            $validated = $request->validate([
                'fecha_devolucion' => 'required|date',
                'monto_cobrado_daño_total' => 'nullable|numeric|min:0',
                'observaciones' => 'nullable|string',
                'detalles' => 'required|array|min:1',
                'detalles.*.prestamo_evento_detalle_id' => 'required|exists:prestamo_evento_detalle,id',
                'detalles.*.cantidad_devuelta' => 'required|integer|min:0',
            ]);

            // Validar que todos los detalles pertenecen a este préstamo
            foreach ($validated['detalles'] as $detalleData) {
                $detalle = \App\Models\PrestamoEventoDetalle::findOrFail($detalleData['prestamo_evento_detalle_id']);
                if ($detalle->prestamo_evento_id !== $prestamo->id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Uno o más detalles no pertenecen a este préstamo',
                    ], 422);
                }
            }

            // Agregar prestamo_evento_id
            $validated['prestamo_evento_id'] = $prestamo->id;

            // Registrar devolución
            $devolución = $this->prestamoService->registrarDevolucion($validated);

            if (!$devolución) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error registrando devolución',
                ], 500);
            }

            $devolución->load(['detalles']);

            return response()->json([
                'success' => true,
                'data' => $devolución,
                'message' => 'Devolución registrada exitosamente',
            ], 201);
        } catch (\Exception $e) {
            Log::error('❌ Error registrando devolución de evento', [
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
     * POST /api/prestamos-evento/{prestamo}/anular
     * Anular préstamo a evento
     */
    public function anularPrestamo(Request $request, PrestamoEvento $prestamo): JsonResponse
    {
        try {
            Log::info('📝 Anulando préstamo a evento', [
                'prestamo_id' => $prestamo->id,
            ]);

            $validated = $request->validate([
                'razon_anulacion' => 'nullable|string|max:500',
            ]);

            // Anular préstamo
            $prestamoAnulado = $this->prestamoService->anularPrestamo(
                $prestamo->id,
                $validated['razon_anulacion'] ?? null
            );

            if (!$prestamoAnulado) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error anulando préstamo',
                ], 500);
            }

            Log::info('✅ Préstamo a evento anulado correctamente', [
                'prestamo_id' => $prestamoAnulado->id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $prestamoAnulado->load(['detalles.prestable', 'chofer']),
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
            Log::error('❌ Error anulando préstamo a evento', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * GET /prestamos/eventos/{prestamo}/imprimir
     * Imprimir préstamo a evento
     */
    public function imprimir(PrestamoEvento $prestamo, Request $request)
    {
        $formato = $request->input('formato', 'A4');      // A4 | TICKET_80
        $accion  = $request->input('accion', 'download'); // download | stream

        // Cargar relaciones necesarias para la impresión
        $prestamo->load([
            'detalles.prestable',
            'detalles.prestable.condiciones',
            'detalles.devoluciones',
            'cliente',
            'chofer',
            'venta',
            'devoluciones.detalles',
        ]);

        // Generar PDF usando el tipo de documento "prestamo_evento"
        $pdf = $this->impresionService->generarPDF('prestamo_evento', $prestamo, $formato);

        $nombreArchivo = "prestamo_evento_{$prestamo->id}_{$formato}.pdf";

        return $accion === 'stream'
            ? $pdf->stream($nombreArchivo)
            : $pdf->download($nombreArchivo);
    }
}
