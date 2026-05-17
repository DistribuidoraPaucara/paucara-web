<?php
namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Requests\CreateMovimientoRequest;
use App\Http\Requests\StoreAjusteInventarioRequest;
use App\Http\Requests\StoreMermaRequest;
use App\Http\Requests\StoreTransferenciaInventarioRequest;
use App\Models\Almacen;
use App\Models\AjusteInventario;
use App\Models\Categoria;
use App\Models\DetalleTransferenciaInventario;
use App\Models\EstadoMerma;
use App\Models\MermaInventario;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\StockProducto;
use App\Models\TipoAjusteInventario;
use App\Models\TipoMerma;
use App\Models\TipoOperacion;
use App\Models\TransferenciaInventario;
use App\Models\User;
use App\Models\Venta;
use App\Models\Vehiculo;
use App\Services\Ajuste\AjusteDistribucionService;
use App\Services\ExcelExportService;
use App\Services\Merma\MermaDistribucionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class InventarioController extends Controller
{
    private ExcelExportService $excelExportService;
    private AjusteDistribucionService $ajusteDistribucionService;
    private MermaDistribucionService $mermaDistribucionService;

    public function __construct(
        ExcelExportService $excelExportService,
        AjusteDistribucionService $ajusteDistribucionService,
        MermaDistribucionService $mermaDistribucionService
    )
    {
        $this->excelExportService = $excelExportService;
        $this->ajusteDistribucionService = $ajusteDistribucionService;
        $this->mermaDistribucionService = $mermaDistribucionService;
    }
    /**
     * Generar número secuencial para ajuste de inventario
     * Formato: AJ + YYYYMMDD + XXXX (ejemplo: AJ202510290001)
     */
    private function generarNumeroAjuste(): string
    {
        $fecha       = now()->format('Ymd');
        $maxIntentos = 5;
        $intento     = 0;

        while ($intento < $maxIntentos) {
            try {
                // Buscar el último movimiento de ajuste del día
                $ultimoAjuste = MovimientoInventario::where('numero_documento', 'like', "AJ{$fecha}%")
                    ->orderBy('numero_documento', 'desc')
                    ->lockForUpdate()
                    ->first();

                if ($ultimoAjuste) {
                    $numeroSecuencial = intval(substr($ultimoAjuste->numero_documento, -4)) + 1;
                } else {
                    $numeroSecuencial = 1;
                }

                $numero = 'AJ' . $fecha . str_pad($numeroSecuencial, 4, '0', STR_PAD_LEFT);

                \Illuminate\Support\Facades\Log::info('Número de ajuste generado', [
                    'numero'  => $numero,
                    'intento' => $intento + 1,
                ]);

                return $numero;

            } catch (\Illuminate\Database\QueryException $e) {
                $intento++;
                if ($intento >= $maxIntentos) {
                    throw new \Exception('No se pudo generar el número de ajuste después de ' . $maxIntentos . ' intentos');
                }
                usleep(100000); // Esperar 100ms antes de reintentar
            }
        }

        throw new \Exception('Error al generar número de ajuste');
    }

    /**
     * Dashboard principal de inventario
     */
    public function dashboard(): Response
    {
        // Estadísticas generales
        $totalProductos          = Producto::where('activo', true)->count();
        $productosStockBajo      = Producto::where('activo', true)->stockBajo()->count();
        $productosProximosVencer = Producto::where('activo', true)->proximosVencer(30)->count();
        $productosVencidos       = Producto::where('activo', true)->vencidos()->count();

        // Stock por almacén - agrupado por producto+almacén con detalles de lotes
        // Incluye productos con cantidad >= 0 (incluyendo 0) y todos los productos sin registros en stock_productos
        $stockPorAlmacen = StockProducto::with([
            'producto',
            'producto.codigoPrincipal',
            'almacen',
            'producto.precios',
            'producto.unidad',
            'producto.conversiones.unidadDestino',
        ])
            ->whereHas('producto', function ($q) {
                $q->where('activo', true); // Solo productos activos
            })
            ->withoutTrashed() // Excluir registros soft deleted
            ->where('cantidad', '>=', 0) // Incluye cantidad 0 para ver productos sin movimiento
            ->orderBy('almacen_id')
            ->orderBy('producto_id')
            ->get();

        // Agrupar por producto_id + almacen_id
        $stockAgrupado = [];
        foreach ($stockPorAlmacen as $stock) {
            $clave = $stock->producto_id . '_' . $stock->almacen_id;

            if (! isset($stockAgrupado[$clave])) {
                // Obtener precio de venta base
                $precioVenta = 0;
                if ($stock->producto) {
                    $precioVentaObj = $stock->producto->precios?->firstWhere('es_precio_base', true);
                    $precioVenta    = $precioVentaObj?->precio ?? $stock->producto->precio_venta ?? 0;
                }

                $stockAgrupado[$clave] = [
                    'id'                        => null,
                    'producto_id'               => $stock->producto_id,
                    'almacen_id'                => $stock->almacen_id,
                    'cantidad'                  => 0,
                    'cantidad_disponible'       => 0,
                    'cantidad_reservada'        => 0,
                    'precio_venta'              => $precioVenta,
                    'producto_nombre'           => $stock->producto?->nombre ?? 'Desconocido',
                    'producto_codigo'           => $stock->producto?->codigo ?? '',
                    'producto_codigo_barra'     => $stock->producto?->codigoPrincipal?->codigo ?? '',
                    'producto_sku'              => $stock->producto?->sku ?? '',
                    'almacen_nombre'            => $stock->almacen?->nombre ?? 'Desconocido',
                    'es_fraccionado'            => (bool) $stock->producto?->es_fraccionado,
                    'unidad_medida_nombre'      => $stock->producto?->unidad?->nombre ?? 'Unidades',
                    'fecha_vencimiento_proximo' => null,
                    'detalles_lotes'            => [],
                ];
            }

            // Acumular cantidades
            $stockAgrupado[$clave]['cantidad']            += $stock->cantidad;
            $stockAgrupado[$clave]['cantidad_disponible'] += $stock->cantidad_disponible;
            $stockAgrupado[$clave]['cantidad_reservada']  += $stock->cantidad_reservada;

            // Procesar conversiones para productos fraccionados
            $conversiones = [];
            if ($stock->producto?->es_fraccionado && $stock->producto->conversiones) {
                $conversiones = $stock->producto->conversiones->map(function ($conv) use ($stock) {
                    return [
                        'id'                     => $conv->id,
                        'unidad_origen_id'       => $conv->unidad_origen_id,
                        'unidad_destino_id'      => $conv->unidad_destino_id,
                        'unidad_destino_nombre'  => $conv->unidadDestino?->nombre ?? '',
                        'factor_conversion'      => $conv->factor_conversion,
                        'cantidad_en_conversion' => round($stock->cantidad * $conv->factor_conversion, 2),
                    ];
                })->values()->toArray();
            }

            // Agregar detalle de lote
            $stockAgrupado[$clave]['detalles_lotes'][] = [
                'id'                  => $stock->id,
                'lote'                => $stock->lote ?? 'Sin lote',
                'fecha_vencimiento'   => $stock->fecha_vencimiento ? \Carbon\Carbon::parse($stock->fecha_vencimiento)->format('d/m/Y') : null,
                'cantidad'            => $stock->cantidad,
                'cantidad_disponible' => $stock->cantidad_disponible,
                'cantidad_reservada'  => $stock->cantidad_reservada,
                'conversiones'        => $conversiones,
            ];

            // Actualizar próximo vencimiento (el más cercano)
            if ($stock->fecha_vencimiento) {
                $fechaParsed = \Carbon\Carbon::parse($stock->fecha_vencimiento);

                // ✅ CORREGIDO (2026-02-17): Inicializar si no existe + usar createFromFormat para parsear fechas formateadas
                if (!isset($stockAgrupado[$clave]['fecha_vencimiento_proximo'])) {
                    $stockAgrupado[$clave]['fecha_vencimiento_proximo'] = $fechaParsed->format('d/m/Y');
                } else {
                    // Usar createFromFormat para parsear fechas en formato d/m/Y (no parse que falla con este formato)
                    $fechaProximoParsed = \Carbon\Carbon::createFromFormat('d/m/Y', $stockAgrupado[$clave]['fecha_vencimiento_proximo']);

                    if ($fechaParsed < $fechaProximoParsed) {
                        $stockAgrupado[$clave]['fecha_vencimiento_proximo'] = $fechaParsed->format('d/m/Y');
                    }
                }
            }
        }

        // Convertir a Collection para las operaciones posteriores
        $stockPorAlmacenCollection = collect($stockAgrupado);

        // ✅ IMPORTANTE: Obtener TODOS los productos activos que NO aparecen en $stockPorAlmacen
        // Esto incluye productos sin NINGÚN registro en stock_productos
        $productosConStock = $stockPorAlmacenCollection->pluck('producto_id')->unique();
        $productossinStock = Producto::where('activo', true)
            ->whereNotIn('id', $productosConStock)
            ->with(['codigoPrincipal', 'precios', 'unidad', 'conversiones.unidadDestino'])
            ->orderBy('nombre')
            ->get();

        // Mapear productos sin stock con cantidad 0
        $stockSinRegistros = $productossinStock->map(function ($producto) {
            // Obtener precio de venta base
            $precioVenta    = 0;
            $precioVentaObj = $producto->precios?->firstWhere('es_precio_base', true);
            $precioVenta    = $precioVentaObj?->precio ?? $producto->precio_venta ?? 0;

            return [
                'id'                        => null,
                'producto_id'               => $producto->id,
                'almacen_id'                => null,
                'cantidad'                  => 0,
                'cantidad_disponible'       => 0,
                'cantidad_reservada'        => 0,
                'precio_venta'              => $precioVenta,
                'producto_nombre'           => $producto->nombre,
                'producto_codigo'           => $producto->codigo ?? '',
                'producto_codigo_barra'     => $producto->codigoPrincipal?->codigo ?? '',
                'producto_sku'              => $producto->sku ?? '',
                'almacen_nombre'            => 'Sin Stock',
                'es_fraccionado'            => (bool) $producto->es_fraccionado,
                'unidad_medida_nombre'      => $producto->unidad?->nombre ?? 'Unidades',
                'fecha_vencimiento_proximo' => null,
                'detalles_lotes'            => [],
            ];
        });

        // Combinar stock existente con productos sin stock
        // ✅ ORDENAMIENTO (2026-02-11): Ordenar SOLO por nombre de producto (alfabético)
        $stockPorAlmacen = $stockPorAlmacenCollection->concat($stockSinRegistros)->sortBy('producto_nombre')->values()->toArray();

        // Movimientos recientes (últimos 7 días)
        // ✅ MEJORADO (2026-02-18): Incluir información de conversiones de unidades
        $movimientosRecientes  = MovimientoInventario::with([
            'stockProducto.producto',
            'stockProducto.almacen',
            'user',
            'unidadVenta:id,nombre',   // Relación con unidades_medida para conversiones (unidad de venta)
            'unidadBase:id,nombre',     // ✅ NUEVO (2026-02-18): Relación para unidad base
        ])
            ->whereBetween('fecha', [now()->subDays(7), now()])
            ->whereHas('stockProducto.producto')
            ->orderByDesc('fecha')
            ->limit(10)
            ->get()
            ->filter(function ($movimiento) {
                // Filtrar movimientos que tengan relaciones válidas
                return $movimiento->stockProducto && $movimiento->stockProducto->producto && $movimiento->stockProducto->almacen;
            })
            ->map(function ($movimiento) {
                // ✅ NUEVO (2026-02-18): Agregar información de conversión para el frontend
                return [
                    'id'                      => $movimiento->id,
                    'stock_producto_id'       => $movimiento->stock_producto_id,
                    'cantidad'                => $movimiento->cantidad,
                    'tipo'                    => $movimiento->tipo,
                    'fecha'                   => $movimiento->fecha->format('d/m/Y H:i'),
                    'numero_documento'        => $movimiento->numero_documento,
                    // Conversión info
                    'es_conversion_aplicada'  => (bool) $movimiento->es_conversion_aplicada,
                    'cantidad_solicitada'     => $movimiento->cantidad_solicitada,
                    'factor_conversion'       => $movimiento->factor_conversion,
                    'unidad_venta_nombre'     => $movimiento->unidadVenta?->nombre,
                    'unidad_base_nombre'      => $movimiento->unidadBase?->nombre, // ✅ NUEVO (2026-02-18): Unidad base
                    // Relaciones
                    'stockProducto' => [
                        'id'       => $movimiento->stockProducto?->id,
                        'producto' => [
                            'id'     => $movimiento->stockProducto?->producto?->id,
                            'nombre' => $movimiento->stockProducto?->producto?->nombre,
                        ],
                        'almacen' => [
                            'id'     => $movimiento->stockProducto?->almacen?->id,
                            'nombre' => $movimiento->stockProducto?->almacen?->nombre,
                        ],
                    ],
                    'user' => [
                        'id'   => $movimiento->user?->id,
                        'name' => $movimiento->user?->name,
                    ],
                ];
            })
            ->values();

        // Top productos con más movimientos en el mes
        $productosMasMovidosData = MovimientoInventario::select([
            'stock_productos.producto_id',
            DB::raw('COUNT(*) as total_movimientos'),
            DB::raw('SUM(ABS(movimientos_inventario.cantidad)) as cantidad_total'),
        ])
            ->join('stock_productos', 'movimientos_inventario.stock_producto_id', '=', 'stock_productos.id')
            ->whereBetween('movimientos_inventario.fecha', [now()->startOfMonth(), now()])
            ->groupBy('stock_productos.producto_id')
            ->orderByRaw('COUNT(*) DESC')
            ->limit(10)
            ->get();

        // Obtener productos en una sola query
        $productoIds = $productosMasMovidosData->pluck('producto_id')->unique();
        $productos   = Producto::whereIn('id', $productoIds)->select('id', 'nombre')->get()->keyBy('id');

        $productosMasMovidos = $productosMasMovidosData->map(function ($item) use ($productos) {
            $producto = $productos->get($item->producto_id);
            return [
                'producto_id'       => $item->producto_id,
                'nombre_producto'   => $producto?->nombre ?? 'Producto desconocido',
                'total_movimientos' => $item->total_movimientos,
            ];
        });

        // Obtener lista de almacenes para los filtros
        $almacenesLista = Almacen::select('id', 'nombre')
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();

        return Inertia::render('inventario/index', [
            'estadisticas'          => [
                'total_productos'           => $totalProductos,
                'productos_stock_bajo'      => $productosStockBajo,
                'productos_proximos_vencer' => $productosProximosVencer,
                'productos_vencidos'        => $productosVencidos,
            ],
            'stock_por_almacen'     => $stockPorAlmacen,
            'movimientos_recientes' => $movimientosRecientes,
            'productos_mas_movidos' => $productosMasMovidos,
            'almacenes'             => $almacenesLista,
        ]);
    }

    /**
     * Productos con stock bajo
     */
    public function stockBajo(Request $request): Response
    {
        $q         = (string) $request->string('q');
        $almacenId = $request->integer('almacen_id');

        // Obtener productos con stock bajo directamente desde StockProducto
        $query = StockProducto::with(['producto.categoria', 'producto.marca', 'almacen'])
            ->withoutTrashed() // Excluir registros soft deleted
            ->where('cantidad', '>', 0)
            ->whereHas('producto', function ($q) {
                $q->where('activo', true)
                    ->where('stock_minimo', '>', 0);
            })
            ->whereRaw('cantidad <= (SELECT stock_minimo FROM productos WHERE productos.id = stock_productos.producto_id)');

        if ($q) {
            $query->whereHas('producto', function ($productQuery) use ($q) {
                $searchLower = strtolower($q);
                $productQuery->whereRaw('LOWER(nombre) like ?', ["%$searchLower%"]);
            });
        }

        if ($almacenId) {
            $query->where('almacen_id', $almacenId);
        }

        $productos = $query->get()
            ->map(function ($stock) {
                return [
                    'id'                => $stock->id,
                    'producto'          => [
                        'id'        => $stock->producto->id,
                        'nombre'    => $stock->producto->nombre,
                        'categoria' => [
                            'nombre' => $stock->producto->categoria->nombre ?? 'Sin categoría',
                        ],
                    ],
                    'almacen'           => [
                        'id'     => $stock->almacen->id,
                        'nombre' => $stock->almacen->nombre,
                    ],
                    'stock_actual'      => $stock->cantidad,
                    'stock_minimo'      => $stock->producto->stock_minimo,
                    'fecha_vencimiento' => $stock->fecha_vencimiento,
                ];
            });

        $almacenes = Almacen::where('activo', true)->orderBy('nombre')->get(['id', 'nombre']);

        return Inertia::render('inventario/stock-bajo', [
            'productos' => $productos,
            'almacenes' => $almacenes,
            'filters'   => [
                'q'          => $q,
                'almacen_id' => $almacenId,
            ],
        ]);
    }

    /**
     * Productos próximos a vencer
     */
    public function proximosVencer(Request $request): Response
    {
        $diasAnticipacion = $request->integer('dias', 30);
        $almacenId        = $request->integer('almacen_id');

        // Obtener productos próximos a vencer directamente desde StockProducto
        $fechaLimite = now()->addDays($diasAnticipacion);

        $query = StockProducto::with(['producto.categoria', 'producto.marca', 'almacen'])
            ->withoutTrashed() // Excluir registros soft deleted
            ->whereNotNull('fecha_vencimiento')
            ->where('fecha_vencimiento', '>', now()->toDateString())
            ->where('fecha_vencimiento', '<=', $fechaLimite)
            ->where('cantidad', '>', 0)
            ->whereHas('producto', function ($q) {
                $q->where('activo', true);
            });

        if ($almacenId) {
            $query->where('almacen_id', $almacenId);
        }

        $productos = $query->orderBy('fecha_vencimiento')
            ->get()
            ->map(function ($stock) {
                return [
                    'id'                => $stock->id,
                    'producto'          => [
                        'id'        => $stock->producto->id,
                        'nombre'    => $stock->producto->nombre,
                        'categoria' => [
                            'nombre' => $stock->producto->categoria->nombre ?? 'Sin categoría',
                        ],
                    ],
                    'almacen'           => [
                        'id'     => $stock->almacen->id,
                        'nombre' => $stock->almacen->nombre,
                    ],
                    'stock_actual'      => $stock->cantidad,
                    'fecha_vencimiento' => $stock->fecha_vencimiento,
                    'dias_para_vencer'  => now()->diffInDays($stock->fecha_vencimiento, false),
                ];
            });

        $almacenes = Almacen::where('activo', true)->orderBy('nombre')->get(['id', 'nombre']);

        return Inertia::render('inventario/proximos-vencer', [
            'productos' => $productos,
            'almacenes' => $almacenes,
            'filters'   => [
                'dias'       => $diasAnticipacion,
                'almacen_id' => $almacenId,
            ],
        ]);
    }

    /**
     * Productos vencidos
     */
    public function vencidos(Request $request): Response
    {
        $almacenId = $request->integer('almacen_id');

        // Obtener productos vencidos directamente desde StockProducto
        $query = StockProducto::with(['producto.categoria', 'producto.marca', 'almacen'])
            ->withoutTrashed() // Excluir registros soft deleted
            ->whereNotNull('fecha_vencimiento')
            ->where('fecha_vencimiento', '<', now()->toDateString())
            ->where('cantidad', '>', 0)
            ->whereHas('producto', function ($q) {
                $q->where('activo', true);
            });

        if ($almacenId) {
            $query->where('almacen_id', $almacenId);
        }

        $productos = $query->orderBy('fecha_vencimiento')
            ->get()
            ->map(function ($stock) {
                return [
                    'id'                => $stock->id,
                    'producto'          => [
                        'id'        => $stock->producto->id,
                        'nombre'    => $stock->producto->nombre,
                        'categoria' => [
                            'nombre' => $stock->producto->categoria->nombre ?? 'Sin categoría',
                        ],
                    ],
                    'almacen'           => [
                        'id'     => $stock->almacen->id,
                        'nombre' => $stock->almacen->nombre,
                    ],
                    'stock_actual'      => $stock->cantidad,
                    'fecha_vencimiento' => $stock->fecha_vencimiento,
                    'dias_vencido'      => now()->diffInDays($stock->fecha_vencimiento, false) * -1,
                ];
            });

        $almacenes = Almacen::where('activo', true)->orderBy('nombre')->get(['id', 'nombre']);

        return Inertia::render('inventario/vencidos', [
            'productos' => $productos,
            'almacenes' => $almacenes,
            'filters'   => [
                'almacen_id' => $almacenId,
            ],
        ]);
    }

    /**
     * Historial de movimientos
     */
    public function movimientos(Request $request): Response
    {
        $fechaInicio = $request->date('fecha_inicio') ?? now()->startOfDay();
        $fechaFin    = $request->date('fecha_fin') ?? now();
        $tipo        = $request->filled('tipo') ? $request->string('tipo') : null;
        $almacenId   = $request->filled('almacen_id') ? $request->integer('almacen_id') : null;
        $productoId  = $request->filled('producto_id') ? $request->integer('producto_id') : null;
        $productoBusqueda = $request->filled('producto_busqueda') ? $request->string('producto_busqueda') : null;
        $observaciones = $request->filled('observaciones') ? $request->string('observaciones') : null;
        $numeroDocumento = $request->filled('numero_documento') ? $request->string('numero_documento') : null;
        $anulado     = $request->filled('anulado') ? $request->boolean('anulado') : null;
        $esReversión = $request->filled('es_reversión') ? $request->boolean('es_reversión') : null;  // ✅ NUEVO: Filtro de reversiones
        $referenciaTipo = $request->filled('referencia_tipo') ? $request->string('referencia_tipo') : null;  // ✅ NUEVO (2026-03-27): Filtro por tipo de referencia (proforma, venta, etc)
        $perPage     = $request->integer('per_page', 15); // ✅ Dinámico: permite cambiar items por página

        // Construir query con filtros
        // ✅ MEJORADO (2026-02-18): Incluir información de conversiones de unidades
        $query = MovimientoInventario::with([
            'stockProducto.producto:id,nombre,sku',
            'stockProducto.almacen:id,nombre',
            'user:id,name,email',  // ✅ MODIFICADO: Agregar email
            'user.roles:id,name',  // ✅ NUEVO: Cargar roles del usuario
            'unidadVenta:id,nombre',  // ✅ NUEVO (2026-02-18): Relación para conversiones (unidad de venta)
            'unidadBase:id,nombre',   // ✅ NUEVO (2026-02-18): Relación para conversiones (unidad base)
        ])->porFecha($fechaInicio, $fechaFin);

        if ($tipo && ! empty($tipo)) {
            $query->porTipo($tipo);
        }

        if ($almacenId && $almacenId > 0) {
            $query->porAlmacen($almacenId);
        }

        // Buscar por ID específico O por búsqueda flexible
        if ($productoId && $productoId > 0) {
            $query->porProducto($productoId);
        } elseif ($productoBusqueda && ! empty($productoBusqueda)) {
            // ✅ MODIFICADO (2026-03-27): Usar búsqueda con PRIORIDAD (ID primero, luego SKU)
            $query->porProductoBusquedaConPrioridad($productoBusqueda);
        }

        // Filtrar por observaciones
        if ($observaciones && ! empty($observaciones)) {
            $query->porObservaciones($observaciones);
        }

        // Filtrar por número de documento
        if ($numeroDocumento && ! empty($numeroDocumento)) {
            $query->where('numero_documento', 'LIKE', '%' . $numeroDocumento . '%');
        }

        // Filtrar por estado (anulado)
        if ($anulado !== null) {
            $query->where('anulado', $anulado);
        }

        // ✅ NUEVO: Filtrar por reversiones (es_reversión=true filtra solo ENTRADA_AJUSTE)
        if ($esReversión === true) {
            $query->where('tipo', 'ENTRADA_AJUSTE');
        }

        // ✅ NUEVO (2026-03-27): Filtrar por tipo de referencia (proforma, venta, etc)
        if ($referenciaTipo && ! empty($referenciaTipo)) {
            $query->where('referencia_tipo', $referenciaTipo);
        }

        // Obtener total para estadísticas
        $totalMovimientos = $query->count();
        $totalEntradas    = (clone $query)->where('tipo', 'like', 'ENTRADA%')->count();
        $totalSalidas     = (clone $query)->where('tipo', 'like', 'SALIDA%')->count();

        // ✅ Paginar resultados - Laravel obtiene automáticamente la página del request
        // ✅ ORDENAMIENTO (2026-02-11): Ordenar por created_at DESC (más recientes primero)
        $movimientosPaginados = $query->orderByDesc('created_at')
            ->paginate($perPage);

        // Mapear datos de movimientos
        $movimientos = $movimientosPaginados->map(function ($movimiento) {
            // ✅ Validar que stockProducto existe (puede ser null si se eliminó el lote)
            $stockProducto = $movimiento->stockProducto;

            if (!$stockProducto) {
                // Si el stock_producto fue eliminado, crear datos fallback
                $cantidadesExtraidas = $this->extraerCantidadesDelJSON($movimiento->observacion);

                return [
                    'id'                => $movimiento->id,
                    'tipo'              => $this->mapearTipoMovimiento($movimiento->tipo),
                    'tipo_ajuste_id'    => $movimiento->tipo_ajuste_inventario_id,
                    'tipo_merma_id'     => $movimiento->tipo_merma_id,
                    'estado_merma_id'   => $movimiento->estado_merma_id,
                    'motivo'            => $this->obtenerMotivoMovimiento($movimiento->tipo),
                    'cantidad'          => $movimiento->cantidad,
                    'cantidad_anterior' => $movimiento->cantidad_anterior,  // ✅ Nombre correcto
                    'cantidad_posterior' => $movimiento->cantidad_posterior,  // ✅ Nombre correcto
                    // ✅ NUEVO (2026-03-26): Información adicional de cantidades - Usar columnas directas
                    'cantidad_total_anterior' => $movimiento->cantidad_total_anterior ?? $cantidadesExtraidas['cantidad_total_anterior'],
                    'cantidad_total_posterior' => $movimiento->cantidad_total_posterior ?? $cantidadesExtraidas['cantidad_total_posterior'],
                    'cantidad_disponible_anterior' => $movimiento->cantidad_disponible_anterior ?? 0,
                    'cantidad_disponible_posterior' => $movimiento->cantidad_disponible_posterior ?? 0,
                    'cantidad_reservada_anterior' => $movimiento->cantidad_reservada_anterior ?? $cantidadesExtraidas['cantidad_reservada_anterior'],
                    'cantidad_reservada_posterior' => $movimiento->cantidad_reservada_posterior ?? $cantidadesExtraidas['cantidad_reservada_posterior'],
                    'fecha'             => $movimiento->fecha->toISOString(),
                    'created_at'        => $movimiento->created_at->toISOString(),  // ✅ NUEVO (2026-02-11): Fecha de creación
                    'usuario'           => [
                        'id'   => $movimiento->user_id,
                        'name' => $movimiento->user?->name ?? 'Sistema',
                        'rol'  => $movimiento->user?->roles?->first()?->name ?? 'Sin rol',  // ✅ NUEVO: Agregar rol
                    ],
                    'producto'          => [
                        'id'        => null,
                        'nombre'    => '[Producto Eliminado]',
                        'sku'       => 'N/A',
                        'categoria' => [
                            'nombre' => 'General',
                        ],
                    ],
                    'almacen'           => [
                        'id'     => null,
                        'nombre' => '[Almacén No Disponible]',
                    ],
                    'stock_producto_id' => null,  // ✅ NUEVO (2026-02-12): ID del stock no disponible
                    'lote'              => '-',  // ✅ NUEVO (2026-02-12): Número de lote no disponible
                    'numero_documento'  => $movimiento->numero_documento,  // ✅ NUEVO: Identificador de venta/proforma
                    'referencia'        => $movimiento->numero_documento,
                    'referencia_tipo'   => $movimiento->referencia_tipo,
                    'referencia_id'     => $movimiento->referencia_id,
                    'observaciones'     => $movimiento->observacion,
                    'anulado'           => (bool) $movimiento->anulado,
                    'motivo_anulacion'  => $movimiento->motivo_anulacion,
                    'user_anulacion_id' => $movimiento->user_anulacion_id,
                    'fecha_anulacion'   => $movimiento->fecha_anulacion ? \Carbon\Carbon::parse($movimiento->fecha_anulacion)->toISOString() : null,
                    'ip_dispositivo'    => $movimiento->ip_dispositivo,
                ];
            }

            $cantidadesExtraidas = $this->extraerCantidadesDelJSON($movimiento->observacion);

            return [
                'id'                => $movimiento->id,
                'tipo'              => $this->mapearTipoMovimiento($movimiento->tipo),
                'tipo_ajuste_id'    => $movimiento->tipo_ajuste_inventario_id,
                'tipo_merma_id'     => $movimiento->tipo_merma_id,
                'estado_merma_id'   => $movimiento->estado_merma_id,
                'motivo'            => $this->obtenerMotivoMovimiento($movimiento->tipo),
                'cantidad'          => $movimiento->cantidad,
                'cantidad_anterior' => $movimiento->cantidad_anterior,  // ✅ Nombre correcto
                'cantidad_posterior' => $movimiento->cantidad_posterior,  // ✅ Nombre correcto
                // ✅ NUEVO (2026-03-26): Información adicional de cantidades - Usar columnas directas
                'cantidad_total_anterior' => $movimiento->cantidad_total_anterior ?? $cantidadesExtraidas['cantidad_total_anterior'],
                'cantidad_total_posterior' => $movimiento->cantidad_total_posterior ?? $cantidadesExtraidas['cantidad_total_posterior'],
                'cantidad_disponible_anterior' => $movimiento->cantidad_disponible_anterior ?? 0,
                'cantidad_disponible_posterior' => $movimiento->cantidad_disponible_posterior ?? 0,
                'cantidad_reservada_anterior' => $movimiento->cantidad_reservada_anterior ?? $cantidadesExtraidas['cantidad_reservada_anterior'],
                'cantidad_reservada_posterior' => $movimiento->cantidad_reservada_posterior ?? $cantidadesExtraidas['cantidad_reservada_posterior'],
                'fecha'             => $movimiento->fecha->toISOString(),
                'created_at'        => $movimiento->created_at->toISOString(),  // ✅ NUEVO (2026-02-11): Fecha de creación
                'usuario'           => [
                    'id'   => $movimiento->user_id,
                    'name' => $movimiento->user?->name ?? 'Sistema',
                    'rol'  => $movimiento->user?->roles?->first()?->name ?? 'Sin rol',  // ✅ NUEVO: Agregar rol
                ],
                'producto'          => [
                    'id'        => $stockProducto->producto->id,
                    'nombre'    => $stockProducto->producto->nombre,
                    'sku'       => $stockProducto->producto->sku,
                    'categoria' => [
                        'nombre' => 'General',
                    ],
                ],
                'almacen'           => [
                    'id'     => $stockProducto->almacen->id,
                    'nombre' => $stockProducto->almacen->nombre,
                ],
                'stock_producto_id' => $stockProducto->id,  // ✅ NUEVO (2026-02-12): ID del stock
                'lote'              => $stockProducto->lote ?? '-',  // ✅ NUEVO (2026-02-12): Número de lote
                'numero_documento'  => $movimiento->numero_documento,  // ✅ NUEVO: Identificador de venta/proforma
                'referencia'        => $movimiento->numero_documento,
                'referencia_tipo'   => $movimiento->referencia_tipo,
                'referencia_id'     => $movimiento->referencia_id,
                'observaciones'     => $movimiento->observacion,
                'anulado'           => (bool) $movimiento->anulado,
                'motivo_anulacion'  => $movimiento->motivo_anulacion,
                'user_anulacion_id' => $movimiento->user_anulacion_id,
                'fecha_anulacion'   => $movimiento->fecha_anulacion ? \Carbon\Carbon::parse($movimiento->fecha_anulacion)->toISOString() : null,
                'ip_dispositivo'    => $movimiento->ip_dispositivo,
                // ✅ NUEVO (2026-02-18): Información de conversiones de unidades
                'es_conversion_aplicada' => (bool) $movimiento->es_conversion_aplicada,
                'cantidad_solicitada'    => $movimiento->cantidad_solicitada,
                'factor_conversion'      => $movimiento->factor_conversion,
                'unidad_venta_nombre'    => $movimiento->unidadVenta?->nombre,
                'unidad_base_nombre'     => $movimiento->unidadBase?->nombre,
            ];
        });

        // Estadísticas
        $stats = [
            'total_movimientos'      => $totalMovimientos,
            'total_entradas'         => $totalEntradas,
            'total_salidas'          => $totalSalidas,
            'total_transferencias'   => 0,
            'total_mermas'           => 0,
            'total_ajustes'          => 0,
            'valor_total_entradas'   => 0,
            'valor_total_salidas'    => 0,
            'valor_total_mermas'     => 0,
            'productos_afectados'    => 0,
            'almacenes_activos'      => 0,
            'movimientos_pendientes' => 0,
            'tendencia_semanal'      => [],
        ];

        // ✅ NUEVO: Obtener productos vendidos hoy (APROBADOS)
        $productosVendidosHoy = [];
        $ventasHoy = Venta::with([
            'detalles.producto:id,nombre,sku',
            'estadoDocumento:id,codigo,nombre',
        ])
        ->whereHas('estadoDocumento', fn($q) => $q->where('codigo', 'APROBADO'))
        ->whereDate('created_at', today())
        ->get();

        // Agrupar por producto
        $productosSumario = [];
        foreach ($ventasHoy as $venta) {
            foreach ($venta->detalles as $detalle) {
                $productoId = $detalle->producto_id;
                if (!isset($productosSumario[$productoId])) {
                    $productosSumario[$productoId] = [
                        'id'                 => $productoId,
                        'nombre'             => $detalle->producto?->nombre ?? 'Producto sin nombre',
                        'sku'                => $detalle->producto?->sku ?? '-',
                        'cantidad_total'     => 0,
                        'precio_unitario'    => $detalle->precio_unitario,
                        'subtotal'           => 0,
                        'stock_actual'       => 0,
                        'stock_inicial'      => 0,
                    ];
                }
                $cantidad = $detalle->cantidad ?? 0;
                $precio = $detalle->precio_unitario ?? 0;
                $productosSumario[$productoId]['cantidad_total'] += $cantidad;
                $productosSumario[$productoId]['subtotal'] += ($cantidad * $precio);
            }
        }

        // ✅ NUEVO: Obtener stock actual y calcular stock inicial
        foreach ($productosSumario as &$producto) {
            // Stock actual = suma de stock disponible en todos los almacenes
            $stockActual = StockProducto::where('producto_id', $producto['id'])
                ->sum('cantidad_disponible');

            // Stock inicial = stock actual + cantidad vendida
            $stockInicial = $stockActual + $producto['cantidad_total'];

            $producto['stock_actual'] = (int) $stockActual;
            $producto['stock_inicial'] = (int) $stockInicial;
        }
        unset($producto);

        // Convertir a array indexado y ordenar por nombre
        $productosVendidosHoy = array_values($productosSumario);
        usort($productosVendidosHoy, fn($a, $b) => strcmp($a['nombre'], $b['nombre']));

        // Datos para filtros
        $almacenes = Almacen::where('activo', true)->orderBy('nombre')->get(['id', 'nombre']);
        $productos = Producto::where('activo', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre'])
            ->take(100); // Limitar para performance

        $tipo_mermas              = TipoMerma::all();
        $tipos_ajueste_inventario = TipoAjusteInventario::where('activo', true)
            ->select('id', 'clave', 'label')
            ->orderBy('label')
            ->get();
        $estado_mermas = EstadoMerma::all();

        return Inertia::render('inventario/movimientos', [
            'movimientos'             => [
                'data'         => $movimientos,
                'current_page' => $movimientosPaginados->currentPage(),
                'per_page'     => $movimientosPaginados->perPage(),
                'total'        => $movimientosPaginados->total(),
                'last_page'    => $movimientosPaginados->lastPage(),
                'from'         => $movimientosPaginados->firstItem(),
                'to'           => $movimientosPaginados->lastItem(),
            ],
            'stats'                   => $stats,
            'filtros'                 => [
                'fecha_inicio'      => $fechaInicio->toDateString(),
                'fecha_fin'         => $fechaFin->toDateString(),
                'tipo'              => $tipo,
                'almacen_id'        => $almacenId,
                // ✅ FIX: No preseleccionar producto por defecto - null para ambos
                'producto_id'       => null,
                'producto_busqueda' => $productoBusqueda,  // ✅ FIXED (2026-03-27): Preservar búsqueda actual en navegación
                'numero_documento'  => $numeroDocumento,
                'observaciones'     => $observaciones,
                'anulado'           => $anulado,
                'es_reversión'      => $esReversión,  // ✅ NUEVO: Pasar filtro de reversiones al frontend
                'referencia_tipo'   => $referenciaTipo,  // ✅ NUEVO (2026-03-27): Pasar filtro de referencia_tipo para mantenerlo en navegación
            ],
            'almacenes'               => $almacenes,
            'productos'               => $productos,
            'productosVendidosHoy'    => $productosVendidosHoy,
            'tipo_mermas'             => $tipo_mermas,
            'tipos_ajuste_inventario' => $tipos_ajueste_inventario,
            'estado_mermas'           => $estado_mermas,
        ]);
    }

    /**
     * ✅ NUEVO (2026-03-26): Extraer información de cantidad desde JSON de observacion
     * Devuelve: cantidad_total_anterior, cantidad_total_posterior, cantidad_reservada_anterior, cantidad_reservada_posterior
     */
    private function extraerCantidadesDelJSON(?string $observacion): array
    {
        $datos = [
            'cantidad_total_anterior' => null,
            'cantidad_total_posterior' => null,
            'cantidad_reservada_anterior' => null,
            'cantidad_reservada_posterior' => null,
        ];

        if (!$observacion) {
            return $datos;
        }

        try {
            $json = json_decode($observacion, true);
            if (is_array($json)) {
                return [
                    'cantidad_total_anterior' => $json['cantidad_total_anterior'] ?? null,
                    'cantidad_total_posterior' => $json['cantidad_total_posterior'] ?? null,
                    'cantidad_reservada_anterior' => $json['cantidad_reservada_anterior'] ?? null,
                    'cantidad_reservada_posterior' => $json['cantidad_reservada_posterior'] ?? null,
                ];
            }
        } catch (\Exception $e) {
            // Si hay error al parsear JSON, devolver nulls
        }

        return $datos;
    }

    /**
     * Mapear tipo de movimiento a formato simple
     */
    private function mapearTipoMovimiento(string $tipo): string
    {
        if (str_starts_with($tipo, 'ENTRADA_')) {
            return 'ENTRADA';
        } elseif (str_starts_with($tipo, 'SALIDA_')) {
            return 'SALIDA';
        } elseif (str_starts_with($tipo, 'RESERVA') || str_starts_with($tipo, 'LIBERACION') || str_starts_with($tipo, 'CONSUMO')) {
            return 'RESERVA';  // ✅ NUEVO: Identificar movimientos de reserva (incluyendo CONSUMO_RESERVA)
        } else {
            return 'AJUSTE';
        }
    }

    /**
     * Obtener motivo legible del movimiento
     */
    private function obtenerMotivoMovimiento(string $tipo): string
    {
        $tipos = [
            'ENTRADA_COMPRA'     => 'Compra',
            'ENTRADA_AJUSTE'     => 'Ajuste de inventario',
            'ENTRADA_DEVOLUCION' => 'Devolución de venta',
            'ENTRADA_TRANSFERENCIA' => 'Transferencia recibida',
            'SALIDA_VENTA'       => 'Venta',
            'SALIDA_MERMA'       => 'Merma',
            'SALIDA_AJUSTE'      => 'Ajuste de inventario',
            'SALIDA_TRANSFERENCIA' => 'Transferencia enviada',
            // ✅ NUEVO: Tipos de reserva
            'RESERVA_PROFORMA'   => 'Reserva de proforma',
            'LIBERACION_RESERVA' => 'Liberación de reserva',
            'CONSUMO_RESERVA'    => 'Consumo de reserva',  // ✅ NUEVO (2026-02-12): Consumo de reserva al convertir proforma
        ];

        return $tipos[$tipo] ?? 'Movimiento desconocido';
    }

    /**
     * Formulario de ajuste de inventario
     */
    public function ajusteForm(Request $request): Response
    {
        $almacenId = $request->integer('almacen_id');
        $tipoAjuste = $request->string('tipo_ajuste'); // 'entrada', 'salida', o vacío para todos
        $perPage = $request->integer('per_page', 15);

        $stockProductos = collect();
        if ($almacenId) {
            $stockProductos = StockProducto::where('almacen_id', $almacenId)
                ->withoutTrashed() // Excluir registros soft deleted
                ->with(['producto:id,nombre,sku,codigo_barras,codigo_qr', 'producto.codigosBarra', 'almacen:id,nombre'])
                ->orderBy('cantidad_disponible', 'desc')
                ->get();
        }

        // Obtener ajustes realizados desde tabla maestra AjusteInventario
        $query = AjusteInventario::with([
            'almacen:id,nombre',
            'user:id,name',
        ]);

        // Filtrar por almacén si se proporciona
        if ($almacenId) {
            $query->where('almacen_id', $almacenId);
        }

        $ajustesInventario = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        // ✅ Transformar datos del ajuste maestro para presentación
        $ajustesInventario->getCollection()->transform(function ($ajuste) {
            return [
                'id' => $ajuste->id,
                'numero' => $ajuste->numero,
                'almacen_id' => $ajuste->almacen_id,
                'user_id' => $ajuste->user_id,
                'cantidad_entradas' => $ajuste->cantidad_entradas,
                'cantidad_salidas' => $ajuste->cantidad_salidas,
                'cantidad_productos' => $ajuste->cantidad_productos,
                'observacion' => $ajuste->observacion,
                'estado' => $ajuste->estado,
                'created_at' => $ajuste->created_at,
                'updated_at' => $ajuste->updated_at,
                // ✅ Relaciones explícitamente incluidas
                'almacen' => $ajuste->almacen ? [
                    'id' => $ajuste->almacen->id,
                    'nombre' => $ajuste->almacen->nombre,
                ] : null,
                'user' => $ajuste->user ? [
                    'id' => $ajuste->user->id,
                    'name' => $ajuste->user->name,
                ] : null,
            ];
        });

        $almacenes = Almacen::where('activo', true)->orderBy('nombre')->get(['id', 'nombre']);

        return Inertia::render('inventario/ajuste', [
            'almacenes'            => $almacenes,
            'stock_productos'      => $stockProductos,
            'almacen_seleccionado' => $almacenId,
            'tipo_ajuste_filtro'   => $tipoAjuste,
            'ajustes_inventario'   => $ajustesInventario,
        ]);
    }

    /**
     * Formulario de merma de inventario - Histórico
     */
    public function mermaForm(Request $request): Response
    {
        $almacenId = $request->integer('almacen_id');
        $tipoMerma = $request->string('tipo_merma', ''); // Filtro por tipo de merma
        $perPage   = $request->integer('per_page', 15);

        $stockProductos = collect();
        if ($almacenId) {
            $stockProductos = StockProducto::where('almacen_id', $almacenId)
                ->withoutTrashed()
                ->with(['producto:id,nombre,sku,codigo_barras,codigo_qr', 'producto.codigosBarra', 'almacen:id,nombre'])
                ->orderBy('cantidad_disponible', 'desc')
                ->get();
        }

        // Obtener mermas realizadas desde tabla maestra MermaInventario
        $query = MermaInventario::with([
            'almacen:id,nombre',
            'user:id,name',
            'movimientos' => function ($q) {
                $q->with(['stockProducto.producto:id,nombre,sku']);
            },
        ]);

        // Filtrar por almacén si se proporciona
        if ($almacenId) {
            $query->where('almacen_id', $almacenId);
        }

        // Filtrar por tipo de merma si se proporciona
        if ($tipoMerma) {
            $query->where('tipo_merma', $tipoMerma);
        }

        $mermasInventario = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        // ✅ Transformar datos de la merma maestra para presentación
        $mermasInventario->getCollection()->transform(function ($merma) {
            if (!$merma) {
                return null;
            }

            return [
                'id'                  => $merma->id ?? null,
                'numero'              => $merma->numero ?? 'SIN NÚMERO',
                'almacen_id'          => $merma->almacen_id ?? null,
                'user_id'             => $merma->user_id ?? null,
                'tipo_merma'          => $merma->tipo_merma ?? 'SIN TIPO',
                'cantidad_productos'  => $merma->cantidad_productos ?? 0,
                'costo_total'         => (float) ($merma->costo_total ?? 0),
                'observacion'         => $merma->observacion ?? null,
                'estado'              => $merma->estado ?? 'procesado',
                'created_at'          => $merma->created_at ? $merma->created_at->toIso8601String() : now()->toIso8601String(),
                'updated_at'          => $merma->updated_at ? $merma->updated_at->toIso8601String() : now()->toIso8601String(),
                // ✅ Relaciones explícitamente incluidas
                'almacen'             => $merma->almacen ? [
                    'id'    => $merma->almacen->id,
                    'nombre' => $merma->almacen->nombre,
                ] : null,
                'user'                => $merma->user ? [
                    'id'   => $merma->user->id,
                    'name' => $merma->user->name,
                ] : null,
                // ✅ Movimientos asociados
                'movimientos'         => $merma->movimientos ? $merma->movimientos->map(function ($mov) {
                    return [
                        'id'            => $mov->id ?? null,
                        'cantidad'      => (float) ($mov->cantidad ?? 0),
                        'numero_documento' => $mov->numero_documento ?? '-',
                        'producto'      => $mov->stockProducto?->producto ? [
                            'id'     => $mov->stockProducto->producto->id,
                            'nombre' => $mov->stockProducto->producto->nombre,
                            'sku'    => $mov->stockProducto->producto->sku,
                        ] : null,
                    ];
                })->toArray() : [],
            ];
        })->filter(function ($item) {
            return $item !== null;
        });

        $almacenes = Almacen::where('activo', true)->orderBy('nombre')->get(['id', 'nombre']);

        return Inertia::render('inventario/merma', [
            'almacenes'             => $almacenes,
            'stock_productos'       => $stockProductos,
            'almacen_seleccionado'  => $almacenId,
            'tipo_merma_filtro'     => $tipoMerma,
            'mermas_inventario'     => $mermasInventario,
        ]);
    }

    /**
     * Procesar ajuste de inventario (Web)
     */
    public function procesarAjuste(StoreAjusteInventarioRequest $request): RedirectResponse
    {
        try {
            $resultado = $this->procesarAjustesInventario($request->validated()['ajustes']);
            $movimientos = $resultado['movimientos'];
            $ajusteId = $resultado['ajuste_inventario_id'];

            return redirect()->route('inventario.ajuste.form')
                ->with('success', 'Se procesaron ' . count($movimientos) . ' ajustes de inventario')
                ->with('ajuste_inventario_id', $ajusteId);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'El producto no existe. Por favor, recarga la página e intenta nuevamente.']);
        } catch (\Exception $e) {
            \Log::error('Error al procesar ajuste de inventario: ' . $e->getMessage(), [
                'exception' => $e,
                'ajustes'   => $request->validated()['ajustes'],
            ]);

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error al procesar ajustes: ' . $e->getMessage()]);
        }
    }

    /**
     * API: Procesar ajuste de inventario
     */
    public function procesarAjusteApi(StoreAjusteInventarioRequest $request): JsonResponse
    {
        try {
            $resultado = $this->procesarAjustesInventario($request->validated()['ajustes']);
            $movimientos = $resultado['movimientos'];
            $ajusteId = $resultado['ajuste_inventario_id'];

            return ApiResponse::success(
                [
                    'movimientos' => $movimientos,
                    'ajuste_inventario_id' => $ajusteId,
                ],
                'Se procesaron ' . count($movimientos) . ' ajustes de inventario'
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Error al procesar ajustes: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * API: Procesar ajuste de inventario desde tabla editable
     * Ahora usa el método maestro-detalle con AjusteInventario cabecera
     */
    public function procesarAjusteTabla(Request $request): JsonResponse
    {
        try {
            // Validar datos básicos
            $validated = $request->validate([
                'almacen_id' => 'required|integer|exists:almacenes,id',
                'ajustes' => 'required|array|min:1',
                'ajustes.*.stock_producto_id' => 'required|integer|exists:stock_productos,id',
                'ajustes.*.nueva_cantidad' => 'required|numeric|min:0',
                'ajustes.*.observacion' => 'nullable|string|max:500',
                'ajustes.*.tipo_ajuste' => 'nullable|in:entrada,salida',
                'ajustes.*.tipo_ajuste_inventario_id' => 'nullable|integer|exists:tipos_ajuste_inventario,id',
            ], [
                'almacen_id.required' => 'El almacén es requerido',
                'almacen_id.exists' => 'El almacén no existe',
                'ajustes.required' => 'Debes agregar al menos un ajuste',
                'ajustes.min' => 'Debes agregar al menos un ajuste',
                'ajustes.*.stock_producto_id.required' => 'El producto es requerido en todas las filas',
                'ajustes.*.stock_producto_id.exists' => 'Uno o más productos no existen',
                'ajustes.*.nueva_cantidad.required' => 'La cantidad es requerida',
                'ajustes.*.nueva_cantidad.numeric' => 'La cantidad debe ser un número',
                'ajustes.*.nueva_cantidad.min' => 'La cantidad no puede ser negativa',
            ]);

            // Usar el método privado que crea cabecera + detalles
            $resultado = $this->procesarAjustesInventario($validated['ajustes']);

            // El resultado ya contiene movimientos + ajuste_inventario_id
            return ApiResponse::success(
                [
                    'movimientos' => $resultado['movimientos'],
                    'ajuste_inventario_id' => $resultado['ajuste_inventario_id'],
                ],
                'Se procesaron ' . count($resultado['movimientos']) . ' ajustes de inventario exitosamente'
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ApiResponse::error(
                'Error en los datos: ' . json_encode($e->errors()),
                422
            );
        } catch (\Exception $e) {
            \Log::error('Error al procesar ajuste de tabla:', [
                'error' => $e->getMessage(),
                'ajustes' => $request->input('ajustes'),
            ]);

            return ApiResponse::error(
                'Error al procesar ajustes: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * ✅ REFACTORIZADO (2026-03-27): Método privado compartido para procesar ajustes AGRUPADOS
     *
     * Ahora usa AjusteDistribucionService para crear movimientos AGRUPADOS por producto
     * En lugar de UN movimiento por lote, crea UN movimiento por producto
     *
     * @param array $ajustes Array de ajustes a procesar
     * @return array Array de movimientos creados (AGRUPADOS por producto)
     * @throws \Exception Si hay error al procesar
     */
    private function procesarAjustesInventario(array $ajustes): array
    {
        $movimientos = [];
        $ajusteInventarioId = null;

        DB::transaction(function () use ($ajustes, &$movimientos, &$ajusteInventarioId) {
            // Obtener el almacén del usuario
            $almacenId = auth()->user()->empresa->almacen_id ?? 1;

            // Contadores para el ajuste maestro
            $cantidadEntradas = 0;
            $cantidadSalidas = 0;
            $cantidadProductos = count($ajustes);

            // ✅ NUEVO: Recolectar tipos de ajuste y observación general
            $tiposAjusteResumen = [];
            $observacionGeneral = $ajustes[0]['observacion'] ?? 'Ajuste de inventario';

            // Crear el registro maestro de AjusteInventario (sin número aún)
            $ajuste = AjusteInventario::create([
                'numero' => 'TEMP',
                'almacen_id' => $almacenId,
                'user_id' => auth()->id(),
                'cantidad_entradas' => 0,
                'cantidad_salidas' => 0,
                'cantidad_productos' => $cantidadProductos,
                'observacion' => $observacionGeneral,
                'estado' => AjusteInventario::ESTADO_PROCESADO,
            ]);

            $ajusteInventarioId = $ajuste->id;

            // Generar número usando el ID del registro recién creado
            $numeroFinal = AjusteInventario::generarNumero($ajusteInventarioId);
            $ajuste->update(['numero' => $numeroFinal]);

            Log::info('✅ [InventarioController] Ajuste maestro creado', [
                'ajuste_id' => $ajusteInventarioId,
                'ajuste_numero' => $numeroFinal,
                'cantidad_detalles' => count($ajustes),
            ]);

            // ✅ REFACTORIZADO (2026-03-27): Usar servicio centralizado para registrar movimientos AGRUPADOS
            try {
                $movimientos = $this->ajusteDistribucionService->registrarAjustesAgrupados(
                    ajustes: $ajustes,
                    numeroAjuste: $numeroFinal,
                    almacenId: $almacenId,
                    usuarioId: auth()->id() ?? 1
                );

                Log::info('✅ [InventarioController] Movimientos agrupados registrados', [
                    'ajuste_numero' => $numeroFinal,
                    'movimientos_creados' => count($movimientos),
                    'nota' => 'Movimientos AGRUPADOS por producto (no por lote)',
                ]);
            } catch (\Exception $e) {
                Log::error('❌ [InventarioController] Error al registrar movimientos agrupados', [
                    'ajuste_numero' => $numeroFinal,
                    'error' => $e->getMessage(),
                ]);
                throw $e;
            }

            // ✅ Asociar movimientos al ajuste maestro y contar entradas/salidas
            foreach ($movimientos as $movimiento) {
                $movimiento->update(['ajuste_inventario_id' => $ajusteInventarioId]);

                // Contar entradas y salidas según tipo de movimiento
                if ($movimiento->tipo === MovimientoInventario::TIPO_ENTRADA_AJUSTE) {
                    $cantidadEntradas += abs($movimiento->cantidad);
                } else {
                    $cantidadSalidas += abs($movimiento->cantidad);
                }
            }

            // ✅ Recolectar tipos de ajuste desde los detalles originales para observación
            foreach ($ajustes as $ajusteItem) {
                $tipoAjusteInventarioId = $ajusteItem['tipo_ajuste_inventario_id'] ?? null;
                if ($tipoAjusteInventarioId) {
                    $tipoAjuste = TipoAjusteInventario::find($tipoAjusteInventarioId);
                    if ($tipoAjuste && !in_array($tipoAjuste->label, $tiposAjusteResumen)) {
                        $tiposAjusteResumen[] = $tipoAjuste->label;
                    }
                }
            }

            // Construir observación final
            $observacionFinal = $observacionGeneral;
            if (!empty($tiposAjusteResumen)) {
                $observacionFinal .= ' | Tipos: ' . implode(', ', $tiposAjusteResumen);
            }

            // Actualizar el ajuste maestro con los totales reales
            $ajuste->update([
                'cantidad_entradas' => $cantidadEntradas,
                'cantidad_salidas' => $cantidadSalidas,
                'observacion' => $observacionFinal,
            ]);

            Log::info('✅ [InventarioController] Ajuste finalizado', [
                'ajuste_numero' => $numeroFinal,
                'cantidad_entradas' => $cantidadEntradas,
                'cantidad_salidas' => $cantidadSalidas,
            ]);
        });

        // Retornar tanto movimientos como ajuste_inventario_id
        return [
            'movimientos' => $movimientos,
            'ajuste_inventario_id' => $ajusteInventarioId,
        ];
    }

    /**
     * API: Listar movimientos de inventario
     */
    public function movimientosApi(Request $request): JsonResponse
    {
        $perPage     = $request->integer('per_page', 15);
        $almacenId   = $request->integer('almacen_id') ?: null;
        $productoId  = $request->integer('producto_id') ?: null;
        $tipo        = $request->filled('tipo') ? $request->string('tipo') : null;
        $fechaInicio = $request->date('fecha_inicio');
        $fechaFin    = $request->date('fecha_fin');

        $movimientos = MovimientoInventario::with([
            'stockProducto.producto:id,nombre,sku',
            'stockProducto.producto.codigoPrincipal:id,codigo',
            'stockProducto.almacen:id,nombre',
            'user:id,name',
        ])
            ->when($almacenId, fn($q) => $q->whereHas('stockProducto', fn($sq) => $sq->where('almacen_id', $almacenId)))
            ->when($productoId, fn($q) => $q->whereHas('stockProducto', fn($sq) => $sq->where('producto_id', $productoId)))
            ->when($tipo, fn($q) => $q->where('tipo', $tipo))
            ->when($fechaInicio, fn($q) => $q->whereDate('fecha', '>=', $fechaInicio))
            ->when($fechaFin, fn($q) => $q->whereDate('fecha', '<=', $fechaFin))
            // ✅ ORDENAMIENTO (2026-02-11): Ordenar por created_at DESC (más recientes primero)
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return ApiResponse::success($movimientos);
    }

    /**
     * API: Obtener todos los movimientos sin paginación (para impresión/exportación)
     */
    public function movimientosParaImpresion(Request $request): JsonResponse
    {
        $almacenId   = $request->integer('almacen_id') ?: null;
        $productoId  = $request->integer('producto_id') ?: null;
        $tipo        = $request->filled('tipo') ? $request->string('tipo') : null;
        $fechaInicio = $request->date('fecha_inicio');
        $fechaFin    = $request->date('fecha_fin');

        \Log::info('📋 [movimientosParaImpresion] Parámetros recibidos:', [
            'almacen_id'   => $almacenId,
            'producto_id'  => $productoId,
            'tipo'         => $tipo,
            'fecha_inicio' => $fechaInicio?->format('Y-m-d'),
            'fecha_fin'    => $fechaFin?->format('Y-m-d'),
        ]);

        $query = MovimientoInventario::with([
            'stockProducto.producto:id,nombre,sku',
            'stockProducto.producto.codigoPrincipal:id,codigo',
            'stockProducto.almacen:id,nombre',
            'user:id,name',
        ])
            ->when($almacenId, fn($q) => $q->whereHas('stockProducto', fn($sq) => $sq->where('almacen_id', $almacenId)))
            ->when($productoId, fn($q) => $q->whereHas('stockProducto', fn($sq) => $sq->where('producto_id', $productoId)))
            ->when($tipo, fn($q) => $q->where('tipo', $tipo))
            ->when($fechaInicio, fn($q) => $q->whereDate('fecha', '>=', $fechaInicio))
            ->when($fechaFin, fn($q) => $q->whereDate('fecha', '<=', $fechaFin))
            // ✅ ORDENAMIENTO (2026-02-11): Ordenar por created_at DESC (más recientes primero)
            ->orderByDesc('created_at');

        // Log de query sin ejecutar
        \Log::info('📋 [movimientosParaImpresion] Query SQL:', ['sql' => $query->toSql(), 'bindings' => $query->getBindings()]);

        $movimientos = $query->get();

        \Log::info('📋 [movimientosParaImpresion] Resultados obtenidos:', ['cantidad' => $movimientos->count()]);

        return ApiResponse::success($movimientos, 'Movimientos obtenidos');
    }

    /**
     * API: Crear movimiento manual de inventario
     */
    public function crearMovimiento(CreateMovimientoRequest $request): JsonResponse
    {
        // Data already validated by CreateMovimientoRequest
        $data = $request->validated();

        try {
            $stockProducto = StockProducto::findOrFail($data['stock_producto_id']);

            $movimiento = MovimientoInventario::registrar(
                $stockProducto,
                $data['cantidad'],
                $data['tipo'],
                $data['observacion']
            );

            return ApiResponse::success(
                $movimiento->load(['stockProducto.producto', 'stockProducto.almacen', 'user']),
                'Movimiento registrado exitosamente'
            );

        } catch (\Exception $e) {
            return ApiResponse::error(
                'Error al registrar movimiento: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * API: Buscar productos para ajustes
     */
    public function buscarProductos(Request $request): JsonResponse
    {
        $q         = $request->string('q');
        $almacenId = $request->integer('almacen_id');

        if (! $q || strlen($q) < 2) {
            return ApiResponse::success([]);
        }

        $searchLower = strtolower($q);
        $productos   = Producto::whereRaw('LOWER(nombre) like ?', ["%$searchLower%"])
            ->where('activo', true)
            ->with(['stock' => function ($query) use ($almacenId) {
                if ($almacenId) {
                    $query->where('almacen_id', $almacenId);
                }
                $query->with('almacen');
            }])
            ->limit(20)
            ->get();

        return ApiResponse::success($productos);
    }

    /**
     * API: Obtener stock de un producto específico
     */
    public function stockProducto(Producto $producto, Request $request): JsonResponse
    {
        $almacenId = $request->integer('almacen_id');

        $stock = $producto->stock()
            ->when($almacenId, fn($q) => $q->where('almacen_id', $almacenId))
            ->with('almacen')
            ->get();

        return ApiResponse::success([
            'producto'          => [
                'id'           => $producto->id,
                'nombre'       => $producto->nombre,
                'stock_minimo' => $producto->stock_minimo,
                'stock_maximo' => $producto->stock_maximo,
                'stock_total'  => $producto->stockTotal(),
                'stock_bajo'   => $producto->stockBajo(),
            ],
            'stock_por_almacen' => $stock,
        ]);
    }

    /**
     * Página de reportes de inventario
     */
    public function reportes(): Response
    {
        $categorias = Categoria::where('activo', true)->orderBy('nombre')->get(['id', 'nombre']);
        $almacenes  = Almacen::where('activo', true)->orderBy('nombre')->get(['id', 'nombre']);

        return Inertia::render('inventario/reportes', [
            'categorias' => $categorias,
            'almacenes'  => $almacenes,
        ]);
    }

    /**
     * Listado de transferencias entre almacenes
     */
    public function transferencias(Request $request): Response
    {
        $query = TransferenciaInventario::with([
            'almacenOrigen:id,nombre',
            'almacenDestino:id,nombre',
            'usuario:id,name',
            'vehiculo:id,placa',
            'chofer:id,licencia',
        ]);

        if ($request->filled('estado')) {
            $query->porEstado($request->string('estado'));
        }

        if ($request->filled('almacen_id')) {
            $query->porAlmacen($request->integer('almacen_id'));
        }

        if ($request->filled('fecha_inicio')) {
            $query->porFecha($request->date('fecha_inicio'), $request->date('fecha_fin'));
        }

        $transferencias = $query->orderByDesc('fecha')
            ->paginate(15)
            ->withQueryString();

        $almacenes = Almacen::where('activo', true)->get(['id', 'nombre']);
        $vehiculos = Vehiculo::activos()->get(['id', 'placa']);
        $choferes  = User::role('Chofer')->get(['id', 'name'])->map(fn($user) => ['id' => $user->id, 'name' => $user->name]);
        $estados   = TransferenciaInventario::getEstados();

        return Inertia::render('inventario/transferencias/index', [
            'transferencias' => $transferencias,
            'almacenes'      => $almacenes,
            'vehiculos'      => $vehiculos,
            'choferes'       => $choferes,
            'estados'        => $estados,
            'filtros'        => $request->only(['estado', 'almacen_id', 'fecha_inicio', 'fecha_fin']),
        ]);
    }

    /**
     * Crear nueva transferencia de inventario
     */
    public function crearTransferencia(StoreTransferenciaInventarioRequest $request): RedirectResponse
    {
        $data = $request->validated();

        try {
            $transferencia = DB::transaction(function () use ($data) {
                // Generar número
                $ultimoNumero = TransferenciaInventario::max('numero') ?? 'TRF-000000';
                $numero       = (int) substr($ultimoNumero, 4);
                $nuevoNumero  = 'TRF-' . str_pad($numero + 1, 6, '0', STR_PAD_LEFT);

                // Crear transferencia
                $transferencia = TransferenciaInventario::create([
                    'numero'             => $nuevoNumero,
                    'fecha'              => now(),
                    'almacen_origen_id'  => $data['almacen_origen_id'],
                    'almacen_destino_id' => $data['almacen_destino_id'],
                    'usuario_id'         => Auth::id(),
                    'estado'             => TransferenciaInventario::ESTADO_BORRADOR,
                    'vehiculo_id'        => $data['vehiculo_id'] ?? null,
                    'chofer_id'          => $data['chofer_id'] ?? null,
                    'observaciones'      => $data['observaciones'] ?? null,
                    'total_productos'    => count($data['detalles']),
                    'total_cantidad'     => array_sum(array_column($data['detalles'], 'cantidad')),
                ]);

                // Crear detalles
                foreach ($data['detalles'] as $detalle) {
                    DetalleTransferenciaInventario::create([
                        'transferencia_id'  => $transferencia->id,
                        'producto_id'       => $detalle['producto_id'],
                        'cantidad'          => $detalle['cantidad'],
                        'lote'              => $detalle['lote'] ?? null,
                        'fecha_vencimiento' => $detalle['fecha_vencimiento'] ?? null,
                    ]);
                }

                return $transferencia;
            });

            return redirect()
                ->route('inventario.transferencias.show', $transferencia)
                ->with('success', "Transferencia {$transferencia->numero} creada exitosamente");

        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Error al crear transferencia: ' . $e->getMessage()]);
        }
    }

    /**
     * Registrar merma de inventario
     */
    public function registrarMerma(StoreMermaRequest $request): JsonResponse
    {
        $data = $request->validated();

        try {
            DB::beginTransaction();

            Log::info('🟠 [REGISTRAR MERMA] INICIO', [
                'almacen_id'      => $data['almacen_id'],
                'tipo_merma'      => $data['tipo_merma'],
                'total_productos' => count($data['productos']),
            ]);

            // PASO 1: Crear registro maestro en mermas_inventario (con número temporal)
            // Concatenar motivo específico + observaciones
            $observacionCompleta = $data['motivo'];
            if (!empty($data['observaciones'])) {
                $observacionCompleta .= "\n\n📝 Observaciones adicionales:\n" . $data['observaciones'];
            }

            $mermaInventario = MermaInventario::create([
                'numero'              => 'TEMP',
                'almacen_id'          => $data['almacen_id'],
                'user_id'             => auth()->id(),
                'tipo_merma'          => $data['tipo_merma'],
                'cantidad_productos'  => count($data['productos']),
                'costo_total'         => 0, // Se actualiza después
                'observacion'         => $observacionCompleta,
                'estado'              => MermaInventario::ESTADO_PROCESADO,
            ]);

            Log::info('🟠 [REGISTRAR MERMA] Cabecera creada (temporal)', [
                'merma_id' => $mermaInventario->id,
                'almacen'  => $data['almacen_id'],
            ]);

            // ✅ REFACTORIZADO (2026-03-27): Usar servicio centralizado para registrar mermas AGRUPADAS
            try {
                $resultado = $this->mermaDistribucionService->registrarMermasAgrupadas(
                    productos: $data['productos'],
                    numeroMerma: 'TEMP',  // Se actualizará después
                    almacenId: $data['almacen_id'],
                    motivo: $data['motivo'],
                    usuarioId: auth()->id() ?? 1
                );

                $movimientosRegistrados = $resultado['movimientos'];
                $costTotalMerma = $resultado['costo_total'];

                Log::info('✅ [REGISTRAR MERMA] Movimientos agrupados registrados', [
                    'merma_id'         => $mermaInventario->id,
                    'movimientos'      => count($movimientosRegistrados),
                    'costo_total'      => $costTotalMerma,
                    'nota'             => 'Movimientos AGRUPADOS por producto (no por lote)',
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('❌ [REGISTRAR MERMA] Error al registrar mermas agrupadas', [
                    'error' => $e->getMessage(),
                ]);
                return ApiResponse::error(
                    'Error al registrar merma: ' . $e->getMessage(),
                    422
                );
            }

            // PASO 4: Actualizar número de la merma usando el ID
            $numeroMerma = MermaInventario::generarNumero($mermaInventario->id);
            $mermaInventario->update([
                'numero'      => $numeroMerma,
                'costo_total' => $costTotalMerma,
            ]);

            // PASO 5: ✅ Asociar movimientos con merma maestro y actualizar número_documento
            foreach ($movimientosRegistrados as $movimiento) {
                $movimiento->update([
                    'merma_inventario_id' => $mermaInventario->id,
                    'numero_documento'    => $numeroMerma,
                ]);
            }

            DB::commit();

            Log::info('🟢 [REGISTRAR MERMA] COMPLETADO', [
                'merma_id'          => $mermaInventario->id,
                'numero'            => $numeroMerma,
                'total_movimientos' => count($movimientosRegistrados),
                'costo_total'       => $costTotalMerma,
            ]);

            return ApiResponse::success(
                [
                    'merma_inventario_id' => $mermaInventario->id,
                    'numero_merma'        => $numeroMerma,
                    'movimientos'         => MovimientoInventario::where('merma_inventario_id', $mermaInventario->id)
                        ->with(['stockProducto.producto', 'stockProducto.almacen'])
                        ->get(),
                    'costo_total'         => $costTotalMerma,
                    'cantidad_productos'  => count($movimientosRegistrados),
                ],
                'Merma registrada exitosamente'
            );

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('❌ [REGISTRAR MERMA] ERROR', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return ApiResponse::error(
                'Error al registrar merma: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * Mostrar formulario para crear transferencia
     */
    public function formularioCrearTransferencia(): Response
    {
        $almacenes = Almacen::where('activo', true)
            ->select('id', 'nombre', 'direccion', 'ubicacion_fisica', 'requiere_transporte_externo')
            ->get();
        $vehiculos = Vehiculo::activos()->get();
        $choferes  = User::role('Chofer')->get(['id', 'name'])->map(fn($user) => ['id' => $user->id, 'name' => $user->name]);
        $productos = Producto::where('activo', true)
            ->with(['codigoPrincipal', 'stock' => function ($query) {
                $query->select('producto_id', 'almacen_id', 'cantidad')
                    ->where('cantidad', '>', 0);
            }])
            ->select('id', 'nombre', 'codigo_qr')
            ->orderBy('nombre')
            ->get()
            ->map(function ($producto) {
                $stockTotal = $producto->stock->sum('cantidad');

                return [
                    'id'                => $producto->id,
                    'nombre'            => $producto->nombre,
                    'codigo'            => $producto->codigoPrincipal?->codigo ?? $producto->codigo_qr ?? 'SIN-CODIGO',
                    'stock_disponible'  => $stockTotal,
                    'stock_por_almacen' => $producto->stock->groupBy('almacen_id')->map(function ($stock) {
                        return $stock->sum('cantidad');
                    })->toArray(),
                ];
            });

        return Inertia::render('inventario/transferencias/crear', [
            'almacenes' => $almacenes,
            'vehiculos' => $vehiculos,
            'choferes'  => $choferes,
            'productos' => $productos,
        ]);
    }

    /**
     * Ver detalles de una transferencia
     */
    public function verTransferencia(TransferenciaInventario $transferencia): Response
    {
        $transferencia->load([
            'almacenOrigen',
            'almacenDestino',
            'vehiculo',
            'chofer.user',
            'creadoPor',
            'detalles.producto',
        ]);

        return Inertia::render('inventario/transferencias/ver', [
            'transferencia' => $transferencia,
        ]);
    }

    /**
     * Enviar transferencia
     */
    public function enviarTransferencia(Request $request, TransferenciaInventario $transferencia): JsonResponse
    {
        try {
            $transferencia->enviar();

            return ApiResponse::success(
                $transferencia->load(['almacenOrigen', 'almacenDestino']),
                'Transferencia enviada exitosamente'
            );

        } catch (\Exception $e) {
            return ApiResponse::error(
                'Error al enviar transferencia: ' . $e->getMessage(),
                400
            );
        }
    }

    /**
     * Recibir transferencia
     */
    public function recibirTransferencia(Request $request, TransferenciaInventario $transferencia): JsonResponse
    {
        try {
            $transferencia->recibir();

            return ApiResponse::success(
                $transferencia->load(['almacenOrigen', 'almacenDestino']),
                'Transferencia recibida exitosamente'
            );

        } catch (\Exception $e) {
            return ApiResponse::error(
                'Error al recibir transferencia: ' . $e->getMessage(),
                400
            );
        }
    }

    /**
     * Cancelar transferencia
     */
    public function cancelarTransferencia(Request $request, TransferenciaInventario $transferencia): JsonResponse
    {
        $data = $request->validate([
            'motivo_cancelacion' => ['required', 'string', 'max:500'],
        ]);

        try {
            $transferencia->cancelar($data['motivo_cancelacion']);

            return ApiResponse::success(
                $transferencia->load(['almacenOrigen', 'almacenDestino']),
                'Transferencia cancelada exitosamente'
            );

        } catch (\Exception $e) {
            return ApiResponse::error(
                'Error al cancelar transferencia: ' . $e->getMessage(),
                400
            );
        }
    }

    /**
     * Listar mermas
     */
    public function mermas(Request $request): Response
    {
        $almacenId = $request->integer('almacen_id', 0);
        $tipoMerma = (string) $request->string('tipo_merma', '');
        $perPage   = $request->integer('per_page', 15);

        // 🔍 DEBUG: Verificar estado de la tabla
        $totalMermasEnBD = MermaInventario::count();
        Log::info('🔍 [MERMAS] DEBUG', [
            'total_mermas_en_bd' => $totalMermasEnBD,
            'filtro_almacen' => $almacenId,
            'filtro_tipo' => $tipoMerma,
            'tipo_merma_object_class' => class_exists(\Illuminate\Support\Stringable::class) ? 'Stringable' : 'string',
        ]);

        // Obtener mermas realizadas desde tabla maestra MermaInventario
        $query = MermaInventario::with([
            'almacen:id,nombre',
            'user:id,name',
            'movimientos' => function ($q) {
                $q->with(['stockProducto.producto:id,nombre,sku']);
            },
        ]);

        // Filtrar por almacén si se proporciona
        if ($almacenId > 0) {
            $query->where('almacen_id', $almacenId);
        }

        // Filtrar por tipo de merma si se proporciona (y no es vacío)
        if (!empty($tipoMerma) && $tipoMerma !== '') {
            $query->where('tipo_merma', $tipoMerma);
        }

        $mermasData = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        // ✅ Transformar datos de la merma maestra para presentación
        $mermasData->getCollection()->transform(function ($merma) {
            if (!$merma) {
                return null;
            }

            return [
                'id'                  => $merma->id ?? null,
                'numero'              => $merma->numero ?? 'SIN NÚMERO',
                'almacen_id'          => $merma->almacen_id ?? null,
                'user_id'             => $merma->user_id ?? null,
                'tipo_merma'          => $merma->tipo_merma ?? 'SIN TIPO',
                'cantidad_productos'  => $merma->cantidad_productos ?? 0,
                'costo_total'         => (float) ($merma->costo_total ?? 0),
                'observacion'         => $merma->observacion ?? null,
                'estado'              => $merma->estado ?? 'procesado',
                'created_at'          => $merma->created_at ? $merma->created_at->toIso8601String() : now()->toIso8601String(),
                'updated_at'          => $merma->updated_at ? $merma->updated_at->toIso8601String() : now()->toIso8601String(),
                'almacen'             => $merma->almacen ? [
                    'id'    => $merma->almacen->id,
                    'nombre' => $merma->almacen->nombre,
                ] : null,
                'user'                => $merma->user ? [
                    'id'   => $merma->user->id,
                    'name' => $merma->user->name,
                ] : null,
                'movimientos'         => $merma->movimientos ? $merma->movimientos->map(function ($mov) {
                    return [
                        'id'            => $mov->id ?? null,
                        'cantidad'      => (float) ($mov->cantidad ?? 0),
                        'numero_documento' => $mov->numero_documento ?? '-',
                        'producto'      => $mov->stockProducto?->producto ? [
                            'id'     => $mov->stockProducto->producto->id,
                            'nombre' => $mov->stockProducto->producto->nombre,
                            'sku'    => $mov->stockProducto->producto->sku,
                        ] : null,
                    ];
                })->toArray() : [],
            ];
        })->filter(function ($item) {
            return $item !== null;
        });

        // Obtener almacenes para filtro
        $almacenes = Almacen::where('activo', true)->orderBy('nombre')->get(['id', 'nombre']);

        // Calcular estadísticas de mermas
        $estadisticas = [
            'total_mermas'     => MermaInventario::count(),
            'total_pendientes' => MermaInventario::where('estado', MermaInventario::ESTADO_PENDIENTE)->count(),
            'total_aprobadas'  => MermaInventario::where('estado', MermaInventario::ESTADO_PROCESADO)->count(),
            'total_rechazadas' => 0, // No hay estado rechazado aún
            'costo_total_mes'  => MermaInventario::whereMonth('created_at', now()->month)->sum('costo_total'),
        ];

        return Inertia::render('inventario/mermas/index', [
            'mermas'                => $mermasData,
            'almacenes'             => $almacenes,
            'almacen_seleccionado'  => $almacenId,
            'tipo_merma_filtro'     => $tipoMerma,
            'estadisticas'          => $estadisticas,
        ]);
    }

    /**
     * Mostrar formulario para registrar merma
     */
    public function formularioRegistrarMerma(): Response
    {
        $almacenes = Almacen::where('activo', true)->get();

        return Inertia::render('inventario/mermas/registrar', [
            'almacenes' => $almacenes,
        ]);
    }

    /**
     * API: Obtener vehículos activos
     */
    public function apiVehiculos(): JsonResponse
    {
        $vehiculos = Vehiculo::activos()->get();

        return ApiResponse::success($vehiculos);
    }

    /**
     * API: Obtener choferes
     */
    public function apiChoferes(): JsonResponse
    {
        $choferes = User::role('Chofer')->get(['id', 'name'])->map(function ($user) {
            return [
                'id'     => $user->id,
                'nombre' => $user->name,
                'activo' => true, // Los usuarios en el sistema están activos
            ];
        });

        return ApiResponse::success($choferes);
    }

    /**
     * Formulario para editar transferencia
     */
    public function editarTransferencia(TransferenciaInventario $transferencia): Response
    {
        $transferencia->load(['detalles.producto', 'almacenOrigen', 'almacenDestino', 'vehiculo', 'chofer.user']);

        $almacenes = Almacen::where('activo', true)->get();
        $vehiculos = Vehiculo::where('activo', true)->get();
        $choferes  = User::role('Chofer')->get(['id', 'name'])->map(fn($user) => ['id' => $user->id, 'name' => $user->name]);

        return Inertia::render('inventario/transferencias/editar', [
            'transferencia' => $transferencia,
            'almacenes'     => $almacenes,
            'vehiculos'     => $vehiculos,
            'choferes'      => $choferes,
        ]);
    }

    /**
     * Actualizar transferencia
     */
    public function actualizarTransferencia(Request $request, TransferenciaInventario $transferencia): RedirectResponse
    {
        $request->validate([
            'almacen_destino_id'            => 'required|exists:almacenes,id',
            'vehiculo_id'                   => 'nullable|exists:vehiculos,id',
            'chofer_id'                     => 'nullable|exists:choferes,id',
            'observaciones'                 => 'nullable|string|max:500',
            'productos'                     => 'required|array|min:1',
            'productos.*.stock_producto_id' => 'required|exists:stock_productos,id',
            'productos.*.cantidad'          => 'required|numeric|min:0.01',
        ]);

        DB::beginTransaction();
        try {
            // Solo permitir editar si está en estado pendiente
            if ($transferencia->estado !== 'pendiente') {
                return back()->withErrors(['error' => 'Solo se pueden editar transferencias pendientes']);
            }

            // Actualizar datos principales
            $transferencia->update([
                'almacen_destino_id' => $request->almacen_destino_id,
                'vehiculo_id'        => $request->vehiculo_id,
                'chofer_id'          => $request->chofer_id,
                'observaciones'      => $request->observaciones,
            ]);

            // Eliminar detalles existentes
            $transferencia->detalles()->delete();

            // Recrear detalles
            foreach ($request->productos as $producto) {
                DetalleTransferenciaInventario::create([
                    'transferencia_inventario_id' => $transferencia->id,
                    'stock_producto_id'           => $producto['stock_producto_id'],
                    'cantidad_solicitada'         => $producto['cantidad'],
                    'cantidad_enviada'            => 0,
                    'cantidad_recibida'           => 0,
                ]);
            }

            DB::commit();

            return redirect()->route('inventario.transferencias.ver', $transferencia->id)
                ->with('success', 'Transferencia actualizada exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Error al actualizar la transferencia: ' . $e->getMessage()]);
        }
    }

    /**
     * Listado de mermas
     */
    public function indexMermas(Request $request): Response
    {
        try {
            // Obtener todos los movimientos de tipo MERMA con sus relaciones
            $movimientos = MovimientoInventario::with([
                'stockProducto.producto',
                'stockProducto.almacen',
                'user',
            ])
                ->where('tipo', MovimientoInventario::TIPO_SALIDA_MERMA)
                ->orderByDesc('fecha')
                ->get();

            // Agrupar por numero_documento (cada número de merma puede tener múltiples movimientos)
            $mermasAgrupadas = $movimientos->groupBy('numero_documento')->map(function ($grupo) {
                $primerMovimiento = $grupo->first();
                $totalProductos   = $grupo->count();
                $totalCantidad    = $grupo->sum(function ($mov) {
                    return abs($mov->cantidad);
                });
                $costoTotal = $grupo->sum(function ($mov) {
                    $costoUnitario = $mov->stockProducto?->precio_promedio ?? 0;
                    return abs($mov->cantidad) * $costoUnitario;
                });

                return [
                    'id'              => $primerMovimiento->numero_documento,
                    'numero'          => $primerMovimiento->numero_documento,
                    'almacen'         => $primerMovimiento->stockProducto?->almacen ? [
                        'id'     => $primerMovimiento->stockProducto->almacen->id,
                        'nombre' => $primerMovimiento->stockProducto->almacen->nombre,
                    ] : null,
                    'motivo'          => $primerMovimiento->observacion ?? 'Sin motivo',
                    'tipo_merma'      => 'MERMA',
                    'estado'          => 'Registrada',
                    'total_productos' => $totalProductos,
                    'total_cantidad'  => $totalCantidad,
                    'costo_total'     => $costoTotal,
                    'fecha'           => $primerMovimiento->fecha,
                    'usuario'         => $primerMovimiento->user ? [
                        'id'   => $primerMovimiento->user->id,
                        'name' => $primerMovimiento->user->name,
                    ] : null,
                    'movimientos'     => $grupo->toArray(),
                ];
            });

            // Convertir a array y paginar
            $mermasArray = $mermasAgrupadas->values()->toArray();
            $perPage     = 15;
            $currentPage = $request->get('page', 1);
            $total       = count($mermasArray);
            $mermas      = array_slice($mermasArray, ($currentPage - 1) * $perPage, $perPage);

            // Calcular estadísticas
            $estadisticas = [
                'total_mermas'        => $total,
                'valor_total_perdido' => collect($mermasArray)->sum('costo_total'),
                'mermas_pendientes'   => 0,
                'mermas_aprobadas'    => 0,
                'mermas_rechazadas'   => 0,
            ];

            Log::info('📊 [INDEX MERMAS] Datos cargados', [
                'total_mermas'      => $total,
                'total_movimientos' => $movimientos->count(),
                'valor_total'       => $estadisticas['valor_total_perdido'],
            ]);

            return Inertia::render('inventario/mermas/index', [
                'mermas'       => [
                    'data'         => $mermas,
                    'total'        => $total,
                    'per_page'     => $perPage,
                    'current_page' => $currentPage,
                    'last_page'    => ceil($total / $perPage),
                ],
                'estadisticas' => $estadisticas,
                'filtros'      => $request->all(),
                'almacenes'    => Almacen::where('activo', true)->get(),
            ]);
        } catch (\Exception $e) {
            Log::error('❌ [INDEX MERMAS] Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return Inertia::render('inventario/mermas/index', [
                'mermas'       => [
                    'data'         => [],
                    'total'        => 0,
                    'per_page'     => 15,
                    'current_page' => 1,
                    'last_page'    => 0,
                ],
                'estadisticas' => [
                    'total_mermas'        => 0,
                    'valor_total_perdido' => 0,
                    'mermas_pendientes'   => 0,
                    'mermas_aprobadas'    => 0,
                    'mermas_rechazadas'   => 0,
                ],
                'filtros'      => $request->all(),
                'almacenes'    => Almacen::where('activo', true)->get(),
            ]);
        }
    }

    /**
     * Formulario para registrar mermas
     */
    public function registrarMermasForm(): Response
    {
        $almacenes = Almacen::where('activo', true)->get();

        return Inertia::render('inventario/mermas/registrar', [
            'almacenes' => $almacenes,
        ]);
    }

    /**
     * Ver detalle de merma
     */
    /**
     * Ver detalle de una merma (master-detail pattern)
     */
    public function verMerma(MermaInventario $merma): Response
    {
        // Cargar movimientos relacionados con eager loading
        // Importante: Cargar producto directamente de stockProducto para obtener SKU
        $merma->load([
            'movimientos' => function ($query) {
                $query->with([
                    'stockProducto' => function ($sq) {
                        $sq->with([
                            'producto' => function ($pq) {
                                // Cargar precios con su tipo para obtener el precio COSTO
                                $pq->with([
                                    'precios' => function ($prq) {
                                        $prq->with('tipoPrecio');
                                    },
                                ]);
                            },
                            'almacen',
                        ]);
                    },
                    'user',
                ]);
            },
            'almacen',
            'user',
        ]);

        // Logging para debugging
        Log::info('🔍 [VerMerma] Cargando merma ID: ' . $merma->id);
        Log::info('🔍 [VerMerma] Total movimientos: ' . $merma->movimientos->count());

        // Transformar movimientos (detalles) para la vista
        $detalles = $merma->movimientos->map(function ($movimiento, $index) {
            $producto = $movimiento->stockProducto?->producto;
            $stockProducto = $movimiento->stockProducto;

            // Obtener precio COSTO desde precios_producto
            $precioCosto = 0;
            if ($producto) {
                // Buscar el precio de tipo COSTO
                $precioCostoObj = $producto->obtenerPrecio('COSTO');
                if ($precioCostoObj) {
                    $precioCosto = (float) $precioCostoObj->precio;
                } elseif ($producto->precio_compra) {
                    // Fallback a precio_compra si existe
                    $precioCosto = (float) $producto->precio_compra;
                } elseif ($producto->precio_venta) {
                    // Último fallback a precio_venta
                    $precioCosto = (float) $producto->precio_venta;
                }
            }

            // Logging para debugging
            Log::info("✅ [VerMerma Detalle $index] Producto: " . $producto?->nombre);
            Log::info("✅ [VerMerma Detalle $index] SKU: " . $producto?->sku);
            Log::info("✅ [VerMerma Detalle $index] Precio COSTO: " . $precioCosto);

            $cantidadAbs = abs($movimiento->cantidad);
            $costoTotal = $cantidadAbs * $precioCosto;

            return [
                'id'                => $movimiento->id,
                'merma_id'          => $movimiento->merma_inventario_id,
                'producto_id'       => $producto?->id ?? 0,
                'cantidad'          => $cantidadAbs,
                'costo_unitario'    => (float) $precioCosto,
                'costo_total'       => (float) $costoTotal,
                'lote'              => $movimiento->numero_documento ?? null,
                'fecha_vencimiento' => null,
                'observaciones'     => $movimiento->observacion,
                // Relación producto con toda la información
                'producto'          => [
                    'id'     => $producto?->id ?? 0,
                    'nombre' => $producto?->nombre ?? 'Producto desconocido',
                    'sku'    => $producto?->sku ?? 'SIN-SKU',
                    'codigo' => $producto?->codigo ?? null,
                ],
                // Información adicional
                'stock_anterior'    => $movimiento->cantidad_anterior ?? 0,
                'stock_posterior'   => $movimiento->cantidad_posterior ?? 0,
            ];
        })->toArray();

        // Calcular totales
        $totalCosto = 0;
        $totalCantidad = 0;
        foreach ($merma->movimientos as $mov) {
            $totalCantidad += abs($mov->cantidad);

            $producto = $mov->stockProducto?->producto;
            $precioCosto = 0;

            if ($producto) {
                // Obtener precio COSTO desde precios_producto
                $precioCostoObj = $producto->obtenerPrecio('COSTO');
                if ($precioCostoObj) {
                    $precioCosto = (float) $precioCostoObj->precio;
                } elseif ($producto->precio_compra) {
                    $precioCosto = (float) $producto->precio_compra;
                } elseif ($producto->precio_venta) {
                    $precioCosto = (float) $producto->precio_venta;
                }
            }

            $totalCosto += abs($mov->cantidad) * $precioCosto;
        }

        Log::info("🔍 [VerMerma] Total cantidad: $totalCantidad, Total costo: $totalCosto");

        // Transformar respuesta para match con interfaz TypeScript
        $mermaTransformada = [
            'id'                  => $merma->id,
            'numero'              => $merma->numero,
            'fecha'               => $merma->created_at ? $merma->created_at->format('Y-m-d H:i:s') : now()->format('Y-m-d H:i:s'),
            'almacen_id'          => $merma->almacen_id,
            'tipo_merma'          => (string) $merma->tipo_merma,
            'motivo'              => $merma->observacion ?? '',
            'observaciones'       => $merma->observacion ?? '',
            'total_productos'     => $merma->cantidad_productos ?? count($detalles),
            'total_cantidad'      => (int) $totalCantidad,
            'total_costo'         => (float) $totalCosto,
            'usuario_id'          => $merma->user_id,
            'estado'              => strtoupper($merma->estado ?? 'PENDIENTE'),
            'fecha_aprobacion'    => null,
            'aprobado_por_id'     => null,
            // Relaciones
            'almacen'             => [
                'id'     => $merma->almacen?->id ?? null,
                'nombre' => $merma->almacen?->nombre ?? 'Sin almacén',
            ],
            'usuario'             => [
                'id'   => $merma->user?->id ?? 0,
                'name' => $merma->user?->name ?? 'Sistema',
            ],
            'aprobado_por'        => null,
            'detalles'            => $detalles,
        ];

        Log::info("✅ [VerMerma] Merma transformada con " . count($detalles) . " detalles");

        return Inertia::render('inventario/mermas/ver', [
            'merma' => $mermaTransformada,
        ]);
    }

    /**
     * Aprobar merma
     */
    public function aprobarMerma(Request $request, $id): JsonResponse
    {
        $request->validate([
            'observaciones_aprobacion' => 'nullable|string|max:500',
        ]);

        try {
            $movimiento = MovimientoInventario::where('tipo', MovimientoInventario::TIPO_SALIDA_MERMA)
                ->findOrFail($id);

            // Verificar que no esté anulado
            if ($movimiento->anulado) {
                return ApiResponse::error('No se puede aprobar una merma anulada', 400);
            }

            // Buscar el estado "aprobado"
            $estadoAprobado = EstadoMerma::where('clave', 'APROBADO')
                ->orWhere('label', 'like', '%aprobad%')
                ->first();

            if (! $estadoAprobado) {
                return ApiResponse::error('No se encontró el estado "Aprobado" en el sistema', 500);
            }

            // Actualizar estado
            $movimiento->update([
                'estado_merma_id' => $estadoAprobado->id,
            ]);

            // Si hay observaciones, agregarlas
            if ($request->observaciones_aprobacion) {
                $observacionActual = $movimiento->observacion ?? '';
                $movimiento->update([
                    'observacion' => $observacionActual . "\n[APROBACIÓN] " . $request->observaciones_aprobacion,
                ]);
            }

            return ApiResponse::success([
                'message'    => 'Merma aprobada exitosamente',
                'merma_id'   => $id,
                'movimiento' => $movimiento->load(['estadoMerma', 'tipoMerma']),
            ]);
        } catch (\Exception $e) {
            return ApiResponse::error('Error al aprobar la merma: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Rechazar merma
     */
    public function rechazarMerma(Request $request, $id): JsonResponse
    {
        $request->validate([
            'observaciones_rechazo' => 'required|string|max:500',
        ]);

        try {
            $movimiento = MovimientoInventario::where('tipo', MovimientoInventario::TIPO_SALIDA_MERMA)
                ->findOrFail($id);

            // Verificar que no esté anulado
            if ($movimiento->anulado) {
                return ApiResponse::error('No se puede rechazar una merma anulada', 400);
            }

            // Buscar el estado "rechazado"
            $estadoRechazado = EstadoMerma::where('clave', 'RECHAZADO')
                ->orWhere('label', 'like', '%rechazad%')
                ->first();

            if (! $estadoRechazado) {
                return ApiResponse::error('No se encontró el estado "Rechazado" en el sistema', 500);
            }

            // Actualizar estado y agregar observaciones
            $observacionActual = $movimiento->observacion ?? '';
            $movimiento->update([
                'estado_merma_id' => $estadoRechazado->id,
                'observacion'     => $observacionActual . "\n[RECHAZO] " . $request->observaciones_rechazo,
            ]);

            return ApiResponse::success([
                'message'        => 'Merma rechazada exitosamente',
                'merma_id'       => $id,
                'motivo_rechazo' => $request->observaciones_rechazo,
                'movimiento'     => $movimiento->load(['estadoMerma', 'tipoMerma']),
            ]);
        } catch (\Exception $e) {
            return ApiResponse::error('Error al rechazar la merma: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Mostrar formulario para ajuste masivo
     */
    public function ajusteMasivoForm(Request $request): Response
    {
        $almacenes      = Almacen::where('activo', true)->orderBy('nombre')->get(['id', 'nombre', 'activo']);
        $tiposAjuste    = TipoAjusteInventario::where('activo', true)->get();
        $tiposMerma     = TipoMerma::where('activo', true)->get();
        $tiposOperacion = TipoOperacion::where('activo', true)->get();
        $productos      = Producto::all(['id', 'sku', 'nombre'])->take(1000);
        $proveedores    = \App\Models\Proveedor::where('activo', true)->orderBy('nombre')->get(['id', 'nombre', 'razon_social', 'nit'])->take(500);
        $clientes       = \App\Models\Cliente::where('activo', true)->orderBy('nombre')->get(['id', 'nombre', 'razon_social', 'nit'])->take(500);

        return Inertia::render('inventario/ajuste-masivo', [
            'almacenes'       => $almacenes,
            'tipos_ajuste'    => $tiposAjuste,
            'tipos_merma'     => $tiposMerma,
            'tipos_operacion' => $tiposOperacion,
            'productos'       => $productos,
            'proveedores'     => $proveedores,
            'clientes'        => $clientes,
        ]);
    }

    /**
     * Procesar ajustes masivos desde CSV
     */
    public function importarAjustesMasivos(Request $request): JsonResponse
    {
        $request->validate([
            'ajustes'                     => 'required|array|min:1',
            'ajustes.*.stock_producto_id' => 'required|integer|exists:stock_productos,id',
            'ajustes.*.tipo_operacion_id' => 'required|integer|exists:tipo_operaciones,id',
            'ajustes.*.tipo_motivo_id'    => 'nullable|integer', // Puede ser null para operaciones sin tipo motivo específico
            'ajustes.*.almacen_id'        => 'required|integer|exists:almacenes,id',
            'ajustes.*.cantidad'          => 'required|integer|min:1', // Siempre positiva
            'ajustes.*.observacion'       => 'required|string|max:500',
            'ajustes.*.tipo_motivo_valor' => 'nullable|string|max:255', // Para proveedor/cliente
            'nombre_archivo'              => 'required|string|max:255',
            'datos_csv'                   => 'required|array', // Datos originales del CSV para almacenamiento
        ]);

        try {
            DB::beginTransaction();

            $ajustes            = $request->input('ajustes');
            $nombreArchivo      = $request->input('nombre_archivo');
            $datosCsv           = $request->input('datos_csv');
            $procesados         = 0;
            $errores            = [];
            $movimientosCreados = [];

            // Calcular hash del archivo para detectar duplicados
            $hashArchivo = hash('sha256', json_encode($datosCsv));

            // Verificar si el archivo ya fue cargado (deduplicación)
            $cargaPrevious = \App\Models\CargoCSVInventario::where('hash_archivo', $hashArchivo)->first();
            if ($cargaPrevious) {
                DB::rollBack();
                return ApiResponse::error('Este archivo ya fue procesado anteriormente', 409);
            }

            // Crear registro de carga CSV
            $cargo = \App\Models\CargoCSVInventario::create([
                'usuario_id'       => Auth::id(),
                'nombre_archivo'   => $nombreArchivo,
                'hash_archivo'     => $hashArchivo,
                'cantidad_filas'   => count($datosCsv),
                'cantidad_validas' => count($ajustes),
                'cantidad_errores' => 0,
                'estado'           => 'pendiente',
                'datos_json'       => json_encode($datosCsv),
                'errores_json'     => json_encode([]),
                'cambios_json'     => json_encode([]),
            ]);

            // Procesar cada ajuste
            foreach ($ajustes as $index => $ajuste) {
                try {
                    // Obtener el stock del producto
                    $stock    = StockProducto::findOrFail($ajuste['stock_producto_id']);
                    $producto = $stock->producto;

                    // VALIDACIÓN CRÍTICA: Verificar que el stock pertenece al almacén especificado
                    if ($stock->almacen_id !== $ajuste['almacen_id']) {
                        throw new \Exception(
                            "El producto '{$producto->nombre}' no existe en el almacén especificado. " .
                            "Pertenece al almacén: {$stock->almacen->nombre}"
                        );
                    }

                    // Obtener la operación para determinar la dirección
                    $operacion = TipoOperacion::findOrFail($ajuste['tipo_operacion_id']);

                    // Generar número de ajuste
                    $numeroAjuste = $this->generarNumeroAjuste();

                    // Determinar tipo de movimiento según la dirección de la operación
                    // La cantidad siempre es positiva, la dirección viene del tipo de operación
                    $cantidad  = $ajuste['cantidad'];
                    $esEntrada = $operacion->direccion === 'entrada';

                    // Mapear el tipo de operación al tipo de movimiento
                    $tipoMovimiento = $this->mapearTipoMovimiento($operacion->clave);

                    // Capturar cantidad anterior ANTES de actualizar el stock
                    $cantidadAnterior = $stock->cantidad;

                    // Actualizar stock según la dirección
                    // IMPORTANTE: Mantener el invariante: cantidad = cantidad_disponible + cantidad_reservada
                    if ($esEntrada) {
                        $stock->cantidad            += $cantidad;
                        $stock->cantidad_disponible += $cantidad;
                    } else {
                        $stock->cantidad            -= $cantidad;
                        $stock->cantidad_disponible -= $cantidad;

                        // Evitar stock negativo
                        if ($stock->cantidad < 0) {
                            $stock->cantidad = 0;
                        }
                        if ($stock->cantidad_disponible < 0) {
                            $stock->cantidad_disponible = 0;
                        }
                    }

                    $stock->fecha_actualizacion  = now();
                    $stock->save();

                    // Ahora crear el movimiento CON los datos actualizados
                    $cantidadPosterior = $stock->cantidad;

                    $movimientoData = [
                        'numero_documento'   => $numeroAjuste,
                        'stock_producto_id'  => $ajuste['stock_producto_id'],
                        'cantidad'           => $cantidad,
                        'cantidad_anterior'  => $cantidadAnterior,
                        'cantidad_posterior' => $cantidadPosterior,
                        'tipo'               => $tipoMovimiento,
                        'observacion'        => $ajuste['observacion'],
                        'user_id'            => Auth::id(),
                        'fecha'              => now(),
                        'referencia_tipo'    => 'CARGA_CSV',
                        'referencia_id'      => $cargo->id, // Vincular al cargo CSV
                    ];

                    // Agregar campos específicos según el tipo de operación
                    if ($operacion->requiere_tipo_motivo === 'tipo_ajuste' && $ajuste['tipo_motivo_id']) {
                        $movimientoData['tipo_ajust_inventario_id'] = $ajuste['tipo_motivo_id'];
                    } else if ($operacion->requiere_tipo_motivo === 'tipo_merma' && $ajuste['tipo_motivo_id']) {
                        $movimientoData['tipo_merma_id'] = $ajuste['tipo_motivo_id'];
                    } else if ($operacion->requiere_proveedor || $operacion->requiere_cliente) {
                        // Guardar el nombre del proveedor/cliente en observación o campo adicional
                        $movimientoData['observacion'] .= ' (' . $ajuste['tipo_motivo_valor'] . ')';
                    }

                    $movimiento = MovimientoInventario::create($movimientoData);

                    $procesados++;
                    $movimientosCreados[] = $movimiento->id;
                } catch (\Exception $e) {
                    $errores[] = [
                        'fila'  => $index + 1,
                        'error' => $e->getMessage(),
                    ];
                }
            }

            // Actualizar errores en cargo
            if (! empty($errores)) {
                $cargo->update([
                    'cantidad_errores' => count($errores),
                    'errores_json'     => json_encode($errores),
                ]);
            }

            DB::commit();

            // Después de commit, vincular movimientos al cargo
            if (! empty($movimientosCreados)) {
                foreach ($movimientosCreados as $movimientoId) {
                    DB::table('cargo_csv_movimientos')->insert([
                        'cargo_csv_id'             => $cargo->id,
                        'movimiento_inventario_id' => $movimientoId,
                        'created_at'               => now(),
                        'updated_at'               => now(),
                    ]);
                }

                // Marcar cargo como procesado
                $cargo->update(['estado' => 'procesado']);
            }

            if ($errores) {
                \Log::warning('Errores en importación de ajustes masivos', [
                    'cargo_id' => $cargo->id,
                    'errores'  => $errores,
                ]);
            }

            return ApiResponse::success([
                'cargo_id'   => $cargo->id,
                'procesados' => $procesados,
                'total'      => count($ajustes),
                'errores'    => $errores,
                'mensaje'    => "Se procesaron {$procesados} de " . count($ajustes) . " ajustes",
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error al procesar ajustes masivos', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error('Error al procesar los ajustes masivos: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Mostrar formulario de historial de cargas CSV
     */
    public function historialCargasForm()
    {
        return Inertia::render('inventario/historial-cargas', [
            'initialCargos' => [],
        ]);
    }

    /**
     * Obtener listado de cargas CSV
     */
    public function listarCargosCsv(Request $request): JsonResponse
    {
        try {
            $page    = $request->input('page', 1);
            $perPage = $request->input('per_page', 15);
            $estado  = $request->input('estado');  // Opcional: filtrar por estado
            $usuario = $request->input('usuario'); // Opcional: filtrar por usuario

            $query = \App\Models\CargoCSVInventario::with(['usuario', 'revertidoPorUsuario'])
                ->latest('created_at');

            if ($estado) {
                $query->where('estado', $estado);
            }

            if ($usuario) {
                $query->where('usuario_id', $usuario);
            }

            $cargos = $query->paginate($perPage, ['*'], 'page', $page);

            return ApiResponse::success([
                'data'       => $cargos->map(function ($cargo) {
                    return $cargo->getResumenAttribute();
                })->toArray(),
                'pagination' => [
                    'current_page' => $cargos->currentPage(),
                    'per_page'     => $cargos->perPage(),
                    'total'        => $cargos->total(),
                    'last_page'    => $cargos->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Error al obtener cargos CSV', [
                'error' => $e->getMessage(),
            ]);

            return ApiResponse::error('Error al obtener el historial de cargas', 500);
        }
    }

    /**
     * Obtener detalles de un cargo CSV
     */
    public function obtenerDetalleCargo(\App\Models\CargoCSVInventario $cargo): JsonResponse
    {
        try {
            $movimientos = $cargo->movimientos()
                ->with(['stockProducto.producto', 'almacen', 'tipoAjuste'])
                ->get()
                ->map(function ($mov) {
                    return [
                        'id'               => $mov->id,
                        'numero_documento' => $mov->numero_documento,
                        'producto'         => $mov->stockProducto->producto->nombre,
                        'sku'              => $mov->stockProducto->producto->sku,
                        'cantidad'         => $mov->cantidad,
                        'tipo'             => $mov->tipo,
                        'almacen'          => $mov->almacen->nombre,
                        'observacion'      => $mov->observacion,
                        'fecha'            => $mov->fecha_movimiento->format('d/m/Y H:i'),
                    ];
                });

            return ApiResponse::success([
                'cargo'            => $cargo->getResumenAttribute(),
                'movimientos'      => $movimientos,
                'puede_revertir'   => $cargo->estado === 'procesado',
                'datos_originales' => json_decode($cargo->datos_json, true),
                'errores'          => json_decode($cargo->errores_json, true),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error al obtener detalles del cargo', [
                'cargo_id' => $cargo->id,
                'error'    => $e->getMessage(),
            ]);

            return ApiResponse::error('Error al obtener los detalles del cargo', 500);
        }
    }

    /**
     * Revertir un cargo CSV
     */
    public function revertirCargo(Request $request, \App\Models\CargoCSVInventario $cargo): JsonResponse
    {
        $request->validate([
            'motivo' => 'required|string|max:500',
        ]);

        try {
            // Verificar que el cargo pueda ser revertido
            if ($cargo->estado !== 'procesado') {
                return ApiResponse::error('Este cargo no puede ser revertido. Estado actual: ' . $cargo->estado, 400);
            }

            // Revertir el cargo
            $resultado = $cargo->revertir(Auth::user(), $request->input('motivo'));

            if (! $resultado) {
                return ApiResponse::error('Error al revertir el cargo', 500);
            }

            \Log::info('Cargo CSV revertido', [
                'cargo_id'              => $cargo->id,
                'usuario_id'            => Auth::id(),
                'movimientos_afectados' => $cargo->movimientos()->count(),
            ]);

            return ApiResponse::success([
                'cargo_id'               => $cargo->id,
                'mensaje'                => 'Cargo revertido exitosamente. Se han deshecho todos los cambios.',
                'movimientos_revertidos' => $cargo->movimientos()->count(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error al revertir cargo CSV', [
                'cargo_id' => $cargo->id,
                'error'    => $e->getMessage(),
                'trace'    => $e->getTraceAsString(),
            ]);

            return ApiResponse::error('Error al revertir el cargo: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Obtener estadísticas de inventario
     */
    public function estadisticasApi(Request $request): JsonResponse
    {
        try {
            // Parámetros opcionales de filtro
            $almacenId   = $request->integer('almacen_id');
            $categoriaId = $request->integer('categoria_id');
            $fechaDesde  = $request->date('fecha_desde');
            $fechaHasta  = $request->date('fecha_hasta');

            // Query base de movimientos
            $movimientosQuery = MovimientoInventario::when($almacenId, fn($q) =>
                $q->whereHas('stockProducto', fn($sq) => $sq->where('almacen_id', $almacenId))
            )->when($categoriaId, fn($q) =>
                $q->whereHas('stockProducto.producto', fn($sq) => $sq->where('categoria_id', $categoriaId))
            )->when($fechaDesde, fn($q) =>
                $q->whereDate('fecha', '>=', $fechaDesde)
            )->when($fechaHasta, fn($q) =>
                $q->whereDate('fecha', '<=', $fechaHasta)
            );

            // Estadísticas por tipo de movimiento
            $totalMovimientos    = (clone $movimientosQuery)->count();
            $totalEntradas       = (clone $movimientosQuery)->where('tipo', 'like', 'ENTRADA%')->count();
            $totalSalidas        = (clone $movimientosQuery)->where('tipo', 'like', 'SALIDA%')->count();
            $totalTransferencias = (clone $movimientosQuery)->where('tipo', 'like', '%TRANSFERENCIA%')->count();
            $totalMermas         = (clone $movimientosQuery)->where('tipo', 'like', '%MERMA%')->count();
            $totalAjustes        = (clone $movimientosQuery)->where('tipo', 'like', '%AJUSTE%')->count();

            // Valor total de movimientos (usando cantidad como aproximación)
            $valorTotalEntradas = (clone $movimientosQuery)
                ->where('tipo', 'like', 'ENTRADA%')
                ->where('cantidad', '>', 0)
                ->sum(DB::raw('cantidad'));

            $valorTotalSalidas = (clone $movimientosQuery)
                ->where('tipo', 'like', 'SALIDA%')
                ->where('cantidad', '>', 0)
                ->sum(DB::raw('cantidad'));

            $valorTotalMermas = (clone $movimientosQuery)
                ->where('tipo', 'like', '%MERMA%')
                ->sum(DB::raw('ABS(cantidad)'));

            // Productos afectados
            $productosAfectados = (clone $movimientosQuery)
                ->select('stock_productos.producto_id')
                ->distinct()
                ->count();

            // Almacenes activos
            $almacenesActivos = Almacen::where('activo', true)->count();

            // Stock bajo
            $stockBajo = Producto::where('activo', true)
                ->stockBajo()
                ->count();

            // Próximos a vencer
            $proximosVencer = Producto::where('activo', true)
                ->proximosVencer(30)
                ->count();

            // Vencidos
            $vencidos = Producto::where('activo', true)
                ->vencidos()
                ->count();

            // Tendencia semanal
            $tendenciaSemanal = (clone $movimientosQuery)
                ->select(
                    DB::raw('DATE(fecha) as fecha'),
                    DB::raw("SUM(CASE WHEN tipo LIKE 'ENTRADA%' THEN ABS(cantidad) ELSE 0 END) as entradas"),
                    DB::raw("SUM(CASE WHEN tipo LIKE 'SALIDA%' THEN ABS(cantidad) ELSE 0 END) as salidas"),
                    DB::raw("SUM(CASE WHEN tipo LIKE '%TRANSFERENCIA%' THEN 1 ELSE 0 END) as transferencias"),
                    DB::raw("SUM(CASE WHEN tipo LIKE '%MERMA%' THEN ABS(cantidad) ELSE 0 END) as mermas")
                )
                ->groupBy(DB::raw('DATE(fecha)'))
                ->orderBy('fecha', 'desc')
                ->limit(7)
                ->get()
                ->sortBy('fecha')
                ->values()
                ->map(fn($item) => [
                    'fecha'          => $item->fecha,
                    'entradas'       => (int) $item->entradas,
                    'salidas'        => (int) $item->salidas,
                    'transferencias' => (int) $item->transferencias,
                    'mermas'         => (int) $item->mermas,
                ]);

            $estadisticas = [
                'total_movimientos'      => $totalMovimientos,
                'total_entradas'         => $totalEntradas,
                'total_salidas'          => $totalSalidas,
                'total_transferencias'   => $totalTransferencias,
                'total_mermas'           => $totalMermas,
                'total_ajustes'          => $totalAjustes,
                'valor_total_entradas'   => (float) $valorTotalEntradas,
                'valor_total_salidas'    => (float) $valorTotalSalidas,
                'valor_total_mermas'     => (float) $valorTotalMermas,
                'productos_afectados'    => $productosAfectados,
                'almacenes_activos'      => $almacenesActivos,
                'stock_bajo'             => $stockBajo,
                'proximos_vencer'        => $proximosVencer,
                'vencidos'               => $vencidos,
                'movimientos_pendientes' => 0,
                'tendencia_semanal'      => $tendenciaSemanal,
            ];

            return ApiResponse::success($estadisticas);

        } catch (\Exception $e) {
            \Log::error('Error al obtener estadísticas', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error('Error al obtener estadísticas: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Exportar stock a Excel con formato profesional
     * GET /stock/{stock}/exportar-excel
     */
    public function exportarExcel(StockProducto $stock)
    {
        Log::info('📊 [InventarioController::exportarExcel] Exportando stock a Excel', [
            'stock_id' => $stock->id,
            'user_id'  => auth()->id(),
        ]);

        try {
            return $this->excelExportService->exportarInventario($stock);
        } catch (\Exception $e) {
            Log::error('❌ [InventarioController::exportarExcel] Error', [
                'error'    => $e->getMessage(),
                'stock_id' => $stock->id,
            ]);
            return back()->with('error', 'Error al generar Excel: ' . $e->getMessage());
        }
    }

    /**
     * Exportar stock a PDF
     * GET /stock/{stock}/exportar-pdf
     */
    public function exportarPdf(StockProducto $stock)
    {
        Log::info('📄 [InventarioController::exportarPdf] Exportando stock a PDF', [
            'stock_id' => $stock->id,
            'user_id'  => auth()->id(),
        ]);

        try {
            // Generar PDF usando DomPDF
            $stock->load(['producto.categoria', 'producto.marca', 'almacen']);

            $datos = [
                'stock'   => $stock,
                'empresa' => \App\Models\Empresa::first(),
                'usuario' => auth()->user()->name ?? 'Sistema',
            ];

            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('impresion.inventarios.reporte-a4', $datos);
            $pdf->setPaper('A4', 'portrait');

            return $pdf->download('stock_' . $stock->producto->codigo . '_' . now()->format('Y-m-d_H-i-s') . '.pdf');
        } catch (\Exception $e) {
            Log::error('❌ [InventarioController::exportarPdf] Error', [
                'error'    => $e->getMessage(),
                'stock_id' => $stock->id,
            ]);
            return back()->with('error', 'Error al generar PDF: ' . $e->getMessage());
        }
    }

    /**
     * API: Obtener stock filtrado y ordenado
     * Parámetros de query:
     * - busqueda: Buscar por nombre, código o SKU
     * - almacen_id: Filtrar por almacén
     * - rango_stock: 'todos', 'cero', 'bajo', 'normal', 'alto'
     * - ordenamiento: 'cantidad-asc', 'cantidad-desc', 'producto', 'almacen'
     */
    public function apiStockFiltrado(Request $request): JsonResponse
    {
        try {
            $busqueda      = (string) $request->string('busqueda', '')->lower();
            $almacenId     = (int) $request->integer('almacen_id', 0);
            $rangoStock    = (string) $request->string('rango_stock', 'todos');
            $ordenamiento  = (string) $request->string('ordenamiento', 'cantidad-desc');
            $soloConStock  = (bool) $request->boolean('solo_con_stock', false);

            // Definir rangos de stock
            $rangos = [
                'todos'  => ['min' => 0, 'max' => PHP_INT_MAX],
                'cero'   => ['min' => 0, 'max' => 0],
                'bajo'   => ['min' => 0.01, 'max' => 10],
                'normal' => ['min' => 10.01, 'max' => 100],
                'alto'   => ['min' => 100.01, 'max' => PHP_INT_MAX],
            ];

            $rango = $rangos[$rangoStock] ?? $rangos['todos'];

            // Obtener lista de almacenes activos
            $almacenes = Almacen::where('activo', true)->get();

            $stocks = [];

            // ✅ SIEMPRE comenzar desde Producto para incluir productos sin stock_productos
            // Esta lógica incluye:
            // - Productos con registros en stock_productos
            // - Productos que NUNCA han tenido registros en stock_productos (sin stock)
            $productoQuery = Producto::with([
                'stock' => fn($q) => $q->withoutTrashed(), // Excluir soft deleted
                'stock.almacen',
                'codigoPrincipal',
                'precios',
                'unidad',
                'conversiones.unidadDestino',
            ])
                ->where('activo', true); // Solo productos activos

            // Aplicar filtro de búsqueda solo si hay término de búsqueda
            if ($busqueda) {
                $productoQuery->where(function ($q) use ($busqueda) {
                    // Prioridad 1: Búsqueda exacta por ID si es numérico
                    if (is_numeric($busqueda)) {
                        $q->where('id', (int) $busqueda);
                    } else {
                        // Prioridad 2: Búsqueda exacta por SKU (no parcial)
                        $q->where('sku', strtolower($busqueda));
                    }

                    // Prioridad 3: Si no coincide exacto, buscar parcial en SKU
                    $q->orWhereRaw('LOWER(sku) like ?', ["%{$busqueda}%"]);

                    // Prioridad 4: Buscar parcial en nombre
                    $q->orWhereRaw('LOWER(nombre) like ?', ["%{$busqueda}%"]);

                    // Prioridad 5: Buscar en código de barras
                    $q->orWhereHas('codigoPrincipal', function ($cq) use ($busqueda) {
                        $cq->whereRaw('LOWER(codigo) like ?', ["%{$busqueda}%"]);
                    });
                });
            }

            $productoQuery = $productoQuery->get();

            // Procesar productos encontrados
            foreach ($productoQuery as $producto) {
                if ($producto->stock && $producto->stock->count() > 0) {
                    // Producto tiene stock registrado
                    foreach ($producto->stock as $stock) {
                        // Aplicar filtros
                        if ($almacenId > 0 && $stock->almacen_id != $almacenId) {
                            continue;
                        }

                        // ✅ NUEVO: Filtrar solo productos con stock cantidad >= 1
                        if ($soloConStock && $stock->cantidad < 1) {
                            continue;
                        }

                        if ($rangoStock === 'cero' && $stock->cantidad != 0) {
                            continue;
                        } elseif ($rangoStock !== 'cero' && ! ($stock->cantidad >= $rango['min'] && $stock->cantidad <= $rango['max'])) {
                            continue;
                        }

                        $stocks[] = $stock;
                    }
                } else {
                    // Producto sin stock: crear registros virtuales (stock = 0)
                    // ✅ NUEVO: Si "solo_con_stock" está activado, NO mostrar productos sin stock
                    if ($soloConStock) {
                        // Saltar este producto porque no tiene stock
                        continue;
                    }

                    if ($rangoStock === 'cero' || $rangoStock === 'todos') {
                        // Mostrar en todos los almacenes o solo el seleccionado
                        $almacenesParaMostrar = $almacenId > 0
                            ? [$almacenes->find($almacenId)]
                            : $almacenes;

                        foreach ($almacenesParaMostrar as $almacen) {
                            if (! $almacen) {
                                continue;
                            }

                            // Crear objeto StockProducto virtual con todas las propiedades
                            $stockVirtual                      = new \stdClass();
                            $stockVirtual->id                  = null;
                            $stockVirtual->producto_id         = $producto->id;
                            $stockVirtual->almacen_id          = $almacen->id;
                            $stockVirtual->cantidad            = 0;
                            $stockVirtual->cantidad_disponible = 0;
                            $stockVirtual->cantidad_reservada  = 0;
                            $stockVirtual->lote                = null;
                            $stockVirtual->ubicacion           = null;
                            $stockVirtual->fecha_vencimiento   = null;
                            $stockVirtual->fecha_registro      = now();
                            $stockVirtual->producto            = $producto;
                            $stockVirtual->almacen             = $almacen;

                            $stocks[] = $stockVirtual;
                        }
                    }
                }
            }
            $stockProductos = [];

            // Construcción de datos con detalles de lote
            $stockProductos = [];
            $stockAgrupado  = []; // Para agrupar por producto+almacén

            foreach ($stocks as $stock) {
                // Obtener precio de venta base
                $precioVenta = 0;
                if ($stock->producto) {
                    $precioVentaObj = $stock->producto->precios?->firstWhere('es_precio_base', true);
                    $precioVenta    = $precioVentaObj?->precio ?? $stock->producto->precio_venta ?? 0;
                }

                // Procesar conversiones para productos fraccionados
                $conversiones = [];
                if ($stock->producto?->es_fraccionado && $stock->producto->conversiones) {
                    foreach ($stock->producto->conversiones as $conv) {
                        $conversiones[] = [
                            'id'                     => $conv->id,
                            'unidad_origen_id'       => $conv->unidad_origen_id,
                            'unidad_destino_id'      => $conv->unidad_destino_id,
                            'unidad_destino_nombre'  => $conv->unidadDestino?->nombre ?? '',
                            'factor_conversion'      => $conv->factor_conversion,
                            'cantidad_en_conversion' => round($stock->cantidad * $conv->factor_conversion, 2),
                        ];
                    }
                }

                // Clave única para agrupar
                $clave = $stock->producto_id . '_' . $stock->almacen_id;

                // Si no existe el grupo, crearlo
                if (! isset($stockAgrupado[$clave])) {
                    $stockAgrupado[$clave] = [
                        'id'                        => null, // No hay ID en grupo
                        'producto_id'               => $stock->producto_id,
                        'almacen_id'                => $stock->almacen_id,
                        'cantidad'                  => 0,
                        'cantidad_disponible'       => 0,
                        'cantidad_reservada'        => 0,
                        'precio_venta'              => $precioVenta,
                        'producto_nombre'           => $stock->producto?->nombre ?? 'Desconocido',
                        'producto_codigo'           => $stock->producto?->codigo ?? '',
                        'producto_codigo_barra'     => $stock->producto?->codigoPrincipal?->codigo ?? '',
                        'producto_sku'              => $stock->producto?->sku ?? '',
                        'almacen_nombre'            => $stock->almacen?->nombre ?? 'Desconocido',
                        'es_fraccionado'            => (bool) $stock->producto?->es_fraccionado,
                        'unidad_medida_nombre'      => $stock->producto?->unidad?->nombre ?? 'Unidades',
                        'fecha_vencimiento_proximo' => null, // Se calcula después
                        'detalles_lotes'            => [],
                    ];
                }

                // Acumular cantidades
                $stockAgrupado[$clave]['cantidad']            += $stock->cantidad;
                $stockAgrupado[$clave]['cantidad_disponible'] += $stock->cantidad_disponible;
                $stockAgrupado[$clave]['cantidad_reservada']  += $stock->cantidad_reservada;

                // Agregar detalle de lote
                $stockAgrupado[$clave]['detalles_lotes'][] = [
                    'id'                  => $stock->id,
                    'lote'                => $stock->lote ?? 'Sin lote',
                    'fecha_vencimiento'   => $stock->fecha_vencimiento ? \Carbon\Carbon::parse($stock->fecha_vencimiento)->format('d/m/Y') : null,
                    'cantidad'            => $stock->cantidad,
                    'cantidad_disponible' => $stock->cantidad_disponible,
                    'cantidad_reservada'  => $stock->cantidad_reservada,
                    'conversiones'        => $conversiones,
                ];

                // Actualizar próximo vencimiento (el más cercano)
                if ($stock->fecha_vencimiento) {
                    $fechaParsed = \Carbon\Carbon::parse($stock->fecha_vencimiento);
                    if (! $stockAgrupado[$clave]['fecha_vencimiento_proximo'] ||
                        $fechaParsed < $stockAgrupado[$clave]['fecha_vencimiento_proximo']) {
                        $stockAgrupado[$clave]['fecha_vencimiento_proximo'] = $fechaParsed;
                    }
                }
            }

            // Convertir a array de valores
            $stockProductos = array_values($stockAgrupado);

            // Ordenamiento
            usort($stockProductos, function ($a, $b) use ($ordenamiento) {
                return match ($ordenamiento) {
                    'cantidad-asc'  => (int) $a['cantidad'] <=> (int) $b['cantidad'],
                    'cantidad-desc' => (int) $b['cantidad'] <=> (int) $a['cantidad'],
                    'producto'      => strcmp((string) $a['producto_nombre'], (string) $b['producto_nombre']),
                    'almacen'       => strcmp((string) $a['almacen_nombre'], (string) $b['almacen_nombre']),
                    default         => (int) $b['cantidad'] <=> (int) $a['cantidad'],
                };
            });

            // Formatear fechas de vencimiento antes de devolver
            $stockProductos = array_map(function ($item) {
                if ($item['fecha_vencimiento_proximo'] instanceof \Carbon\Carbon) {
                    $item['fecha_vencimiento_proximo'] = $item['fecha_vencimiento_proximo']->format('d/m/Y');
                }
                return $item;
            }, $stockProductos);

            return response()->json([
                'success' => true,
                'data'    => $stockProductos,
                'total'   => count($stockProductos),
            ]);

        } catch (\Exception $e) {
            Log::error('Error en apiStockFiltrado', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener stock filtrado: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener lotes disponibles para un producto en un almacén específico
     * GET /api/inventario/lotes?producto_id=X&almacen_id=Y
     */
    public function apiLotes(Request $request): JsonResponse
    {
        try {
            $productoId = (int) $request->integer('producto_id', 0);
            $almacenId = (int) $request->integer('almacen_id', 0);

            if (!$productoId || !$almacenId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Los parámetros producto_id y almacen_id son requeridos',
                ], 400);
            }

            // Obtener lotes del producto en el almacén especificado
            $lotes = StockProducto::query()
                ->where('producto_id', $productoId)
                ->where('almacen_id', $almacenId)
                ->where('cantidad', '>', 0)
                ->withoutTrashed()
                ->select('id', 'lote', 'fecha_vencimiento', 'cantidad', 'cantidad_disponible')
                ->orderBy('fecha_vencimiento', 'asc')
                ->orderBy('lote', 'asc')
                ->get();

            $lotesFormateados = $lotes->map(function ($stock) {
                return [
                    'id' => $stock->id,
                    'numero' => $stock->lote ?? 'Sin lote',
                    'fecha_vencimiento' => $stock->fecha_vencimiento ? $stock->fecha_vencimiento->toDateString() : null,
                    'cantidad' => $stock->cantidad,
                    'cantidad_disponible' => $stock->cantidad_disponible,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $lotesFormateados,
                'total' => count($lotesFormateados),
            ]);

        } catch (\Exception $e) {
            Log::error('Error en apiLotes', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener lotes: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Buscar productos por almacén con términos de búsqueda
     * Prioriza búsqueda por SKU (ID.SKU), luego nombre
     * GET /api/inventario/productos-almacen/{almacen_id}?q=search_term
     */
    public function buscarProductosAlmacen(Request $request, $almacenId): JsonResponse
    {
        try {
            $searchTerm = $request->input('q', '');
            $limit = (int) $request->input('limit', 10);

            // Validar almacén
            $almacen = Almacen::findOrFail($almacenId);

            if (empty($searchTerm)) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'total' => 0,
                ]);
            }

            $searchLower = strtolower($searchTerm);
            $isNumeric = is_numeric($searchTerm);

            // ✅ PASO 1: Obtener productos que ya existen en stock en este almacén
            $stockProductos = StockProducto::where('almacen_id', $almacenId)
                ->with(['producto:id,nombre,sku,codigo_barras', 'producto.codigosBarra'])
                ->get();

            // ✅ PASO 2: Obtener todos los productos (incluyendo los que NO existen en stock)
            // Búsqueda incluye: ID, SKU, Códigos de Barra, Nombre (todo case-insensitive)
            $todosProductos = \App\Models\Producto::with('codigosBarra')
                ->select('id', 'nombre', 'sku', 'codigo_barras')
                ->where(function ($query) use ($searchLower, $isNumeric, $searchTerm) {
                    // ID exacto (si es numérico)
                    if ($isNumeric) {
                        $query->orWhere('id', (int)$searchTerm);
                    }
                    // SKU
                    $query->orWhereRaw('LOWER(sku) LIKE ?', ['%' . $searchLower . '%'])
                          // Nombre
                          ->orWhereRaw('LOWER(nombre) LIKE ?', ['%' . $searchLower . '%'])
                          // Código de barras principal
                          ->orWhereRaw('LOWER(codigo_barras) LIKE ?', ['%' . $searchLower . '%']);
                })
                ->orWhereHas('codigosBarra', function ($query) use ($searchLower) {
                    // Códigos de barra adicionales (si existen en tabla relacional)
                    $query->whereRaw('LOWER(codigo) LIKE ?', ['%' . $searchLower . '%']);
                })
                ->get();

            // ✅ PASO 3: Helper function para obtener todos los códigos de barra de un producto
            $obtenerCodigosBarra = function ($producto) {
                $codigos = [];
                // Código principal
                if (!empty($producto->codigo_barras)) {
                    $codigos[] = strtolower($producto->codigo_barras);
                }
                // Códigos adicionales desde la relación
                if ($producto->codigosBarra) {
                    foreach ($producto->codigosBarra as $cb) {
                        $codigos[] = strtolower($cb->codigo ?? '');
                    }
                }
                return array_filter($codigos);
            };

            // ✅ PASO 4: Combinar resultados - Priorizar los que ya existen en stock
            $resultadosColecccion = collect();

            // Primero agregar los que ya están en stock
            foreach ($stockProductos as $sp) {
                $sku = strtolower($sp->producto->sku ?? '');
                $nombre = strtolower($sp->producto->nombre ?? '');
                $codigos = $obtenerCodigosBarra($sp->producto);

                $coincide = strpos($sku, $searchLower) !== false ||
                           strpos($nombre, $searchLower) !== false ||
                           in_array($searchLower, $codigos) ||
                           array_filter($codigos, fn($c) => strpos($c, $searchLower) !== false);

                if ($coincide) {
                    $resultadosColecccion->push([
                        'id' => $sp->id,
                        'stock_producto_id' => $sp->id,
                        'producto_id' => $sp->producto->id,
                        'nombre' => $sp->producto->nombre,
                        'sku' => $sp->producto->sku,
                        'codigo_barras' => $sp->producto->codigo_barras,
                        'cantidad_disponible' => $sp->cantidad_disponible,
                        'cantidad_actual' => $sp->cantidad,
                        'lote' => $sp->lote,
                        'producto' => $sp->producto,
                        'existe_en_almacen' => true,
                    ]);
                }
            }

            // Luego agregar productos que NO están en stock en este almacén
            foreach ($todosProductos as $producto) {
                // Verificar si ya fue agregado (existe en stock)
                $yaExiste = $resultadosColecccion->contains(function ($item) use ($producto) {
                    return $item['producto_id'] === $producto->id;
                });

                if (!$yaExiste) {
                    $resultadosColecccion->push([
                        'id' => null,  // No hay stock_producto aún
                        'stock_producto_id' => null,
                        'producto_id' => $producto->id,
                        'nombre' => $producto->nombre,
                        'sku' => $producto->sku,
                        'codigo_barras' => $producto->codigo_barras,
                        'cantidad_disponible' => 0,
                        'cantidad_actual' => 0,
                        'lote' => null,
                        'producto' => $producto,
                        'existe_en_almacen' => false,  // Marca como nuevo en almacén
                    ]);
                }
            }

            // ✅ PASO 5: Ordenar por relevancia (Prioridades: ID > SKU > CodigosBarra > Nombre)
            $resultados = $resultadosColecccion->sort(function ($a, $b) use ($searchLower, $isNumeric, $searchTerm, $obtenerCodigosBarra) {
                $idA = (string)$a['producto_id'];
                $idB = (string)$b['producto_id'];
                $skuA = strtolower($a['sku'] ?? '');
                $skuB = strtolower($b['sku'] ?? '');
                $nombreA = strtolower($a['nombre'] ?? '');
                $nombreB = strtolower($b['nombre'] ?? '');

                $codigosA = $obtenerCodigosBarra($a['producto']);
                $codigosB = $obtenerCodigosBarra($b['producto']);

                // Prioridad 0: Existentes en almacén
                if ($a['existe_en_almacen'] !== $b['existe_en_almacen']) {
                    return $a['existe_en_almacen'] ? -1 : 1;
                }

                // Prioridad 1: ID coincidencia exacta
                if ($isNumeric) {
                    $idMatch = (int)$searchTerm;
                    $matchA = $a['producto_id'] === $idMatch ? 1 : 0;
                    $matchB = $b['producto_id'] === $idMatch ? 1 : 0;
                    if ($matchA !== $matchB) return $matchB - $matchA;
                }

                // Prioridad 2: SKU coincidencia exacta
                if ($skuA === $searchLower && $skuB !== $searchLower) return -1;
                if ($skuA !== $searchLower && $skuB === $searchLower) return 1;

                // Prioridad 3: Código de barras coincidencia exacta
                $codigoExactoA = in_array($searchLower, $codigosA) ? 1 : 0;
                $codigoExactoB = in_array($searchLower, $codigosB) ? 1 : 0;
                if ($codigoExactoA !== $codigoExactoB) return $codigoExactoB - $codigoExactoA;

                // Prioridad 4: SKU comienza con término
                $skuStartsA = strpos($skuA, $searchLower) === 0 ? 1 : 0;
                $skuStartsB = strpos($skuB, $searchLower) === 0 ? 1 : 0;
                if ($skuStartsA !== $skuStartsB) return $skuStartsB - $skuStartsA;

                // Prioridad 5: Código de barras comienza con término
                $codigoStartsA = array_filter($codigosA, fn($c) => strpos($c, $searchLower) === 0);
                $codigoStartsB = array_filter($codigosB, fn($c) => strpos($c, $searchLower) === 0);
                if ((bool)$codigoStartsA !== (bool)$codigoStartsB) return (bool)$codigoStartsB ? 1 : -1;

                // Prioridad 6: SKU contiene término
                $skuContainsA = strpos($skuA, $searchLower) !== false ? 1 : 0;
                $skuContainsB = strpos($skuB, $searchLower) !== false ? 1 : 0;
                if ($skuContainsA !== $skuContainsB) return $skuContainsB - $skuContainsA;

                // Prioridad 7: Código de barras contiene término
                $codigoContainsA = array_filter($codigosA, fn($c) => strpos($c, $searchLower) !== false);
                $codigoContainsB = array_filter($codigosB, fn($c) => strpos($c, $searchLower) !== false);
                if ((bool)$codigoContainsA !== (bool)$codigoContainsB) return (bool)$codigoContainsB ? 1 : -1;

                // Prioridad 8: Nombre comienza con término
                $nombreStartsA = strpos($nombreA, $searchLower) === 0 ? 1 : 0;
                $nombreStartsB = strpos($nombreB, $searchLower) === 0 ? 1 : 0;
                if ($nombreStartsA !== $nombreStartsB) return $nombreStartsB - $nombreStartsA;

                // Prioridad 9: Nombre contiene término
                $nombreContainsA = strpos($nombreA, $searchLower) !== false ? 1 : 0;
                $nombreContainsB = strpos($nombreB, $searchLower) !== false ? 1 : 0;
                return $nombreContainsB - $nombreContainsA;
            })
            ->take($limit)
            ->values();

            return response()->json([
                'success' => true,
                'data' => $resultados->toArray(),
                'total' => $resultados->count(),
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Almacén no encontrado',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error en buscarProductosAlmacen', [
                'error' => $e->getMessage(),
                'almacen_id' => $almacenId,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al buscar productos: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Crear stock_producto para un producto nuevo en un almacén
     * POST /api/inventario/crear-stock-producto
     */
    public function crearStockProducto(Request $request): JsonResponse
    {
        try {
            $productoId = (int) $request->input('producto_id');
            $almacenId = (int) $request->input('almacen_id');

            if (!$productoId || !$almacenId) {
                return response()->json([
                    'success' => false,
                    'message' => 'producto_id y almacen_id son requeridos',
                ], 400);
            }

            // Validar que existan producto y almacén
            $producto = Producto::findOrFail($productoId);
            $almacen = Almacen::findOrFail($almacenId);

            // Verificar si ya existe stock para este producto en este almacén
            $stockExistente = StockProducto::where('producto_id', $productoId)
                ->where('almacen_id', $almacenId)
                ->first();

            if ($stockExistente) {
                return response()->json([
                    'success' => true,
                    'message' => 'Stock ya existe',
                    'data' => [
                        'id' => $stockExistente->id,
                        'stock_producto_id' => $stockExistente->id,
                        'producto_id' => $stockExistente->producto_id,
                        'nombre' => $producto->nombre,
                        'sku' => $producto->sku,
                        'cantidad_actual' => $stockExistente->cantidad,
                        'cantidad_disponible' => $stockExistente->cantidad_disponible,
                    ],
                ]);
            }

            // ✅ Crear nuevo stock_producto con cantidad 0
            $nuevoStock = StockProducto::create([
                'producto_id' => $productoId,
                'almacen_id' => $almacenId,
                'cantidad' => 0,
                'cantidad_disponible' => 0,
                'lote' => null,
                'fecha_vencimiento' => null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Stock creado correctamente',
                'data' => [
                    'id' => $nuevoStock->id,
                    'stock_producto_id' => $nuevoStock->id,
                    'producto_id' => $nuevoStock->producto_id,
                    'nombre' => $producto->nombre,
                    'sku' => $producto->sku,
                    'codigo_barras' => $producto->codigo_barras,
                    'cantidad_actual' => $nuevoStock->cantidad,
                    'cantidad_disponible' => $nuevoStock->cantidad_disponible,
                ],
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Producto o almacén no encontrado',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error en crearStockProducto', [
                'error' => $e->getMessage(),
                'producto_id' => $productoId ?? null,
                'almacen_id' => $almacenId ?? null,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al crear stock: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Imprimir ajustes de inventario en formato A4
     * GET /inventario/ajuste/imprimir?formato=A4&accion=stream|download
     */
    public function imprimirAjustes(Request $request)
    {
        try {
            $ajusteId = (int) $request->query('ajuste_id', 0);
            $ajustes = [];

            if ($ajusteId > 0) {
                // Imprimir ajuste específico por ID (histórico)
                $ajuste = AjusteInventario::with([
                    'movimientos.stockProducto.producto',
                    'movimientos.stockProducto.almacen',
                    'almacen',
                    'user'
                ])->findOrFail($ajusteId);

                // Convertir movimientos a formato de ajustes para la plantilla
                $ajustes = $ajuste->movimientos->map(function ($movimiento) {
                    return [
                        'numero_documento' => $movimiento->numero_documento ?? '-',
                        'fecha' => $movimiento->created_at ?? $movimiento->fecha,
                        'producto_nombre' => $movimiento->stockProducto->producto->nombre ?? 'N/A',
                        'producto_sku' => $movimiento->stockProducto->producto->sku ?? 'N/A',
                        'almacen_nombre' => $movimiento->stockProducto->almacen->nombre ?? 'N/A',
                        'tipo_operacion' => $movimiento->tipo,
                        'tipo_ajuste_label' => $this->mapearTipoMovimiento($movimiento->tipo),
                        'cantidad' => $movimiento->cantidad,
                        'cantidad_anterior' => $movimiento->cantidad_anterior ?? 0,
                        'cantidad_posterior' => $movimiento->cantidad_posterior ?? 0,
                        'observacion' => $movimiento->observacion,
                        'usuario' => $movimiento->user->name ?? 'Sistema',
                    ];
                })->toArray();

                // Datos del ajuste maestro
                $cabecera = [
                    'id' => $ajuste->id,
                    'numero' => $ajuste->numero,
                    'almacen_nombre' => $ajuste->almacen->nombre ?? 'N/A',
                    'usuario' => $ajuste->user->name ?? 'Sistema',
                    'fecha_creacion' => $ajuste->created_at,
                    'cantidad_productos' => $ajuste->cantidad_productos ?? 0,
                    'cantidad_entradas' => $ajuste->cantidad_entradas ?? 0,
                    'cantidad_salidas' => $ajuste->cantidad_salidas ?? 0,
                    'observacion' => $ajuste->observacion,
                    'estado' => $ajuste->estado ?? 'procesado',
                ];

                $almacenFiltro = $ajuste->almacen->nombre ?? 'Todos';
                $tipoAjusteFiltro = null;
            } else {
                // Obtener datos de sesión (para impresión inmediata después de procesar)
                $ajustes = session('ajustes_impresion', []);
                $almacenFiltro = session('almacen_filtro_impresion', null);
                $tipoAjusteFiltro = session('tipo_ajuste_filtro_impresion', null);
                $cabecera = session('cabecera_impresion', null);

                if (empty($ajustes)) {
                    return back()->with('error', 'No hay ajustes para imprimir. Por favor, prepara los datos primero.');
                }
            }

            // Preparar datos para la vista
            $datos = [
                'cabecera'              => $cabecera ?? [],
                'ajustes'               => collect($ajustes),
                'almacenFiltro'         => $almacenFiltro ?? 'Todos',
                'tipoAjusteFiltro'      => $tipoAjusteFiltro,
                'fecha_generacion'      => now()->format('d/m/Y H:i'),
                'usuario'               => auth()->user()->name ?? 'Sistema',
                'empresa'               => auth()->user()->empresa ?? config('app.name'),
            ];

            // Generar PDF
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('impresion.inventario.ajustes-a4', $datos);
            $pdf->setPaper('A4', 'portrait');

            // Determinar acción (stream o download)
            $accion = $request->input('accion', 'stream');
            $nombreArchivo = 'ajustes_inventario_' . now()->format('Y-m-d_H-i-s') . '.pdf';

            if ($accion === 'download') {
                return $pdf->download($nombreArchivo);
            } else {
                return $pdf->stream($nombreArchivo);
            }

        } catch (\Exception $e) {
            Log::error('❌ [InventarioController::imprimirAjustes] Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->with('error', 'Error al generar PDF: ' . $e->getMessage());
        }
    }

    /**
     * API: Preparar ajustes para impresión
     * POST /api/inventario/ajuste/preparar-impresion
     */
    public function prepararImpresionAjustes(Request $request)
    {
        try {
            $ajustes = $request->input('ajustes', []);
            $almacenFiltro = $request->input('almacen_filtro');
            $tipoAjusteFiltro = $request->input('tipo_ajuste_filtro');
            $cabecera = $request->input('cabecera');

            if (empty($ajustes)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No hay ajustes para imprimir',
                ], 422);
            }

            // Normalizar estructura de ajustes para asegurar campos correctos
            $ajustesNormalizados = array_map(function ($ajuste) {
                // Asegurar que los campos tengan los nombres esperados por la plantilla
                return [
                    'numero_documento' => $ajuste['numero_documento'] ?? '-',
                    'fecha' => $ajuste['fecha'] ?? $ajuste['created_at'] ?? now()->format('Y-m-d'),
                    'producto_nombre' => $ajuste['producto_nombre'] ?? $ajuste['nombre'] ?? 'N/A',
                    'producto_sku' => $ajuste['producto_sku'] ?? $ajuste['sku'] ?? 'N/A',
                    'almacen_nombre' => $ajuste['almacen_nombre'] ?? $ajuste['almacen'] ?? 'Sin almacén',
                    'tipo_operacion' => $ajuste['tipo_operacion'] ?? $ajuste['tipo'] ?? 'AJUSTE',
                    'tipo_ajuste_label' => $this->mapearTipoMovimiento($ajuste['tipo_operacion'] ?? $ajuste['tipo'] ?? 'AJUSTE'),
                    'cantidad' => (float)($ajuste['cantidad'] ?? 0),
                    'cantidad_anterior' => (float)($ajuste['cantidad_anterior'] ?? 0),
                    'cantidad_posterior' => (float)($ajuste['cantidad_posterior'] ?? 0),
                    'observacion' => $ajuste['observacion'] ?? '-',
                    'usuario' => $ajuste['usuario'] ?? auth()->user()->name ?? 'Sistema',
                ];
            }, $ajustes);

            // Normalizar cabecera si existe
            $cabeceraFormato = [];
            if ($cabecera && is_array($cabecera)) {
                $cabeceraFormato = [
                    'id' => $cabecera['id'] ?? 'N/A',
                    'numero' => $cabecera['numero'] ?? 'N/A',
                    'almacen_nombre' => $cabecera['almacen_nombre'] ?? $almacenFiltro ?? 'N/A',
                    'usuario' => $cabecera['usuario'] ?? auth()->user()->name ?? 'Sistema',
                    'fecha_creacion' => $cabecera['fecha_creacion'] ?? now(),
                    'cantidad_productos' => $cabecera['cantidad_productos'] ?? 0,
                    'cantidad_entradas' => $cabecera['cantidad_entradas'] ?? 0,
                    'cantidad_salidas' => $cabecera['cantidad_salidas'] ?? 0,
                    'observacion' => $cabecera['observacion'] ?? '',
                    'estado' => $cabecera['estado'] ?? 'procesado',
                ];
            }

            // Guardar en sesión
            session([
                'ajustes_impresion'                => $ajustesNormalizados,
                'almacen_filtro_impresion'         => $almacenFiltro,
                'tipo_ajuste_filtro_impresion'     => $tipoAjusteFiltro,
                'cabecera_impresion'               => $cabeceraFormato,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Ajustes preparados para impresión',
                'cantidad_ajustes' => count($ajustesNormalizados),
            ]);

        } catch (\Exception $e) {
            Log::error('❌ [InventarioController::prepararImpresionAjustes] Error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al preparar impresión: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Anular un ajuste de inventario y revertir todos sus movimientos
     * POST /api/inventario/ajuste/{id}/anular
     */
    public function anularAjuste(Request $request, AjusteInventario $ajuste): JsonResponse
    {
        try {
            // 1. Validar que solo admin pueda anular
            if (!auth()->user()->hasRole('admin')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sin permisos para anular ajustes',
                ], 403);
            }

            // 2. No anular si ya está anulado
            if ($ajuste->estado === AjusteInventario::ESTADO_ANULADO) {
                return response()->json([
                    'success' => false,
                    'message' => 'El ajuste ya está anulado',
                ], 422);
            }

            $motivo = $request->input('motivo', '');
            $movimientoService = new \App\Services\Stock\MovimientoInventarioService();

            DB::transaction(function () use ($ajuste, $motivo, $movimientoService) {
                // 3. Cargar movimientos con relaciones
                $ajuste->load('movimientos.stockProducto.producto', 'almacen');

                // Agrupar movimientos por producto para registrar un movimiento agrupado por producto
                $movimientosPorProducto = [];

                foreach ($ajuste->movimientos as $movimiento) {
                    $stockProducto = $movimiento->stockProducto;
                    $producto = $stockProducto->producto;
                    $productoId = $producto->id;

                    if (!isset($movimientosPorProducto[$productoId])) {
                        $movimientosPorProducto[$productoId] = [
                            'producto_id' => $productoId,
                            'producto' => $producto,
                            'almacen_id' => $ajuste->almacen_id,
                            'movimientos' => [],
                            'cantidad_total' => 0,
                            'totales_previos_producto_capturados' => false,
                            'cantidad_total_anterior' => 0,
                            'cantidad_disponible_anterior' => 0,
                            'cantidad_reservada_anterior' => 0,
                        ];

                        // ✅ CORREGIDO (2026-04-05): Capturar totales del PRODUCTO ANTES en la primera iteración
                        $movimientosPorProducto[$productoId]['cantidad_total_anterior'] = (float) \App\Models\StockProducto::where('producto_id', $productoId)
                            ->where('almacen_id', $ajuste->almacen_id)
                            ->sum('cantidad');

                        $movimientosPorProducto[$productoId]['cantidad_disponible_anterior'] = (float) \App\Models\StockProducto::where('producto_id', $productoId)
                            ->where('almacen_id', $ajuste->almacen_id)
                            ->sum('cantidad_disponible');

                        $movimientosPorProducto[$productoId]['cantidad_reservada_anterior'] = (float) \App\Models\StockProducto::where('producto_id', $productoId)
                            ->where('almacen_id', $ajuste->almacen_id)
                            ->sum('cantidad_reservada');

                        $movimientosPorProducto[$productoId]['totales_previos_producto_capturados'] = true;
                    }

                    // Capturar valores ANTES (por lote)
                    $cantidadTotalAntes = (float) $stockProducto->cantidad;
                    $cantidadDisponibleAntes = (float) $stockProducto->cantidad_disponible;
                    $cantidadReservadaAntes = (float) $stockProducto->cantidad_reservada;

                    // Determinar tipo inverso y cantidad inversa
                    if ($movimiento->tipo === MovimientoInventario::TIPO_ENTRADA_AJUSTE) {
                        // Si fue entrada, crear salida inversa
                        $tipoInverso = MovimientoInventario::TIPO_SALIDA_AJUSTE;
                        $cantidadInversa = -abs($movimiento->cantidad);
                        // ✅ REVERTIR ENTRADA: restar de cantidad Y cantidad_disponible
                        $stockProducto->decrement('cantidad', abs($movimiento->cantidad));
                        $stockProducto->decrement('cantidad_disponible', abs($movimiento->cantidad));
                    } else {
                        // Si fue salida, crear entrada inversa
                        $tipoInverso = MovimientoInventario::TIPO_ENTRADA_AJUSTE;
                        $cantidadInversa = abs($movimiento->cantidad);
                        // ✅ REVERTIR SALIDA: sumar a cantidad Y cantidad_disponible
                        $stockProducto->increment('cantidad', abs($movimiento->cantidad));
                        $stockProducto->increment('cantidad_disponible', abs($movimiento->cantidad));
                    }

                    // Capturar valores DESPUÉS
                    $stockProducto->refresh();
                    $cantidadTotalDespues = (float) $stockProducto->cantidad;
                    $cantidadDisponibleDespues = (float) $stockProducto->cantidad_disponible;
                    $cantidadReservadaDespues = (float) $stockProducto->cantidad_reservada;

                    // Acumular cantidad total inversa
                    $movimientosPorProducto[$productoId]['cantidad_total'] += $cantidadInversa;

                    $movimientosPorProducto[$productoId]['movimientos'][] = [
                        'stock_producto_id' => $stockProducto->id,
                        'lote' => $stockProducto->lote,
                        'cantidad' => $cantidadInversa,
                        'cantidad_total_anterior' => $cantidadTotalAntes,
                        'cantidad_total_posterior' => $cantidadTotalDespues,
                        'cantidad_disponible_anterior' => $cantidadDisponibleAntes,
                        'cantidad_disponible_posterior' => $cantidadDisponibleDespues,
                        'cantidad_reservada_anterior' => $cantidadReservadaAntes,
                        'cantidad_reservada_posterior' => $cantidadReservadaDespues,
                    ];
                }

                // ✅ CORREGIDO (2026-04-05): Capturar totales del PRODUCTO DESPUÉS para cada producto
                foreach ($movimientosPorProducto as &$productoData) {
                    $productoData['cantidad_total_posterior'] = (float) \App\Models\StockProducto::where('producto_id', $productoData['producto_id'])
                        ->where('almacen_id', $productoData['almacen_id'])
                        ->sum('cantidad');

                    $productoData['cantidad_disponible_posterior'] = (float) \App\Models\StockProducto::where('producto_id', $productoData['producto_id'])
                        ->where('almacen_id', $productoData['almacen_id'])
                        ->sum('cantidad_disponible');

                    $productoData['cantidad_reservada_posterior'] = (float) \App\Models\StockProducto::where('producto_id', $productoData['producto_id'])
                        ->where('almacen_id', $productoData['almacen_id'])
                        ->sum('cantidad_reservada');
                }
                unset($productoData);

                // ✅ Registrar movimientos agrupados por producto usando el servicio
                foreach ($movimientosPorProducto as $productoData) {
                    $movimientoService->registrarMovimientoAgrupado(
                        $productoData['producto_id'],
                        $productoData['almacen_id'],
                        MovimientoInventario::TIPO_AJUSTE, // Tipo genérico para anulación
                        'ajuste_inventario',  // ✅ CORREGIDO (2026-04-05): Parámetro requerido
                        $productoData['cantidad_total'],
                        $ajuste->numero . '-REV',
                        $productoData['movimientos'],
                        [
                            // 'referencia_tipo' => 'ajuste_inventario',  // ← Movido a parámetro directo
                            'referencia_id' => $ajuste->id,
                            // ✅ CORREGIDO (2026-04-05): Pasar totales del PRODUCTO COMPLETO
                            'totales_previos' => [
                                'cantidad_total_anterior' => $productoData['cantidad_total_anterior'],
                                'cantidad_disponible_anterior' => $productoData['cantidad_disponible_anterior'],
                                'cantidad_reservada_anterior' => $productoData['cantidad_reservada_anterior'],
                            ],
                            'totales_posteriores' => [
                                'cantidad_total_posterior' => $productoData['cantidad_total_posterior'],
                                'cantidad_disponible_posterior' => $productoData['cantidad_disponible_posterior'],
                                'cantidad_reservada_posterior' => $productoData['cantidad_reservada_posterior'],
                            ],
                            'observacion_extra' => [
                                'ajuste_numero' => $ajuste->numero,
                                'motivo_anulacion' => $motivo,
                                'usuario_anulacion' => auth()->user()->name,
                            ],
                        ]
                    );
                }

                // 4. Actualizar el ajuste maestro
                $ajuste->update([
                    'estado' => AjusteInventario::ESTADO_ANULADO,
                    'motivo_anulacion' => $motivo,
                    'user_anulacion_id' => auth()->id(),
                    'fecha_anulacion' => now(),
                    'observacion' => ($ajuste->observacion ? $ajuste->observacion . ' | ' : '') .
                        '[ANULADO] por: ' . auth()->user()->name . ' - ' . now()->format('d/m/Y H:i') .
                        ($motivo ? " - Motivo: $motivo" : ''),
                ]);

                Log::info('✅ [InventarioController::anularAjuste] Ajuste anulado exitosamente con servicio centralizado', [
                    'ajuste_id' => $ajuste->id,
                    'ajuste_numero' => $ajuste->numero,
                    'user_id' => auth()->id(),
                    'motivo' => $motivo,
                    'movimientos_revertidos' => $ajuste->movimientos->count(),
                    'productos_afectados' => count($movimientosPorProducto),
                ]);
            });

            return response()->json([
                'success' => true,
                'message' => 'Ajuste anulado exitosamente',
                'data' => [
                    'ajuste_id' => $ajuste->id,
                    'numero' => $ajuste->numero,
                    'estado' => $ajuste->fresh()->estado,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('❌ [InventarioController::anularAjuste] Error al anular ajuste', [
                'error' => $e->getMessage(),
                'ajuste_id' => $ajuste->id ?? null,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al anular ajuste: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Imprimir merma de inventario
     */
    public function imprimirMerma(Request $request, $id): Response | \Symfony\Component\HttpFoundation\Response
    {
        // Obtener merma por ID
        $merma = MermaInventario::find($id);

        if (!$merma) {
            abort(404, 'Merma no encontrada');
        }

        // Cargar relaciones
        $merma->load([
            'movimientos' => function ($query) {
                $query->with([
                    'stockProducto' => function ($sq) {
                        $sq->with([
                            'producto' => function ($pq) {
                                // Cargar precios con su tipo para obtener el precio COSTO
                                $pq->with([
                                    'precios' => function ($prq) {
                                        $prq->with('tipoPrecio');
                                    },
                                ]);
                            },
                            'almacen',
                        ]);
                    },
                    'user',
                ]);
            },
            'almacen',
            'user',
        ]);

        // Transformar movimientos a detalles con costos
        $detalles = $merma->movimientos->map(function ($movimiento) {
            $producto = $movimiento->stockProducto?->producto;
            $stockProducto = $movimiento->stockProducto;

            // Obtener precio COSTO desde precios_producto
            $precioCosto = 0;
            if ($producto) {
                // Buscar el precio de tipo COSTO
                $precioCostoObj = $producto->obtenerPrecio('COSTO');
                if ($precioCostoObj) {
                    $precioCosto = (float) $precioCostoObj->precio;
                } elseif ($producto->precio_compra) {
                    // Fallback a precio_compra si existe
                    $precioCosto = (float) $producto->precio_compra;
                } elseif ($producto->precio_venta) {
                    // Último fallback a precio_venta
                    $precioCosto = (float) $producto->precio_venta;
                }
            }

            $cantidadAbs = abs($movimiento->cantidad);
            $costoTotal = $cantidadAbs * $precioCosto;

            \Log::debug('✅ [ImprimirMerma] Precio COSTO Obtenido', [
                'producto_id' => $producto?->id,
                'producto_nombre' => $producto?->nombre,
                'precio_costo_tabla' => $precioCosto,
                'cantidad' => $cantidadAbs,
                'costo_total' => $costoTotal,
            ]);

            return [
                'id' => $movimiento->id,
                'cantidad' => $cantidadAbs,
                'costo_unitario' => (float) $precioCosto,
                'costo_total' => (float) $costoTotal,
                'lote' => $movimiento->numero_documento ?? null,
                'producto' => [
                    'id' => $producto?->id ?? 0,
                    'nombre' => $producto?->nombre ?? 'Producto desconocido',
                    'sku' => $producto?->sku ?? 'SIN-SKU',
                    'codigo' => $producto?->codigo ?? null,
                ],
            ];
        })->toArray();

        // Calcular totales
        $totalCosto = 0;
        $totalCantidad = 0;
        foreach ($merma->movimientos as $mov) {
            $totalCantidad += abs($mov->cantidad);

            $producto = $mov->stockProducto?->producto;
            $precioCosto = 0;

            if ($producto) {
                // Obtener precio COSTO desde precios_producto
                $precioCostoObj = $producto->obtenerPrecio('COSTO');
                if ($precioCostoObj) {
                    $precioCosto = (float) $precioCostoObj->precio;
                } elseif ($producto->precio_compra) {
                    $precioCosto = (float) $producto->precio_compra;
                } elseif ($producto->precio_venta) {
                    $precioCosto = (float) $producto->precio_venta;
                }
            }

            $totalCosto += abs($mov->cantidad) * $precioCosto;
        }

        // Transformar merma para la vista
        $mermaTransformada = [
            'id' => $merma->id,
            'numero' => $merma->numero,
            'fecha' => $merma->created_at,
            'almacen' => [
                'id' => $merma->almacen?->id ?? null,
                'nombre' => $merma->almacen?->nombre ?? 'Sin almacén',
            ],
            'usuario' => [
                'id' => $merma->user?->id ?? 0,
                'name' => $merma->user?->name ?? 'Sistema',
            ],
            'tipo_merma' => (string) $merma->tipo_merma,
            'motivo' => $merma->observacion ?? '',
            'observaciones' => $merma->observacion ?? '',
            'total_productos' => $merma->cantidad_productos ?? count($detalles),
            'total_cantidad' => (int) $totalCantidad,
            'total_costo' => (float) $totalCosto,
            'estado' => strtoupper($merma->estado ?? 'PENDIENTE'),
            'detalles' => $detalles,
        ];

        // Determinar formato
        $formato = $request->input('formato', 'A4');
        $accion = $request->input('accion', 'stream');

        // Seleccionar view según formato
        $viewMap = [
            'A4' => 'impresion.inventario.mermas-a4',
            'TICKET_80' => 'impresion.inventario.mermas-ticket-80',
            'TICKET_58' => 'impresion.inventario.mermas-ticket-58',
        ];

        $view = $viewMap[$formato] ?? $viewMap['A4'];

        // Renderizar y generar PDF
        try {
            // Obtener empresa para mostrar en el documento
            $empresa = auth()->user()->empresa ?? \App\Models\Empresa::first();

            $html = view($view, [
                'merma' => $mermaTransformada,
                'empresa' => $empresa,
            ])->render();
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html);

            if ($accion === 'download') {
                return $pdf->download("merma-{$merma->numero}.pdf");
            }

            return $pdf->stream();
        } catch (\Exception $e) {
            Log::error('❌ [ImprimirMerma] Error al generar PDF', [
                'error' => $e->getMessage(),
                'merma_id' => $id,
            ]);

            abort(500, 'Error al generar documento de impresión');
        }
    }
}
