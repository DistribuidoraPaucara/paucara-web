<?php
namespace App\Http\Controllers;

use App\Exports\StockActualExport;
use App\Exports\MovimientosInventarioExport;
use App\Exports\ProductosBajoMinimoExport;
use App\Exports\StockValorizadoExport;
use App\Exports\ProductosSinMovimientoExport;
use App\Exports\VencimientosExport;
use App\Exports\KardexProductoExport;
use App\Exports\RotacionInventarioExport;
use App\Helpers\ApiResponse;
use App\Models\Almacen;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\StockProducto;
use App\Services\ReporteInventarioService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class ReporteInventarioApiController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:inventario.reportes')->only([
            'estadisticasGenerales',
            'stockBajo',
            'proximosVencer',
            'vencidos',
            'movimientosPorPeriodo',
            'productosMasMovidos',
            'valorizacionInventario',
        ]);
    }

    /**
     * Estadísticas generales de inventario
     */
    public function estadisticasGenerales(): JsonResponse
    {
        $estadisticas = [
            'total_productos'           => Producto::where('activo', true)->count(),
            'productos_stock_bajo'      => Producto::query()->stockBajo()->count(),
            'productos_proximos_vencer' => Producto::query()->proximosVencer(30)->count(),
            'productos_vencidos'        => Producto::query()->vencidos()->count(),
            'valor_total_inventario'    => StockProducto::join('productos', 'stock_productos.producto_id', '=', 'productos.id')
                ->selectRaw('SUM(stock_productos.cantidad * productos.precio_compra) as total')
                ->value('total') ?? 0,
            'stock_por_almacen'         => Almacen::withSum('stockProductos', 'cantidad')
                ->where('activo', true)
                ->get(['id', 'nombre'])
                ->map(function ($almacen) {
                    return [
                        'almacen_id'     => $almacen->id,
                        'almacen_nombre' => $almacen->nombre,
                        'stock_total'    => $almacen->stock_productos_sum_cantidad ?? 0,
                    ];
                }),
        ];

        return ApiResponse::success($estadisticas);
    }

    /**
     * Productos con stock bajo
     */
    public function stockBajo(Request $request): JsonResponse
    {
        $almacenId = $request->integer('almacen_id');
        $perPage   = $request->integer('per_page', 20);

        $productos = Producto::query()->stockBajo()
            ->with(['categoria:id,nombre', 'marca:id,nombre'])
            ->with(['stock' => function ($query) use ($almacenId) {
                if ($almacenId) {
                    $query->where('almacen_id', $almacenId);
                }
                $query->with('almacen:id,nombre');
            }])
            ->when($almacenId, function ($query) use ($almacenId) {
                $query->whereHas('stock', function ($q) use ($almacenId) {
                    $q->where('almacen_id', $almacenId);
                });
            })
            ->withCount(['stock as stock_total' => function ($query) {
                $query->select(DB::raw('COALESCE(SUM(cantidad), 0)'));
            }])
            ->paginate($perPage);

        return ApiResponse::success($productos);
    }

    /**
     * Productos próximos a vencer
     */
    public function proximosVencer(Request $request): JsonResponse
    {
        $dias      = $request->integer('dias', 30);
        $almacenId = $request->integer('almacen_id');
        $perPage   = $request->integer('per_page', 20);

        $productos = Producto::proximosVencer($dias)
            ->with(['categoria:id,nombre', 'marca:id,nombre'])
            ->with(['stock' => function ($query) use ($almacenId) {
                if ($almacenId) {
                    $query->where('almacen_id', $almacenId);
                }
                $query->whereNotNull('fecha_vencimiento')
                    ->orderBy('fecha_vencimiento')
                    ->with('almacen:id,nombre');
            }])
            ->when($almacenId, function ($query) use ($almacenId) {
                $query->whereHas('stock', function ($q) use ($almacenId) {
                    $q->where('almacen_id', $almacenId);
                });
            })
            ->paginate($perPage);

        return ApiResponse::success($productos);
    }

    /**
     * Productos vencidos
     */
    public function vencidos(Request $request): JsonResponse
    {
        $almacenId = $request->integer('almacen_id');
        $perPage   = $request->integer('per_page', 20);

        $productos = Producto::query()->vencidos()
            ->with(['categoria:id,nombre', 'marca:id,nombre'])
            ->with(['stock' => function ($query) use ($almacenId) {
                if ($almacenId) {
                    $query->where('almacen_id', $almacenId);
                }
                $query->whereNotNull('fecha_vencimiento')
                    ->where('fecha_vencimiento', '<', now())
                    ->orderBy('fecha_vencimiento')
                    ->with('almacen:id,nombre');
            }])
            ->when($almacenId, function ($query) use ($almacenId) {
                $query->whereHas('stock', function ($q) use ($almacenId) {
                    $q->where('almacen_id', $almacenId);
                });
            })
            ->paginate($perPage);

        return ApiResponse::success($productos);
    }

    /**
     * Movimientos por período
     */
    public function movimientosPorPeriodo(Request $request): JsonResponse
    {
        $fechaInicio = $request->date('fecha_inicio', now()->subMonth());
        $fechaFin    = $request->date('fecha_fin', now());
        $almacenId   = $request->integer('almacen_id');
        $tipo        = $request->string('tipo');

        $movimientos = MovimientoInventario::with([
            'stockProducto.producto:id,nombre,codigo',
            'stockProducto.almacen:id,nombre',
            'user:id,name',
        ])
            ->whereBetween('fecha', [$fechaInicio, $fechaFin])
            ->when($almacenId, function ($q) use ($almacenId) {
                $q->whereHas('stockProducto', fn($sq) => $sq->where('almacen_id', $almacenId));
            })
            ->when($tipo, fn($q) => $q->where('tipo', $tipo))
            ->orderByDesc('fecha')
            ->orderByDesc('id')
            ->get();

        // Agrupar por tipo
        $resumenPorTipo = $movimientos->groupBy('tipo')->map(function ($items, $tipo) {
            return [
                'tipo'                 => $tipo,
                'cantidad_movimientos' => $items->count(),
                'cantidad_total'       => $items->sum('cantidad'),
                'valor_total'          => $items->sum(function ($mov) {
                    return abs($mov->cantidad) * ($mov->stockProducto->producto->precio_compra ?? 0);
                }),
            ];
        })->values();

        return ApiResponse::success([
            'movimientos'       => $movimientos,
            'resumen_por_tipo'  => $resumenPorTipo,
            'total_movimientos' => $movimientos->count(),
            'periodo'           => [
                'fecha_inicio' => $fechaInicio->format('Y-m-d'),
                'fecha_fin'    => $fechaFin->format('Y-m-d'),
            ],
        ]);
    }

    /**
     * Productos más movidos en un período
     */
    public function productosMasMovidos(Request $request): JsonResponse
    {
        $fechaInicio = $request->date('fecha_inicio', now()->subMonth());
        $fechaFin    = $request->date('fecha_fin', now());
        $limite      = $request->integer('limite', 20);
        $almacenId   = $request->integer('almacen_id');

        $productos = DB::table('movimientos_inventario')
            ->select([
                'productos.id',
                'productos.nombre',
                'productos.codigo',
                DB::raw('COUNT(*) as total_movimientos'),
                DB::raw('SUM(ABS(movimientos_inventario.cantidad)) as cantidad_total'),
                DB::raw('AVG(ABS(movimientos_inventario.cantidad)) as promedio_movimiento'),
            ])
            ->join('stock_productos', 'movimientos_inventario.stock_producto_id', '=', 'stock_productos.id')
            ->join('productos', 'stock_productos.producto_id', '=', 'productos.id')
            ->whereBetween('movimientos_inventario.fecha', [$fechaInicio, $fechaFin])
            ->when($almacenId, fn($q) => $q->where('stock_productos.almacen_id', $almacenId))
            ->groupBy('productos.id', 'productos.nombre', 'productos.codigo')
            ->orderByDesc('total_movimientos')
            ->limit($limite)
            ->get();

        return ApiResponse::success([
            'productos' => $productos,
            'periodo'   => [
                'fecha_inicio' => $fechaInicio->format('Y-m-d'),
                'fecha_fin'    => $fechaFin->format('Y-m-d'),
            ],
        ]);
    }

    /**
     * Valorización de inventario por almacén
     */
    public function valorizacionInventario(Request $request): JsonResponse
    {
        $almacenId = $request->integer('almacen_id');

        $query = StockProducto::with(['producto:id,nombre,codigo,precio_compra,precio_venta', 'almacen:id,nombre'])
            ->where('cantidad', '>', 0);

        if ($almacenId) {
            $query->where('almacen_id', $almacenId);
        }

        $stocks = $query->get();

        $valorizacion = $stocks->groupBy('almacen.nombre')->map(function ($items, $almacenNombre) {
            $valorCompra = $items->sum(function ($stock) {
                return $stock->cantidad * ($stock->producto->precio_compra ?? 0);
            });

            $valorVenta = $items->sum(function ($stock) {
                return $stock->cantidad * ($stock->producto->precio_venta ?? 0);
            });

            return [
                'almacen'         => $almacenNombre,
                'total_productos' => $items->count(),
                'cantidad_total'  => $items->sum('cantidad'),
                'valor_compra'    => $valorCompra,
                'valor_venta'     => $valorVenta,
                'margen_bruto'    => $valorVenta - $valorCompra,
                'productos'       => $items->map(function ($stock) {
                    return [
                        'producto_id'        => $stock->producto->id,
                        'producto_nombre'    => $stock->producto->nombre,
                        'producto_codigo'    => $stock->producto->codigo,
                        'cantidad'           => $stock->cantidad,
                        'precio_compra'      => $stock->producto->precio_compra,
                        'precio_venta'       => $stock->producto->precio_venta,
                        'valor_total_compra' => $stock->cantidad * ($stock->producto->precio_compra ?? 0),
                        'valor_total_venta'  => $stock->cantidad * ($stock->producto->precio_venta ?? 0),
                    ];
                }),
            ];
        });

        return ApiResponse::success($valorizacion);
    }

    /**
     * Generar reporte de inventario en formato especificado
     * GET /api/inventario/reportes/generar
     */
    public function generar(Request $request)
    {
        try {
            // Limpiar parámetros vacíos
            $data = $request->all();
            $data = array_filter($data, function ($value) {
                return $value !== '' && $value !== null;
            });

            // Permitir 'pdf' como alias para '80mm'
            if (isset($data['formato']) && $data['formato'] === 'pdf') {
                $data['formato'] = '80mm';
            }

            // Convertir strings booleanos a booleanos reales
            if (isset($data['incluir_sin_movimientos'])) {
                $data['incluir_sin_movimientos'] = filter_var($data['incluir_sin_movimientos'], FILTER_VALIDATE_BOOLEAN);
            }
            if (isset($data['solo_con_stock'])) {
                $data['solo_con_stock'] = filter_var($data['solo_con_stock'], FILTER_VALIDATE_BOOLEAN);
            }

            // Validar parámetros
            $validated = \Illuminate\Support\Facades\Validator::make($data, [
                'tipo_reporte' => 'required|in:stock_actual,movimientos,stock_valorizado,productos_bajo_minimo,productos_sin_movimiento,vencimientos,kardex,rotacion_inventario',
                'formato' => 'required|in:excel,csv,80mm,58mm',
                'almacen_id' => 'nullable|integer|exists:almacenes,id',
                'categoria_id' => 'nullable|integer|exists:categorias,id',
                'fecha_desde' => 'nullable|date',
                'fecha_hasta' => 'nullable|date',
                'incluir_sin_movimientos' => 'nullable|boolean',
                'solo_con_stock' => 'nullable|boolean',
                'producto_id' => 'nullable|integer|exists:productos,id',
            ])->validate();

            // Inyectar servicio
            $servicio = new ReporteInventarioService();

            // Obtener datos según tipo de reporte
            $datos = match ($validated['tipo_reporte']) {
                'stock_actual' => $servicio->obtenerStockActual($validated),
                'movimientos' => $servicio->obtenerMovimientos($validated),
                'stock_valorizado' => $servicio->obtenerStockValorizado($validated),
                'productos_bajo_minimo' => $servicio->obtenerProductosBajoMinimo($validated),
                'productos_sin_movimiento' => $servicio->obtenerProductosSinMovimiento($validated),
                'vencimientos' => $servicio->obtenerVencimientos($validated),
                'kardex' => $servicio->obtenerKardex($validated),
                'rotacion_inventario' => $servicio->obtenerRotacion($validated),
            };

            // Generar archivo según formato
            return match ($validated['formato']) {
                'excel' => $this->generarExcel($validated['tipo_reporte'], $datos),
                'csv' => $this->generarCsv($validated['tipo_reporte'], $datos),
                '80mm' => $this->generarImpresion($validated['tipo_reporte'], $datos, '80'),
                '58mm' => $this->generarImpresion($validated['tipo_reporte'], $datos, '58'),
            };
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error generando reporte', [
                'tipo_reporte' => $request->input('tipo_reporte'),
                'formato' => $request->input('formato'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al generar el reporte',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generar Excel - Actualmente se genera en formato CSV
     * por compatibilidad con la versión instalada de Laravel Excel
     */
    private function generarExcel(string $tipoReporte, $datos)
    {
        // Generar como CSV en lugar de Excel por problemas de compatibilidad
        // El navegador puede abrir CSV y el usuario puede guardarlo como Excel
        \Log::info('Excel requested, generating as CSV for compatibility');
        return $this->generarCsv($tipoReporte, $datos);
    }

    /**
     * Generar CSV
     */
    private function generarCsv(string $tipoReporte, $datos)
    {
        $csv = '';

        // Encabezados basados en tipo de reporte
        $encabezados = match ($tipoReporte) {
            'stock_actual' => ['Almacén', 'Código', 'Nombre Producto', 'Cantidad', 'Disponible', 'Reservado', 'Precio Compra', 'Precio Venta', 'Valor Compra', 'Valor Venta', 'Stock Mínimo', 'Fecha Actualización'],
            'movimientos' => ['Fecha', 'Almacén', 'Código', 'Nombre Producto', 'Tipo Movimiento', 'Cantidad', 'Motivo', 'Usuario', 'Referencia'],
            'stock_valorizado' => ['Almacén', 'Código', 'Nombre Producto', 'Cantidad', 'Valor Compra', 'Valor Venta', 'Margen Bruto', 'Margen %'],
            'productos_bajo_minimo' => ['Código', 'Nombre Producto', 'Almacén', 'Stock Actual', 'Stock Mínimo', 'Falta', 'Precio Compra', 'Precio Venta', 'Categoría'],
            'productos_sin_movimiento' => ['Código', 'Nombre Producto', 'Almacén', 'Categoría', 'Cantidad Stock', 'Precio Compra', 'Precio Venta', 'Valor Inmobilizado', 'Días Sin Movimiento', 'Última Actualización'],
            'vencimientos' => ['Código', 'Nombre Producto', 'Almacén', 'Categoría', 'Cantidad', 'Fecha Vencimiento', 'Días para Vencer', 'Estado', 'Precio Compra', 'Valor Total'],
            'kardex' => ['Fecha', 'Almacén', 'Tipo Movimiento', 'Cantidad', 'Motivo', 'Usuario', 'Referencia', 'Observaciones'],
            'rotacion_inventario' => ['Código', 'Nombre Producto', 'Categoría', 'Total Movimientos', 'Cantidad Total Movida', 'Promedio por Movimiento', 'Última Fecha Movimiento', 'Clasificación Rotación'],
        };

        // Agregar encabezados
        $csv .= implode(',', $encabezados) . "\n";

        // Agregar datos
        foreach ($datos as $fila) {
            $valores = array_values((array) $fila);
            $csv .= implode(',', array_map(function ($val) {
                $val = str_replace('"', '""', $val);
                return '"' . $val . '"';
            }, $valores)) . "\n";
        }

        return response($csv)
            ->header('Content-Type', 'text/csv; charset=utf-8')
            ->header('Content-Disposition', 'attachment; filename=reporte_' . $tipoReporte . '_' . now()->format('Y-m-d_H-i-s') . '.csv');
    }

    /**
     * Generar Impresión en formatos 80mm y 58mm
     */
    private function generarImpresion(string $tipoReporte, $datos, string $formato)
    {
        $sufijo = $formato === '80' ? '80' : '58';
        $tipoReporteFormato = str_replace('_', '-', $tipoReporte);
        $vista = "impresion.reportes.{$tipoReporteFormato}-{$sufijo}";

        try {
            // Validar que la vista exista
            if (!\Illuminate\Support\Facades\View::exists($vista)) {
                \Log::error('Vista no encontrada', [
                    'vista' => $vista,
                    'tipo_reporte' => $tipoReporte,
                    'formato' => $sufijo,
                ]);

                throw new \Exception("La vista '{$vista}' no existe. Reportes disponibles: stock_actual, movimientos, stock_valorizado, productos_bajo_minimo, productos_sin_movimiento, vencimientos, kardex, rotacion");
            }

            // Obtener configuración de empresa
            $empresa = \App\Models\Empresa::first() ?? new \App\Models\Empresa();
            $usuario = auth()->user();

            $pdf = Pdf::loadView($vista, [
                'datos' => $datos,
                'empresa' => $empresa,
                'fecha_impresion' => now(),
                'usuario' => $usuario,
            ]);

            // Configurar formato de papel según tamaño
            if ($formato === '80') {
                $pdf->setPaper([0, 0, 226.77, 841.89], 'portrait'); // 80mm x 297mm
            } else {
                $pdf->setPaper([0, 0, 164.41, 841.89], 'portrait'); // 58mm x 297mm
            }

            $pdf->setOption('enable-local-file-access', true);

            $nombreArchivo = "reporte_{$tipoReporte}_{$sufijo}mm_" . now()->format('Y-m-d_H-i-s') . '.pdf';
            return $pdf->download($nombreArchivo);
        } catch (\Exception $e) {
            \Log::error('Error generando impresión', [
                'tipo_reporte' => $tipoReporte,
                'formato' => $sufijo,
                'vista' => $vista,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al generar impresión',
                'error' => $e->getMessage(),
                'vista' => $vista,
            ], 500);
        }
    }
}
