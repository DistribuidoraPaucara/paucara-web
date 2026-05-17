<?php
namespace App\Http\Controllers;

use App\Models\Almacen;
use App\Models\InventarioInicialBorrador;
use App\Models\InventarioInicialBorradorItem;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\StockProducto;
use App\Models\TipoAjusteInventario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class InventarioInicialController extends Controller
{
    /**
     * Mostrar la página de carga masiva de inventario inicial (versión anterior)
     */
    public function index()
    {
        // Obtener almacenes activos
        $almacenes = Almacen::where('activo', true)
            ->select('id', 'nombre')
            ->orderBy('nombre')
            ->get();

        // Obtener el tipo de ajuste INVENTARIO_INICIAL
        $tipoInventarioInicial = TipoAjusteInventario::where('clave', 'INVENTARIO_INICIAL')->firstOrFail();

        // Obtener borradores en estado "borrador" para mostrar si hay trabajos en progreso
        $borradores = InventarioInicialBorrador::with(['usuario:id,name,email', 'items'])
            ->where('estado', 'borrador')
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($borrador) {
                return [
                    'id'              => $borrador->id,
                    'usuario_id'      => $borrador->usuario_id,
                    'usuario_nombre'  => $borrador->usuario->name ?? 'Usuario desconocido',
                    'usuario_email'   => $borrador->usuario->email ?? '',
                    'cantidad_items'  => $borrador->items->count(),
                    'created_at'      => $borrador->created_at->format('d/m/Y H:i'),
                    'updated_at'      => $borrador->updated_at->format('d/m/Y H:i'),
                    'es_tuyo'         => $borrador->usuario_id === Auth::id(),
                ];
            });

        // Renderizar el componente - SIN cargar todos los productos
        // Los productos se buscan al backend según sea necesario mediante búsqueda
        return Inertia::render('inventario/inventario-inicial', [
            'almacenes'  => $almacenes,
            'tipoInventarioInicial' => $tipoInventarioInicial,
            'borradores' => $borradores,
        ]);
    }

    /**
     * Procesar la carga masiva de inventario inicial
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items'                     => 'required|array|min:1',
            'items.*.producto_id'       => 'required|exists:productos,id',
            'items.*.almacen_id'        => 'required|exists:almacenes,id',
            'items.*.cantidad'          => 'required|integer|min:1',
            'items.*.lote'              => 'nullable|string|max:50',
            'items.*.fecha_vencimiento' => 'nullable|date',
            'items.*.observaciones'     => 'nullable|string|max:500',
        ]);

        // Obtener el tipo de ajuste INVENTARIO_INICIAL
        $tipoInventarioInicial = TipoAjusteInventario::where('clave', 'INVENTARIO_INICIAL')->firstOrFail();

        $resultados = [
            'exitosos'     => 0,
            'fallidos'     => 0,
            'advertencias' => [],
            'errores'      => [],
        ];

        DB::beginTransaction();

        try {
            foreach ($validated['items'] as $index => $item) {
                try {
                    // Verificar si ya existe inventario inicial para este producto/almacén
                    $yaExisteInventarioInicial = MovimientoInventario::whereHas('stockProducto', function ($query) use ($item) {
                        $query->where('producto_id', $item['producto_id'])
                            ->where('almacen_id', $item['almacen_id']);
                    })
                        ->where('tipo', 'ENTRADA_AJUSTE')
                        ->where('tipo_ajuste_inventario_id', $tipoInventarioInicial->id)
                        ->exists();

                    if ($yaExisteInventarioInicial) {
                        $resultados['advertencias'][] = "Item #" . ($index + 1) . ": Ya existe inventario inicial cargado para este producto en este almacén. Se agregará como ajuste adicional.";
                    }

                    // Buscar o crear el registro de stock
                    $stockProducto = StockProducto::firstOrCreate(
                        [
                            'producto_id' => $item['producto_id'],
                            'almacen_id'  => $item['almacen_id'],
                            'lote'        => $item['lote'] ?? null,
                        ],
                        [
                            'cantidad'            => 0,
                            'cantidad_disponible' => 0, // Stock disponible (sin reservas)
                            'cantidad_reservada'  => 0, // Stock reservado
                            'fecha_actualizacion' => now(),
                            'fecha_vencimiento'   => $item['fecha_vencimiento'] ?? null,
                        ]
                    );

                    // Si el stock ya existe pero tiene una fecha de vencimiento diferente, actualizarla
                    if (! $stockProducto->wasRecentlyCreated && isset($item['fecha_vencimiento'])) {
                        $stockProducto->fecha_vencimiento = $item['fecha_vencimiento'];
                    }

                    $cantidadAnterior = $stockProducto->cantidad;

                    // Actualizar cantidad y mantener el invariante: cantidad = cantidad_disponible + cantidad_reservada
                    // Como es carga inicial, TODO el stock es disponible (sin reservas)
                    $stockProducto->cantidad            += $item['cantidad'];
                    $stockProducto->cantidad_disponible += $item['cantidad']; // Todo es disponible en carga inicial
                                                                              // cantidad_reservada se mantiene igual (sigue siendo 0 en carga inicial)
                    $stockProducto->fecha_actualizacion  = now();
                    $stockProducto->save();

                    // Validar que el invariante se mantiene
                    if ($stockProducto->validarInvariante() === false) {
                        throw new \Exception(
                            "Invariante de stock roto para producto_id={$item['producto_id']}, almacen_id={$item['almacen_id']}: " .
                            "cantidad ({$stockProducto->cantidad}) != cantidad_disponible ({$stockProducto->cantidad_disponible}) + cantidad_reservada ({$stockProducto->cantidad_reservada})"
                        );
                    }

                    // Generar número de documento para la carga inicial
                    $numeroDocumento = 'INV-INICIAL-' . now()->format('Ymd') . '-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT);

                    // Registrar el movimiento
                    MovimientoInventario::create([
                        'stock_producto_id'         => $stockProducto->id,
                        'cantidad'                  => $item['cantidad'],
                        'cantidad_anterior'         => $cantidadAnterior,
                        'cantidad_posterior'        => $stockProducto->cantidad,
                        'fecha'                     => now(),
                        'numero_documento'          => $numeroDocumento,
                        'observacion'               => $item['observaciones'] ?? 'Carga inicial de inventario al implementar el sistema',
                        'tipo'                      => 'ENTRADA_AJUSTE',
                        'tipo_ajuste_inventario_id' => $tipoInventarioInicial->id,
                        'referencia_tipo'           => 'inventario_inicial',
                        'referencia_id'             => null,
                        'user_id'                   => Auth::id(),
                        'ip_dispositivo'            => $request->ip(),
                    ]);

                    $resultados['exitosos']++;
                } catch (\Exception $e) {
                    $resultados['fallidos']++;
                    $resultados['errores'][] = "Item #" . ($index + 1) . ": {$e->getMessage()}";
                    Log::error("Error en carga de inventario inicial item #" . ($index + 1), [
                        'item'  => $item,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            DB::commit();

            return redirect()->back()->with('success', "Inventario inicial cargado: {$resultados['exitosos']} exitosos, {$resultados['fallidos']} fallidos." . (count($resultados['advertencias']) > 0 ? ' Revisa las advertencias.' : ''));
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error en carga masiva de inventario inicial', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Error al cargar el inventario inicial: ' . $e->getMessage());
        }
    }

    /**
     * Crear o obtener un borrador para el usuario actual
     */
    public function createOrGetDraft()
    {
        $borrador = InventarioInicialBorrador::firstOrCreate(
            [
                'usuario_id' => Auth::id(),
                'estado'     => 'borrador',
            ],
            [
                'usuario_id' => Auth::id(),
                'estado'     => 'borrador',
            ]
        );

        return response()->json([
            'id'     => $borrador->id,
            'estado' => $borrador->estado,
        ]);
    }

    /**
     * Guardar o actualizar un item del borrador
     */
    public function storeDraftItem(Request $request, $borradorId)
    {
        $validated = $request->validate([
            'producto_id'       => 'required|exists:productos,id',
            'almacen_id'        => 'required|exists:almacenes,id',
            'cantidad'          => 'nullable|numeric|min:0',
            'lote'              => 'nullable|string|max:100',
            'fecha_vencimiento' => 'nullable|date',
            'precio_costo'      => 'nullable|numeric|min:0',
        ]);

        // Verificar que el borrador pertenece al usuario actual
        $borrador = InventarioInicialBorrador::findOrFail($borradorId);
        if ($borrador->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        // Usar UPSERT para insertar o actualizar
        // IMPORTANTE: Incluir 'lote' en los criterios de búsqueda para evitar duplicados
        $item = InventarioInicialBorradorItem::updateOrCreate(
            [
                'borrador_id' => $borradorId,
                'producto_id' => $validated['producto_id'],
                'almacen_id'  => $validated['almacen_id'],
                'lote'        => $validated['lote'] ?? null,
            ],
            $validated
        );

        return response()->json([
            'success'     => true,
            'item'        => $item,
            'lastUpdated' => now(),
        ]);
    }

    /**
     * Obtener un borrador con todos sus items
     */
    public function getDraft($borradorId)
    {
        $borrador = InventarioInicialBorrador::with([
            'items.producto.codigosBarra',  // ✅ Cargar códigos de barra con el producto
            'items.producto.marca',         // ✅ NUEVO: Cargar marca del producto
            'items.producto.unidad',        // ✅ NUEVO: Cargar unidad de medida del producto (corrected relationship name)
            'items.almacen',
            'items.stockProducto',
        ])->findOrFail($borradorId);

        // ✅ NUEVO (2026-02-24): Ordenar items por ID DESC para que los nuevos aparezcan primero
        // Usar ->values() para resetear las claves del array indexado
        $itemsOrdenados = $borrador->items->sortByDesc('id')->values();

        // Verificar autorización
        if ($borrador->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        return response()->json([
            'id'      => $borrador->id,
            'estado'  => $borrador->estado,
            'items'   => $itemsOrdenados->map(fn($item) => [  // ✅ Usar items ordenados
                'id'                 => $item->id,
                'producto_id'        => $item->producto_id,
                'almacen_id'         => $item->almacen_id,
                'cantidad'           => $item->cantidad,
                'lote'               => $item->lote,
                'fecha_vencimiento'  => $item->fecha_vencimiento,
                'precio_costo'       => $item->precio_costo,
                'producto'           => $item->producto,
                'almacen'            => $item->almacen,
                'stock_existente_id' => $item->stock_producto_id,
                'es_actualizacion'   => $item->stock_producto_id !== null,
            ]),
            'created' => $borrador->created_at,
            'updated' => $borrador->updated_at,
        ]);
    }

    /**
     * Agregar múltiples productos al borrador
     */
    public function addProductosToDraft(Request $request, $borradorId)
    {
        $validated = $request->validate([
            'producto_ids'   => 'required|array|min:1',
            'producto_ids.*' => 'exists:productos,id',
        ]);

        $borrador = InventarioInicialBorrador::findOrFail($borradorId);

        // Verificar autorización
        if ($borrador->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        // Obtener almacenes activos
        $almacenes = Almacen::where('activo', true)->get();

        // Crear items para cada producto/almacén, cargando stock existente
        $items = [];
        foreach ($validated['producto_ids'] as $productoId) {
            foreach ($almacenes as $almacen) {
                // Buscar stock existente para este producto/almacén
                $stocksExistentes = StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacen->id)
                    ->get();

                if ($stocksExistentes->isEmpty()) {
                    // Crear item sin stock (nuevo producto)
                    $item = InventarioInicialBorradorItem::firstOrCreate(
                        [
                            'borrador_id' => $borradorId,
                            'producto_id' => $productoId,
                            'almacen_id'  => $almacen->id,
                        ],
                        [
                            'cantidad'          => null,
                            'lote'              => null,
                            'fecha_vencimiento' => null,
                            'precio_costo'      => null,
                            'stock_producto_id' => null,
                        ]
                    );
                    $items[] = $item;
                } else {
                    // Crear un item por cada lote existente
                    foreach ($stocksExistentes as $stock) {
                        $item = InventarioInicialBorradorItem::firstOrCreate(
                            [
                                'borrador_id' => $borradorId,
                                'producto_id' => $productoId,
                                'almacen_id'  => $almacen->id,
                                'lote'        => $stock->lote,
                            ],
                            [
                                'cantidad'          => $stock->cantidad,
                                'fecha_vencimiento' => $stock->fecha_vencimiento,
                                'precio_costo'      => $stock->precio_costo,
                                'stock_producto_id' => $stock->id,
                            ]
                        );
                        $items[] = $item;
                    }
                }
            }
        }

        return response()->json([
            'success'    => true,
            'itemsCount' => count($items),
            'items'      => $items,
        ]);
    }

    /**
     * Eliminar un item del borrador
     */
    public function deleteDraftItem($borradorId, $itemId)
    {
        $borrador = InventarioInicialBorrador::findOrFail($borradorId);

        // Verificar autorización
        if ($borrador->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $item = InventarioInicialBorradorItem::where('id', $itemId)
            ->where('borrador_id', $borradorId)
            ->firstOrFail();

        $item->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Completar el borrador y guardar el inventario inicial
     */
    public function completeDraft(Request $request, $borradorId)
    {
        $validated = $request->validate([
            'validar_cantidades' => 'boolean',
        ]);

        $borrador = InventarioInicialBorrador::with('items')->findOrFail($borradorId);

        // Verificar autorización
        if ($borrador->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        DB::beginTransaction();
        try {
            $tipoInventarioInicial = TipoAjusteInventario::where('clave', 'INVENTARIO_INICIAL')->firstOrFail();
            $resultados            = [
                'exitosos'     => 0,
                'fallidos'     => 0,
                'advertencias' => [],
                'errores'      => [],
            ];

            foreach ($borrador->items as $index => $item) {
                // Permitir cantidad 0 (reemplazar sin importar el valor)
                if ($item->cantidad === null) {
                    continue; // Solo saltar si es null
                }

                // Usar savepoint para aislar cada item
                $savepointName = 'sp_item_' . $index;
                DB::statement("SAVEPOINT {$savepointName}");

                try {
                    if ($item->stock_producto_id) {
                        // Reemplazar stock existente (no actualizar)
                        $stockProducto = StockProducto::find($item->stock_producto_id);

                        if (!$stockProducto) {
                            throw new \Exception("Stock producto con ID {$item->stock_producto_id} no encontrado");
                        }

                        $cantidadAnterior = $stockProducto->cantidad;
                        $diferencia       = $item->cantidad - $cantidadAnterior;

                        // REEMPLAZAR cantidad y cantidad_disponible (ignorar reservas previas)
                        $stockProducto->cantidad            = $item->cantidad;
                        $stockProducto->cantidad_disponible = $item->cantidad;
                        $stockProducto->cantidad_reservada  = 0;
                        $stockProducto->lote                = $item->lote;
                        $stockProducto->fecha_vencimiento   = $item->fecha_vencimiento;
                        if ($item->precio_costo) {
                            $stockProducto->precio_costo = $item->precio_costo;
                        }
                        $stockProducto->fecha_actualizacion = now();
                        $stockProducto->save();

                        // Validar invariante
                        if ($stockProducto->validarInvariante() === false) {
                            throw new \Exception("Invariante de stock roto para producto_id={$item->producto_id}");
                        }

                        // Registrar movimiento de ajuste
                        if ($diferencia !== 0) {
                            MovimientoInventario::create([
                                'stock_producto_id'         => $stockProducto->id,
                                'cantidad'                  => $diferencia,
                                'cantidad_anterior'         => $cantidadAnterior,
                                'cantidad_posterior'        => $stockProducto->cantidad,
                                'fecha'                     => now(),
                                'numero_documento'          => 'INV-AJUSTE-' . now()->format('Ymd') . '-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                                'observacion'               => 'Ajuste de inventario inicial',
                                'tipo'                      => 'ENTRADA_AJUSTE',
                                'tipo_ajuste_inventario_id' => $tipoInventarioInicial->id,
                                'referencia_tipo'           => 'inventario_inicial_borrador',
                                'referencia_id'             => $item->id,
                                'user_id'                   => Auth::id(),
                                'ip_dispositivo'            => $request->ip(),
                            ]);
                        }
                    } else {
                        // Crear nuevo registro de stock
                        $stockProducto = StockProducto::create([
                            'producto_id'         => $item->producto_id,
                            'almacen_id'          => $item->almacen_id,
                            'cantidad'            => $item->cantidad,
                            'cantidad_disponible' => $item->cantidad,
                            'cantidad_reservada'  => 0,
                            'lote'                => $item->lote,
                            'fecha_vencimiento'   => $item->fecha_vencimiento,
                            'precio_costo'        => $item->precio_costo,
                            'fecha_actualizacion' => now(),
                        ]);

                        // Registrar movimiento de creación
                        MovimientoInventario::create([
                            'stock_producto_id'         => $stockProducto->id,
                            'cantidad'                  => $item->cantidad,
                            'cantidad_anterior'         => 0,
                            'cantidad_posterior'        => $item->cantidad,
                            'fecha'                     => now(),
                            'numero_documento'          => 'INV-INICIAL-' . now()->format('Ymd') . '-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                            'observacion'               => 'Carga inicial de inventario',
                            'tipo'                      => 'ENTRADA_AJUSTE',
                            'tipo_ajuste_inventario_id' => $tipoInventarioInicial->id,
                            'referencia_tipo'           => 'inventario_inicial_borrador',
                            'referencia_id'             => $item->id,
                            'user_id'                   => Auth::id(),
                            'ip_dispositivo'            => $request->ip(),
                        ]);
                    }

                    $resultados['exitosos']++;
                    // Confirmar savepoint
                    DB::statement("RELEASE SAVEPOINT {$savepointName}");
                } catch (\Exception $e) {
                    // Revertir solo este item
                    DB::statement("ROLLBACK TO SAVEPOINT {$savepointName}");
                    $resultados['fallidos']++;
                    $resultados['errores'][] = "Item producto {$item->producto_id}, almacén {$item->almacen_id}: {$e->getMessage()}";
                    Log::error('Error completando item del borrador', ['error' => $e->getMessage()]);
                }
            }

            // Marcar borrador como completado
            $borrador->estado = 'completado';
            $borrador->save();

            DB::commit();

            return response()->json([
                'success'    => true,
                'resultados' => $resultados,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error completando inventario inicial borrador', [
                'borrador_id' => $borradorId,
                'error'       => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'Error al completar el inventario: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Cargar productos paginados al borrador con stock actual
     * Prioridad: ID exacto > SKU exacto > Código de barras exacto > Búsqueda parcial
     */
    public function loadProductsPaginated(Request $request, $borradorId)
    {
        $validated = $request->validate([
            'page'     => 'integer|min:1',
            'per_page' => 'integer|min:1|max:100',
            'search'   => 'nullable|string|max:255',
        ]);

        $borrador = InventarioInicialBorrador::findOrFail($borradorId);

        // Verificar autorización
        if ($borrador->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $page    = $validated['page'] ?? 1;
        $perPage = $validated['per_page'] ?? 30;
        $search  = $validated['search'] ?? '';

        $exactMatch = false; // Flag para indicar si es búsqueda exacta

        // Obtener productos activos
        $productosQuery = Producto::with(['categoria', 'marca', 'unidad', 'codigosBarra'])
            ->where('activo', true);

        // Aplicar búsqueda con PRIORIDAD
        if (! empty($search)) {
            $searchLower = strtolower($search);
            $searchNumeric = is_numeric($search) ? (int) $search : null;

            // INTENTO 1: Búsqueda exacta por ID (si es número)
            if ($searchNumeric !== null) {
                $productosPorId = (clone $productosQuery)->where('id', $searchNumeric)->get();
                if ($productosPorId->count() > 0) {
                    $productos = $productosPorId;
                    $exactMatch = true;
                    $page = 1;
                } else {
                    // INTENTO 2: Búsqueda exacta por SKU
                    $productosPorSku = (clone $productosQuery)
                        ->whereRaw('LOWER(sku) = ?', [$searchLower])
                        ->get();

                    if ($productosPorSku->count() > 0) {
                        $productos = $productosPorSku;
                        $exactMatch = true;
                        $page = 1;
                    } else {
                        // INTENTO 3: Búsqueda exacta por código de barras
                        $productosPorCodigo = (clone $productosQuery)
                            ->whereHas('codigosBarra', function ($q) use ($searchLower) {
                                $q->whereRaw('LOWER(codigo) = ?', [$searchLower])
                                    ->where('activo', true);
                            })
                            ->get();

                        if ($productosPorCodigo->count() > 0) {
                            $productos = $productosPorCodigo;
                            $exactMatch = true;
                            $page = 1;
                        } else {
                            // ❌ Sin coincidencia exacta - Retornar vacío (no fallback a parcial)
                            $productos = collect();
                        }
                    }
                }
            } else {
                // INTENTO 2: Búsqueda exacta por SKU (si no es número)
                $productosPorSku = (clone $productosQuery)
                    ->whereRaw('LOWER(sku) = ?', [$searchLower])
                    ->get();

                if ($productosPorSku->count() > 0) {
                    $productos = $productosPorSku;
                    $exactMatch = true;
                    $page = 1;
                } else {
                    // INTENTO 3: Búsqueda exacta por código de barras
                    $productosPorCodigo = (clone $productosQuery)
                        ->whereHas('codigosBarra', function ($q) use ($searchLower) {
                            $q->whereRaw('LOWER(codigo) = ?', [$searchLower])
                                ->where('activo', true);
                        })
                        ->get();

                    if ($productosPorCodigo->count() > 0) {
                        $productos = $productosPorCodigo;
                        $exactMatch = true;
                        $page = 1;
                    } else {
                        // ❌ Sin coincidencia exacta - Retornar vacío (no fallback a parcial)
                        $productos = collect();
                    }
                }
            }
        } else {
            $productos = $productosQuery->paginate($perPage, ['*'], 'page', $page);
        }

        // Convertir a colección si es resultado exacto (no paginado)
        if ($exactMatch && !($productos instanceof \Illuminate\Pagination\LengthAwarePaginator)) {
            $productosArray = $productos->toArray();
        } else {
            $productosArray = $productos instanceof \Illuminate\Pagination\LengthAwarePaginator
                ? $productos->items()
                : $productos->toArray();
        }

        // Obtener almacenes activos
        $almacenes = Almacen::where('activo', true)->get();

        // Agregar productos al borrador con stock actual
        $productosIds = is_array($productosArray)
            ? collect($productosArray)->pluck('id')->toArray()
            : collect($productosArray)->pluck('id')->toArray();

        // Usar el método existente para agregar productos (ya carga stock)
        $items = [];
        foreach ($productosIds as $productoId) {
            foreach ($almacenes as $almacen) {
                // Buscar stock existente
                $stocksExistentes = StockProducto::where('producto_id', $productoId)
                    ->where('almacen_id', $almacen->id)
                    ->get();

                if ($stocksExistentes->isEmpty()) {
                    $item = InventarioInicialBorradorItem::firstOrCreate(
                        [
                            'borrador_id' => $borradorId,
                            'producto_id' => $productoId,
                            'almacen_id'  => $almacen->id,
                        ],
                        [
                            'cantidad'          => null,
                            'lote'              => null,
                            'fecha_vencimiento' => null,
                            'precio_costo'      => null,
                            'stock_producto_id' => null,
                        ]
                    );
                    $items[] = $item;
                } else {
                    foreach ($stocksExistentes as $stock) {
                        $item = InventarioInicialBorradorItem::firstOrCreate(
                            [
                                'borrador_id' => $borradorId,
                                'producto_id' => $productoId,
                                'almacen_id'  => $almacen->id,
                                'lote'        => $stock->lote,
                            ],
                            [
                                'cantidad'          => $stock->cantidad,
                                'fecha_vencimiento' => $stock->fecha_vencimiento,
                                'precio_costo'      => $stock->precio_costo,
                                'stock_producto_id' => $stock->id,
                            ]
                        );
                        $items[] = $item;
                    }
                }
            }
        }

        return response()->json([
            'success'      => true,
            'productos'    => $productosArray,
            'current_page' => $productos instanceof \Illuminate\Pagination\LengthAwarePaginator ? $productos->currentPage() : 1,
            'last_page'    => $productos instanceof \Illuminate\Pagination\LengthAwarePaginator ? $productos->lastPage() : 1,
            'per_page'     => $productos instanceof \Illuminate\Pagination\LengthAwarePaginator ? $productos->perPage() : count($productosArray),
            'total'        => count($productosArray),
            'itemsAdded'   => count($items),
            'exactMatch'   => $exactMatch,
            'resultCount'  => count($productosArray),
        ]);
    }

    /**
     * Buscar producto en el borrador por múltiples criterios
     * Busca por: id, nombre, sku, código de barras, marca, categoría (case insensitive)
     */
    /**
     * Buscar productos sin agregarlos al borrador (SOLO para sugerencias)
     */
    public function searchProductosForSuggestions(Request $request, $borradorId)
    {
        $validated = $request->validate([
            'search'   => 'nullable|string|max:255',
            'per_page' => 'integer|min:1|max:100',
        ]);

        $borrador = InventarioInicialBorrador::findOrFail($borradorId);

        // Verificar autorización
        if ($borrador->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $search   = $validated['search'] ?? '';
        $perPage  = $validated['per_page'] ?? 10;

        // Obtener productos activos SIN agregarlos al borrador
        $productosQuery = Producto::with(['categoria', 'marca', 'unidad', 'codigosBarra', 'proveedor'])
            ->where('activo', true);

        // Aplicar búsqueda
        if (! empty($search)) {
            $searchLower = strtolower($search);
            $productosQuery->where(function ($q) use ($search, $searchLower) {
                $q->whereRaw('LOWER(nombre) like ?', ["%{$searchLower}%"])
                    ->orWhereRaw('LOWER(sku) like ?', ["%{$searchLower}%"])
                    ->orWhereHas('codigosBarra', function ($codigoQuery) use ($searchLower) {
                        $codigoQuery->whereRaw('LOWER(codigo) like ?', ["%{$searchLower}%"])
                            ->where('activo', true);
                    })
                    ->orWhereHas('proveedor', function ($proveedorQuery) use ($searchLower) {
                        $proveedorQuery->whereRaw('LOWER(nombre) like ?', ["%{$searchLower}%"]);
                    });
            });
        }

        $productos = $productosQuery->limit($perPage)->get();

        return response()->json([
            'productos' => $productos,
        ]);
    }

    public function searchProductoInDraft(Request $request, $borradorId)
    {
        $validated = $request->validate([
            'search' => 'required|string|min:1|max:255',
        ]);

        $borrador = InventarioInicialBorrador::findOrFail($borradorId);

        // Verificar autorización
        if ($borrador->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $search      = trim($validated['search']);
        $searchLower = strtolower($search);

        // Buscar en los items del borrador con relaciones
        $item = InventarioInicialBorradorItem::with([
            'producto' => function ($query) {
                $query->with(['categoria:id,nombre', 'marca:id,nombre', 'unidad:id,nombre', 'codigosBarra']);
            },
            'almacen:id,nombre',
        ])
            ->where('borrador_id', $borradorId)
            ->whereHas('producto', function ($query) use ($searchLower, $search) {
                // Búsqueda case insensitive por múltiples criterios
                $query->where(function ($q) use ($searchLower, $search) {
                    // Búsqueda exacta por ID (si es número)
                    if (is_numeric($search)) {
                        $q->orWhere('id', (int) $search);
                    }

                    // Búsqueda case insensitive en nombre
                    $q->orWhereRaw('LOWER(nombre) LIKE ?', ["%{$searchLower}%"])
                    // Búsqueda case insensitive en SKU
                        ->orWhereRaw('LOWER(sku) LIKE ?', ["%{$searchLower}%"])
                    // Búsqueda case insensitive en código de barras legacy
                        ->orWhereRaw('LOWER(codigo_barras) LIKE ?', ["%{$searchLower}%"])
                    // Búsqueda en tabla codigos_barra (actual)
                        ->orWhereHas('codigosBarra', function ($q) use ($searchLower) {
                            $q->whereRaw('LOWER(codigo) LIKE ?', ["%{$searchLower}%"])
                                ->where('activo', true);
                        })
                    // Búsqueda en marca (relacional)
                        ->orWhereHas('marca', function ($q) use ($searchLower) {
                            $q->whereRaw('LOWER(nombre) LIKE ?', ["%{$searchLower}%"]);
                        })
                    // Búsqueda en categoría (relacional)
                        ->orWhereHas('categoria', function ($q) use ($searchLower) {
                            $q->whereRaw('LOWER(nombre) LIKE ?', ["%{$searchLower}%"]);
                        });
                });
            })
            ->first();

        if ($item) {
            return response()->json([
                'success'  => true,
                'found'    => true,
                'producto' => [
                    'id'            => $item->producto->id,
                    'nombre'        => $item->producto->nombre,
                    'sku'           => $item->producto->sku,
                    'codigo_barras' => $item->producto->codigo_barras,
                    'categoria'     => $item->producto->categoria?->nombre,
                    'marca'         => $item->producto->marca?->nombre,
                ],
                'item'     => [
                    'cantidad'          => $item->cantidad,
                    'lote'              => $item->lote,
                    'fecha_vencimiento' => $item->fecha_vencimiento,
                    'almacen'           => $item->almacen?->nombre,
                ],
                'message'  => "Producto ya registrado en borrador",
            ]);
        }

        return response()->json([
            'success' => true,
            'found'   => false,
            'message' => 'Producto no encontrado en borrador',
        ]);
    }

    /**
     * Verificar si un producto ya tiene inventario inicial cargado
     */
    private function tieneInventarioInicial(int $productoId): bool
    {
        $tipoInventarioInicial = TipoAjusteInventario::where('clave', 'INVENTARIO_INICIAL')->first();

        if (! $tipoInventarioInicial) {
            return false;
        }

        return MovimientoInventario::whereHas('stockProducto', function ($query) use ($productoId) {
            $query->where('producto_id', $productoId);
        })
            ->where('tipo', 'ENTRADA_AJUSTE')
            ->where('tipo_ajuste_inventario_id', $tipoInventarioInicial->id)
            ->exists();
    }
}
