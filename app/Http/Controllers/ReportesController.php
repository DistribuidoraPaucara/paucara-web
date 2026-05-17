<?php

namespace App\Http\Controllers;

use App\Models\Prestable;
use App\Models\PrestamoCliente;
use App\Models\PrestamoProveedor;
use App\Models\PrestableStock;
use App\Services\Prestamos\PrestableStockService;
use App\Services\Prestamos\PrestamoProveedorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * ReportesController - Reportes de prestamos
 *
 * Rutas:
 * - GET /api/reportes/stock - Stock actual por almacén
 * - GET /api/reportes/stock/bajo - Stock bajo (disponible < 10)
 * - GET /api/reportes/prestamos/cliente - Préstamos activos por cliente
 * - GET /api/reportes/devoluciones/pendientes - Devoluciones pendientes
 * - GET /api/reportes/proveedor/deudas - Deudas totales con proveedores
 */
class ReportesController extends Controller
{
    public function __construct(
        private PrestableStockService $stockService,
        private PrestamoProveedorService $prestamoProveedorService
    ) {
    }

    /**
     * GET /api/reportes/stock
     * Reporte de stock actual por almacén
     */
    public function reporteStock(Request $request): JsonResponse
    {
        try {
            $almacenId = $request->integer('almacenes_prestables_id') ?? auth()->user()->empresa->almacenes_prestables_id ?? 1;

            $stocks = PrestableStock::where('almacenes_prestables_id', $almacenId)
                ->with(['prestable' => function ($q) {
                    $q->select('id', 'nombre', 'codigo', 'tipo', 'capacidad');
                }, 'almacenPrestable'])
                ->get()
                ->map(function ($stock) {
                    return [
                        'prestable_id' => $stock->prestable_id,
                        'prestable_nombre' => $stock->prestable->nombre,
                        'prestable_codigo' => $stock->prestable->codigo,
                        'prestable_tipo' => $stock->prestable->tipo,
                        'cantidad_disponible' => $stock->cantidad_disponible,
                        'cantidad_en_prestamo_cliente' => $stock->cantidad_en_prestamo_cliente,
                        'cantidad_que_debo_devolver' => $stock->cantidad_que_debo_devolver,
                        'cantidad_vendida' => $stock->cantidad_vendida,
                        'cantidad_total' => $stock->cantidad_disponible +
                                           $stock->cantidad_en_prestamo_cliente +
                                           $stock->cantidad_que_debo_devolver +
                                           $stock->cantidad_vendida,
                    ];
                });

            return response()->json([
                'success' => true,
                'almacenes_prestables_id' => $almacenId,
                'data' => $stocks,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error en reporte de stock', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error generando reporte'], 500);
        }
    }

    /**
     * GET /api/reportes/stock/bajo
     * Reporte de stock bajo
     */
    public function reporteStockBajo(Request $request): JsonResponse
    {
        try {
            $almacenId = $request->integer('almacenes_prestables_id') ?? auth()->user()->empresa->almacenes_prestables_id ?? 1;
            $limite = $request->integer('limite', 10);

            $stockBajo = PrestableStock::where('almacenes_prestables_id', $almacenId)
                ->where('cantidad_disponible', '<', $limite)
                ->with(['prestable' => function ($q) {
                    $q->select('id', 'nombre', 'codigo', 'tipo');
                }])
                ->get()
                ->map(function ($stock) {
                    return [
                        'prestable_id' => $stock->prestable_id,
                        'prestable_nombre' => $stock->prestable->nombre,
                        'prestable_codigo' => $stock->prestable->codigo,
                        'cantidad_disponible' => $stock->cantidad_disponible,
                        'cantidad_total' => $stock->cantidad_disponible +
                                           $stock->cantidad_en_prestamo_cliente +
                                           $stock->cantidad_que_debo_devolver,
                    ];
                });

            return response()->json([
                'success' => true,
                'limite' => $limite,
                'cantidad_items' => $stockBajo->count(),
                'data' => $stockBajo,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error en reporte de stock bajo', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error generando reporte'], 500);
        }
    }

    /**
     * GET /api/reportes/stock-bajo-prestables
     * Lista de prestables con stock bajo
     */
    public function stockBajoPrestables(Request $request): JsonResponse
    {
        try {
            $almacenId = $request->integer('almacenes_prestables_id') ?? auth()->user()->empresa->almacenes_prestables_id ?? 1;
            $limite = $request->integer('limite', 10);

            // Obtener prestables con stock bajo
            $prestables = Prestable::whereHas('stocks', function ($q) use ($almacenId, $limite) {
                $q->where('almacenes_prestables_id', $almacenId)
                  ->where('cantidad_disponible', '<', $limite);
            })
            ->with(['stocks' => function ($q) use ($almacenId) {
                $q->where('almacenes_prestables_id', $almacenId);
            }])
            ->get();

            return response()->json([
                'success' => true,
                'almacenes_prestables_id' => $almacenId,
                'limite' => $limite,
                'data' => $prestables,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error en reporte de prestables con stock bajo', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error generando reporte'], 500);
        }
    }

    /**
     * GET /api/reportes/prestamos/cliente
     * Reporte de préstamos activos por cliente
     */
    public function reportePrestamosCliente(Request $request): JsonResponse
    {
        try {
            $query = PrestamoCliente::where('estado', 'ACTIVO')
                ->with(['prestable:id,nombre,codigo', 'cliente:id,nombre,razon_social'])
                ->orderByDesc('fecha_esperada_devolucion');

            if ($request->has('cliente_id')) {
                $query->where('cliente_id', $request->integer('cliente_id'));
            }

            $prestamos = $query->get()
                ->map(function ($prestamo) {
                    return [
                        'id' => $prestamo->id,
                        'cliente_id' => $prestamo->cliente_id,
                        'cliente_nombre' => $prestamo->cliente->nombre,
                        'prestable_nombre' => $prestamo->prestable->nombre,
                        'cantidad' => $prestamo->cantidad,
                        'monto_garantia' => $prestamo->monto_garantia,
                        'fecha_prestamo' => $prestamo->fecha_prestamo->format('Y-m-d'),
                        'fecha_esperada' => $prestamo->fecha_esperada_devolucion?->format('Y-m-d'),
                        'dias_pendiente' => $prestamo->fecha_esperada_devolucion ? $prestamo->fecha_esperada_devolucion->diffInDays(now()) : null,
                        'estado' => $prestamo->estado,
                    ];
                });

            return response()->json([
                'success' => true,
                'cantidad_total' => $prestamos->count(),
                'data' => $prestamos,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error en reporte de préstamos', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error generando reporte'], 500);
        }
    }

    /**
     * GET /api/reportes/devoluciones/pendientes
     * Reporte de devoluciones pendientes (vencidas)
     */
    public function reporteDevolucionesPendientes(Request $request): JsonResponse
    {
        try {
            $hoy = now();
            $diasAlerta = $request->integer('dias_alerta', 3);

            $pendientes = PrestamoCliente::whereIn('estado', ['ACTIVO', 'PARCIALMENTE_DEVUELTO'])
                ->where('fecha_esperada_devolucion', '<', $hoy->addDays($diasAlerta))
                ->with([
                    'prestable:id,nombre,codigo',
                    'cliente:id,nombre,razon_social',
                    'chofer:id,name',
                    'devoluciones',
                ])
                ->get()
                ->map(function ($prestamo) {
                    $cantidadDevuelta = $prestamo->devoluciones->sum('cantidad_devuelta');
                    $pendiente = $prestamo->cantidad - $cantidadDevuelta;

                    return [
                        'id' => $prestamo->id,
                        'cliente' => $prestamo->cliente->nombre,
                        'prestable' => $prestamo->prestable->nombre,
                        'chofer' => $prestamo->chofer->name ?? 'Sin asignar',
                        'cantidad_pendiente' => $pendiente,
                        'fecha_esperada' => $prestamo->fecha_esperada_devolucion->format('Y-m-d'),
                        'dias_vencidos' => max(0, now()->diffInDays($prestamo->fecha_esperada_devolucion) * -1),
                        'estado' => $prestamo->estado,
                    ];
                });

            return response()->json([
                'success' => true,
                'dias_alerta' => $diasAlerta,
                'cantidad_pendientes' => $pendientes->count(),
                'data' => $pendientes,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error en reporte de devoluciones', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error generando reporte'], 500);
        }
    }

    /**
     * GET /api/reportes/proveedor/deudas
     * Reporte de deudas con proveedores
     */
    public function reporteDeudas(Request $request): JsonResponse
    {
        try {
            $proveedores = DB::table('proveedores')
                ->select('id', 'nombre', 'razon_social')
                ->get()
                ->map(function ($proveedor) {
                    $deuda = $this->prestamoProveedorService->obtenerDeudaTotal($proveedor->id);
                    $prestamosActivos = PrestamoProveedor::where('proveedor_id', $proveedor->id)
                        ->where('es_compra', true)
                        ->whereIn('estado', ['ACTIVO', 'PARCIALMENTE_DEVUELTO'])
                        ->count();

                    return [
                        'proveedor_id' => $proveedor->id,
                        'proveedor_nombre' => $proveedor->nombre,
                        'prestamos_activos' => $prestamosActivos,
                        'deuda_total' => $deuda,
                    ];
                })
                ->filter(function ($item) {
                    return $item['deuda_total'] > 0;
                })
                ->sortByDesc('deuda_total')
                ->values();

            $deudaGlobal = $proveedores->sum('deuda_total');

            return response()->json([
                'success' => true,
                'deuda_global' => $deudaGlobal,
                'cantidad_proveedores' => $proveedores->count(),
                'data' => $proveedores,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error en reporte de deudas', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error generando reporte'], 500);
        }
    }

    /**
     * GET /api/reportes/resumen-prestamos
     * Reporte resumido de todos los préstamos
     */
    public function reporteResumen(Request $request): JsonResponse
    {
        try {
            $almacenId = $request->integer('almacenes_prestables_id') ?? auth()->user()->empresa->almacenes_prestables_id ?? 1;

            // Total de canastillas en el sistema
            $totalCanastillas = PrestableStock::where('almacenes_prestables_id', $almacenId)
                ->sum(DB::raw('cantidad_disponible + cantidad_en_prestamo_cliente + cantidad_que_debo_devolver + cantidad_vendida'));

            // Stock disponible
            $stockDisponible = PrestableStock::where('almacenes_prestables_id', $almacenId)->sum('cantidad_disponible');

            // En préstamo a clientes
            $enPrestamoClientes = PrestableStock::where('almacenes_prestables_id', $almacenId)->sum('cantidad_en_prestamo_cliente');

            // Deuda a proveedores
            $deudeaProveedores = PrestableStock::where('almacenes_prestables_id', $almacenId)->sum('cantidad_que_debo_devolver');

            // Vendido
            $vendido = PrestableStock::where('almacenes_prestables_id', $almacenId)->sum('cantidad_vendida');

            // Préstamos activos
            $prestamosActivosClientes = PrestamoCliente::where('estado', 'ACTIVO')->count();
            $prestamosActivosProveedores = PrestamoProveedor::where('estado', 'ACTIVO')->count();

            return response()->json([
                'success' => true,
                'resumen' => [
                    'total_canastillas' => $totalCanastillas,
                    'disponible' => $stockDisponible,
                    'en_prestamo_clientes' => $enPrestamoClientes,
                    'deuda_proveedores' => $deudeaProveedores,
                    'vendido' => $vendido,
                    'prestamos_activos_clientes' => $prestamosActivosClientes,
                    'prestamos_activos_proveedores' => $prestamosActivosProveedores,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error en reporte resumen', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error generando reporte'], 500);
        }
    }
}
