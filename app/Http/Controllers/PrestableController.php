<?php

namespace App\Http\Controllers;

use App\Models\Prestable;
use App\Models\PrestableStock;
use App\Models\Proveedor;
use App\Models\Producto;
use App\Models\AlmacenPrestable;
use App\Services\Prestamos\PrestableStockService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\AjusteStockPrestable;
use App\Models\MovimientoPrestable;

class PrestableController extends Controller
{
    public function __construct(private PrestableStockService $stockService)
    {
    }

    /**
     * GET /api/prestables
     * Listar todas las canastillas/embases activas
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Relaciones base por defecto
            $relaciones = [
                'producto:id,nombre,sku',
                'proveedor:id,nombre',
                'precios',
                'condiciones',
                'stocks',
                'stocks.almacenPrestable:id,nombre,es_proveedor',
                'ultimoDetalleCompra',
                'prestablePadre:id,nombre,codigo',
                'embasesRelacionados.stocks',  // Siempre cargar embases
                'embasesRelacionados.precios',
                'embasesRelacionados.ultimoDetalleCompra',
                'productosRelacionados.producto:id,nombre,sku',  // Cargar productos relacionados
            ];

            // Si se solicita dinamicamente via parámetro with, agregar esas relaciones
            if ($request->has('with')) {
                $withParams = explode(',', $request->string('with'));
                $relaciones = array_merge($relaciones, $withParams);
            }

            $query = Prestable::with($relaciones)
                ->where('activo', true);

            // Filtro opcional por almacén (si se requiere en otras pantallas)
            if ($request->has('almacen_id')) {
                $almacenId = $request->integer('almacen_id');
                $query->whereHas('stocks', function ($q) use ($almacenId) {
                    $q->where('almacenes_prestables_id', $almacenId);
                });
            }

            // Filtro por tipo
            if ($request->has('tipo')) {
                $query->where('tipo', $request->string('tipo'));
            }

            // Filtro por proveedor
            if ($request->has('proveedor_id')) {
                $query->where('proveedor_id', $request->integer('proveedor_id'));
            }

            // Búsqueda
            if ($request->has('q')) {
                $searchTerm = $request->string('q');
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('nombre', 'like', "%{$searchTerm}%")
                        ->orWhere('codigo', 'like', "%{$searchTerm}%")
                        ->orWhere('descripcion', 'like', "%{$searchTerm}%");
                });
            }

            // Ordenar en orden descendente por ID (más recientes primero)
            $query->orderByDesc('id');

            $prestables = $query->paginate($request->integer('per_page', 15));

            // Convertir a array y agregar totales, asegurando que las relaciones se incluyan
            $data = $prestables->getCollection()->map(function ($prestable) {
                $totalCanastillas = 0;
                $totalEmbases = 0;

                $precioCompraConfigurado = $prestable->precios
                    ->where('tipo_precio', 'COMPRA')
                    ->where('activo', true)
                    ->sortByDesc('id')
                    ->first();

                $precioCompraReferencial = (float) (
                    $precioCompraConfigurado?->valor
                    ?? $prestable->ultimoDetalleCompra?->precio_unitario
                    ?? 0
                );

                $fuentePrecioCompra = $precioCompraConfigurado
                    ? 'prestable_precios.COMPRA'
                    : ($prestable->ultimoDetalleCompra ? 'ultima_compra_confirmada' : 'sin_referencia');

                foreach ($prestable->stocks as $stock) {
                    $cantidadTotal = $stock->getTotalGeneralAttribute();

                    $totalCanastillas += $cantidadTotal;

                    if ($prestable->capacidad) {
                        $totalEmbases += $cantidadTotal * $prestable->capacidad;
                    }
                }

                // Retornar array con todas las propiedades y relaciones
                return array_merge($prestable->toArray(), [
                    'total_canastillas' => $totalCanastillas,
                    'total_embases' => $totalEmbases,
                    'embasesRelacionados' => $prestable->embasesRelacionados->toArray(), // Explícitamente incluir embases
                    'prestablePadre' => $prestable->prestablePadre ? $prestable->prestablePadre->toArray() : null, // Explícitamente incluir canastilla relacionada
                    'productosRelacionados' => $prestable->productosRelacionados->toArray(), // Incluir productos relacionados
                    'stocks' => $prestable->stocks->toArray(),
                    'precio_compra_referencial' => $precioCompraReferencial,
                    'fuente_precio_compra' => $fuentePrecioCompra,
                ]);
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'data' => $data,
                    'current_page' => $prestables->currentPage(),
                    'per_page' => $prestables->perPage(),
                    'total' => $prestables->total(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error listando prestables', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error listando prestables'], 500);
        }
    }

    /**
     * POST /api/prestables
     * Crear nueva canastilla/embases
     */
    public function store(Request $request): JsonResponse
    {
        Log::info('🚀🚀🚀 ¡¡STORE METHOD CALLED!!! 🚀🚀🚀');
        Log::info('📋 PRESTABLE STORE - Datos recibidos:', $request->all());

        try {

            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'codigo' => 'nullable|string|unique:prestables,codigo|max:50', // Opcional - si se proporciona, debe ser único
                'tipo' => 'required|in:CANASTILLA,EMBASES,OTRO',
                'capacidad' => 'nullable|integer|min:1',
                'producto_id' => 'nullable|exists:productos,id',
                'proveedor_id' => 'nullable|exists:proveedores,id',
                'prestable_relacionado_id' => 'nullable|exists:prestables,id',
                'descripcion' => 'nullable|string',
                'crear_embase_asociado' => 'nullable|boolean', // ✨ NUEVO: Flag para crear embase
                'productos_relacionados' => 'nullable|array',
                'productos_relacionados.*.producto_id' => 'required_with:productos_relacionados|exists:productos,id',
                'productos_relacionados.*.descripcion' => 'nullable|string',
                'productos_relacionados.*.es_principal' => 'nullable|boolean',
                'productos_relacionados.*.orden' => 'nullable|integer|min:0',
                'precios' => 'nullable|array',
                'precios.*.tipo_precio' => 'nullable|in:VENTA,PRESTAMO,COMPRA,DAÑO_TOTAL',
                'precios.*.valor' => 'nullable|numeric|min:0',
                'condiciones' => 'nullable|array',
                'condiciones.monto_garantia' => 'nullable|numeric|min:0',
                'condiciones.monto_daño_total' => 'nullable|numeric|min:0',
            ]);

            Log::info('✅ PRESTABLE VALIDADO:', $validated);
            Log::info('📍 Código recibido:', ['codigo' => $validated['codigo'] ?? 'VACÍO - SERÁ AUTOGENERADO']);

            $prestable = DB::transaction(function () use ($validated) {
                // ✨ NUEVO: Si no hay código personalizado, generar basado en el ID
                $codigoPersonalizado = $validated['codigo'];

                if (!empty($codigoPersonalizado)) {
                    // Validar que el código personalizado sea único
                    if (Prestable::where('codigo', $codigoPersonalizado)->exists()) {
                        throw new \Exception("El código '{$codigoPersonalizado}' ya existe");
                    }
                    $codigoAUsar = $codigoPersonalizado;
                } else {
                    // Usar un código temporal que será reemplazado por el ID
                    $codigoAUsar = 'TEMP-' . time();
                }

                // Crear prestable con el código temporal (o personalizado)
                $prestable = Prestable::create([
                    'nombre' => $validated['nombre'],
                    'codigo' => $codigoAUsar,
                    'tipo' => $validated['tipo'],
                    'capacidad' => $validated['capacidad'] ?? null,
                    'producto_id' => $validated['producto_id'] ?? null,
                    'proveedor_id' => $validated['proveedor_id'] ?? null,
                    'prestable_relacionado_id' => $validated['prestable_relacionado_id'] ?? null,
                    'descripcion' => $validated['descripcion'] ?? null,
                    'activo' => true,
                ]);

                // ✨ Si no era código personalizado, generar el FINAL basado en el ID
                if (empty($codigoPersonalizado)) {
                    $prefijo = $validated['tipo'] === 'CANASTILLA' ? 'CANT' : ($validated['tipo'] === 'EMBASES' ? 'EMBA' : 'PRES');
                    $codigoFinal = "{$prefijo}-{$prestable->id}"; // Ej: CANT-42

                    // Actualizar el prestable con el código basado en ID
                    $prestable->update(['codigo' => $codigoFinal]);
                    Log::info('🔑 Código autogenerado basado en ID:', ['id' => $prestable->id, 'codigo' => $codigoFinal]);
                }

                Log::info('✅ Prestable creado con código:', ['id' => $prestable->id, 'codigo' => $prestable->codigo]);

                // Crear precios
                if (isset($validated['precios']) && is_array($validated['precios'])) {
                    Log::info('💰 Procesando precios:', $validated['precios']);
                    foreach ($validated['precios'] as $precio) {
                        if (!empty($precio['tipo_precio']) && $precio['valor'] !== null) {
                            Log::info('💾 Guardando precio:', [
                                'tipo_precio' => $precio['tipo_precio'],
                                'valor' => $precio['valor'] ?? 0,
                            ]);
                            $prestable->precios()->create([
                                'tipo_precio' => $precio['tipo_precio'],
                                'valor' => $precio['valor'] ?? 0,
                                'activo' => true,
                            ]);
                        } else {
                            Log::warning('⚠️ Precio descartado por valores vacíos:', $precio);
                        }
                    }
                } else {
                    Log::warning('⚠️ No hay precios para procesar');
                }

                // Crear condiciones
                if (isset($validated['condiciones']) && is_array($validated['condiciones'])) {
                    Log::info('🔒 Procesando condiciones:', $validated['condiciones']);
                    $tieneCondiciones = !empty($validated['condiciones']['monto_garantia'])
                        || !empty($validated['condiciones']['monto_daño_total']);

                    if ($tieneCondiciones) {
                        Log::info('💾 Guardando condiciones:', [
                            'monto_garantia' => $validated['condiciones']['monto_garantia'] ?? 0,
                            'monto_daño_total' => $validated['condiciones']['monto_daño_total'] ?? 0,
                        ]);
                        $prestable->condiciones()->create([
                            'monto_garantia' => $validated['condiciones']['monto_garantia'] ?? 0,
                            'monto_daño_total' => $validated['condiciones']['monto_daño_total'] ?? 0,
                            'activo' => true,
                        ]);
                    } else {
                        Log::warning('⚠️ Condiciones descartadas por ser todas 0');
                    }
                } else {
                    Log::warning('⚠️ No hay condiciones para procesar');
                }

                // ✨ NUEVO: Guardar productos relacionados
                if (isset($validated['productos_relacionados']) && is_array($validated['productos_relacionados'])) {
                    Log::info('🔗 Procesando productos relacionados:', $validated['productos_relacionados']);
                    foreach ($validated['productos_relacionados'] as $index => $productoRel) {
                        if (!empty($productoRel['producto_id'])) {
                            Log::info('💾 Guardando producto relacionado:', [
                                'producto_id' => $productoRel['producto_id'],
                                'descripcion' => $productoRel['descripcion'] ?? null,
                                'es_principal' => $productoRel['es_principal'] ?? false,
                                'orden' => $productoRel['orden'] ?? $index,
                            ]);
                            $prestable->productosRelacionados()->create([
                                'producto_id' => $productoRel['producto_id'],
                                'descripcion' => $productoRel['descripcion'] ?? null,
                                'es_principal' => $productoRel['es_principal'] ?? false,
                                'orden' => $productoRel['orden'] ?? $index,
                            ]);
                        }
                    }
                } else {
                    Log::warning('⚠️ No hay productos relacionados para procesar');
                }

                // ✨ NUEVO: Crear stock inicial en TODOS los almacenes de prestables
                $almacenes = AlmacenPrestable::where('activo', true)->get();
                Log::info('📦 Creando stock inicial para prestable en todos los almacenes:', ['cantidad_almacenes' => $almacenes->count()]);

                foreach ($almacenes as $almacen) {
                    Log::info('📦 Creando stock en almacén:', ['almacen_id' => $almacen->id, 'almacen_nombre' => $almacen->nombre]);
                    $prestable->stocks()->create([
                        'almacenes_prestables_id' => $almacen->id,
                        'cantidad_disponible' => 0,
                        'cantidad_prestamo_cliente_activo' => 0,
                        'cantidad_prestamo_proveedor_activo' => 0,
                        'cantidad_vendida' => 0,
                    ]);
                }

                // ✨ NUEVO: Si es canastilla y se solicita crear embase asociado
                if ($validated['tipo'] === 'CANASTILLA' && !empty($validated['crear_embase_asociado'])) {
                    Log::info('🔗 Creando embase asociado para canastilla:', ['canastilla_id' => $prestable->id]);

                    // Crear código temporal para el embase
                    $codigoEmbaseTemporal = 'TEMP-' . time() . '-EMB';

                    // Crear el embase
                    $embase = Prestable::create([
                        'nombre' => 'EMB-' . $validated['nombre'], // Prefijo EMB- en el nombre
                        'codigo' => $codigoEmbaseTemporal,
                        'tipo' => 'EMBASES',
                        'capacidad' => null, // Los embases no tienen capacidad
                        'producto_id' => $validated['producto_id'] ?? null, // Mismo producto
                        'proveedor_id' => $validated['proveedor_id'] ?? null,
                        'prestable_relacionado_id' => $prestable->id, // Relacionado con la canastilla
                        'descripcion' => $validated['descripcion'] ?? null,
                        'activo' => true,
                    ]);

                    // Generar código del embase basado en su ID
                    $codigoEmbaseFinal = "EMBA-{$embase->id}";
                    $embase->update(['codigo' => $codigoEmbaseFinal]);

                    // Crear stock inicial para el embase en TODOS los almacenes
                    foreach ($almacenes as $almacen) {
                        Log::info('📦 Creando stock embase en almacén:', ['almacen_id' => $almacen->id, 'almacen_nombre' => $almacen->nombre]);
                        $embase->stocks()->create([
                            'almacenes_prestables_id' => $almacen->id,
                            'cantidad_disponible' => 0,
                            'cantidad_prestamo_cliente_activo' => 0,
                            'cantidad_prestamo_proveedor_activo' => 0,
                            'cantidad_vendida' => 0,
                        ]);
                    }

                    // Copiar precios del embase si los tiene
                    if (isset($validated['precios']) && is_array($validated['precios'])) {
                        foreach ($validated['precios'] as $precio) {
                            if (!empty($precio['tipo_precio']) && $precio['valor'] !== null) {
                                $embase->precios()->create([
                                    'tipo_precio' => $precio['tipo_precio'],
                                    'valor' => $precio['valor'] ?? 0,
                                    'activo' => true,
                                ]);
                            }
                        }
                    }

                    // ✨ Copiar productos relacionados del embase si los tiene
                    if (isset($validated['productos_relacionados']) && is_array($validated['productos_relacionados'])) {
                        Log::info('🔗 Copiando productos relacionados al embase asociado:', $validated['productos_relacionados']);
                        foreach ($validated['productos_relacionados'] as $index => $productoRel) {
                            if (!empty($productoRel['producto_id'])) {
                                Log::info('💾 Guardando producto relacionado al embase:', [
                                    'producto_id' => $productoRel['producto_id'],
                                    'es_principal' => $productoRel['es_principal'] ?? false,
                                ]);
                                $embase->productosRelacionados()->create([
                                    'producto_id' => $productoRel['producto_id'],
                                    'descripcion' => $productoRel['descripcion'] ?? null,
                                    'es_principal' => $productoRel['es_principal'] ?? false,
                                    'orden' => $productoRel['orden'] ?? $index,
                                ]);
                            }
                        }
                    } else {
                        Log::warning('⚠️ No hay productos relacionados para copiar al embase');
                    }

                    Log::info('✅ Embase asociado creado:', ['embase_id' => $embase->id, 'codigo' => $embase->codigo]);
                }

                return $prestable;
            });

            Log::info('✅ Prestable creado', ['prestable_id' => $prestable->id, 'nombre' => $prestable->nombre]);

            $prestableWithRelations = $prestable->load(['precios', 'condiciones']);
            Log::info('📤 RESPUESTA DEL BACKEND:', [
                'prestable_id' => $prestableWithRelations->id,
                'precios_count' => count($prestableWithRelations->precios),
                'precios' => $prestableWithRelations->precios,
                'condiciones' => $prestableWithRelations->condiciones,
            ]);

            return response()->json([
                'success' => true,
                'data' => $prestableWithRelations,
                'message' => 'Prestable creado exitosamente',
            ], 201);
        } catch (\Exception $e) {
            Log::error('❌❌❌ ERROR CREANDO PRESTABLE ❌❌❌', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'error_type' => class_basename($e),
            ], 422);
        }
    }

    /**
     * GET /api/prestables/{prestable}
     * Ver detalles de una canastilla
     */
    public function show(Prestable $prestable): JsonResponse
    {
        try {
            $prestable->load([
                'producto',
                'proveedor',
                'precios',
                'condiciones',
                'stocks.almacenPrestable',
                'prestablePadre:id,nombre,codigo,capacidad',
                'embasesRelacionados',
                'productosRelacionados.producto:id,nombre,sku',
            ]);

            // Calcular totales de stock
            $totalCanastillas = 0;
            $totalEmbases = 0;

            foreach ($prestable->stocks as $stock) {
                $cantidadTotal = $stock->cantidad_disponible
                    + $stock->cantidad_prestamo_cliente_activo
                    + $stock->cantidad_prestamo_proveedor_activo
                    + $stock->cantidad_vendida;

                $totalCanastillas += $cantidadTotal;

                if ($prestable->capacidad) {
                    $totalEmbases += $cantidadTotal * $prestable->capacidad;
                }
            }

            $prestable->total_canastillas = $totalCanastillas;
            $prestable->total_embases = $totalEmbases;

            // Convertir a array y transformar relaciones a snake_case para el frontend
            $data = $prestable->toArray();
            $data['embases_relacionados'] = $prestable->embasesRelacionados->toArray();
            $data['prestable_padre'] = $prestable->prestablePadre ? $prestable->prestablePadre->toArray() : null;
            $data['productos_relacionados'] = $prestable->productosRelacionados->toArray();

            // Calcular stock resumido
            $almacenId = auth()->user()->empresa->almacenes_prestables_id ?? 1;
            $resumenStock = $this->stockService->obtenerResumen($prestable->id, $almacenId);

            return response()->json([
                'success' => true,
                'data' => $data,
                'stock_resumen' => $resumenStock,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error obteniendo prestable', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error obteniendo prestable'], 500);
        }
    }

    /**
     * PUT /api/prestables/{prestable}
     * Actualizar canastilla
     */
    public function update(Request $request, Prestable $prestable): JsonResponse
    {
        Log::info('🔄 UPDATE PRESTABLE - Datos recibidos:', $request->all());

        try {
            $validated = $request->validate([
                'nombre' => 'sometimes|string|max:255',
                'tipo' => 'sometimes|in:CANASTILLA,EMBASES,OTRO',
                'capacidad' => 'nullable|integer|min:1',
                'producto_id' => 'nullable|exists:productos,id',
                'proveedor_id' => 'nullable|exists:proveedores,id',
                'prestable_relacionado_id' => 'nullable|exists:prestables,id',
                'descripcion' => 'nullable|string',
                'activo' => 'sometimes|boolean',
                'productos_relacionados' => 'nullable|array',
                'productos_relacionados.*.producto_id' => 'required_with:productos_relacionados|exists:productos,id',
                'productos_relacionados.*.descripcion' => 'nullable|string',
                'productos_relacionados.*.es_principal' => 'nullable|boolean',
                'productos_relacionados.*.orden' => 'nullable|integer|min:0',
                'precios' => 'nullable|array',
                'precios.*.tipo_precio' => 'nullable|in:VENTA,PRESTAMO,COMPRA,DAÑO_TOTAL',
                'precios.*.valor' => 'nullable|numeric|min:0',
                'condiciones' => 'nullable|array',
                'condiciones.monto_garantia' => 'nullable|numeric|min:0',
                'condiciones.monto_daño_total' => 'nullable|numeric|min:0',
            ]);

            Log::info('✅ DATOS VALIDADOS:', $validated);

            DB::transaction(function () use ($validated, $prestable) {
                // Actualizar campos básicos
                $prestable->update([
                    'nombre' => $validated['nombre'] ?? $prestable->nombre,
                    'tipo' => $validated['tipo'] ?? $prestable->tipo,
                    'capacidad' => $validated['capacidad'] ?? $prestable->capacidad,
                    'producto_id' => $validated['producto_id'] ?? $prestable->producto_id,
                    'proveedor_id' => $validated['proveedor_id'] ?? $prestable->proveedor_id,
                    'prestable_relacionado_id' => $validated['prestable_relacionado_id'] ?? $prestable->prestable_relacionado_id,
                    'descripcion' => $validated['descripcion'] ?? $prestable->descripcion,
                    'activo' => $validated['activo'] ?? $prestable->activo,
                ]);

                // Actualizar/Crear precios
                if (isset($validated['precios']) && is_array($validated['precios'])) {
                    Log::info('💰 Procesando precios para actualización:', $validated['precios']);

                    foreach ($validated['precios'] as $precio) {
                        if (!empty($precio['tipo_precio']) && $precio['valor'] !== null) {
                            // Buscar si existe precio con este tipo
                            $precioExistente = $prestable->precios()
                                ->where('tipo_precio', $precio['tipo_precio'])
                                ->first();

                            if ($precioExistente) {
                                Log::info('🔄 Actualizando precio existente:', [
                                    'tipo_precio' => $precio['tipo_precio'],
                                    'valor' => $precio['valor'],
                                ]);
                                $precioExistente->update([
                                    'valor' => $precio['valor'] ?? 0,
                                ]);
                            } else {
                                Log::info('➕ Creando nuevo precio:', [
                                    'tipo_precio' => $precio['tipo_precio'],
                                    'valor' => $precio['valor'],
                                ]);
                                $prestable->precios()->create([
                                    'tipo_precio' => $precio['tipo_precio'],
                                    'valor' => $precio['valor'] ?? 0,
                                    'activo' => true,
                                ]);
                            }
                        }
                    }
                }

                // Actualizar/Crear condiciones
                if (isset($validated['condiciones']) && is_array($validated['condiciones'])) {
                    Log::info('🔒 Procesando condiciones:', $validated['condiciones']);

                    $tieneCondiciones = !empty($validated['condiciones']['monto_garantia'])
                        || !empty($validated['condiciones']['monto_daño_total']);

                    if ($tieneCondiciones) {
                        $condicionExistente = $prestable->condiciones()->first();

                        if ($condicionExistente) {
                            Log::info('🔄 Actualizando condición existente');
                            $condicionExistente->update([
                                'monto_garantia' => $validated['condiciones']['monto_garantia'] ?? 0,
                                'monto_daño_total' => $validated['condiciones']['monto_daño_total'] ?? 0,
                            ]);
                        } else {
                            Log::info('➕ Creando nueva condición');
                            $prestable->condiciones()->create([
                                'monto_garantia' => $validated['condiciones']['monto_garantia'] ?? 0,
                                'monto_daño_total' => $validated['condiciones']['monto_daño_total'] ?? 0,
                                'activo' => true,
                            ]);
                        }
                    }
                }

                // Actualizar productos relacionados
                if (isset($validated['productos_relacionados'])) {
                    Log::info('🔗 Actualizando productos relacionados');

                    // Eliminar productos relacionados existentes
                    $prestable->productosRelacionados()->delete();

                    // Crear los nuevos
                    if (is_array($validated['productos_relacionados'])) {
                        foreach ($validated['productos_relacionados'] as $index => $productoRel) {
                            if (!empty($productoRel['producto_id'])) {
                                Log::info('💾 Guardando producto relacionado actualizado:', [
                                    'producto_id' => $productoRel['producto_id'],
                                    'es_principal' => $productoRel['es_principal'] ?? false,
                                ]);
                                $prestable->productosRelacionados()->create([
                                    'producto_id' => $productoRel['producto_id'],
                                    'descripcion' => $productoRel['descripcion'] ?? null,
                                    'es_principal' => $productoRel['es_principal'] ?? false,
                                    'orden' => $productoRel['orden'] ?? $index,
                                ]);
                            }
                        }
                    }
                }
            });

            Log::info('✅ Prestable actualizado', ['prestable_id' => $prestable->id]);

            return response()->json([
                'success' => true,
                'data' => $prestable->load(['precios', 'condiciones']),
                'message' => 'Prestable actualizado exitosamente',
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error actualizando prestable', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * DELETE /api/prestables/{prestable}
     * Eliminar canastilla de la BD
     */
    public function destroy(Prestable $prestable): JsonResponse
    {
        try {
            $prestableId = $prestable->id;
            $prestableName = $prestable->nombre;

            $prestable->delete();

            Log::info('✅ Prestable eliminado', ['prestable_id' => $prestableId, 'nombre' => $prestableName]);

            return response()->json([
                'success' => true,
                'message' => 'Prestable eliminado exitosamente',
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error eliminando prestable', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error eliminando prestable'], 500);
        }
    }

    /**
     * GET /api/prestables/{prestable}/stock
     * Obtener stock por almacén
     */
    public function obtenerStock(Prestable $prestable): JsonResponse
    {
        try {
            $stocks = $prestable->stocks()->with('almacen')->get();

            return response()->json([
                'success' => true,
                'data' => $stocks,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error obteniendo stock', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error obteniendo stock'], 500);
        }
    }

    /**
     * GET /api/prestables/{prestable}/disponibilidad
     * Obtener disponibilidad total del prestable (suma de todos los almacenes)
     */
    public function obtenerDisponibilidad(Prestable $prestable): JsonResponse
    {
        try {
            $prestable->load(['stocks.almacen', 'prestablePadre:id,nombre,codigo,capacidad']);

            // Calcular totales sumando todos los almacenes
            $totalDisponible = 0;
            $totalEnPrestamocliente = 0;
            $totalEnPrestamoproveedor = 0;
            $totalVendida = 0;
            $totalGeneral = 0;

            foreach ($prestable->stocks as $stock) {
                $totalDisponible += $stock->cantidad_disponible;
                $totalEnPrestamocliente += $stock->cantidad_prestamo_cliente_activo;
                $totalEnPrestamoproveedor += $stock->cantidad_prestamo_proveedor_activo;
                $totalVendida += $stock->cantidad_vendida;
            }

            $totalGeneral = $totalDisponible + $totalEnPrestamocliente + $totalEnPrestamoproveedor + $totalVendida;

            // Calcular embases si aplica
            $totalDisponibleEmbases = $prestable->capacidad ? $totalDisponible * $prestable->capacidad : null;
            $totalEnPrestamoclienteEmbases = $prestable->capacidad ? $totalEnPrestamocliente * $prestable->capacidad : null;
            $totalEnPrestamoproveedorEmbases = $prestable->capacidad ? $totalEnPrestamoproveedor * $prestable->capacidad : null;
            $totalVendidaEmbases = $prestable->capacidad ? $totalVendida * $prestable->capacidad : null;
            $totalGeneralEmbases = $prestable->capacidad ? $totalGeneral * $prestable->capacidad : null;

            return response()->json([
                'success' => true,
                'data' => [
                    'prestable' => [
                        'id' => $prestable->id,
                        'nombre' => $prestable->nombre,
                        'codigo' => $prestable->codigo,
                        'tipo' => $prestable->tipo,
                        'capacidad' => $prestable->capacidad,
                        'prestablePadre' => $prestable->prestablePadre,
                    ],
                    'stock' => [
                        'canastillas' => [
                            'disponible' => $totalDisponible,
                            'en_prestamo_cliente' => $totalEnPrestamocliente,
                            'en_prestamo_proveedor' => $totalEnPrestamoproveedor,
                            'vendida' => $totalVendida,
                            'total' => $totalGeneral,
                        ],
                        'embases' => $prestable->capacidad ? [
                            'disponible' => $totalDisponibleEmbases,
                            'en_prestamo_cliente' => $totalEnPrestamoclienteEmbases,
                            'en_prestamo_proveedor' => $totalEnPrestamoproveedorEmbases,
                            'vendida' => $totalVendidaEmbases,
                            'total' => $totalGeneralEmbases,
                        ] : null,
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error obteniendo disponibilidad', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error obteniendo disponibilidad'], 500);
        }
    }

    /**
     * POST /api/prestables/{prestable}/stock/incrementar
     * Incrementar stock (compra inicial)
     */
    public function incrementarStock(Request $request, Prestable $prestable): JsonResponse
    {
        try {
            $validated = $request->validate([
                'almacenes_prestables_id' => 'required|exists:almacenes_prestables,id',
                'cantidad' => 'required|integer|min:1',
            ]);

            $this->stockService->incrementarStockInicial(
                $prestable->id,
                $validated['almacenes_prestables_id'],
                $validated['cantidad']
            );

            $resumen = $this->stockService->obtenerResumen($prestable->id, $validated['almacenes_prestables_id']);

            return response()->json([
                'success' => true,
                'message' => 'Stock incrementado',
                'stock_resumen' => $resumen,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error incrementando stock', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * POST /api/prestables/{prestable}/stock/ajustar
     * Realizar ajustes de stock con los 4 valores de categorías
     */
    public function ajustarStock(Request $request, Prestable $prestable): JsonResponse
    {
        try {
            Log::info('📥 RECIBIDO DEL FRONTEND - ajustarStock', [
                'prestable_id' => $prestable->id,
                'request_input' => $request->all(),
            ]);

            $validated = $request->validate([
                'almacenes_prestables_id' => 'required|exists:almacenes_prestables,id',
                'cantidad_disponible' => 'required|integer|min:0',
                'cantidad_prestamo_cliente_activo' => 'required|integer|min:0',
                'cantidad_prestamo_proveedor_activo' => 'required|integer|min:0',
                'cantidad_vendida' => 'required|integer|min:0',
                'motivo' => 'nullable|string|max:255',
                'comentarios' => 'nullable|string|max:500',
            ]);

            $stock = PrestableStock::where('prestable_id', $prestable->id)
                ->where('almacenes_prestables_id', $validated['almacenes_prestables_id'])
                ->firstOrFail();

            // Valores anteriores para auditoría
            $valoresAnteriores = [
                'disponible' => $stock->cantidad_disponible,
                'prestamo_cliente' => $stock->cantidad_prestamo_cliente_activo,
                'prestamo_proveedor' => $stock->cantidad_prestamo_proveedor_activo,
                'vendida' => 0, // No existe campo vendida en prestable_stock
            ];

            Log::info('📊 ANTES DE ACTUALIZAR STOCK', [
                'prestable_id' => $prestable->id,
                'stock_id' => $stock->id,
                'valores_anteriores' => $valoresAnteriores,
                'valores_a_guardar' => [
                    'disponible' => $validated['cantidad_disponible'],
                    'cliente' => $validated['cantidad_prestamo_cliente_activo'],
                    'proveedor' => $validated['cantidad_prestamo_proveedor_activo'],
                ],
            ]);

            DB::transaction(function () use ($stock, $validated, $prestable, $valoresAnteriores) {
                // Actualizar stock con los nombres correctos
                $stock->update([
                    'cantidad_disponible' => $validated['cantidad_disponible'],
                    'cantidad_prestamo_cliente_activo' => $validated['cantidad_prestamo_cliente_activo'],
                    'cantidad_prestamo_proveedor_activo' => $validated['cantidad_prestamo_proveedor_activo'],
                ]);

                Log::info('✅ STOCK ACTUALIZADO CORRECTAMENTE', [
                    'prestable_id' => $prestable->id,
                    'stock_id' => $stock->id,
                    'nuevos_valores' => $stock->fresh()->toArray(),
                ]);

                // 📊 Guardar ajuste en auditoría (con nombres de columnas reales de la tabla)
                $ajuste = AjusteStockPrestable::create([
                    'prestable_id' => $prestable->id,
                    'prestable_stock_id' => $stock->id,
                    'almacenes_prestables_id' => $validated['almacenes_prestables_id'],
                    'usuario_id' => auth()->id(),
                    'cantidad_disponible_antes' => $valoresAnteriores['disponible'],
                    'cantidad_en_prestamo_cliente_antes' => $valoresAnteriores['prestamo_cliente'],
                    'cantidad_en_prestamo_proveedor_antes' => $valoresAnteriores['prestamo_proveedor'],
                    'cantidad_vendida_antes' => $valoresAnteriores['vendida'],
                    'cantidad_disponible_despues' => $validated['cantidad_disponible'],
                    'cantidad_en_prestamo_cliente_despues' => $validated['cantidad_prestamo_cliente_activo'],
                    'cantidad_en_prestamo_proveedor_despues' => $validated['cantidad_prestamo_proveedor_activo'],
                    'cantidad_vendida_despues' => 0, // No hay campo vendida en prestable_stock
                    'motivo' => $validated['motivo'] ?? null,
                    'comentarios' => $validated['comentarios'] ?? null,
                    'tipo_ajuste' => 'ajuste_relativo',
                    'ip_usuario' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);

                // 📈 Registrar movimiento en tabla movimientos_prestables
                MovimientoPrestable::create([
                    'prestable_stock_id' => $stock->id,
                    'almacenes_prestables_id' => $validated['almacenes_prestables_id'],
                    'usuario_id' => auth()->id(),
                    'tipo' => 'AJUSTE_DIRECTO',
                    'cantidad' => abs(
                        ($validated['cantidad_disponible'] - $valoresAnteriores['disponible']) +
                        ($validated['cantidad_prestamo_cliente_activo'] - $valoresAnteriores['prestamo_cliente']) +
                        ($validated['cantidad_prestamo_proveedor_activo'] - $valoresAnteriores['prestamo_proveedor'])
                    ),
                    'disponible_anterior' => $valoresAnteriores['disponible'],
                    'prestamo_cliente_anterior' => $valoresAnteriores['prestamo_cliente'],
                    'prestamo_proveedor_anterior' => $valoresAnteriores['prestamo_proveedor'],
                    'vendida_anterior' => 0,
                    'disponible_posterior' => $validated['cantidad_disponible'],
                    'prestamo_cliente_posterior' => $validated['cantidad_prestamo_cliente_activo'],
                    'prestamo_proveedor_posterior' => $validated['cantidad_prestamo_proveedor_activo'],
                    'vendida_posterior' => 0,
                    'categoria_afectada' => null,
                    'motivo' => $validated['motivo'] ?? null,
                    'observaciones' => $validated['comentarios'] ?? null,
                    'numero_referencia' => "AJUSTE-{$ajuste->id}",
                    'referencia_tipo' => 'AJUSTE',
                    'referencia_id' => $ajuste->id,
                    'ip_usuario' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);

                Log::info('📊 AJUSTE DE STOCK PRESTABLE (TABLA) - GUARDADO EN AUDITORÍA', [
                    'prestable_id' => $prestable->id,
                    'almacenes_prestables_id' => $validated['almacenes_prestables_id'],
                    'usuario_id' => auth()->id(),
                    'valores_anteriores' => $valoresAnteriores,
                    'valores_nuevos' => [
                        'disponible' => $validated['cantidad_disponible'],
                        'prestamo_cliente' => $validated['cantidad_prestamo_cliente_activo'],
                        'prestamo_proveedor' => $validated['cantidad_prestamo_proveedor_activo'],
                    ],
                    'motivo' => $validated['motivo'] ?? 'Sin especificar',
                    'comentarios' => $validated['comentarios'] ?? 'Sin comentarios',
                ]);
            });

            // Recargar stock actualizado
            $stock->refresh();

            return response()->json([
                'success' => true,
                'message' => 'Stock ajustado exitosamente',
                'data' => $stock,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error ajustando stock', [
                'prestable_id' => $prestable->id,
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * GET /api/prestables/ajustes/historial
     * Obtener historial de ajustes con paginación y filtros
     */
    public function historialAjustes(Request $request): JsonResponse
    {
        try {
            $query = AjusteStockPrestable::query()
                ->with(['prestable', 'almacenPrestable', 'usuario'])
                ->orderByDesc('created_at');

            // Filtros
            if ($request->filled('prestable_id')) {
                $query->where('prestable_id', $request->input('prestable_id'));
            }

            if ($request->filled('almacenes_prestables_id')) {
                $query->where('almacenes_prestables_id', $request->input('almacenes_prestables_id'));
            }

            if ($request->filled('usuario_id')) {
                $query->where('usuario_id', $request->input('usuario_id'));
            }

            if ($request->filled('fecha_desde')) {
                $query->whereDate('created_at', '>=', $request->input('fecha_desde'));
            }

            if ($request->filled('fecha_hasta')) {
                $query->whereDate('created_at', '<=', $request->input('fecha_hasta'));
            }

            if ($request->filled('buscar')) {
                $buscar = $request->input('buscar');
                $query->whereHas('prestable', function ($q) use ($buscar) {
                    $q->where('nombre', 'ilike', "%{$buscar}%")
                        ->orWhere('codigo', 'ilike', "%{$buscar}%");
                });
            }

            $ajustes = $query->paginate(20);

            return response()->json([
                'success' => true,
                'data' => $ajustes,
            ]);
        } catch (\Exception $e) {
            Log::error('Error obteniendo historial de ajustes', [
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generar documento imprimible de ajuste de stock
     * GET /api/prestables/{prestable}/ajuste-documento
     */
    public function ajusteDocumento(Prestable $prestable, Request $request)
    {
        try {
            $datos = [
                'fecha' => $request->input('fecha', now()->format('d/m/Y H:i')),
                'prestable_nombre' => $prestable->nombre,
                'prestable_codigo' => $prestable->codigo,
                'almacen' => $request->input('almacen', 'N/A'),
                'valores_antes' => [
                    'disponible' => (int) $request->input('disponible_antes', 0),
                    'prestamo_cliente' => (int) $request->input('prestamo_cliente_antes', 0),
                    'prestamo_proveedor' => (int) $request->input('prestamo_proveedor_antes', 0),
                    'vendida' => (int) $request->input('vendida_antes', 0),
                ],
                'valores_despues' => [
                    'disponible' => (int) $request->input('disponible_despues', 0),
                    'prestamo_cliente' => (int) $request->input('prestamo_cliente_despues', 0),
                    'prestamo_proveedor' => (int) $request->input('prestamo_proveedor_despues', 0),
                    'vendida' => (int) $request->input('vendida_despues', 0),
                ],
                'motivo' => $request->input('motivo', ''),
                'comentarios' => $request->input('comentarios', ''),
                'usuario' => auth()->user()->name,
                'empresa' => config('app.name'),
            ];

            // 🔗 Si se actualizó el embase, incluir su información
            if ($request->has('embase_nombre')) {
                $datos['embase'] = [
                    'nombre' => $request->input('embase_nombre'),
                    'codigo' => $request->input('embase_codigo'),
                    'multiplicador' => (int) $request->input('multiplicador', 1),
                    'valores_antes' => [
                        'disponible' => (int) $request->input('embase_disponible_antes', 0),
                        'prestamo_cliente' => (int) $request->input('embase_prestamo_cliente_antes', 0),
                        'prestamo_proveedor' => (int) $request->input('embase_prestamo_proveedor_antes', 0),
                        'vendida' => (int) $request->input('embase_vendida_antes', 0),
                    ],
                    'valores_despues' => [
                        'disponible' => (int) $request->input('embase_disponible_despues', 0),
                        'prestamo_cliente' => (int) $request->input('embase_prestamo_cliente_despues', 0),
                        'prestamo_proveedor' => (int) $request->input('embase_prestamo_proveedor_despues', 0),
                        'vendida' => (int) $request->input('embase_vendida_despues', 0),
                    ],
                ];
            }

            $html = view('documentos.ajuste-stock', $datos)->render();
            $pdf = Pdf::loadHTML($html);
            $pdf->setPaper('A4', 'portrait');

            $nombreArchivo = "ajuste-stock_{$prestable->codigo}_" . now()->format('Ymd_His') . ".pdf";

            return $pdf->download($nombreArchivo);
        } catch (\Exception $e) {
            Log::error('Error generando documento de ajuste', [
                'prestable_id' => $prestable->id,
                'error' => $e->getMessage(),
            ]);
            return back()->with('error', 'Error al generar PDF: ' . $e->getMessage());
        }
    }

    /**
     * GET /api/prestables/movimientos
     * Obtener movimientos de prestables con paginación y filtros
     */
    public function movimientos(Request $request): JsonResponse
    {
        try {
            $query = \App\Models\MovimientoPrestable::query()
                ->with(['prestableStock.prestable', 'prestableStock.almacenPrestable', 'usuario']);

            // Filtros
            if ($request->filled('tipo')) {
                $query->where('tipo', $request->input('tipo'));
            }

            if ($request->filled('almacenes_prestables_id')) {
                $query->where('almacenes_prestables_id', $request->input('almacenes_prestables_id'));
            }

            if ($request->filled('usuario_id')) {
                $query->where('usuario_id', $request->input('usuario_id'));
            }

            if ($request->filled('fecha_desde')) {
                $query->whereDate('created_at', '>=', $request->input('fecha_desde'));
            }

            if ($request->filled('fecha_hasta')) {
                $query->whereDate('created_at', '<=', $request->input('fecha_hasta'));
            }

            if ($request->filled('buscar')) {
                $buscar = $request->input('buscar');
                $query->whereHas('prestableStock.prestable', function ($q) use ($buscar) {
                    $q->where('nombre', 'ilike', "%{$buscar}%")
                        ->orWhere('codigo', 'ilike', "%{$buscar}%");
                });
            }

            // Incluir anulados o solo activos
            if (!$request->boolean('incluir_anulados', false)) {
                $query->where('anulado', false);
            }

            $movimientos = $query->orderBy('created_at', 'desc')->paginate(50);

            return response()->json([
                'success' => true,
                'data' => $movimientos,
            ]);
        } catch (\Exception $e) {
            Log::error('Error obteniendo movimientos de prestables', [
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
