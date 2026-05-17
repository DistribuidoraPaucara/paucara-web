<?php
namespace App\Http\Controllers;

use App\Models\Almacen;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\StockProducto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReporteInventarioController extends Controller
{
    /**
     * Reporte de stock actual por almacén
     */
    public function stockActual(Request $request): Response
    {
        $filtros = $request->validate([
            'almacen_id'   => ['nullable', 'exists:almacenes,id'],
            'categoria_id' => ['nullable', 'exists:categorias,id'],
            'stock_bajo'   => ['nullable', 'boolean'],
            'stock_alto'   => ['nullable', 'boolean'],
            'busqueda'     => ['nullable', 'string', 'max:100'],
        ]);

        $query = StockProducto::with(['producto.categoria', 'almacen'])
            ->where('cantidad', '>', 0);

        // Aplicar filtros
        if (! empty($filtros['almacen_id'])) {
            $query->where('almacen_id', $filtros['almacen_id']);
        }

        if (! empty($filtros['categoria_id'])) {
            $query->whereHas('producto', function ($q) use ($filtros) {
                $q->where('categoria_id', $filtros['categoria_id']);
            });
        }

        if (! empty($filtros['stock_bajo'])) {
            $query->whereHas('producto', function ($q) {
                $q->whereColumn('stock_minimo', '>', 0)
                    ->whereRaw('(SELECT COALESCE(SUM(cantidad), 0) FROM stock_productos sp WHERE sp.producto_id = productos.id) < stock_minimo');
            });
        }

        if (! empty($filtros['stock_alto'])) {
            $query->whereHas('producto', function ($q) {
                $q->whereColumn('stock_maximo', '>', 0)
                    ->whereRaw('(SELECT COALESCE(SUM(cantidad), 0) FROM stock_productos sp WHERE sp.producto_id = productos.id) > stock_maximo');
            });
        }

        if (! empty($filtros['busqueda'])) {
            $query->where(function ($q) use ($filtros) {
                $busqueda = $filtros['busqueda'];
                $q->where('productos.nombre', 'like', "%{$busqueda}%")
                    ->orWhere('productos.sku', 'like', "%{$busqueda}%")
                    ->orWhere('productos.codigo_barras', 'like', "%{$busqueda}%");
                if (is_numeric($busqueda)) {
                    $q->orWhere('productos.id', (int) $busqueda);
                }
            });
        }

        $stock = $query
            ->join('productos', 'stock_productos.producto_id', '=', 'productos.id')
            ->select('stock_productos.*')
            ->orderBy('productos.nombre', 'asc')
            ->paginate(20)
            ->withQueryString();

        // Estadísticas generales
        $estadisticas = [
            'total_productos'        => StockProducto::distinct('producto_id')->count(),
            'total_stock'            => StockProducto::sum('cantidad'),
            'productos_stock_bajo'   => Producto::query()->stockBajo()->count(),
            'productos_stock_alto'   => Producto::query()->stockAlto()->count(),
            'valor_total_inventario' => $this->calcularValorInventario($filtros),
        ];

        return Inertia::render('reportes/inventario/stock-actual', [
            'stock'        => $stock,
            'estadisticas' => $estadisticas,
            'filtros'      => $filtros,
            'almacenes'    => Almacen::orderBy('nombre')->get(['id', 'nombre']),
            'categorias'   => \App\Models\Categoria::orderBy('nombre')->get(['id', 'nombre']),
            'marcas'       => \App\Models\Marca::orderBy('nombre')->get(['id', 'nombre']),
        ]);
    }

    /**
     * Reporte de productos vencidos y próximos a vencer
     */
    public function vencimientos(Request $request): Response
    {
        $filtros = $request->validate([
            'almacen_id'        => ['nullable', 'exists:almacenes,id'],
            'dias_anticipacion' => ['nullable', 'integer', 'min:1', 'max:365'],
            'solo_vencidos'     => ['nullable', 'boolean'],
        ]);

        $diasAnticipacion = $filtros['dias_anticipacion'] ?? 30;
        $soloVencidos     = $filtros['solo_vencidos'] ?? false;

        $query = StockProducto::with(['producto.categoria', 'almacen'])
            ->whereNotNull('fecha_vencimiento')
            ->where('cantidad', '>', 0);

        if ($soloVencidos) {
            $query->where('fecha_vencimiento', '<', now());
        } else {
            $fechaLimite = now()->addDays($diasAnticipacion);
            $query->where('fecha_vencimiento', '<=', $fechaLimite);
        }

        if (! empty($filtros['almacen_id'])) {
            $query->where('almacen_id', $filtros['almacen_id']);
        }

        $productos = $query->orderBy('fecha_vencimiento')->paginate(50)->withQueryString();

        // Estadísticas
        $estadisticas = [
            'productos_vencidos'        => StockProducto::whereNotNull('fecha_vencimiento')
                ->where('fecha_vencimiento', '<', now())
                ->where('cantidad', '>', 0)
                ->count(),
            'productos_proximos_vencer' => StockProducto::whereNotNull('fecha_vencimiento')
                ->where('fecha_vencimiento', '<=', now()->addDays($diasAnticipacion))
                ->where('fecha_vencimiento', '>=', now())
                ->where('cantidad', '>', 0)
                ->count(),
            'valor_productos_vencidos'  => $this->calcularValorVencidos(),
        ];

        return Inertia::render('reportes/inventario/vencimientos', [
            'productos'    => $productos,
            'estadisticas' => $estadisticas,
            'filtros'      => $filtros,
            'almacenes'    => Almacen::orderBy('nombre')->get(['id', 'nombre']),
        ]);
    }

    /**
     * Reporte de rotación de inventario
     */
    public function rotacion(Request $request): Response
    {
        $filtros = $request->validate([
            'fecha_inicio' => ['nullable', 'date'],
            'fecha_fin'    => ['nullable', 'date'],
            'almacen_id'   => ['nullable', 'exists:almacenes,id'],
            'categoria_id' => ['nullable', 'exists:categorias,id'],
        ]);

        $fechaInicio = $filtros['fecha_inicio'] ?? now()->subMonths(3);
        $fechaFin    = $filtros['fecha_fin'] ?? now();

        // Productos con más salidas (mayor rotación)
        $rotacionQuery = MovimientoInventario::select([
            'stock_productos.producto_id',
            DB::raw("COUNT(CASE WHEN movimientos_inventario.tipo LIKE 'SALIDA_%' THEN 1 END) as total_salidas"),
            DB::raw("SUM(CASE WHEN movimientos_inventario.tipo LIKE 'SALIDA_%' THEN ABS(movimientos_inventario.cantidad) ELSE 0 END) as cantidad_vendida"),
            DB::raw('AVG(stock_productos.cantidad) as stock_promedio'),
            DB::raw("CASE WHEN AVG(stock_productos.cantidad) > 0 THEN SUM(CASE WHEN movimientos_inventario.tipo LIKE 'SALIDA_%' THEN ABS(movimientos_inventario.cantidad) ELSE 0 END) / AVG(stock_productos.cantidad) ELSE 0 END as indice_rotacion"),
        ])
            ->join('stock_productos', 'movimientos_inventario.stock_producto_id', '=', 'stock_productos.id')
            ->whereBetween('fecha', [$fechaInicio, $fechaFin])
            ->groupBy('stock_productos.producto_id');

        if (! empty($filtros['almacen_id'])) {
            $rotacionQuery->where('stock_productos.almacen_id', $filtros['almacen_id']);
        }

        // Para evitar problemas con count() en consultas complejas, obtenemos el total primero
        $totalQuery         = clone $rotacionQuery;
        $totalResultados    = $totalQuery->havingRaw("COUNT(CASE WHEN movimientos_inventario.tipo LIKE 'SALIDA_%' THEN 1 END) > 0")->get();
        $totalConMovimiento = $totalResultados->count();

        $rotacion = $rotacionQuery->havingRaw("COUNT(CASE WHEN movimientos_inventario.tipo LIKE 'SALIDA_%' THEN 1 END) > 0")
            ->orderByDesc('indice_rotacion')
            ->paginate(50)
            ->withQueryString();

        // Cargar productos para cada resultado
        $rotacion->getCollection()->transform(function ($item) {
            $producto       = Producto::find($item->producto_id);
            $item->producto = $producto ? $producto->only(['id', 'nombre']) : null;
            return $item;
        });

        // Estadísticas de rotación
        $estadisticas = [
            'productos_con_movimiento' => $totalConMovimiento,
            'productos_sin_movimiento' => Producto::whereDoesntHave('movimientos', function ($q) use ($fechaInicio, $fechaFin) {
                $q->whereBetween('fecha', [$fechaInicio, $fechaFin]);
            })->count(),
            'rotacion_promedio'        => $totalResultados->avg('indice_rotacion') ?? 0,
        ];

        return Inertia::render('reportes/inventario/rotacion', [
            'rotacion'     => $rotacion,
            'estadisticas' => $estadisticas,
            'filtros'      => $filtros,
            'almacenes'    => Almacen::orderBy('nombre')->get(['id', 'nombre']),
            'categorias'   => \App\Models\Categoria::orderBy('nombre')->get(['id', 'nombre']),
        ]);
    }

    /**
     * Reporte de movimientos de inventario
     */
    public function movimientos(Request $request): Response
    {
        $filtros = $request->validate([
            'fecha_inicio' => ['nullable', 'date'],
            'fecha_fin'    => ['nullable', 'date'],
            'tipo'         => ['nullable', 'string'],
            'almacen_id'   => ['nullable', 'exists:almacenes,id'],
            'producto_id'  => ['nullable', 'exists:productos,id'],
        ]);

        $fechaInicio = $filtros['fecha_inicio'] ?? now()->subMonth();
        $fechaFin    = $filtros['fecha_fin'] ?? now();

        $movimientos = MovimientoInventario::with([
            'stockProducto.producto:id,nombre',
            'stockProducto.almacen:id,nombre',
            'user:id,name',
        ])
            ->whereBetween('fecha', [$fechaInicio, $fechaFin]);

        // Aplicar filtros adicionales
        if (! empty($filtros['tipo'])) {
            $movimientos->where('tipo', $filtros['tipo']);
        }

        if (! empty($filtros['almacen_id'])) {
            $movimientos->whereHas('stockProducto', function ($q) use ($filtros) {
                $q->where('almacen_id', $filtros['almacen_id']);
            });
        }

        if (! empty($filtros['producto_id'])) {
            $movimientos->whereHas('stockProducto', function ($q) use ($filtros) {
                $q->where('producto_id', $filtros['producto_id']);
            });
        }

        $movimientos = $movimientos->orderByDesc('fecha')->paginate(100)->withQueryString();

        // Estadísticas de movimientos
        $estadisticas = [
            'total_entradas'       => MovimientoInventario::entradas()
                ->whereBetween('fecha', [$fechaInicio, $fechaFin])
                ->sum('cantidad'),
            'total_salidas'        => MovimientoInventario::salidas()
                ->whereBetween('fecha', [$fechaInicio, $fechaFin])
                ->sum(DB::raw('ABS(cantidad)')),
            'movimientos_por_tipo' => $this->obtenerMovimientosPorTipo($fechaInicio, $fechaFin),
        ];

        return Inertia::render('reportes/inventario/movimientos', [
            'movimientos'  => $movimientos,
            'estadisticas' => $estadisticas,
            'filtros'      => $filtros,
            'tipos'        => MovimientoInventario::getTipos(),
            'almacenes'    => Almacen::orderBy('nombre')->get(['id', 'nombre']),
        ]);
    }

    /**
     * Exportar reporte a Excel/CSV
     */
    /**
     * ✅ NUEVO: Exportar reportes en PDF A4
     *
     * GET /reportes/inventario/export-pdf
     * Parámetros: tipo=stock-actual|vencimientos|rotacion|movimientos
     */
    public function exportPdf(Request $request)
    {
        // Aumentar límite de memoria temporalmente para PDF con muchos datos
        ini_set('memory_limit', '4096M'); // 4GB
        set_time_limit(300); // 5 minutos de timeout

        $tipo = (string) $request->string('tipo');
        $filtros = $request->all();

        \Log::info("🔍 exportPdf DEBUG", ['tipo' => $tipo, 'tipo_var' => var_export($tipo, true), 'request_all' => $request->all()]);

        $datos = match ($tipo) {
            'stock-actual' => $this->obtenerDatosStockActual($filtros),
            'vencimientos' => $this->obtenerDatosVencimientos($filtros),
            'rotacion' => $this->obtenerDatosRotacion($filtros),
            'movimientos' => $this->obtenerDatosMovimientos($filtros),
            default => throw new \InvalidArgumentException("Tipo de reporte inválido: $tipo"),
        };

        $user = auth()->user();
        $empresa = null;

        if ($user && $user->empresa_id) {
            $empresa = \App\Models\Empresa::find($user->empresa_id);
        }

        $html = view("pdf.reportes-inventario.$tipo", [
            'datos' => $datos,
            'fecha_generacion' => now()->format('d/m/Y H:i'),
            'empresa' => $empresa?->razon_social ?? 'Sistema',
            'usuario' => $user?->name ?? 'Sin usuario',
            'filtros' => $filtros,
        ])->render();

        // Usar DomPDF para generar PDF - Landscape para reportes de inventario
        $orientation = ($tipo === 'stock-actual') ? 'landscape' : 'portrait';
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html)
            ->setPaper('A4', $orientation)
            ->setOption('margin-top', 10)
            ->setOption('margin-bottom', 10)
            ->setOption('margin-left', 10)
            ->setOption('margin-right', 10);

        return $pdf->download("reporte_inventario_{$tipo}_" . now()->format('Y-m-d_H-i-s') . '.pdf');
    }

    /**
     * ✅ MEJORADO: Exportar a Excel con datos completos
     */
    public function export(Request $request): JsonResponse
    {
        $tipo = (string) $request->string('tipo');
        $filtros = $request->all();

        // Obtener datos completos
        $datos = match ($tipo) {
            'stock-actual' => $this->obtenerDatosStockActual($filtros),
            'vencimientos' => $this->obtenerDatosVencimientos($filtros),
            'rotacion' => $this->obtenerDatosRotacion($filtros),
            'movimientos' => $this->obtenerDatosMovimientos($filtros),
            default => throw new \InvalidArgumentException("Tipo de reporte inválido: $tipo"),
        };

        return response()->json([
            'data' => $datos,
            'filename' => "reporte_inventario_{$tipo}_" . now()->format('Y-m-d_H-i-s') . '.xlsx',
            'timestamp' => now()->format('Y-m-d H:i:s'),
        ]);
    }

    /**
     * Métodos auxiliares privados
     */
    private function calcularValorInventario(array $filtros): float
    {
                    // Implementar cálculo del valor total del inventario
                    // usando precios de costo de los productos
        return 0.0; // Placeholder
    }

    private function calcularValorVencidos(): float
    {
                    // Implementar cálculo del valor de productos vencidos
        return 0.0; // Placeholder
    }

    private function obtenerMovimientosPorTipo(string $fechaInicio, string $fechaFin): array
    {
        return MovimientoInventario::select('tipo', DB::raw('COUNT(*) as cantidad'))
            ->whereBetween('fecha', [$fechaInicio, $fechaFin])
            ->groupBy('tipo')
            ->pluck('cantidad', 'tipo')
            ->toArray();
    }

    /**
     * ✅ IMPLEMENTADO: Obtener datos de stock actual para exportación
     */
    private function obtenerDatosStockActual(array $filtros): array
    {
        // Usar la misma lógica de filtrado que buscarStock para consistencia
        $query = StockProducto::with(['producto.marca', 'producto.categoria', 'producto.unidad', 'producto.proveedor', 'producto.codigosBarra', 'producto.precios.tipoPrecio', 'almacen']);

        // Filtro de stock: determinar qué mostrar
        if ($filtros['sin_stock'] ?? false) {
            // Si sin_stock es true, mostrar solo con cantidad = 0
            $query->where('cantidad', '=', 0);
        } elseif ($filtros['con_stock'] ?? true) {
            // Si con_stock es true (por defecto), mostrar solo con stock > 0
            $query->where('cantidad', '>', 0);
        }

        // Aplicar filtros
        if (!empty($filtros['almacen_id'])) {
            $query->where('almacen_id', $filtros['almacen_id']);
        }

        if (!empty($filtros['categoria_id'])) {
            $query->whereHas('producto', function ($q) use ($filtros) {
                $q->where('categoria_id', $filtros['categoria_id']);
            });
        }

        if (!empty($filtros['marca_id'])) {
            $query->whereHas('producto', function ($q) use ($filtros) {
                $q->where('marca_id', $filtros['marca_id']);
            });
        }

        // Filtro de búsqueda
        if (!empty($filtros['busqueda'])) {
            $busqueda = $filtros['busqueda'];
            $busquedaBaja = strtolower($busqueda);

            $query->where(function ($q) use ($busqueda, $busquedaBaja) {
                $q->whereRaw('LOWER(productos.sku) LIKE ?', ["%{$busquedaBaja}%"])
                    ->orWhereRaw('LOWER(productos.codigo_barras) LIKE ?', ["%{$busquedaBaja}%"]);

                if (is_numeric($busqueda)) {
                    $q->orWhere('productos.id', (int) $busqueda);
                }

                $q->orWhereRaw('LOWER(productos.nombre) LIKE ?', ["%{$busquedaBaja}%"]);
            });
        }

        $stockProductos = $query
            ->join('productos', 'stock_productos.producto_id', '=', 'productos.id')
            ->select('stock_productos.*')
            ->orderBy('productos.nombre', 'asc')
            ->get();

        // Mapear datos para la exportación
        $resultado = [];
        foreach ($stockProductos as $stock) {
            $producto = $stock->producto;

            // Obtener todos los tipos de precio y sus valores
            $preciosPorTipo = $producto->precios->mapWithKeys(function ($precio) {
                $tipoNombre = $precio->tipoPrecio?->nombre ?? 'Desconocido';
                return [$tipoNombre => $precio->precio];
            })->toArray();

            // Obtener códigos de barra
            $codigosBarra = $producto->codigosBarra?->pluck('codigo')->join(', ') ?? '-';

            // Construir fila
            $resultado[] = array_merge([
                'id_producto' => $producto->id,
                'nombre' => $producto->nombre ?? 'N/A',
                'sku' => $producto->sku ?? '-',
                'marca' => $producto->marca?->nombre ?? 'N/A',
                'categoria' => $producto->categoria?->nombre ?? 'N/A',
                'unidad' => $producto->unidad?->nombre ?? 'N/A',
                'proveedor' => $producto->proveedor?->nombre ?? 'N/A',
                'codigos_barra' => $codigosBarra,
                'almacen' => $stock->almacen?->nombre ?? 'N/A',
                'stock_total' => round($stock->cantidad, 2),
            ], $preciosPorTipo);
        }

        return $resultado;
    }

    /**
     * ✅ IMPLEMENTADO: Obtener datos de vencimientos para exportación
     */
    private function obtenerDatosVencimientos(array $filtros): array
    {
        $query = \App\Models\StockProductoLote::with(['producto', 'almacen'])
            ->whereNotNull('fecha_vencimiento');

        // Filtrar vencidos si es necesario
        if (!empty($filtros['solo_vencidos'])) {
            $query->whereDate('fecha_vencimiento', '<', now());
        }

        $lotes = $query->orderBy('fecha_vencimiento')->get();

        return $lotes->map(function ($lote) {
            $fecha_venc = \Carbon\Carbon::parse($lote->fecha_vencimiento);
            $dias_restantes = $fecha_venc->diffInDays(now(), false);
            $estado = $dias_restantes < 0 ? 'VENCIDO' : 'PRÓXIMO';

            return [
                'nombre' => $lote->producto?->nombre ?? 'N/A',
                'lote' => $lote->numero_lote ?? 'N/A',
                'fecha_vencimiento' => $fecha_venc->format('d/m/Y'),
                'cantidad' => $lote->cantidad,
                'estado' => $estado,
                'dias_restantes' => abs(intval($dias_restantes)),
            ];
        })->toArray();
    }

    /**
     * ✅ IMPLEMENTADO: Obtener datos de rotación para exportación
     */
    private function obtenerDatosRotacion(array $filtros): array
    {
        $productos = Producto::with('movimientos')
            ->orderBy('nombre')
            ->get();

        return $productos->map(function ($producto) {
            $movimientos = $producto->movimientos;
            $entrada = $movimientos->where('tipo', 'ENTRADA')->sum('cantidad');
            $salida = $movimientos->where('tipo', 'SALIDA')->sum('cantidad');
            $rotacion = $entrada > 0 ? ($salida / $entrada) * 100 : 0;

            // Clasificar por rotación
            if ($rotacion > 50) {
                $clasificacion = 'ALTO';
            } elseif ($rotacion > 20) {
                $clasificacion = 'MEDIO';
            } else {
                $clasificacion = 'BAJO';
            }

            return [
                'nombre' => $producto->nombre,
                'entrada' => $entrada,
                'salida' => $salida,
                'rotacion' => round($rotacion, 2),
                'clasificacion' => $clasificacion,
                'velocidad' => round($rotacion / 30, 2) . ' %/día', // Velocidad mensual
            ];
        })->toArray();
    }

    /**
     * ✅ IMPLEMENTADO: Obtener datos de movimientos para exportación
     */
    private function obtenerDatosMovimientos(array $filtros): array
    {
        $query = MovimientoInventario::with(['producto', 'almacen', 'usuario'])
            ->orderBy('fecha', 'desc');

        // Aplicar filtros
        if (!empty($filtros['tipo']) && $filtros['tipo'] !== 'all') {
            $query->where('tipo', $filtros['tipo']);
        }

        if (!empty($filtros['almacen_id']) && $filtros['almacen_id'] !== 'all') {
            $query->where('almacen_id', $filtros['almacen_id']);
        }

        if (!empty($filtros['fecha_desde'])) {
            $query->whereDate('fecha', '>=', $filtros['fecha_desde']);
        }

        if (!empty($filtros['fecha_hasta'])) {
            $query->whereDate('fecha', '<=', $filtros['fecha_hasta']);
        }

        $movimientos = $query->limit(1000)->get();

        return $movimientos->map(function ($mov) {
            return [
                'fecha' => \Carbon\Carbon::parse($mov->fecha)->format('d/m/Y H:i'),
                'nombre' => $mov->producto?->nombre ?? 'N/A',
                'tipo' => $mov->tipo,
                'cantidad' => $mov->cantidad,
                'almacen' => $mov->almacen?->nombre ?? 'N/A',
                'referencia' => $mov->referencia ?? '-',
                'usuario' => $mov->usuario?->name ?? '-',
            ];
        })->toArray();
    }

    /**
     * Búsqueda en tiempo real para stock actual (POST)
     * POST /reportes/inventario/buscar-stock
     */
    public function buscarStock(Request $request): JsonResponse
    {
        $filtros = $request->validate([
            'almacen_id'   => ['nullable', 'exists:almacenes,id'],
            'categoria_id' => ['nullable', 'exists:categorias,id'],
            'marca_id'     => ['nullable', 'exists:marcas,id'],
            'con_stock'    => ['nullable', 'boolean'],
            'sin_stock'    => ['nullable', 'boolean'],
            'busqueda'     => ['nullable', 'string', 'max:100'],
            'page'         => ['nullable', 'integer', 'min:1'],
            'per_page'     => ['nullable', 'integer', 'in:10,20,50,100'],
        ]);

        $page = $filtros['page'] ?? 1;
        $perPage = $filtros['per_page'] ?? 20;

        $query = StockProducto::with(['producto.marca', 'producto.categoria', 'almacen']);

        // Filtro de stock: determinar qué mostrar
        if ($filtros['sin_stock'] ?? false) {
            // Si sin_stock es true, mostrar solo con cantidad = 0
            $query->where('cantidad', '=', 0);
        } elseif ($filtros['con_stock'] ?? true) {
            // Si con_stock es true (por defecto), mostrar solo con stock > 0
            $query->where('cantidad', '>', 0);
        }
        // Si ambos son false, mostrar todos

        // Aplicar filtros
        if (!empty($filtros['almacen_id'])) {
            $query->where('almacen_id', $filtros['almacen_id']);
        }

        if (!empty($filtros['categoria_id'])) {
            $query->whereHas('producto', function ($q) use ($filtros) {
                $q->where('categoria_id', $filtros['categoria_id']);
            });
        }

        if (!empty($filtros['marca_id'])) {
            $query->whereHas('producto', function ($q) use ($filtros) {
                $q->where('marca_id', $filtros['marca_id']);
            });
        }

        if (!empty($filtros['busqueda'])) {
            $busqueda = $filtros['busqueda'];
            $busquedaBaja = strtolower($busqueda);

            $query->where(function ($q) use ($busqueda, $busquedaBaja) {
                // Búsqueda prioritaria: ID, SKU, Código de Barra (case insensitive)
                $q->whereRaw('LOWER(productos.sku) LIKE ?', ["%{$busquedaBaja}%"])
                    ->orWhereRaw('LOWER(productos.codigo_barras) LIKE ?', ["%{$busquedaBaja}%"]);

                // Si es numérico, buscar también por ID
                if (is_numeric($busqueda)) {
                    $q->orWhere('productos.id', (int) $busqueda);
                }

                // Segunda prioridad: Nombre (case insensitive)
                $q->orWhereRaw('LOWER(productos.nombre) LIKE ?', ["%{$busquedaBaja}%"]);
            });
        }

        $stock = $query
            ->join('productos', 'stock_productos.producto_id', '=', 'productos.id')
            ->select('stock_productos.*')
            ->orderByRaw("
                CASE
                    WHEN CAST(productos.id AS TEXT) = ? THEN 1
                    WHEN LOWER(productos.sku) = LOWER(?) THEN 2
                    WHEN LOWER(productos.codigo_barras) = LOWER(?) THEN 3
                    WHEN LOWER(productos.sku) LIKE LOWER(?) THEN 4
                    WHEN LOWER(productos.codigo_barras) LIKE LOWER(?) THEN 5
                    ELSE 6
                END, productos.nombre ASC
            ", [
                $filtros['busqueda'] ?? '',
                $filtros['busqueda'] ?? '',
                $filtros['busqueda'] ?? '',
                '%' . ($filtros['busqueda'] ?? '') . '%',
                '%' . ($filtros['busqueda'] ?? '') . '%',
            ])
            ->paginate($perPage, ['stock_productos.*'], 'page', $page);

        return response()->json([
            'data' => $stock->items(),
            'pagination' => [
                'total' => $stock->total(),
                'per_page' => $stock->perPage(),
                'current_page' => $stock->currentPage(),
                'last_page' => $stock->lastPage(),
                'has_more' => $stock->hasMorePages(),
            ],
        ]);
    }
}
