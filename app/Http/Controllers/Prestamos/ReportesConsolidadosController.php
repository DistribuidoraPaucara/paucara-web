<?php

namespace App\Http\Controllers\Prestamos;

use App\Http\Controllers\Controller;
use App\Models\AlmacenPrestable;
use App\Models\PrestableStock;
use App\Services\Prestamos\PrestableStockAdvancedService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReportesConsolidadosController extends Controller
{
    public function __construct(private PrestableStockAdvancedService $advancedService) {}

    /**
     * GET /api/reportes/prestables/stock-detalle
     *
     * Obtener stock detallado por almacén + consolidado
     * Muestra:
     * 1. Stock desglosado por cada almacén (Distribuidora, Proveedores, específicos)
     * 2. Totales consolidados
     * 3. Indicadores de almacén (nombre, tipo)
     */
    public function stockDetallado(Request $request): JsonResponse
    {
        try {
            $prestableId = $request->integer('prestable_id');

            if (!$prestableId) {
                return response()->json([
                    'success' => false,
                    'message' => 'prestable_id es requerido',
                ], 422);
            }

            $resumen = $this->advancedService->obtenerResumenConsolidado($prestableId);

            return response()->json([
                'success' => true,
                'data' => $resumen,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error en reporte consolidado', [
                'prestable_id' => $request->integer('prestable_id'),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error generando reporte consolidado',
            ], 500);
        }
    }

    /**
     * GET /api/reportes/prestables/stock-por-almacen
     *
     * Reporte agrupado por almacén
     * Útil para ver inventario por ubicación física
     */
    public function stockPorAlmacen(Request $request): JsonResponse
    {
        try {
            $almacenId = $request->integer('almacen_id');

            $query = PrestableStock::with(['prestable', 'almacenPrestable'])
                ->where('cantidad_disponible', '>', 0); // Solo con stock

            if ($almacenId) {
                $query->where('almacenes_prestables_id', $almacenId);
            }

            $stocks = $query->get()->groupBy('almacenes_prestables_id');

            $resultado = [];

            foreach ($stocks as $almacenId => $stocksPorAlmacen) {
                $almacen = AlmacenPrestable::find($almacenId);

                $totalDisponible = 0;
                $totalClienteActivo = 0;
                $totalClienteDevuelto = 0;
                $totalEventoActivo = 0;
                $totalEventoDevuelto = 0;
                $totalProveedorActivo = 0;
                $totalProveedorDevuelto = 0;
                $items = [];

                foreach ($stocksPorAlmacen as $stock) {
                    $totalDisponible += $stock->cantidad_disponible;
                    $totalClienteActivo += $stock->cantidad_prestamo_cliente_activo;
                    $totalClienteDevuelto += $stock->cantidad_prestamo_cliente_devuelto;
                    $totalEventoActivo += $stock->cantidad_prestamo_evento_activo;
                    $totalEventoDevuelto += $stock->cantidad_prestamo_evento_devuelto;
                    $totalProveedorActivo += $stock->cantidad_prestamo_proveedor_activo;
                    $totalProveedorDevuelto += $stock->cantidad_prestamo_proveedor_devuelto;

                    $items[] = [
                        'prestable_id' => $stock->prestable_id,
                        'prestable_nombre' => $stock->prestable->nombre ?? 'Desconocido',
                        'prestable_codigo' => $stock->prestable->codigo,
                        'prestable_tipo' => $stock->prestable->tipo,
                        'cantidad_disponible' => $stock->cantidad_disponible,
                        'prestamos_clientes' => [
                            'activo' => $stock->cantidad_prestamo_cliente_activo,
                            'devuelto' => $stock->cantidad_prestamo_cliente_devuelto,
                            'total_prestado' => $stock->getTotalPrestadoClientesAttribute(),
                        ],
                        'prestamos_eventos' => [
                            'activo' => $stock->cantidad_prestamo_evento_activo,
                            'devuelto' => $stock->cantidad_prestamo_evento_devuelto,
                            'total_prestado' => $stock->getTotalPrestadoEventosAttribute(),
                        ],
                        'prestamos_proveedores' => [
                            'activo' => $stock->cantidad_prestamo_proveedor_activo,
                            'devuelto' => $stock->cantidad_prestamo_proveedor_devuelto,
                            'total_prestado' => $stock->getTotalPrestadoProveedoresAttribute(),
                        ],
                        'cantidad_total' => $stock->getTotalGeneralAttribute(),
                    ];
                }

                $resultado[] = [
                    'almacen_id' => $almacenId,
                    'almacen_nombre' => $almacen->nombre,
                    'almacen_tipo' => $this->determinarTipoAlmacen($almacen),
                    'ubicacion_fisica' => $almacen->ubicacion_fisica,
                    'responsable' => $almacen->responsable,
                    'totales' => [
                        'cantidad_disponible' => $totalDisponible,
                        'prestamos_clientes' => [
                            'activo' => $totalClienteActivo,
                            'devuelto' => $totalClienteDevuelto,
                            'total_prestado' => $totalClienteActivo + $totalClienteDevuelto,
                        ],
                        'prestamos_eventos' => [
                            'activo' => $totalEventoActivo,
                            'devuelto' => $totalEventoDevuelto,
                            'total_prestado' => $totalEventoActivo + $totalEventoDevuelto,
                        ],
                        'prestamos_proveedores' => [
                            'activo' => $totalProveedorActivo,
                            'devuelto' => $totalProveedorDevuelto,
                            'total_prestado' => $totalProveedorActivo + $totalProveedorDevuelto,
                        ],
                        'cantidad_total' => $totalDisponible + $totalClienteActivo + $totalClienteDevuelto +
                                          $totalEventoActivo + $totalEventoDevuelto + $totalProveedorActivo + $totalProveedorDevuelto,
                    ],
                    'items' => $items,
                    'cantidad_prestables' => count($items),
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $resultado,
                'cantidad_almacenes' => count($resultado),
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error en reporte por almacén', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error generando reporte por almacén',
            ], 500);
        }
    }

    /**
     * GET /api/reportes/prestables/deuda-proveedores
     *
     * Reporte de deuda con proveedores
     * Muestra qué canastillas debo devolver a cada proveedor
     */
    public function deudaProveedores(Request $request): JsonResponse
    {
        try {
            // Obtener almacenes de proveedores
            $almacenesProveedores = AlmacenPrestable::where('es_proveedor', true)
                ->where('activo', true)
                ->get();

            $resultado = [];

            foreach ($almacenesProveedores as $almacen) {
                $deudas = PrestableStock::where('almacenes_prestables_id', $almacen->id)
                    ->where('cantidad_prestamo_proveedor_activo', '>', 0)
                    ->with('prestable')
                    ->get();

                if ($deudas->isEmpty()) continue;

                $totalDeudaActiva = 0;
                $totalDevuelto = 0;
                $items = [];

                foreach ($deudas as $deuda) {
                    $totalDeudaActiva += $deuda->cantidad_prestamo_proveedor_activo;
                    $totalDevuelto += $deuda->cantidad_prestamo_proveedor_devuelto;

                    $items[] = [
                        'prestable_id' => $deuda->prestable_id,
                        'prestable_nombre' => $deuda->prestable->nombre,
                        'prestable_codigo' => $deuda->prestable->codigo,
                        'cantidad_prestado' => $deuda->getTotalPrestadoProveedoresAttribute(),
                        'cantidad_activo' => $deuda->cantidad_prestamo_proveedor_activo,
                        'cantidad_devuelto' => $deuda->cantidad_prestamo_proveedor_devuelto,
                    ];
                }

                if ($totalDeudaActiva > 0) {
                    $resultado[] = [
                        'almacen_id' => $almacen->id,
                        'almacen_nombre' => $almacen->nombre,
                        'almacen_tipo' => $this->determinarTipoAlmacen($almacen),
                        'total_deuda_activa' => $totalDeudaActiva,
                        'total_devuelto' => $totalDevuelto,
                        'total_prestado' => $totalDeudaActiva + $totalDevuelto,
                        'cantidad_prestables_en_deuda' => count($items),
                        'items' => $items,
                    ];
                }
            }

            // Calcular total consolidado
            $totalConsolidado = collect($resultado)->sum('total_deuda');

            return response()->json([
                'success' => true,
                'deuda_total_consolidada' => $totalConsolidado,
                'cantidad_proveedores_con_deuda' => count($resultado),
                'data' => $resultado,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error en reporte de deuda con proveedores', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error generando reporte de deuda',
            ], 500);
        }
    }

    /**
     * GET /api/reportes/prestables/resumen-general
     *
     * Dashboard de resumen general
     * Muestra métricas consolidadas de todo el sistema de prestables
     */
    public function resumenGeneral(Request $request): JsonResponse
    {
        try {
            $stocks = PrestableStock::all();

            $totales = [
                'cantidad_disponible' => 0,
                'cantidad_en_prestamo_cliente' => 0,
                'cantidad_en_prestamo_evento' => 0,
                'cantidad_que_debo_devolver' => 0,
                'cantidad_total' => 0,
            ];

            $porAlmacen = [];
            $porTipo = [
                'distribuidora' => ['cantidad' => 0, 'almacenes' => []],
                'proveedor' => ['cantidad' => 0, 'almacenes' => []],
            ];

            foreach ($stocks as $stock) {
                $almacen = $stock->almacenPrestable;

                // Acumular totales
                $totales['cantidad_disponible'] += $stock->cantidad_disponible;
                $totales['cantidad_en_prestamo_cliente'] += $stock->cantidad_prestamo_cliente_activo;
                $totales['cantidad_en_prestamo_evento'] += $stock->cantidad_prestamo_evento_activo;
                $totales['cantidad_que_debo_devolver'] += $stock->cantidad_prestamo_proveedor_activo;

                // Agrupar por almacén
                if (!isset($porAlmacen[$almacen->id])) {
                    $porAlmacen[$almacen->id] = [
                        'almacen_id' => $almacen->id,
                        'almacen_nombre' => $almacen->nombre,
                        'cantidad_disponible' => 0,
                        'cantidad_en_prestamo_cliente' => 0,
                        'cantidad_en_prestamo_evento' => 0,
                        'cantidad_que_debo_devolver' => 0,
                    ];
                }

                $porAlmacen[$almacen->id]['cantidad_disponible'] += $stock->cantidad_disponible;
                $porAlmacen[$almacen->id]['cantidad_en_prestamo_cliente'] += $stock->cantidad_prestamo_cliente_activo;
                $porAlmacen[$almacen->id]['cantidad_en_prestamo_evento'] += $stock->cantidad_prestamo_evento_activo;
                $porAlmacen[$almacen->id]['cantidad_que_debo_devolver'] += $stock->cantidad_prestamo_proveedor_activo;

                // Clasificar por tipo
                $tipo = $this->determinarTipoAlmacen($almacen);
                $porTipo[$tipo]['cantidad'] += $stock->getTotalGeneralAttribute();
                $porTipo[$tipo]['almacenes'][] = $almacen->nombre;
            }

            $totales['cantidad_total'] = $totales['cantidad_disponible'] +
                                         $totales['cantidad_en_prestamo_cliente'] +
                                         $totales['cantidad_en_prestamo_evento'] +
                                         $totales['cantidad_que_debo_devolver'];

            return response()->json([
                'success' => true,
                'data' => [
                    'totales' => $totales,
                    'por_almacen' => array_values($porAlmacen),
                    'por_tipo' => $porTipo,
                    'cantidad_almacenes' => count($porAlmacen),
                    'porcentajes' => [
                        'disponible' => $totales['cantidad_total'] > 0
                            ? round(($totales['cantidad_disponible'] / $totales['cantidad_total']) * 100, 2)
                            : 0,
                        'en_prestamo_cliente' => $totales['cantidad_total'] > 0
                            ? round(($totales['cantidad_en_prestamo_cliente'] / $totales['cantidad_total']) * 100, 2)
                            : 0,
                        'en_prestamo_evento' => $totales['cantidad_total'] > 0
                            ? round(($totales['cantidad_en_prestamo_evento'] / $totales['cantidad_total']) * 100, 2)
                            : 0,
                        'deuda_proveedores' => $totales['cantidad_total'] > 0
                            ? round(($totales['cantidad_que_debo_devolver'] / $totales['cantidad_total']) * 100, 2)
                            : 0,
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error en resumen general', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error generando resumen general',
            ], 500);
        }
    }

    /**
     * Determinar el tipo de almacén basado en es_proveedor
     */
    private function determinarTipoAlmacen(AlmacenPrestable $almacen): string
    {
        return $almacen->es_proveedor ? 'proveedor' : 'distribuidora';
    }
}
