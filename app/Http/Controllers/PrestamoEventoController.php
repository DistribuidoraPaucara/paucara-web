<?php

namespace App\Http\Controllers;

use App\Models\PrestamoEvento;
use App\Services\ImpresionService;
use App\Services\Prestamos\PrestamoEventoService;
use App\Services\Prestamos\ValidacionPrestamosService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\PrestableStock;

class PrestamoEventoController extends Controller
{
    public function __construct(
        private PrestamoEventoService $prestamoService,
        private ImpresionService $impresionService,
        private ValidacionPrestamosService $validacionService,
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
                'detalles.almacenes',
                'detalles.devolucionDetalles',  // ✅ CORREGIDO: era 'devoluciones'
                'chofer',
                'almacen',
                'ventas',
                'ubicacion',
                'devoluciones.detalles',
                'creador', // ✅ Usuario que creó el préstamo
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

            $prestamos = $query->orderByDesc('id')->paginate($request->integer('per_page', 15));

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
                'ventas_ids' => 'nullable|array',
                'ventas_ids.*' => 'integer|exists:ventas,id',
                'almacenes_prestables_id' => 'nullable|integer|exists:almacenes_prestables,id', // ✅ OPCIONAL (puede venir en detalles)
                'chofer_id' => 'nullable|exists:users,id',
                'fecha_prestamo' => 'required|date',
                'fecha_entrega' => 'nullable|date|after_or_equal:fecha_prestamo',
                'fecha_esperada_devolucion' => 'nullable|date|after_or_equal:fecha_prestamo',
                'monto_garantia' => 'nullable|numeric|min:0',
                'ubicacion.direccion_cliente_id' => 'nullable|integer|exists:direcciones_cliente,id',
                'ubicacion.localidad_id' => 'nullable|integer|exists:localidades,id',
                'ubicacion.direccion' => 'nullable|string|max:255',
                'ubicacion.es_ubicacion_manual' => 'nullable|boolean',
                'detalles' => 'required|array|min:1',
                'detalles.*.prestable_id' => 'required|exists:prestables,id',
                'detalles.*.cantidad' => 'required|integer|min:1',
                'detalles.*.almacenes_ids' => 'nullable|array',
                'detalles.*.almacenes_ids.*' => 'integer|exists:almacenes_prestables,id',
                'detalles.*.almacenes' => 'nullable|array',
                'detalles.*.almacenes.*.almacenes_prestables_id' => 'integer|exists:almacenes_prestables,id',
                'detalles.*.almacenes.*.cantidad' => 'integer|min:1',
            ]);

            // Validar ubicación si viene
            if ($request->has('ubicacion')) {
                $datosUbicacion = $request->input('ubicacion');

                // Si es ubicación manual, validar que tenga localidad_id
                if (isset($datosUbicacion['es_ubicacion_manual']) && $datosUbicacion['es_ubicacion_manual']) {
                    if (!isset($datosUbicacion['localidad_id'])) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Ubicación manual requiere localidad_id',
                        ], 422);
                    }
                }
            }

            // Validar que se especifique almacén en cabecera O en detalles
            if (!$validated['almacenes_prestables_id']) {
                $tieneAlmacenesEnDetalles = false;
                foreach ($validated['detalles'] as $detalle) {
                    if (!empty($detalle['almacenes']) || !empty($detalle['almacenes_ids'])) {
                        $tieneAlmacenesEnDetalles = true;
                        break;
                    }
                }
                if (!$tieneAlmacenesEnDetalles) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Debes especificar un almacén en la cabecera O en los detalles',
                    ], 422);
                }
            }

            Log::info('✅ Validación exitosa para préstamo de evento', [
                'nombre_evento' => $validated['nombre_evento'],
                'detalles_count' => count($validated['detalles']),
            ]);

            // Validar stock para cada detalle
            $detalles = $validated['detalles'] ?? [];

            foreach ($detalles as $i => $detalle) {
                // ✅ CORREGIDO: Si no hay almacenes en detalle, usar almacén de cabecera
                $almacenesIds = array_values(array_filter(array_map('intval', (array) ($detalle['almacenes_ids'] ?? []))));

                // Si detalle no especifica almacenes, usar almacén de cabecera
                if (count($almacenesIds) === 0 && !empty($validated['almacenes_prestables_id'])) {
                    $almacenesIds = [(int) $validated['almacenes_prestables_id']];
                } elseif (count($almacenesIds) === 0) {
                    // Solo error si no hay almacenes Y no hay almacén de cabecera
                    return response()->json([
                        'success' => false,
                        'message' => "Detalle {$i}: Debes especificar almacenes en la cabecera O en los detalles",
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
                'data' => $prestamo->load(['cliente', 'detalles.prestable', 'detalles.prestable.condiciones', 'chofer', 'almacen', 'ventas', 'ubicacion', 'creador']),
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
                'almacen',
                'detalles.prestable',
                'detalles.prestable.condiciones',
                'detalles.prestable.precios',
                'detalles.almacenes.almacen',
                // ✅ CORREGIDO: Cargar devoluciones anteriores con sus detalles por almacén
                'detalles.devolucionDetalles.devolucionesAlmacenes.almacen',
                'chofer',
                'ventas',
                'ubicacion',
                'creador', // ✅ Usuario que creó el préstamo
                // ✅ NUEVO: Cargar prestable en detalles de devoluciones
                'devoluciones.detalles.prestamoEventoDetalle.prestable',
                'devoluciones.detalles.devolucionesAlmacenes.almacen'
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
     * PUT /api/prestamos-evento/{prestamo}
     * Actualizar préstamo a evento
     */
    public function update(Request $request, PrestamoEvento $prestamo): JsonResponse
    {
        try {
            Log::info('📨 Actualizando préstamo a evento', ['prestamo_id' => $prestamo->id]);

            // Validar datos
            $validated = $request->validate([
                'nombre_evento' => 'sometimes|required|string|max:255',
                'encargado_evento' => 'nullable|string|max:255',
                'vehiculo_asignado' => 'nullable|string|max:255',
                'direccion_evento' => 'nullable|string|max:255',
                'telefono_uno' => 'nullable|string|max:25',
                'telefono_dos' => 'nullable|string|max:25',
                'almacenes_prestables_id' => 'nullable|integer|exists:almacenes_prestables,id',
                'chofer_id' => 'nullable|exists:users,id',
                'fecha_prestamo' => 'sometimes|required|date',
                'fecha_entrega' => 'nullable|date|after_or_equal:fecha_prestamo',
                'fecha_esperada_devolucion' => 'nullable|date|after_or_equal:fecha_prestamo',
                'monto_garantia' => 'nullable|numeric|min:0',
                'ventas_ids' => 'nullable|array',
                'ventas_ids.*' => 'integer|exists:ventas,id',
                'ubicacion.direccion_cliente_id' => 'nullable|integer|exists:direcciones_cliente,id',
                'ubicacion.localidad_id' => 'nullable|integer|exists:localidades,id',
                'ubicacion.direccion' => 'nullable|string|max:255',
                'ubicacion.es_ubicacion_manual' => 'nullable|boolean',
            ]);

            // Validar ubicación si viene
            if ($request->has('ubicacion')) {
                $datosUbicacion = $request->input('ubicacion');

                // Si es ubicación manual, validar que tenga localidad_id
                if (isset($datosUbicacion['es_ubicacion_manual']) && $datosUbicacion['es_ubicacion_manual']) {
                    if (!isset($datosUbicacion['localidad_id'])) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Ubicación manual requiere localidad_id',
                        ], 422);
                    }
                }
            }

            // Actualizar campos del préstamo
            $prestamo->update(collect($validated)->except(['ventas_ids', 'ubicacion'])->toArray());

            // Sincronizar ventas (many-to-many)
            if (isset($validated['ventas_ids'])) {
                $prestamo->ventas()->sync(array_filter($validated['ventas_ids']));
                Log::info('✅ Ventas sincronizadas', [
                    'prestamo_evento_id' => $prestamo->id,
                    'ventas_ids' => $validated['ventas_ids'],
                ]);
            }

            // Actualizar ubicación si viene en los datos
            if (isset($validated['ubicacion'])) {
                $datosUbicacion = $validated['ubicacion'];

                $ubicacion = $prestamo->ubicacion()->first();

                if ($ubicacion) {
                    $ubicacion->update($datosUbicacion);
                } else {
                    $prestamo->ubicacion()->create($datosUbicacion);
                }

                Log::info('✅ Ubicación del préstamo de evento actualizada', [
                    'prestamo_id' => $prestamo->id,
                    'ubicacion_data' => $datosUbicacion
                ]);
            }

            Log::info('✅ Préstamo a evento actualizado exitosamente', [
                'prestamo_evento_id' => $prestamo->id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $prestamo->load(['cliente', 'almacen', 'detalles.prestable', 'chofer', 'ventas', 'ubicacion']),
                'message' => 'Préstamo actualizado exitosamente',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('⚠️ Validación fallida al actualizar préstamo', ['errores' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos',
                'errores' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ Error actualizando préstamo a evento', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * POST /api/prestamos-evento/{prestamo}/devolver
     * Registrar devolución del evento
     */
    public function registrarDevolucion(Request $request, PrestamoEvento $prestamo): JsonResponse
    {
        try {
            $usuario = auth()->user();

            // ✅ NUEVO: Validar permisos de acceso
            $tienePermiso = false;

            // Admin, Manager: permiso total
            if ($usuario->hasRole(['admin', 'Admin', 'manager', 'Manager', 'ADMIN', 'MANAGER'])) {
                $tienePermiso = true;
            }
            // Chofer: solo puede registrar devoluciones de sus propios préstamos
            elseif ($usuario->hasRole(['chofer', 'Chofer', 'CHOFER'])) {
                if ($prestamo->chofer_id === $usuario->id) {
                    $tienePermiso = true;
                }
            }

            if (!$tienePermiso) {
                Log::warning('⚠️ ACCESO DENEGADO - Intento de registrar devolución evento sin permisos', [
                    'usuario_id' => $usuario->id,
                    'usuario_nombre' => $usuario->name,
                    'prestamo_id' => $prestamo->id,
                    'chofer_asignado_id' => $prestamo->chofer_id,
                    'roles_usuario' => $usuario->getRoleNames()->toArray(),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para registrar devoluciones de este préstamo',
                ], 403);
            }

            // Preparar datos para validación y servicio
            $datosValidacion = $request->all();
            $datosValidacion['prestamo_evento_id'] = $prestamo->id;
            $datosValidacion['created_by'] = auth()->id(); // ✅ Registrar quién creó la devolución

            Log::info('📨 INICIANDO DEVOLUCIÓN EVENTO', [
                'usuario_id' => $usuario->id,
                'usuario_nombre' => $usuario->name,
                'prestamo_id' => $prestamo->id,
                'fecha_devolucion' => $datosValidacion['fecha_devolucion'] ?? null,
                'cantidad_detalles' => count($datosValidacion['detalles'] ?? []),
                'almacen_id' => $prestamo->almacenes_prestables_id,
            ]);

            // ✅ DEBUG: Mostrar payload completo
            Log::info('📦 PAYLOAD RECIBIDO EN CONTROLLER EVENTO', [
                'datos_keys' => array_keys($datosValidacion),
                'prestamo_evento_id' => $datosValidacion['prestamo_evento_id'] ?? 'FALTA',
                'fecha_devolucion' => $datosValidacion['fecha_devolucion'] ?? null,
                'detalles_count' => count($datosValidacion['detalles'] ?? []),
                'almacenes_prestables_id' => $datosValidacion['almacenes_prestables_id'] ?? null,
            ]);

            // ✅ DEBUG: Mostrar primer detalle si existe
            if (!empty($datosValidacion['detalles'])) {
                Log::info('🔍 PRIMER DETALLE EVENTO', $datosValidacion['detalles'][0] ?? []);
            }

            // Validar datos de devolución
            $validacion = $this->validacionService->datosDevolucion($datosValidacion);
            if (!$validacion['valido']) {
                Log::warning('⚠️ VALIDACIÓN FALLIDA EN DEVOLUCIÓN EVENTO', [
                    'prestamo_id' => $prestamo->id,
                    'errores' => $validacion['errores'],
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Datos de devolución inválidos',
                    'errores' => $validacion['errores'],
                ], 422);
            }

            // Registrar devolución
            $devolución = $this->prestamoService->registrarDevolucion($datosValidacion);

            if (!$devolución) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error registrando devolución',
                ], 500);
            }

            $devolución->load([
                'detalles.prestamoEventoDetalle.prestable',  // ✅ Nombre correcto de la relación
                'detalles.devolucionesAlmacenes.almacen'
            ]);

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
     * POST /api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/anular
     * Anular una devolución de evento
     */
    public function anularDevolucion(Request $request, PrestamoEvento $prestamo, \App\Models\DevolucionEvento $devolucion): JsonResponse
    {
        try {
            Log::info('📝 Anulando devolución de evento', [
                'prestamo_id' => $prestamo->id,
                'devolucion_id' => $devolucion->id,
            ]);

            $validated = $request->validate([
                'razon_anulacion' => 'required|string|min:10|max:500',
            ]);

            // Anular devolución
            $devolucionAnulada = $this->prestamoService->anularDevolucion(
                $prestamo->id,
                $devolucion->id,
                $validated['razon_anulacion']
            );

            if (!$devolucionAnulada) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error anulando devolución',
                ], 500);
            }

            Log::info('✅ Devolución de evento anulada correctamente', [
                'prestamo_id' => $prestamo->id,
                'devolucion_id' => $devolucionAnulada->id,
            ]);

            return response()->json([
                'success' => true,
                'data' => $devolucionAnulada->load(['detalles.detallePrestamoEvento.prestable', 'creador', 'anulador']),
                'message' => 'Devolución anulada exitosamente',
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('⚠️ Validación fallida al anular devolución', [
                'errores' => $e->errors()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos',
                'errores' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ Error anulando devolución evento', ['error' => $e->getMessage()]);
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
        // ✅ NO cargar 'venta' - usar accessor getVentaAttribute() que devuelve ventas->first()
        $prestamo->load([
            'detalles.prestable',
            'detalles.prestable.condiciones',
            'detalles.devoluciones',
            'cliente',
            'chofer',
            'almacen',
            'ventas', // ✅ Relación many-to-many
            'devoluciones.detalles',
        ]);

        // Generar PDF usando el tipo de documento "prestamo_evento"
        $pdf = $this->impresionService->generarPDF('prestamo_evento', $prestamo, $formato);

        $nombreArchivo = "prestamo_evento_{$prestamo->id}_{$formato}.pdf";

        return $accion === 'stream'
            ? $pdf->stream($nombreArchivo)
            : $pdf->download($nombreArchivo);
    }

    /**
     * GET /prestamos/eventos/devoluciones/{devolucion}/imprimir
     * Imprimir devolución de evento
     */
    public function imprimirDevolucion(\App\Models\DevolucionEvento $devolucion, Request $request)
    {
        $formato = $request->input('formato', 'A4');      // A4 | TICKET_80
        $accion  = $request->input('accion', 'download'); // download | stream

        // Cargar relaciones necesarias para la impresión
        $devolucion->load([
            'prestamoEvento.cliente',
            'prestamoEvento.almacen',
            'prestamoEvento.ventas',
            'prestamoEvento.chofer',
            'prestamoEvento.detalles.prestable',
            'detalles.prestamoEventoDetalle.prestable',
        ]);

        // Generar PDF usando el tipo de documento "devolucion_evento"
        $pdf = $this->impresionService->generarPDF('devolucion_evento', $devolucion, $formato);

        $nombreArchivo = "devolucion_evento_{$devolucion->id}_{$formato}.pdf";

        return $accion === 'stream'
            ? $pdf->stream($nombreArchivo)
            : $pdf->download($nombreArchivo);
    }
}
