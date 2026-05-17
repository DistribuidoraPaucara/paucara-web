<?php
namespace App\Http\Controllers;

use App\Http\Requests\StoreCompraRequest;
use App\Http\Requests\UpdateCompraRequest;
use App\Models\Compra;
use App\Models\CuentaPorPagar;
use App\Models\DetalleCompra;
use App\Models\EstadoDocumento;
use App\Models\Moneda;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\Proveedor;
use App\Models\TipoPago;
use App\Services\Compra\CompraDistribucionService;
use App\Services\DetectarCambiosPrecioService;
use App\Services\ExcelExportService;
use App\Services\ImpresionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CompraController extends Controller
{
    private ExcelExportService $excelExportService;
    private ImpresionService $impresionService;
    private CompraDistribucionService $compraDistribucionService;

    public function __construct(
        ExcelExportService $excelExportService,
        ImpresionService $impresionService,
        CompraDistribucionService $compraDistribucionService
    )
    {
        $this->excelExportService = $excelExportService;
        $this->impresionService   = $impresionService;
        $this->compraDistribucionService = $compraDistribucionService;

        $this->middleware('permission:compras.index')->only('index');
        $this->middleware('permission:compras.show')->only('show');
        $this->middleware('permission:compras.store')->only('store');
        $this->middleware('permission:compras.update')->only('update');
        $this->middleware('permission:compras.destroy')->only('destroy');

        // ✅ REMOVIDO: Las compras no requieren caja abierta
        // $this->middleware('caja.abierta')->only(['store']);
    }

    public function index(Request $request)
    {
        // Validar filtros
        $filtros = $request->validate([
            'q'                   => ['nullable', 'string', 'max:255'],
            'id'                  => ['nullable', 'integer'],
            'proveedor_id'        => ['nullable', 'exists:proveedores,id'],
            'estado_documento_id' => ['nullable', 'exists:estados_documento,id'],
            'moneda_id'           => ['nullable', 'exists:monedas,id'],
            'tipo_pago_id'        => ['nullable', 'exists:tipos_pago,id'],
            'fecha_desde'         => ['nullable', 'date'],
            'fecha_hasta'         => ['nullable', 'date'],
            'per_page'            => ['nullable', 'integer', 'min:10', 'max:100'],
            'sort_by'             => ['nullable', 'string', 'in:numero,fecha,proveedor,total,created_at'],
            'sort_dir'            => ['nullable', 'string', 'in:asc,desc'],
        ]);

        $query = Compra::with(['proveedor', 'usuario', 'estadoDocumento', 'moneda', 'tipoPago']);

        // Filtro por ID de compra
        if (! empty($filtros['id'])) {
            $query->where('id', $filtros['id']);
        }

        // Filtro de búsqueda general
        if (! empty($filtros['q'])) {
            $searchTerm = $filtros['q'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('numero', 'ilike', "%{$searchTerm}%")
                    ->orWhere('numero_factura', 'ilike', "%{$searchTerm}%")
                    ->orWhere('observaciones', 'ilike', "%{$searchTerm}%")
                    ->orWhereHas('proveedor', function ($qq) use ($searchTerm) {
                        $qq->where('nombre', 'ilike', "%{$searchTerm}%");
                    });
            });
        }

        // Filtros específicos
        if (! empty($filtros['proveedor_id'])) {
            $query->where('proveedor_id', $filtros['proveedor_id']);
        }

        if (! empty($filtros['estado_documento_id'])) {
            $query->where('estado_documento_id', $filtros['estado_documento_id']);
        }

        if (! empty($filtros['moneda_id'])) {
            $query->where('moneda_id', $filtros['moneda_id']);
        }

        if (! empty($filtros['tipo_pago_id'])) {
            $query->where('tipo_pago_id', $filtros['tipo_pago_id']);
        }

        // Filtros de fecha
        if (! empty($filtros['fecha_desde'])) {
            $query->whereDate('fecha', '>=', $filtros['fecha_desde']);
        }

        if (! empty($filtros['fecha_hasta'])) {
            $query->whereDate('fecha', '<=', $filtros['fecha_hasta']);
        }

        // Ordenamiento
        $sortBy  = $filtros['sort_by'] ?? 'created_at';
        $sortDir = $filtros['sort_dir'] ?? 'desc';

        if ($sortBy === 'proveedor') {
            $query->leftJoin('proveedores', 'compras.proveedor_id', '=', 'proveedores.id')
                ->orderBy('proveedores.nombre', $sortDir)
                ->select('compras.*');
        } else {
            $query->orderBy($sortBy, $sortDir);
        }

        // Paginación
        $perPage = $filtros['per_page'] ?? 15;
        $compras = $query->paginate($perPage)->withQueryString();

        // Estadísticas para el dashboard
        $estadisticas = $this->calcularEstadisticas($filtros);

        // Datos para filtros - Mostrar todos los elementos activos disponibles
        $datosParaFiltros = [
            'proveedores' => Proveedor::where('activo', true)
                ->orderBy('nombre')
                ->get(['id', 'nombre']),
            'estados'     => EstadoDocumento::where('activo', true)
                ->orderBy('nombre')
                ->get(['id', 'nombre']),
            'monedas'     => Moneda::where('activo', true)
                ->orderBy('codigo')
                ->get(['id', 'codigo', 'simbolo']),
            'tipos_pago'  => TipoPago::orderBy('nombre')
                ->get(['id', 'codigo', 'nombre']),
        ];

        return Inertia::render('compras/index', [
            'compras'          => $compras,
            'filtros'          => $filtros,
            'estadisticas'     => $estadisticas,
            'datosParaFiltros' => $datosParaFiltros,
        ]);
    }

    public function create()
    {
        // Debug inicial
        Log::info('CompraController::create - MÉTODO EJECUTADO');

        $tipos_pago = TipoPago::orderBy('nombre')->get(['id', 'codigo', 'nombre']);
        Log::info('CompraController::create - tipos_pago obtenidos', [
            'count' => $tipos_pago->count(),
            'data'  => $tipos_pago->toArray(),
        ]);

        $data = [
            'tipos_pago'  => $tipos_pago,
            'selectores'  => [
                'tipospagos' => TipoPago::all(),
            ],
            'proveedores' => Proveedor::where('activo', true)->orderBy('nombre')->get(['id', 'nombre', 'email']),
            'productos'   => Producto::with([
                'precios'      => function ($query) {
                    $query->where('activo', true)
                        ->with(['tipoPrecio:id,codigo,nombre']);
                },
                'categoria:id,nombre',
                'marca:id,nombre',
                'unidad:id,codigo,nombre',
                'codigosBarra' => function ($query) {
                    $query->where('activo', true)
                        ->select('id', 'producto_id', 'codigo', 'es_principal');
                },
            ])
                ->where('activo', true)
                ->orderBy('nombre')
                ->limit(10)  // ✨ NUEVO: Limitar inicial a 10 productos (búsqueda dinámica después)
                ->get()
                ->map(function ($producto) {
                    // Mapear precios por tipo
                    $preciosMapeados = [];
                    foreach ($producto->precios as $precio) {
                        $codigo = $precio->tipoPrecio?->codigo;
                        if ($codigo) {
                            $preciosMapeados[$codigo] = $precio->precio;
                        }
                    }

                    // Obtener todos los códigos de barra activos
                    $codigosBarra = $producto->codigosBarra->pluck('codigo')->toArray();

                    // Obtener código principal o usar el de la tabla productos
                    $codigoPrincipal = $producto->codigosBarra->where('es_principal', true)->first()?->codigo
                        ?: ($producto->codigo_qr ?: $producto->codigo_barras);

                    return [
                        'id'             => $producto->id,
                        'nombre'         => $producto->nombre,
                        'codigo'         => $codigoPrincipal,
                        'codigo_barras'  => $codigoPrincipal,
                        'codigos_barras' => $codigosBarra, // Array con todos los códigos de barra
                        'precio_compra'  => $preciosMapeados['COSTO'] ?? 0,
                        'precio_venta'   => $preciosMapeados['VENTA_PUBLICO'] ?? 0,
                        'categoria'      => $producto->categoria?->nombre,
                        // ✅ ARREGLADO 2026-03-06: Retornar objetos completos, no solo nombres (para método create)
                        'marca'          => $producto->marca ? [
                            'id'   => $producto->marca->id,
                            'nombre' => $producto->marca->nombre
                        ] : null,
                        'unidad'         => $producto->unidad ? [
                            'id'    => $producto->unidad->id,
                            'codigo' => $producto->unidad->codigo,
                            'nombre' => $producto->unidad->nombre
                        ] : null,
                        'stock'          => $producto->stockTotal(),
                        'stock_minimo'   => $producto->stock_minimo,
                        'stock_maximo'   => $producto->stock_maximo,
                    ];
                }),

            'monedas'     => Moneda::where('activo', true)->orderBy('codigo')->get(['id', 'codigo', 'nombre', 'simbolo']),
            'estados'     => EstadoDocumento::orderBy('nombre')->get(['id', 'nombre']),
            'almacenes'   => \App\Models\Almacen::where('activo', true)->orderBy('nombre')->get(['id', 'nombre', 'activo']),
        ];

        Log::info('CompraController::create - datos finales', [
            'proveedores_count' => $data['proveedores']->count(),
            'productos_count'   => $data['productos']->count(),
            'monedas_count'     => $data['monedas']->count(),
            'estados_count'     => $data['estados']->count(),
            'tipos_pago_count'  => $data['tipos_pago']->count(),
            'almacenes_count'   => $data['almacenes']->count(),
        ]);

        return Inertia::render('compras/create', $data);
    }

    public function show($id)
    {
        $compra = Compra::with([
            'proveedor',
            'usuario',
            'estadoDocumento',
            'moneda',
            'tipoPago',
            'detalles.producto.codigosBarra',
            'almacen'
        ])->findOrFail($id);

        // ✅ NUEVO 2026-03-24: Cargar movimientos de inventario para cada detalle
        $detalles = $compra->detalles->map(function ($detalle) use ($compra) {
            $movimiento = \App\Models\MovimientoInventario::where('numero_documento', $compra->numero)
                ->where('tipo', 'ENTRADA_COMPRA')
                ->whereHas('stockProducto', function ($q) use ($detalle) {
                    $q->where('producto_id', $detalle->producto_id);
                })
                ->first();

            return [
                'id' => $detalle->id,
                'compra_id' => $detalle->compra_id,
                'producto_id' => $detalle->producto_id,
                'producto' => $detalle->producto,
                'cantidad' => $detalle->cantidad,
                'precio_unitario' => $detalle->precio_unitario,
                'subtotal' => $detalle->subtotal,
                'lote' => $detalle->lote,
                'fecha_vencimiento' => $detalle->fecha_vencimiento,
                'cantidad_anterior' => $movimiento?->cantidad_anterior ?? null,
                'cantidad_posterior' => $movimiento?->cantidad_posterior ?? null,
            ];
        });

        // ✅ NUEVO: Detectar si es solicitud API o web
        if (request()->wantsJson()) {
            return response()->json([
                'data' => [
                    'id' => $compra->id,
                    'numero' => $compra->numero,
                    'proveedor_id' => $compra->proveedor_id,
                    'proveedor' => $compra->proveedor,
                    'fecha' => $compra->fecha,
                    'total' => $compra->total,
                    'usuario' => $compra->usuario,
                    'estadoDocumento' => $compra->estadoDocumento,
                    'moneda' => $compra->moneda,
                    'tipoPago' => $compra->tipoPago,
                    'detalles' => $detalles,
                ]
            ]);
        }

        return Inertia::render('compras/show', [
            'compra' => array_merge($compra->toArray(), [
                'detalles' => $detalles,
            ]),
        ]);
    }

    public function edit($id)
    {
        // ✅ NUEVO 2026-03-06: Cargar detalles con producto y sus relaciones (marca, unidad, codigosBarra, stock)
        $compra = Compra::with([
            'detalles.producto.marca:id,nombre',
            'detalles.producto.unidad:id,codigo,nombre',
            'detalles.producto.codigosBarra:id,producto_id,codigo,es_principal',
            'detalles.producto.stock:id,producto_id,almacen_id,cantidad,cantidad_disponible',
            'estadoDocumento',
            'tipoPago',
            'moneda',
            'proveedor',
            'usuario',
            'almacen'
        ])->findOrFail($id);

        Log::info('CompraController::edit() - Compra cargada', [
            'compra_id'              => $compra->id,
            'estado_documento_id'    => $compra->estado_documento_id,
            'estadoDocumento loaded' => $compra->estadoDocumento !== null,
            'estadoDocumento nombre' => $compra->estadoDocumento?->nombre ?? 'NULL',
        ]);

        // ✅ NUEVO 2026-03-06: Mapear detalles con información completa del producto
        $detallesMapeados = $compra->detalles->map(function ($detalle) {
            $producto = $detalle->producto;

            // Obtener código principal: código de barras principal, o null
            $codigosBarra = $producto->codigosBarra ?? collect();
            $codigoPrincipal = $codigosBarra->where('es_principal', true)->where('activo', true)->first()?->codigo ?? null;
            $sku = $producto->sku ?? null;

            // ✅ NUEVO 2026-03-06: Obtener stock disponible (totalizado de todos los almacenes)
            $stockProductos = $producto->stock ?? collect();
            $cantidadTotal = $stockProductos->sum('cantidad');
            $cantidadDisponible = $stockProductos->sum('cantidad_disponible');

            return [
                'id'                  => $detalle->id,
                'producto_id'         => $detalle->producto_id,
                'cantidad'            => $detalle->cantidad,
                'precio_unitario'     => $detalle->precio_unitario,
                'descuento'           => $detalle->descuento,
                'subtotal'            => $detalle->subtotal,
                'lote'                => $detalle->lote,
                'fecha_vencimiento'   => $detalle->fecha_vencimiento,
                // ✅ NUEVO 2026-03-06: Incluir producto con todos los campos
                'producto'            => [
                    'id'                  => $producto->id,
                    'nombre'              => $producto->nombre,
                    'sku'                 => $sku,
                    'codigo'              => $codigoPrincipal,
                    'codigo_barras'       => $codigoPrincipal,
                    'precio_venta'        => $producto->precio_venta,
                    'precio_compra'       => $producto->precio_compra,
                    // ✅ NUEVO 2026-03-06: Incluir marca y unidad como objetos completos
                    'marca'               => $producto->marca ? [
                        'id'   => $producto->marca->id,
                        'nombre' => $producto->marca->nombre
                    ] : null,
                    'unidad'              => $producto->unidad ? [
                        'id'    => $producto->unidad->id,
                        'codigo' => $producto->unidad->codigo,
                        'nombre' => $producto->unidad->nombre
                    ] : null,
                    // ✅ NUEVO: Stock disponible totalizado
                    'stock_total'         => $cantidadTotal,
                    'stock_disponible'    => $cantidadDisponible,
                ],
            ];
        })->toArray();

        // ✅ NUEVO 2026-03-06: Log para verificar estructura de detalles.producto
        if (count($detallesMapeados) > 0) {
            Log::info('CompraController::edit() - Estructura del primer detalle mapeado:', [
                'detalle_id'              => $detallesMapeados[0]['id'],
                'producto_id'             => $detallesMapeados[0]['producto_id'],
                'producto_nombre'         => $detallesMapeados[0]['producto']['nombre'],
                'producto_sku'            => $detallesMapeados[0]['producto']['sku'],
                'producto_codigo'         => $detallesMapeados[0]['producto']['codigo'],
                'producto_codigo_barras'  => $detallesMapeados[0]['producto']['codigo_barras'],
                'stock_total'             => $detallesMapeados[0]['producto']['stock_total'],
                'stock_disponible'        => $detallesMapeados[0]['producto']['stock_disponible'],
                'producto_marca'          => $detallesMapeados[0]['producto']['marca'],
                'producto_unidad'         => $detallesMapeados[0]['producto']['unidad'],
            ]);
        } else {
            Log::warning('CompraController::edit() - No hay detalles mapeados para la compra', [
                'compra_id' => $compra->id,
            ]);
        }

        return Inertia::render('compras/create', [
            'compra'      => [
                 ...$compra->toArray(),
                'estadoDocumento' => $compra->estadoDocumento?->toArray(),
                'detalles'        => $detallesMapeados, // ✅ NUEVO 2026-03-06: Usar detalles mapeados
            ],
            'tipos_pago'  => TipoPago::orderBy('nombre')->get(['id', 'codigo', 'nombre']),
            'proveedores' => Proveedor::where('activo', true)->orderBy('nombre')->get(['id', 'nombre', 'email']),
            'productos'   => Producto::with([
                'precios'      => function ($query) {
                    $query->where('activo', true)
                        ->with(['tipoPrecio:id,codigo,nombre']);
                },
                'categoria:id,nombre',
                'marca:id,nombre',
                'unidad:id,codigo,nombre',
                'codigosBarra' => function ($query) {
                    $query->where('activo', true)
                        ->select('id', 'producto_id', 'codigo', 'es_principal');
                },
            ])
                ->where('activo', true)
                ->orderBy('nombre')
                ->limit(10)  // ✨ NUEVO: Limitar inicial a 10 productos (búsqueda dinámica después)
                ->get()
                ->map(function ($producto) {
                    // Mapear precios por tipo
                    $preciosMapeados = [];
                    foreach ($producto->precios as $precio) {
                        $codigo = $precio->tipoPrecio?->codigo;
                        if ($codigo) {
                            $preciosMapeados[$codigo] = $precio->precio;
                        }
                    }

                    // Obtener todos los códigos de barra activos
                    $codigosBarra = $producto->codigosBarra->pluck('codigo')->toArray();

                    // Obtener código principal o usar el de la tabla productos
                    $codigoPrincipal = $producto->codigosBarra->where('es_principal', true)->first()?->codigo
                        ?: ($producto->codigo_qr ?: $producto->codigo_barras);

                    return [
                        'id'             => $producto->id,
                        'nombre'         => $producto->nombre,
                        'codigo'         => $codigoPrincipal,
                        'codigo_barras'  => $codigoPrincipal,
                        'codigos_barras' => $codigosBarra, // Array con todos los códigos de barra
                        'precio_compra'  => $preciosMapeados['COSTO'] ?? 0,
                        'precio_venta'   => $preciosMapeados['VENTA_PUBLICO'] ?? 0,
                        'categoria'      => $producto->categoria?->nombre,
                        // ✅ ARREGLADO 2026-03-06: Retornar objetos completos, no solo nombres (para método edit)
                        'marca'          => $producto->marca ? [
                            'id'   => $producto->marca->id,
                            'nombre' => $producto->marca->nombre
                        ] : null,
                        'unidad'         => $producto->unidad ? [
                            'id'    => $producto->unidad->id,
                            'codigo' => $producto->unidad->codigo,
                            'nombre' => $producto->unidad->nombre
                        ] : null,
                        'stock'          => $producto->stockTotal(),
                        'stock_minimo'   => $producto->stock_minimo,
                        'stock_maximo'   => $producto->stock_maximo,
                    ];
                }),
            'monedas'     => Moneda::where('activo', true)->orderBy('codigo')->get(['id', 'codigo', 'nombre', 'simbolo']),
            'estados'     => EstadoDocumento::orderBy('nombre')->get(['id', 'nombre']),
            'almacenes'   => \App\Models\Almacen::where('activo', true)->orderBy('nombre')->get(['id', 'nombre', 'activo']),
        ]);
    }

    public function store(StoreCompraRequest $request)
    {
        Log::info('CompraController::store() - INICIO - Solicitud recibida', [
            'proveedor_id'   => $request->input('proveedor_id'),
            'fecha'          => $request->input('fecha'),
            'total'          => $request->input('total'),
            'detalles_count' => count($request->input('detalles', [])),
        ]);

        $data = $request->validated();

        Log::info('CompraController::store() - Validación exitosa, datos listos', [
            'numero_detalles' => count($data['detalles'] ?? []),
        ]);

        try {
            DB::beginTransaction();

            // ✅ NUEVO 2026-03-19: El número de compra será COMP{fecha}-{id}
            // Primero crear la compra con un número temporal
            $data['numero'] = 'TMP-' . time(); // Temporal placeholder
            $compra = Compra::create($data);

            // Generar número usando el ID: COMP20260319-28
            $fecha = $compra->created_at->format('Ymd');
            $numeroFinal = "COMP{$fecha}-{$compra->id}";

            // Actualizar con el número final
            $compra->update(['numero' => $numeroFinal]);

            Log::info('CompraController::store() - Compra creada con número = COMP{fecha}-{id}', [
                'compra_id' => $compra->id,
                'compra_numero' => $compra->numero,
            ]);

            // Obtener estados para validación
            $estadoAprobado = \App\Models\EstadoDocumento::where('codigo', 'APROBADO')->first();
            $estadoRecibido = \App\Models\EstadoDocumento::where('codigo', 'FACTURADO')->first();

            foreach ($data['detalles'] as $detalle) {
                // ✅ DEBUG: Log cantidad ANTES de crear detalle
                Log::info('🔍 CompraController::store() - DETALLE ANTES DE CREAR', [
                    'cantidad_raw' => $detalle['cantidad'],
                    'cantidad_tipo' => gettype($detalle['cantidad']),
                    'producto_id' => $detalle['producto_id'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'subtotal' => $detalle['subtotal'],
                ]);

                $detalleCompra = $compra->detalles()->create($detalle);

                // ✅ CRITICAL FIX 2026-03-24: REFRESH el detalle para obtener el valor correcto del DB
                // El cast float() en memoria devuelve 1, pero el DB tiene el valor correcto (100)
                $detalleCompra->refresh();

                // ✅ DEBUG: Log cantidad DESPUÉS de crear detalle
                Log::info('🔍 CompraController::store() - DETALLE DESPUÉS DE CREAR', [
                    'detalle_id' => $detalleCompra->id,
                    'cantidad_guardada' => $detalleCompra->cantidad,
                    'cantidad_tipo' => gettype($detalleCompra->cantidad),
                ]);
            }

            // ✅ REFACTORIZADO (2026-03-27): Registrar inventario AGRUPADO después de crear todos los detalles
            if ($compra->estado_documento_id == $estadoAprobado?->id || $compra->estado_documento_id == $estadoRecibido?->id) {
                $detallesParaInventario = $compra->detalles->map(function ($detalle) {
                    return [
                        'producto_id' => $detalle->producto_id,
                        'cantidad' => (float) $detalle->cantidad,
                        'lote' => $detalle->lote,
                        'fecha_vencimiento' => $detalle->fecha_vencimiento,
                    ];
                })->toArray();

                Log::info("Registrando inventario en store() - Usando CompraDistribucionService", [
                    'compra_numero'     => $compra->numero,
                    'cantidad_detalles' => count($detallesParaInventario),
                    'almacen_id'        => $data['almacen_id'] ?? null,
                ]);

                try {
                    $movimientosStock = $this->compraDistribucionService->registrarEntradaCompra(
                        detalles: $detallesParaInventario,
                        numeroCompra: $compra->numero,
                        almacenId: (int)($data['almacen_id'] ?? 1),
                        usuarioId: Auth::id() ?? 1
                    );

                    // ✅ Log con resumen agrupado (como ajustes, proformas, ventas)
                    $resumenPorProducto = [];
                    foreach ($movimientosStock as $movimiento) {
                        $detallesObservacion = json_decode($movimiento->observacion, true);
                        $resumenPorProducto[] = [
                            'producto_id' => $movimiento->numero_documento === $compra->numero ?
                                ($detallesObservacion['producto_id'] ?? 'N/A') : 'N/A',
                            'producto_nombre' => $detallesObservacion['producto_nombre'] ?? 'N/A',
                            'cantidad' => $detallesObservacion['cantidad_total'] ?? 0,
                            'cantidad_lotes' => $detallesObservacion['cantidad_lotes'] ?? 1,
                            'detalles_lotes' => $detallesObservacion['detalles_lotes'] ?? [],
                        ];
                    }

                    Log::info("✅ Inventario registrado (AGRUPADO por producto)", [
                        'compra_numero'        => $compra->numero,
                        'movimientos_creados'  => count($movimientosStock),
                        'productos_afectados'  => count($resumenPorProducto),
                        'resumen' => $resumenPorProducto,
                        'nota'                 => 'Movimientos AGRUPADOS por producto | Detalles por lote en observaciones',
                    ]);
                } catch (\Exception $e) {
                    Log::error('❌ Error al registrar inventario en store()', [
                        'compra_numero' => $compra->numero,
                        'error'         => $e->getMessage(),
                    ]);
                    throw $e;
                }
            }

            // ✅ NUEVO: Manejo de compras a CRÉDITO vs CONTADO
            // Cargar la relación tipoPago para verificar si es crédito
            $compra->load('tipoPago');
            $esCredito = $compra->tipoPago?->es_credito ?? false;

            Log::info('CompraController::store() - Tipo de pago evaluado', [
                'compra_numero'   => $compra->numero,
                'tipo_pago'       => $compra->tipoPago?->nombre,
                'es_credito'      => $esCredito,
                'estado_documento' => $compra->estadoDocumento?->nombre,
            ]);

            // ✅ Si es APROBADO o FACTURADO, procesar el pago
            if ($compra->estado_documento_id == $estadoAprobado?->id || $compra->estado_documento_id == $estadoRecibido?->id) {
                if ($esCredito) {
                    // 1️⃣ COMPRA A CRÉDITO: Crear CuentaPorPagar
                    $this->crearCuentaPorPagar($compra, $data['total']);

                    Log::info('CompraController::store() - Compra creada a CRÉDITO - CuentaPorPagar registrada', [
                        'compra_numero'   => $compra->numero,
                        'total'           => $data['total'],
                        'almacen_id'      => $data['almacen_id'] ?? null,
                    ]);
                }
            }

            DB::commit();

            $numeroGenerado = $compra->numero;
            $mensaje        = "Compra {$numeroGenerado} creada exitosamente";

            return redirect()->route('compras.index')
                ->with('success', $mensaje);

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error al crear compra', [
                'error' => $e->getMessage(),
                'data'  => $data,
            ]);

            return back()->withInput()
                ->withErrors(['error' => 'Error al crear la compra: ' . $e->getMessage()]);
        }
    }

    public function update(UpdateCompraRequest $request, $id)
    {
        $compra = Compra::findOrFail($id);
        $data   = $request->validated();

        // ✅ DEBUG 2026-03-19: Log completo de lo que recibimos
        Log::info('🔴 CompraController::update() - INICIANDO UPDATE', [
            'compra_id'              => $compra->id,
            'compra_numero'          => $compra->numero,
            'estado_documento_id'    => $compra->estado_documento_id,
            'detalles_count_actual'  => $compra->detalles()->count(),
            'detalles_enviados'      => isset($data['detalles']) ? count($data['detalles']) : 'NINGUNO',
            'data_keys'              => array_keys($data),
            'detalles_estructura'    => json_encode($data['detalles'] ?? [], JSON_PRETTY_PRINT),
        ]);

        Log::info('CompraController::update() - Datos validados recibidos', [
            'compra_id'        => $compra->id,
            'estado_anterior'  => $compra->estado_documento_id,
            'detalles_count'   => isset($data['detalles']) ? count($data['detalles']) : 0,
            'detalles_payload' => json_encode($data['detalles'] ?? null, JSON_PRETTY_PRINT),
        ]);

        try {
            DB::beginTransaction();

            // Guardar estado anterior para detectar cambios
            $estadoAnterior  = $compra->estado_documento_id;
            $estadoActual    = $compra->estadoDocumento?->nombre;
            $estadoAprobado  = \App\Models\EstadoDocumento::where('codigo', 'APROBADO')->first();
            $estadoRecibido  = \App\Models\EstadoDocumento::where('codigo', 'FACTURADO')->first();
            $estadoCancelado = \App\Models\EstadoDocumento::where('codigo', 'CANCELADO')->first();

            // ✅ Validación: BORRADOR y APROBADO pueden editar detalles (incluyendo lote y fecha_vencimiento)
            // FACTURADO+: solo lectura
            $estadoBorrador = \App\Models\EstadoDocumento::where('codigo', 'BORRADOR')->first();
            $estadoFacturado = \App\Models\EstadoDocumento::where('codigo', 'FACTURADO')->first();

            if (in_array($estadoAnterior, [$estadoFacturado?->id, $estadoCancelado?->id]) && isset($data['detalles'])) {
                throw new \Exception(
                    "No se pueden modificar los detalles de una compra en estado {$estadoActual}. " .
                    "Solo se pueden editar compras en estado BORRADOR o APROBADO."
                );
            }

            // ✅ NUEVO 2026-03-19: Validación de transiciones de estado permitidas
            // Obtener estado Anulado y Pendiente
            $estadoAnulado = \App\Models\EstadoDocumento::where('codigo', 'ANULADO')->first();
            $estadoPendiente = \App\Models\EstadoDocumento::where('codigo', 'PENDIENTE')->first();

            $estadoNuevo = $data['estado_documento_id'] ?? $estadoAnterior;

            // ✅ FIX 2026-03-19: Permitir mantener el estado actual (usuario solo edita datos)
            // Si el estado NO cambia, permitir la edición sin validar transiciones
            if ($estadoNuevo != $estadoAnterior) {
                // Mapeo de transiciones de estado permitidas (solo aplica si hay cambio de estado)
                $transicionesPermitidas = [
                    // BORRADOR: puede cambiar a Aprobado, Pendiente, o Anulado
                    $estadoBorrador?->id      => [$estadoAprobado?->id, $estadoPendiente?->id, $estadoAnulado?->id],
                    // PENDIENTE: puede cambiar a Aprobado o Anulado
                    $estadoPendiente?->id     => [$estadoAprobado?->id, $estadoAnulado?->id],
                    // APROBADO: puede cambiar a Facturado o Anulado (NO permitir cambiar a Aprobado nuevamente)
                    $estadoAprobado?->id      => [$estadoRecibido?->id, $estadoAnulado?->id],
                    // FACTURADO: puede cambiar a Cancelado o Anulado
                    $estadoRecibido?->id      => [$estadoCancelado?->id, $estadoAnulado?->id],
                    // CANCELADO: solo lectura
                    $estadoCancelado?->id     => [],
                    // ANULADO: solo lectura
                    $estadoAnulado?->id       => [],
                ];

                $transicionesValidas = $transicionesPermitidas[$estadoAnterior] ?? [];

                if (!in_array($estadoNuevo, $transicionesValidas)) {
                    $estadoActualNombre = $compra->estadoDocumento?->nombre ?? 'Desconocido';
                    $estadoNuevoNombre = EstadoDocumento::find($estadoNuevo)?->nombre ?? 'Desconocido';
                    Log::warning('CompraController::update() - Transición de estado no permitida', [
                        'compra_id' => $compra->id,
                        'estado_actual' => $estadoActualNombre,
                        'estado_solicitado' => $estadoNuevoNombre,
                        'transiciones_validas' => $transicionesValidas,
                    ]);
                    throw new \Exception(
                        "Transición de estado no permitida: {$estadoActualNombre} → {$estadoNuevoNombre}. " .
                        "Una compra {$estadoActualNombre} solo puede cambiar a: " .
                        implode(', ', EstadoDocumento::whereIn('id', $transicionesValidas)->pluck('nombre')->toArray()) . "."
                    );
                }
            } else {
                Log::info('CompraController::update() - Sin cambio de estado, permitiendo edición', [
                    'compra_id' => $compra->id,
                    'estado' => $compra->estadoDocumento?->nombre,
                ]);
            }

            // ✅ Validación: APROBADO+ no puede cambiar almacén (stock ya registrado)
            if (in_array($estadoAnterior, [$estadoAprobado?->id, $estadoRecibido?->id, $estadoCancelado?->id]) &&
                isset($data['almacen_id']) && $data['almacen_id'] != $compra->almacen_id) {
                throw new \Exception(
                    "No se puede cambiar el almacén de una compra en estado {$estadoActual}. " .
                    "El almacén ya fue asignado cuando se aprobó la compra."
                );
            }

            // ✅ Validación: FACTURADO+ no puede editar nada
            if (in_array($estadoAnterior, [$estadoRecibido?->id, $estadoCancelado?->id])) {
                throw new \Exception(
                    "No se puede editar una compra en estado {$estadoActual}. " .
                    "Solo se pueden editar compras en estado BORRADOR o APROBADO."
                );
            }

            // ✅ NUEVO 2026-03-25: Si está en APROBADO o FACTURADO y se van a modificar detalles, revertir inventario
            // Esto permite cambiar lote/fecha_vencimiento generando nuevos movimientos (Opción A)
            if (isset($data['detalles']) && in_array($estadoAnterior, [$estadoAprobado?->id, $estadoRecibido?->id])) {
                Log::info('CompraController::update() - Revirtiendo inventario antes de actualizar detalles', [
                    'compra_id' => $compra->id,
                    'compra_numero' => $compra->numero,
                    'estado_actual' => $estadoActual,
                ]);
                $this->revertirInventarioDetalles($compra);
            }

            // ✅ PRIMERO: Actualizar propiedades principales
            $compra->update($data);
            $compra->refresh(); // Recargar propiedades principales

            // ✅ SEGUNDO: Detectar si los detalles realmente cambiaron (FIX 2026-03-19: Comparar por ID, no por índice)
            $detallesChanged = false;
            if (isset($data['detalles'])) {
                // Comparar cantidad de detalles primero
                if ($compra->detalles()->count() !== count($data['detalles'])) {
                    $detallesChanged = true;
                    Log::info('CompraController::update() - Cambio detectado: cantidad de detalles', [
                        'compra_id' => $compra->id,
                        'detalles_existentes' => $compra->detalles()->count(),
                        'detalles_nuevos' => count($data['detalles']),
                    ]);
                } else {
                    // ✅ MEJORADO: Comparar cada detalle por ID (no por índice)
                    $existingDetalles = $compra->detalles->keyBy('id')->toArray();
                    $detalleIds = array_filter(array_map(fn($d) => $d['id'] ?? null, $data['detalles']));

                    // Verificar si hay detalles nuevos (sin ID) o detalles eliminados
                    if (count($detalleIds) !== count($data['detalles']) ||
                        count(array_diff(array_keys($existingDetalles), $detalleIds)) > 0) {
                        $detallesChanged = true;
                        Log::info('CompraController::update() - Cambio detectado: detalles nuevos o eliminados', [
                            'compra_id' => $compra->id,
                            'detalles_con_id' => count($detalleIds),
                            'total_detalles_nuevos' => count($data['detalles']),
                        ]);
                    } else {
                        // Comparar cambios en detalles existentes por ID
                        foreach ($data['detalles'] as $newDetalle) {
                            $id = $newDetalle['id'] ?? null;
                            if (!$id) continue; // Saltar detalles sin ID (nuevos)

                            $existingDetalle = $existingDetalles[$id] ?? null;
                            if (! $existingDetalle) {
                                $detallesChanged = true;
                                Log::info('CompraController::update() - Cambio detectado: detalle no encontrado por ID', [
                                    'compra_id' => $compra->id,
                                    'detalle_id' => $id,
                                ]);
                                break;
                            }

                            // Comparar campos importantes (incluyendo lote y fecha_vencimiento)
                            if ((int) $existingDetalle['producto_id'] !== (int) $newDetalle['producto_id'] ||
                                (float) $existingDetalle['cantidad'] != (float) $newDetalle['cantidad'] ||
                                (float) $existingDetalle['precio_unitario'] != (float) $newDetalle['precio_unitario'] ||
                                (float) ($existingDetalle['descuento'] ?? 0) != (float) ($newDetalle['descuento'] ?? 0) ||
                                ($existingDetalle['lote'] ?? '') !== ($newDetalle['lote'] ?? '') ||
                                ($existingDetalle['fecha_vencimiento'] ?? '') !== ($newDetalle['fecha_vencimiento'] ?? '')) {
                                $detallesChanged = true;
                                Log::info('CompraController::update() - Cambio detectado en detalle', [
                                    'compra_id' => $compra->id,
                                    'detalle_id' => $id,
                                    'producto_anterior' => $existingDetalle['producto_id'],
                                    'producto_nuevo' => $newDetalle['producto_id'],
                                    'cantidad_anterior' => $existingDetalle['cantidad'],
                                    'cantidad_nueva' => $newDetalle['cantidad'],
                                    'lote_anterior' => $existingDetalle['lote'] ?? null,
                                    'lote_nuevo' => $newDetalle['lote'] ?? null,
                                    'fecha_vencimiento_anterior' => $existingDetalle['fecha_vencimiento'] ?? null,
                                    'fecha_vencimiento_nueva' => $newDetalle['fecha_vencimiento'] ?? null,
                                ]);
                                break;
                            }
                        }
                    }
                }
            }

            // ✅ TERCERO: Actualizar/recrear detalles SOLO SI CAMBIARON
            // Escenario 1: Usuario modifica detalles/header → Recrear detalles
            // Escenario 2: Usuario solo cambia estado BORRADOR→APROBADO → Mantener detalles sin cambios
            if ($detallesChanged) {
                Log::info('CompraController::update() - Detalles han cambiado, recreando', [
                    'compra_numero'  => $compra->numero,
                    'detalles_count' => count($data['detalles']),
                ]);

                // Eliminar detalles existentes
                $deletedCount = $compra->detalles()->delete();
                Log::info('CompraController::update() - Detalles eliminados', [
                    'compra_id' => $compra->id,
                    'deleted_count' => $deletedCount,
                ]);

                // ✅ FIX 2026-03-19: Crear nuevos detalles con validación y mejor error handling
                $createdCount = 0;
                foreach ($data['detalles'] as $detalleData) {
                    try {
                        // Asegurar que el ID se excluya si es para un nuevo detalle
                        $detalleParaCrear = $detalleData;
                        $id = $detalleParaCrear['id'] ?? null;
                        if ($id === null || $id === 'null') {
                            unset($detalleParaCrear['id']);
                        }

                        $detalle = $compra->detalles()->create($detalleParaCrear);

                        // ✅ CRITICAL FIX 2026-03-24: REFRESH el detalle para obtener el valor correcto del DB
                        $detalle->refresh();

                        $createdCount++;
                        Log::info('CompraController::update() - Detalle creado', [
                            'compra_id' => $compra->id,
                            'detalle_id' => $detalle->id,
                            'producto_id' => $detalleParaCrear['producto_id'],
                            'cantidad' => $detalleParaCrear['cantidad'],
                            'cantidad_guardada' => $detalle->cantidad,  // ← Ahora con el valor correcto
                            'lote_enviado' => $detalleParaCrear['lote'] ?? 'NO ENVIADO',
                            'lote_guardado' => $detalle->lote ?? 'NO GUARDADO',
                            'fecha_vencimiento_enviada' => $detalleParaCrear['fecha_vencimiento'] ?? 'NO ENVIADA',
                            'fecha_vencimiento_guardada' => $detalle->fecha_vencimiento ?? 'NO GUARDADA',
                        ]);
                    } catch (\Exception $e) {
                        Log::error('CompraController::update() - Error creando detalle', [
                            'compra_id' => $compra->id,
                            'detalle_data' => $detalleParaCrear,
                            'error' => $e->getMessage(),
                        ]);
                        throw $e;
                    }
                }

                Log::info('CompraController::update() - Detalles recreados exitosamente', [
                    'compra_id' => $compra->id,
                    'created_count' => $createdCount,
                ]);

                $compra->load('detalles');
            } else if (isset($data['detalles'])) {
                Log::info('CompraController::update() - Detalles sin cambios, manteniéndose', [
                    'compra_numero'  => $compra->numero,
                    'detalles_count' => $compra->detalles()->count(),
                ]);
                // Detalles no cambiaron, simplemente recargarlos
                $compra->load('detalles');
            }

            // ✅ CUARTO: Detectar cambios de estado importantes
            $cambioAAprobado = $estadoAnterior == $estadoBorrador?->id &&
            $compra->estado_documento_id == $estadoAprobado?->id;
            $cambioARecibido = $estadoAnterior != $estadoRecibido?->id &&
            $compra->estado_documento_id == $estadoRecibido?->id;

            Log::info('CompraController::update() - Detectados cambios de estado', [
                'compra_numero'     => $compra->numero,
                'estadoAnterior_id' => $estadoAnterior,
                'estadoNuevo_id'    => $compra->estado_documento_id,
                'cambioAAprobado'   => $cambioAAprobado,
                'cambioARecibido'   => $cambioARecibido,
                'detalles_count'    => $compra->detalles->count(),
            ]);

            // ✅ QUINTO: Si BORRADOR → APROBADO, registrar inventario Y movimiento de caja (o CuentaPorPagar si es crédito)
            if ($cambioAAprobado && $compra->detalles()->exists()) {
                // Determine which scenario:
                // Escenario 1: Detalles fueron modificados (recreadas)
                // Escenario 2: Estado-only change, detalles sin modificaciones
                $escenario = $detallesChanged ? 'detalles-modificados' : 'estado-only-change';

                Log::info("Registrando inventario para cambio a APROBADO", [
                    'compra_numero'  => $compra->numero,
                    'detalles_count' => $compra->detalles->count(),
                    'escenario'      => $escenario,
                ]);

                // 1️⃣ ✅ REFACTORIZADO (2026-03-27): Registrar inventario con servicio centralizado AGRUPADO
                // En lugar de registrar UN movimiento por detalle,
                // ahora registra UN movimiento por producto con detalles de todos los lotes en JSON
                $detallesParaInventario = $compra->detalles->map(function ($detalle) {
                    return [
                        'producto_id' => $detalle->producto_id,
                        'cantidad' => (float) $detalle->cantidad,
                        'lote' => $detalle->lote,
                        'fecha_vencimiento' => $detalle->fecha_vencimiento,
                    ];
                })->toArray();

                Log::info("Registrando inventario - Usando CompraDistribucionService", [
                    'compra_numero'     => $compra->numero,
                    'cantidad_detalles' => count($detallesParaInventario),
                    'almacen_id'        => $data['almacen_id'] ?? $compra->almacen_id,
                ]);

                $movimientosStock = $this->compraDistribucionService->registrarEntradaCompra(
                    detalles: $detallesParaInventario,
                    numeroCompra: $compra->numero,
                    almacenId: (int)($data['almacen_id'] ?? $compra->almacen_id),
                    usuarioId: Auth::id() ?? 1
                );

                Log::info("Movimientos de inventario registrados", [
                    'compra_numero'        => $compra->numero,
                    'movimientos_creados'  => count($movimientosStock),
                    'nota'                 => 'Movimientos AGRUPADOS por producto (no por lote)',
                ]);

                // 2️⃣ ✨ NUEVO: Registrar CuentaPorPagar si es CRÉDITO
                $compra->load('tipoPago');
                $esCredito = $compra->tipoPago?->es_credito ?? false;

                if ($esCredito) {
                    // COMPRA A CRÉDITO: Crear CuentaPorPagar
                    $this->crearCuentaPorPagar($compra, $data['total']);

                    Log::info("Compra {$compra->numero} cambió a APROBADO - CuentaPorPagar registrada", [
                        'compra_id'      => $compra->id,
                        'tipo_pago'      => $compra->tipoPago?->nombre,
                        'total'          => $data['total'],
                        'escenario'      => $escenario,
                    ]);
                }

                // 3️⃣ ✨ NUEVO: Detectar cambios de precio de costo
                $servicioPrecios    = new DetectarCambiosPrecioService();
                $productosConCambio = $servicioPrecios->procesarCompraAprobada($compra);

                if (! empty($productosConCambio)) {
                    Log::info("Precios de costo actualizados, revisar precios de venta", [
                        'compra_numero'        => $compra->numero,
                        'productos_con_cambio' => count($productosConCambio),
                        'detalles'             => $productosConCambio,
                    ]);
                }

                Log::info("Compra {$compra->numero} cambió a APROBADO - Procesamiento completado", [
                    'compra_id'       => $compra->id,
                    'almacen_id'      => $data['almacen_id'] ?? $compra->almacen_id,
                    'es_credito'      => $esCredito,
                    'escenario'       => $escenario,
                    'cambios_precio'  => count($productosConCambio) ?? 0,
                ]);
            }

            // ✅ SEXTO: Si FACTURADO, registrar inventario con detalles nuevos (también AGRUPADO)
            if ($cambioARecibido && $compra->detalles()->exists()) {
                $detallesParaInventario = $compra->detalles->map(function ($detalle) {
                    return [
                        'producto_id' => $detalle->producto_id,
                        'cantidad' => (float) $detalle->cantidad,
                        'lote' => $detalle->lote,
                        'fecha_vencimiento' => $detalle->fecha_vencimiento,
                    ];
                })->toArray();

                Log::info("Registrando inventario al cambiar a FACTURADO", [
                    'compra_numero'     => $compra->numero,
                    'cantidad_detalles' => count($detallesParaInventario),
                ]);

                $movimientosStock = $this->compraDistribucionService->registrarEntradaCompra(
                    detalles: $detallesParaInventario,
                    numeroCompra: $compra->numero,
                    almacenId: (int)($data['almacen_id'] ?? $compra->almacen_id),
                    usuarioId: Auth::id() ?? 1
                );

                Log::info("Inventario registrado (FACTURADO)", [
                    'compra_numero'       => $compra->numero,
                    'movimientos_creados' => count($movimientosStock),
                ]);
            }

            // ✅ SÉPTIMO (NUEVO 2026-03-25): Si ya está APROBADO y cambió detalle (sin cambio de estado)
            // FIX 2026-03-25: En lugar de registrar entrada nuevamente (duplica stock),
            // actualizar el stock_productos existente con el nuevo lote/fecha_vencimiento
            $yaEstabaAprobado = $estadoAnterior == $estadoAprobado?->id &&
                                $compra->estado_documento_id == $estadoAprobado?->id &&
                                $detallesChanged;

            if ($yaEstabaAprobado && $compra->detalles()->exists()) {
                Log::info('CompraController::update() - APROBADO: Actualizando lote/fecha_vencimiento en stock existente', [
                    'compra_numero'  => $compra->numero,
                    'detalles_count' => $compra->detalles->count(),
                ]);

                foreach ($compra->detalles as $detalle) {
                    try {
                        // Buscar el stock_producto de esta compra
                        $stockProducto = \App\Models\StockProducto::where('producto_id', $detalle->producto_id)
                            ->where('almacen_id', $data['almacen_id'] ?? $compra->almacen_id)
                            ->orderByDesc('created_at')
                            ->first();

                        if ($stockProducto) {
                            // Actualizar solo lote y fecha_vencimiento, NO crear nuevo stock
                            $stockProducto->update([
                                'lote' => $detalle->lote,
                                'fecha_vencimiento' => $detalle->fecha_vencimiento,
                            ]);

                            Log::info('Stock actualizado con nuevo lote/fecha_vencimiento', [
                                'stock_id'           => $stockProducto->id,
                                'detalle_id'         => $detalle->id,
                                'producto_id'        => $detalle->producto_id,
                                'lote_nuevo'         => $detalle->lote,
                                'fecha_vencimiento'  => $detalle->fecha_vencimiento,
                            ]);
                        } else {
                            // Si no existe stock (caso extraño), registrar movimiento normal
                            Log::warning('Stock no encontrado, registrando movimiento de entrada', [
                                'producto_id' => $detalle->producto_id,
                                'almacen_id'  => $data['almacen_id'] ?? $compra->almacen_id,
                            ]);
                            $this->registrarEntradaInventario($detalle, $compra, $data['almacen_id'] ?? $compra->almacen_id);
                        }
                    } catch (\Exception $e) {
                        Log::error('Error al actualizar stock con lote/fecha_vencimiento', [
                            'detalle_id' => $detalle->id,
                            'error'      => $e->getMessage(),
                        ]);
                    }
                }

                Log::info('CompraController::update() - Stock actualizado para cambios en APROBADO', [
                    'compra_id'      => $compra->id,
                    'compra_numero'  => $compra->numero,
                ]);
            }

            // ✅ DEBUG 2026-03-19: Verificar estado final antes de commit
            Log::info('🟢 CompraController::update() - ANTES DE COMMIT', [
                'compra_id'            => $compra->id,
                'compra_numero'        => $compra->numero,
                'detalles_en_db'       => $compra->detalles()->count(),
                'detalles_listados'    => $compra->detalles->map(fn($d) => [
                    'id' => $d->id,
                    'producto_id' => $d->producto_id,
                    'cantidad' => $d->cantidad,
                ])->toArray(),
            ]);

            DB::commit();

            Log::info('✅ CompraController::update() - COMMIT EXITOSO', [
                'compra_id' => $compra->id,
                'mensaje' => 'Compra actualizada y guardada en BD',
            ]);

            return redirect()->route('compras.index')
                ->with('success', 'Compra actualizada exitosamente');

        } catch (\Exception $e) {
            DB::rollback();

            return back()->withInput()
                ->withErrors(['error' => 'Error al actualizar la compra: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $compra = Compra::findOrFail($id);

        try {
            DB::beginTransaction();

            // Problema #17: Validar integridad referencial antes de eliminar
            $this->validarIntegridadReferencialCompra($compra);

            $this->revertirMovimientosInventario($compra);
            $compra->delete();

            DB::commit();

            return redirect()->route('compras.index')
                ->with('success', 'Compra eliminada exitosamente');

        } catch (\Exception $e) {
            DB::rollback();

            return back()->withErrors(['error' => 'Error al eliminar la compra: ' . $e->getMessage()]);
        }
    }

    /**
     * Problema #17: Validar integridad referencial antes de eliminar compra
     *
     * Lanza una excepción si la compra tiene dependencias que impiden su eliminación
     */
    private function validarIntegridadReferencialCompra(\App\Models\Compra $compra): void
    {
        $errores = [];

        // 1. Verificar si tiene pagos asociados
        if ($compra->pagos()->exists()) {
            $cantidadPagos = $compra->pagos()->count();
            $errores[]     = "La compra tiene {$cantidadPagos} pago(s) asociado(s)";
        }

        // 2. Verificar si tiene cuenta por pagar con saldo pendiente
        if ($compra->cuentaPorPagar()->exists()) {
            $cuenta = $compra->cuentaPorPagar;
            if ($cuenta->saldo_pendiente > 0) {
                $errores[] = "La compra tiene una cuenta por pagar con saldo pendiente de " .
                number_format($cuenta->saldo_pendiente, 2);
            }
        }

        // 3. Verificar si tiene asiento contable cerrado
        if ($compra->asientoContable()->exists()) {
            $asiento = $compra->asientoContable;
            if ($asiento->cerrado) {
                $errores[] = "La compra tiene un asiento contable cerrado que no puede revertirse";
            }
        }

        // 4. Verificar si el stock ya fue utilizado (vendido)
        // ✅ MEJORADO (2026-04-16): Verificar stock total del producto en el almacén (todos los lotes)
        // no solo el lote específico de la compra
        $movimientos = \App\Models\MovimientoInventario::where('numero_documento', $compra->numero)
            ->where('tipo', \App\Models\MovimientoInventario::TIPO_ENTRADA_COMPRA)
            ->get();

        foreach ($movimientos as $movimiento) {
            $stockProducto = $movimiento->stockProducto;
            if ($stockProducto) {
                $cantidadEntrada = abs($movimiento->cantidad);
                $producto = $stockProducto->producto;
                $almacenId = $stockProducto->almacen_id;

                // ✅ CORREGIDO: Calcular stock total sumando TODOS los lotes del producto en el almacén
                $stockTotalAlmacen = \App\Models\StockProducto::where('producto_id', $producto->id)
                    ->where('almacen_id', $almacenId)
                    ->sum('cantidad');

                // Si el stock total es menor que la cantidad original de la compra,
                // significa que parte se vendió
                if ($stockTotalAlmacen < $cantidadEntrada) {
                    $cantidadVendida = $cantidadEntrada - $stockTotalAlmacen;
                    $errores[] = "Producto '{$producto->nombre}': se compraron {$cantidadEntrada} unidades pero {$cantidadVendida} ya fueron vendidas (stock disperso en {$almacenId})";
                }
            }
        }

        // Si hay errores, lanzar excepción
        if (! empty($errores)) {
            throw new \Exception(
                "No se puede eliminar la compra #{$compra->numero}:\n" .
                implode("\n", array_map(fn($e) => "- {$e}", $errores))
            );
        }
    }

    /**
     * ✅ REFACTORIZADO (2026-03-28): Registrar entrada de inventario usando servicio centralizado
     *
     * Ahora usa CompraDistribucionService::registrarEntradaCompra() para mantener
     * consistencia con las entradas de compra normales (movimientos AGRUPADOS por producto)
     */
    private function registrarEntradaInventario(DetalleCompra $detalle, Compra $compra, ?int $almacenId = null): void
    {
        // Usar almacén especificado o buscar el primero disponible
        $almacen = null;
        if ($almacenId) {
            $almacen = \App\Models\Almacen::find($almacenId);
        }

        if (! $almacen) {
            $almacen = \App\Models\Almacen::where('activo', true)->first();
        }

        if (! $almacen) {
            Log::warning('No hay almacén disponible para registrar entrada de inventario', [
                'compra_id'   => $compra->id,
                'producto_id' => $detalle->producto_id,
            ]);

            return;
        }

        try {
            Log::info('🔄 [registrarEntradaInventario] Registrando entrada usando CompraDistribucionService', [
                'compra_numero' => $compra->numero,
                'producto_id' => $detalle->producto_id,
                'cantidad' => $detalle->cantidad,
                'lote' => $detalle->lote,
                'almacen_id' => $almacen->id,
            ]);

            // ✅ REFACTORIZADO (2026-03-28): Usar servicio centralizado
            // Prepara los detalles en el formato esperado por registrarEntradaCompra()
            $detallesParaInventario = [
                [
                    'producto_id' => $detalle->producto_id,
                    'cantidad' => (float) $detalle->cantidad,
                    'lote' => $detalle->lote,
                    'fecha_vencimiento' => $detalle->fecha_vencimiento,
                ]
            ];

            $movimientosStock = $this->compraDistribucionService->registrarEntradaCompra(
                detalles: $detallesParaInventario,
                numeroCompra: $compra->numero,
                almacenId: $almacen->id,
                usuarioId: $compra->usuario_id ?? Auth::id() ?? 1
            );

            Log::info('✅ [registrarEntradaInventario] Entrada registrada exitosamente con CompraDistribucionService', [
                'compra_numero' => $compra->numero,
                'producto_id' => $detalle->producto_id,
                'movimientos_creados' => count($movimientosStock),
                'nota' => 'Movimiento AGRUPADO por producto (consistente con entradas normales)',
            ]);

        } catch (\Exception $e) {
            Log::error('❌ Error al registrar entrada de inventario', [
                'compra_id'   => $compra->id,
                'producto_id' => $detalle->producto_id,
                'error'       => $e->getMessage(),
            ]);

            // No detener la transacción, solo registrar el error
        }
    }

    /**
     * ✅ REFACTORIZADO (2026-03-27): Revertir inventario de detalles antes de modificarlos
     * Ahora usa CompraDistribucionService para generar movimientos AGRUPADOS
     */
    private function revertirInventarioDetalles(Compra $compra): void
    {
        try {
            Log::info('🔄 [CompraController] Revirtiendo inventario de compra', [
                'compra_numero' => $compra->numero,
                'detalles_count' => $compra->detalles->count(),
            ]);

            // ✅ NUEVO: Usar CompraDistribucionService para revertir movimientos AGRUPADOS
            $resultado = $this->compraDistribucionService->revertirEntradaCompra($compra->numero);

            if (!$resultado['success']) {
                Log::warning('⚠️ Error al revertir entrada de compra', [
                    'compra_numero' => $compra->numero,
                    'error' => $resultado['error'],
                ]);
            } else {
                Log::info('✅ Inventario revertido exitosamente', [
                    'compra_numero' => $compra->numero,
                    'cantidad_revertida' => $resultado['cantidad_revertida'],
                    'movimientos_creados' => $resultado['movimientos'],
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error al revertir inventario en actualización', [
                'compra_numero' => $compra->numero,
                'error'         => $e->getMessage(),
                'trace'         => substr($e->getTraceAsString(), 0, 500),
            ]);
            // Continuar con la transacción (no fallar completamente)
        }
    }

    /**
     * Anular una compra aprobada
     *
     * Revierte inventario, caja y actualiza estado a ANULADO
     */
    public function anular(Request $request, int $id): \Illuminate\Http\JsonResponse
    {
        try {
            Log::info('🟠 [ANULAR COMPRA] INICIO', ['compra_id' => $id]);

            // 1. Verificar permisos
            if (!auth()->user()->hasRole(['admin', 'Admin'])) {
                Log::warning('🟠 [ANULAR COMPRA] PERMISO DENEGADO', [
                    'compra_id' => $id,
                    'usuario_id' => auth()->id(),
                    'roles' => auth()->user()?->getRoleNames(),
                ]);
                return response()->json(['message' => 'No tienes permiso'], 403);
            }

            $motivo = $request->input('motivo', 'Sin motivo especificado');

            // 2. Cargar compra
            $compra = Compra::with(['detalles.producto', 'cuentaPorPagar.pagos'])->findOrFail($id);

            Log::info('🟠 [ANULAR COMPRA] COMPRA ENCONTRADA', [
                'compra_id' => $compra->id,
                'compra_numero' => $compra->numero,
                'estado_actual' => $compra->estadoDocumento?->nombre,
            ]);

            // 3. Validar estado
            if ($compra->estadoDocumento?->nombre === 'Anulado') {
                Log::warning('🟠 [ANULAR COMPRA] YA ESTA ANULADA', ['compra_id' => $compra->id]);
                return response()->json(['message' => 'Ya está anulada'], 422);
            }

            if ($compra->estadoDocumento?->codigo !== 'APROBADO') {
                Log::warning('🟠 [ANULAR COMPRA] ESTADO NO PERMITIDO', [
                    'compra_id' => $compra->id,
                    'estado' => $compra->estadoDocumento?->nombre,
                ]);
                return response()->json([
                    'message' => 'Solo se pueden anular compras APROBADAS'
                ], 422);
            }

            // 4. Validar integridad
            try {
                $this->validarIntegridadReferencialCompra($compra);
            } catch (\Exception $e) {
                Log::warning('🟠 [ANULAR COMPRA] VALIDACIÓN FALLIDA', [
                    'compra_id' => $compra->id,
                    'error' => $e->getMessage(),
                ]);
                return response()->json(['message' => $e->getMessage()], 422);
            }

            // 5. Ejecutar anulación
            DB::transaction(function () use ($compra, $motivo) {
                // Revertir inventario
                if ($compra->estadoDocumento?->codigo === 'APROBADO') {
                    try {
                        $compra->revertirMovimientosInventario();
                    } catch (\Exception $e) {
                        Log::warning('No se pudo revertir inventario al anular compra', [
                            'compra_id' => $compra->id,
                            'error' => $e->getMessage(),
                        ]);
                    }
                }


                // Actualizar observaciones
                $usuarioNombre = auth()->user()->name ?? 'Sistema';
                $fechaActual = now()->toDateTimeString();
                $observacionesExistentes = $compra->observaciones ?? '';

                $observacionesFinal = $observacionesExistentes;
                if (!empty($observacionesExistentes)) {
                    $observacionesFinal .= "\n";
                }
                $observacionesFinal .= "[ANULADO] Motivo: {$motivo} - Anulado por: {$usuarioNombre} - {$fechaActual}";

                // Cambiar estado
                $estadoAnulado = EstadoDocumento::where('nombre', 'Anulado')->first();
                if (!$estadoAnulado) {
                    throw new \Exception('Estado "Anulado" no encontrado en la base de datos');
                }

                $compra->update([
                    'estado_documento_id' => $estadoAnulado->id,
                    'observaciones' => $observacionesFinal,
                ]);

                Log::info('🟢 [ANULAR COMPRA] COMPLETADO', [
                    'compra_id' => $compra->id,
                    'motivo' => $motivo,
                ]);
            });

            return response()->json([
                'success' => true,
                'message' => 'Compra anulada exitosamente',
            ], 200);

        } catch (\Exception $e) {
            Log::error('🟠 [ANULAR COMPRA] ERROR', [
                'compra_id' => $id,
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ REFACTORIZADO (2026-03-28): Revertir movimientos usando servicio centralizado
     *
     * Ahora usa CompraDistribucionService::revertirEntradaCompra() para mantener
     * consistencia con el registro de entrada (movimientos AGRUPADOS por producto)
     *
     * Diferencia antes vs después:
     * - ANTES: 1 movimiento por lote (no agrupado)
     * - DESPUÉS: 1 movimiento por producto con detalles de lotes en JSON
     */
    private function revertirMovimientosInventario(Compra $compra): void
    {
        try {
            Log::info('🔄 [revertirMovimientosInventario] Iniciando reversión de entrada', [
                'compra_numero' => $compra->numero,
                'detalles_count' => $compra->detalles->count(),
            ]);

            // ✅ REFACTORIZADO (2026-03-28): Usar servicio centralizado
            $resultado = $this->compraDistribucionService->revertirEntradaCompra($compra->numero);

            if ($resultado['success']) {
                Log::info('✅ [revertirMovimientosInventario] Reversión completada exitosamente', [
                    'compra_numero' => $compra->numero,
                    'cantidad_revertida' => $resultado['cantidad_revertida'],
                    'movimientos_creados' => $resultado['movimientos'],
                    'nota' => 'Movimientos AGRUPADOS por producto (consistente con entrada)',
                ]);
            } else {
                Log::warning('⚠️ [revertirMovimientosInventario] Reversión sin movimientos', [
                    'compra_numero' => $compra->numero,
                    'error' => $resultado['error'],
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error al revertir movimientos de inventario', [
                'compra_numero' => $compra->numero,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Calcular estadísticas para el dashboard de compras
     */
    private function calcularEstadisticas(array $filtros): array
    {
        $baseQuery = Compra::query();

        // Aplicar mismos filtros que en el index para estadísticas consistentes
        if (! empty($filtros['proveedor_id'])) {
            $baseQuery->where('proveedor_id', $filtros['proveedor_id']);
        }

        if (! empty($filtros['estado_documento_id'])) {
            $baseQuery->where('estado_documento_id', $filtros['estado_documento_id']);
        }

        if (! empty($filtros['moneda_id'])) {
            $baseQuery->where('moneda_id', $filtros['moneda_id']);
        }

        if (! empty($filtros['fecha_desde'])) {
            $baseQuery->whereDate('fecha', '>=', $filtros['fecha_desde']);
        }

        if (! empty($filtros['fecha_hasta'])) {
            $baseQuery->whereDate('fecha', '<=', $filtros['fecha_hasta']);
        }

        // Estadísticas generales
        $totalCompras   = (clone $baseQuery)->count();
        $montoTotal     = (clone $baseQuery)->sum('total');
        $promedioCompra = $totalCompras > 0 ? $montoTotal / $totalCompras : 0;

        // Compras por estado
        $comprasPorEstado = (clone $baseQuery)
            ->with('estadoDocumento')
            ->get()
            ->groupBy('estado_documento.nombre')
            ->map(function ($compras, $estado) {
                return [
                    'nombre'      => $estado ?? 'Sin estado',
                    'cantidad'    => $compras->count(),
                    'monto_total' => $compras->sum('total'),
                ];
            })
            ->values();

        // Compras del mes actual
        $inicioMes = now()->startOfMonth();
        $finMes    = now()->endOfMonth();

        $comprasMesActual = Compra::whereBetween('fecha', [$inicioMes, $finMes])->count();
        $montoMesActual   = Compra::whereBetween('fecha', [$inicioMes, $finMes])->sum('total');

        // Compras del mes anterior para comparación
        $inicioMesAnterior = now()->subMonth()->startOfMonth();
        $finMesAnterior    = now()->subMonth()->endOfMonth();

        $comprasMesAnterior = Compra::whereBetween('fecha', [$inicioMesAnterior, $finMesAnterior])->count();
        $montoMesAnterior   = Compra::whereBetween('fecha', [$inicioMesAnterior, $finMesAnterior])->sum('total');

        // Calcular variaciones porcentuales
        $variacionCompras = $comprasMesAnterior > 0
            ? (($comprasMesActual - $comprasMesAnterior) / $comprasMesAnterior) * 100
            : 0;

        $variacionMonto = $montoMesAnterior > 0
            ? (($montoMesActual - $montoMesAnterior) / $montoMesAnterior) * 100
            : 0;

        return [
            'total_compras'      => $totalCompras,
            'monto_total'        => $montoTotal,
            'promedio_compra'    => $promedioCompra,
            'compras_por_estado' => $comprasPorEstado,
            'mes_actual'         => [
                'compras'           => $comprasMesActual,
                'monto'             => $montoMesActual,
                'variacion_compras' => round($variacionCompras, 2),
                'variacion_monto'   => round($variacionMonto, 2),
            ],
        ];
    }

    /**
     * Generar número de compra único con protección contra race conditions
     *
     * Formato: COMP20241018-001, COMP20241018-002, etc.
     *
     * Usa bloqueo pesimista (FOR UPDATE) para evitar duplicados cuando
     * múltiples usuarios crean compras simultáneamente.
     */
    private function generarNumeroCompra(): string
    {
        $fecha       = date('Ymd'); // Formato: 20240915
        $maxIntentos = 5;           // Máximo de intentos en caso de deadlock
        $intento     = 0;

        while ($intento < $maxIntentos) {
            try {
                // Usar bloqueo pesimista (FOR UPDATE) para evitar race conditions
                $ultimaCompra = Compra::where('numero', 'like', "COMP{$fecha}%")
                    ->orderBy('numero', 'desc')
                    ->lockForUpdate() // 🔒 BLOQUEO PESIMISTA
                    ->first();

                $secuencial = 1;
                if ($ultimaCompra) {
                    // Extraer el número secuencial del último número de compra
                    $ultimoNumero = $ultimaCompra->numero;
                    // Buscar el último número después del guion
                    if (preg_match('/(\d+)$/', $ultimoNumero, $matches)) {
                        $secuencial = intval($matches[1]) + 1;
                    }
                }

                // Formato inteligente:
                // - Si secuencial < 1000: COMP20240915-0001 (4 dígitos con padding)
                // - Si secuencial >= 1000: COMP20240915-1000 (sin padding)
                if ($secuencial < 1000) {
                    $secuencialFormato = str_pad($secuencial, 4, '0', STR_PAD_LEFT);
                } else {
                    $secuencialFormato = (string) $secuencial;
                }
                $numero = "COMP{$fecha}-{$secuencialFormato}";

                // Verificar que no exista (por si acaso)
                $existe = Compra::where('numero', $numero)->exists();
                if ($existe) {
                    // Si existe, incrementar y reintentar
                    $secuencial++;
                    continue;
                }

                return $numero;

            } catch (\Illuminate\Database\QueryException $e) {
                // Si hay deadlock, esperar un poco y reintentar
                if ($e->getCode() == '40001' || stripos($e->getMessage(), 'deadlock') !== false) {
                    $intento++;
                    usleep(100000 * $intento); // Esperar 100ms, 200ms, 300ms, etc.
                    continue;
                }

                // Si es otro error, lanzarlo
                throw $e;
            }
        }

        // Si después de todos los intentos no se generó, usar timestamp como fallback
        return sprintf('COMP%s-%s', $fecha, substr(microtime(true) * 10000, -6));
    }

    /**
     * Crear cuenta por pagar para compra a crédito
     *
     * Registra una CuentaPorPagar cuando la compra es a crédito,
     * calculando fecha de vencimiento (7 días desde la compra)
     *
     * @param Compra $compra
     * @param float $monto Monto total de la compra
     */
    private function crearCuentaPorPagar(Compra $compra, float $monto): void
    {
        try {
            $fechaVencimiento = $compra->fecha->addDays(7);

            $cuentaPorPagar = CuentaPorPagar::create([
                'compra_id'           => $compra->id,
                'monto_original'      => $monto,
                'saldo_pendiente'     => $monto,
                'fecha_vencimiento'   => $fechaVencimiento,
                'dias_vencido'        => 0,
                'estado'              => 'PENDIENTE',
                'observaciones'       => "Compra #{$compra->numero} - Proveedor: {$compra->proveedor?->nombre}",
            ]);

            Log::info('CuentaPorPagar creada para compra a crédito', [
                'compra_id'              => $compra->id,
                'compra_numero'          => $compra->numero,
                'cuenta_por_pagar_id'    => $cuentaPorPagar->id,
                'monto'                  => $monto,
                'fecha_vencimiento'      => $fechaVencimiento,
            ]);
        } catch (\Exception $e) {
            Log::error('Error al crear CuentaPorPagar para compra', [
                'compra_id'   => $compra->id,
                'compra_numero' => $compra->numero,
                'error'       => $e->getMessage(),
            ]);

            throw new \Exception('Error al registrar cuenta por pagar: ' . $e->getMessage());
        }
    }

    /**
     * Registrar movimiento de caja para compra
     *
     * ✅ MEJORADO: Registra movimiento de caja solo si la compra es CONTADO
     * Si es CRÉDITO, el movimiento se registrará al pagar
     *
     * @param Compra $compra
     * @param int $cajaId ID de caja del middleware
     * @param float $total Monto total del request (para usar valores NUEVOS, no los guardados en BD)
     */
    private function registrarMovimientoCaja(Compra $compra, ?int $cajaId = null, ?float $total = null): void
    {
        try {
            // Solo registrar movimiento para compras con pago inmediato (no CRÉDITO)
            $tipoPago = $compra->tipoPago;
            if (! $tipoPago || strtoupper($tipoPago->codigo) === 'CRÉDITO') {
                // Es a CRÉDITO - no crear movimiento ahora
                Log::info("Compra {$compra->numero} a crédito - movimiento de caja se registrará al pagar");
                return;
            }

            if (! $cajaId) {
                Log::warning("No se especificó cajaId para registrar movimiento de compra {$compra->numero}");
                return;
            }

            // Obtener tipo de operación para compra
            $tipoOperacion = \App\Models\TipoOperacionCaja::where('codigo', 'COMPRA')->first();

            if (! $tipoOperacion) {
                Log::warning('No existe tipo de operación COMPRA para movimiento de caja');
                return;
            }

            // ✅ Usar el total del request si viene, si no usar el de la compra
            $montoRegistro = $total ?? $compra->total;

            // Crear movimiento de caja (EGRESO para compra)
            \App\Models\MovimientoCaja::create([
                'caja_id'           => $cajaId,
                'tipo_operacion_id' => $tipoOperacion->id,
                'numero_documento'  => $compra->numero,
                'observaciones'     => "Compra #{$compra->numero} - Proveedor: {$compra->proveedor?->nombre}",
                'monto' => -$montoRegistro, // ✅ NUEVO: Usa el monto del request (valores NUEVOS)
                'fecha' => $compra->fecha,
                'user_id' => Auth::id(),
            ]);

            Log::info("Movimiento de caja generado para compra {$compra->numero}", [
                'monto'           => $montoRegistro,
                'total_request'   => $total,
                'total_compra_db' => $compra->total,
            ]);
        } catch (\Exception $e) {
            Log::error("Error registrando movimiento de caja para compra {$compra->numero}: " . $e->getMessage());
        }
    }

    /**
     * Imprimir compra en PDF
     * GET /compras/{compra}/imprimir?formato=A4&accion=stream
     */
    public function imprimirCompra(Compra $compra, Request $request)
    {
        // Validar permiso
        $this->authorize('view', $compra);

        $formato = $request->input('formato', 'A4');      // A4, TICKET_80, TICKET_58
        $accion  = $request->input('accion', 'download'); // download | stream

        Log::info("Generando PDF de compra", [
            'compra_id' => $compra->id,
            'formato'   => $formato,
            'accion'    => $accion,
        ]);

        try {
            $pdf = $this->impresionService->imprimirCompra($compra, $formato);

            $nombreArchivo = "compra_{$compra->numero}_{$formato}.pdf";

            return $accion === 'stream'
                ? $pdf->stream($nombreArchivo)
                : $pdf->download($nombreArchivo);
        } catch (\Exception $e) {
            Log::error("Error generando PDF de compra", [
                'compra_id' => $compra->id,
                'error'     => $e->getMessage(),
            ]);

            return back()->with('error', 'Error al generar PDF: ' . $e->getMessage());
        }
    }

    /**
     * Preview de compra en HTML
     * GET /compras/{compra}/preview?formato=A4
     */
    public function previewCompra(Compra $compra, Request $request)
    {
        // Validar permiso
        $this->authorize('view', $compra);

        $formato = $request->input('formato', 'A4');

        try {
            // Intentar obtener plantilla del sistema
            $plantilla = \App\Models\PlantillaImpresion::obtenerDefault('compra', $formato);

            $empresa = \App\Models\Empresa::principal();

            // Convertir logos a base64 para embebimiento en PDF
            $logoPrincipalBase64 = $this->logoToBase64($empresa->logo_principal);
            $logoFooterBase64    = $this->logoToBase64($empresa->logo_footer);

            // Cargar relaciones necesarias
            $compra->load([
                'proveedor',
                'detalles.producto',
                'usuario',
                'tipoPago',
                'moneda',
                'estadoDocumento',
                'almacen',
            ]);

            if ($plantilla) {
                // Usar plantilla del sistema si existe
                return view($plantilla->vista_blade, [
                    'documento'             => $compra,
                    'empresa'               => $empresa,
                    'plantilla'             => $plantilla,
                    'fecha_impresion'       => now(),
                    'usuario'               => auth()->user(),
                    'opciones'              => [],
                    'logo_principal_base64' => $logoPrincipalBase64,
                    'logo_footer_base64'    => $logoFooterBase64,
                ]);
            } else {
                // Fallback a vistas hardcodeadas si no existe plantilla
                $template = match ($formato) {
                    'A4'        => 'impresion.compras.hoja-completa',
                    'TICKET_80' => 'impresion.compras.ticket-80',
                    'TICKET_58' => 'impresion.compras.ticket-58',
                    default     => 'impresion.compras.hoja-completa',
                };

                return view($template, [
                    'compra'                => $compra,
                    'documento'             => $compra,
                    'empresa'               => $empresa,
                    'usuario'               => auth()->user()->name ?? 'Sistema',
                    'fecha_impresion'       => now(),
                    'logo_principal_base64' => $logoPrincipalBase64,
                    'logo_footer_base64'    => $logoFooterBase64,
                ]);
            }
        } catch (\Exception $e) {
            abort(500, 'Error al generar preview: ' . $e->getMessage());
        }

        Log::info("Preview de compra", [
            'compra_id' => $compra->id,
            'formato'   => $formato,
        ]);

        // Retornar vista directamente
        return view($template, $datos);
    }

    /**
     * Aplicar configuración de márgenes y tamaño de papel según formato
     */
    private function aplicarConfiguracionFormato($pdf, $formato): void
    {
        $configuracion = match ($formato) {
            'A4'        => [
                'paper'       => 'A4',
                'orientation' => 'portrait',
                'margins'     => ['left' => 10, 'right' => 10, 'top' => 10, 'bottom' => 10],
            ],
            'TICKET_80' => [
                'paper'       => [0, 0, 226.77, 841.89], // 80mm ancho
                'orientation' => 'portrait',
                'margins'     => ['left' => 5, 'right' => 5, 'top' => 5, 'bottom' => 5],
            ],
            'TICKET_58' => [
                'paper'       => [0, 0, 164.41, 841.89], // 58mm ancho
                'orientation' => 'portrait',
                'margins'     => ['left' => 3, 'right' => 3, 'top' => 3, 'bottom' => 3],
            ],
        };

        $pdf->setPaper($configuracion['paper'], $configuracion['orientation']);
        $pdf->setOption('margin_left', $configuracion['margins']['left']);
        $pdf->setOption('margin_right', $configuracion['margins']['right']);
        $pdf->setOption('margin_top', $configuracion['margins']['top']);
        $pdf->setOption('margin_bottom', $configuracion['margins']['bottom']);
    }

    /**
     * Exportar compra a Excel con formato profesional
     * GET /compras/{compra}/exportar-excel
     */
    public function exportarExcel(Compra $compra)
    {
        Log::info('📊 [CompraController::exportarExcel] Exportando compra a Excel', [
            'compra_id' => $compra->id,
            'user_id'   => auth()->id(),
        ]);

        $this->authorize('view', $compra);

        try {
            return $this->excelExportService->exportarCompra($compra);
        } catch (\Exception $e) {
            Log::error('❌ [CompraController::exportarExcel] Error', [
                'error'     => $e->getMessage(),
                'compra_id' => $compra->id,
            ]);
            return back()->with('error', 'Error al generar Excel: ' . $e->getMessage());
        }
    }

    /**
     * Exportar compra a PDF con formato seleccionado
     * GET /compras/{compra}/exportar-pdf?formato=A4
     */
    public function exportarPdf(Compra $compra, Request $request)
    {
        Log::info('📄 [CompraController::exportarPdf] Exportando compra a PDF', [
            'compra_id' => $compra->id,
            'user_id'   => auth()->id(),
        ]);

        $this->authorize('view', $compra);

        $formato = $request->input('formato', 'A4');

        try {
            return $this->imprimirCompra($compra, new Request([
                'formato' => $formato,
                'accion'  => 'download',
            ]));
        } catch (\Exception $e) {
            Log::error('❌ [CompraController::exportarPdf] Error', [
                'error'     => $e->getMessage(),
                'compra_id' => $compra->id,
            ]);
            return back()->with('error', 'Error al generar PDF: ' . $e->getMessage());
        }
    }

    /**
     * Convertir URL de logo a data URI base64
     *
     * @param string|null $logoUrl URL de la imagen
     * @return string|null Data URI para uso en HTML/CSS
     */
    private function logoToBase64(?string $logoUrl): ?string
    {
        if (! $logoUrl) {
            return null;
        }

        try {
            // Si ya es un data URI, devolverlo tal cual
            if (str_starts_with($logoUrl, 'data:')) {
                return $logoUrl;
            }

            // Resolver la ruta absoluta
            $logoPath = public_path($logoUrl);

            if (! file_exists($logoPath)) {
                \Log::warning('Logo no encontrado: ' . $logoPath);
                return null;
            }

            $imageData = file_get_contents($logoPath);
            $base64    = base64_encode($imageData);

            // Detectar el tipo MIME desde la extensión del archivo
            $extension = strtolower(pathinfo($logoPath, PATHINFO_EXTENSION));
            $mimeTypes = [
                'png'  => 'image/png',
                'jpg'  => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'gif'  => 'image/gif',
                'webp' => 'image/webp',
                'svg'  => 'image/svg+xml',
            ];
            $mimeType = $mimeTypes[$extension] ?? 'image/png';

            return "data:{$mimeType};base64,{$base64}";
        } catch (\Exception $e) {
            \Log::warning('Error al convertir logo a base64', [
                'error'    => $e->getMessage(),
                'logo_url' => $logoUrl,
            ]);
            return null;
        }
    }

    /**
     * Obtener todas las compras para impresión (sin paginación, respetando filtros)
     */
    public function comprasParaImpresion(Request $request)
    {
        $filtros = $request->validate([
            'q'                   => ['nullable', 'string', 'max:255'],
            'id'                  => ['nullable', 'integer'],
            'proveedor_id'        => ['nullable', 'exists:proveedores,id'],
            'estado_documento_id' => ['nullable', 'exists:estados_documento,id'],
            'moneda_id'           => ['nullable', 'exists:monedas,id'],
            'tipo_pago_id'        => ['nullable', 'exists:tipos_pago,id'],
            'fecha_desde'         => ['nullable', 'date'],
            'fecha_hasta'         => ['nullable', 'date'],
        ]);

        \Log::info('📦 [comprasParaImpresion] Parámetros recibidos:', $filtros);

        $query = Compra::with([
            'proveedor',
            'usuario',
            'estadoDocumento',
            'moneda',
            'tipoPago',
            'detalles.producto:id,nombre,sku',
            'detalles.producto.codigoPrincipal:id,codigo'
        ]);

        // Filtro por ID
        if (!empty($filtros['id'])) {
            $query->where('id', (int)$filtros['id']);
        }

        // Búsqueda general
        if (!empty($filtros['q'])) {
            $searchTerm = $filtros['q'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('numero', 'ilike', "%{$searchTerm}%")
                    ->orWhere('numero_factura', 'ilike', "%{$searchTerm}%")
                    ->orWhereHas('proveedor', function ($qq) use ($searchTerm) {
                        $qq->where('nombre', 'ilike', "%{$searchTerm}%");
                    });
            });
        }

        // Filtros específicos
        if (!empty($filtros['proveedor_id'])) {
            $query->where('proveedor_id', (int)$filtros['proveedor_id']);
        }

        if (!empty($filtros['estado_documento_id'])) {
            $query->where('estado_documento_id', (int)$filtros['estado_documento_id']);
        }

        if (!empty($filtros['moneda_id'])) {
            $query->where('moneda_id', (int)$filtros['moneda_id']);
        }

        if (!empty($filtros['tipo_pago_id'])) {
            $query->where('tipo_pago_id', (int)$filtros['tipo_pago_id']);
        }

        // Filtros de fecha
        if (!empty($filtros['fecha_desde'])) {
            $query->whereDate('fecha', '>=', $filtros['fecha_desde']);
        }

        if (!empty($filtros['fecha_hasta'])) {
            $query->whereDate('fecha', '<=', $filtros['fecha_hasta']);
        }

        // Ordenar por fecha descendente
        $compras = $query->orderBy('fecha', 'desc')->get();

        \Log::info('📦 [comprasParaImpresion] Resultados obtenidos:', ['cantidad' => $compras->count()]);

        return response()->json([
            'data' => $compras,
        ]);
    }

    /**
     * Buscar compras para AsyncSearchSelect
     * Prioriza búsqueda por ID para mejor rendimiento
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = $request->string('q', '');

            // Si no hay búsqueda, devolver compras recientes
            if (!$query) {
                $resultado = Compra::select('id', 'numero', 'proveedor_id', 'total')
                    ->with(['proveedor:id,nombre,razon_social'])
                    ->orderByDesc('created_at')
                    ->limit(20)
                    ->get()
                    ->map(fn($compra) => [
                        'id' => $compra->id,
                        'numero' => $compra->numero,
                        'proveedor_id' => $compra->proveedor_id,
                        'nombre' => "Folio #{$compra->id} - Compra #{$compra->numero}",
                        'descripcion' => $compra->proveedor?->nombre ?? 'Sin proveedor',
                    ]);

                return response()->json($resultado);
            }

            // Verificar si la búsqueda es un número (ID)
            if (is_numeric($query)) {
                // 🎯 PRIORIDAD 1: Búsqueda exacta por ID (más rápido)
                $porId = Compra::select('id', 'numero', 'proveedor_id', 'total')
                    ->with(['proveedor:id,nombre,razon_social'])
                    ->where('id', $query)
                    ->limit(1)
                    ->get();

                if ($porId->count() > 0) {
                    $resultado = $porId->map(fn($compra) => [
                        'id' => $compra->id,
                        'numero' => $compra->numero,
                        'proveedor_id' => $compra->proveedor_id,
                        'nombre' => "Folio #{$compra->id} - Compra #{$compra->numero}",
                        'descripcion' => $compra->proveedor?->nombre ?? 'Sin proveedor',
                    ]);

                    return response()->json($resultado);
                }
            }

            // 🎯 PRIORIDAD 2: Búsqueda por número con LIKE
            $compras = Compra::select('id', 'numero', 'proveedor_id', 'total')
                ->with(['proveedor:id,nombre,razon_social'])
                ->where(function ($q) use ($query) {
                    $q->where('numero', 'ilike', "%{$query}%");
                })
                ->orderByDesc('created_at')
                ->limit(20)
                ->get()
                ->map(fn($compra) => [
                    'id' => $compra->id,
                    'numero' => $compra->numero,
                    'proveedor_id' => $compra->proveedor_id,
                    'nombre' => "Folio #{$compra->id} - Compra #{$compra->numero}",
                    'descripcion' => $compra->proveedor?->nombre ?? 'Sin proveedor',
                ]);

            return response()->json($compras);
        } catch (\Exception $e) {
            Log::error('❌ Error buscando compras', ['error' => $e->getMessage()]);
            return response()->json([], 200);
        }
    }
}
