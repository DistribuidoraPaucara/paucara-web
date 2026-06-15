<?php

namespace App\Http\Controllers;

use App\Models\Entrega;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class EntregaReporteController extends Controller
{
    /**
     * Reporte de entregas por chofer
     * GET /api/choferes/{chofer}/entregas-reporte
     */
    public function choferEntregas(int $chofer, Request $request): JsonResponse
    {
        try {
            // Obtener el chofer
            $choferModel = User::findOrFail($chofer);

            // Parámetros de filtro
            $fechaDesde = $request->input('fecha_desde');
            $fechaHasta = $request->input('fecha_hasta');
            $estadoLogistico = $request->input('estado_logistico');
            $estadoDocumento = $request->input('estado_documento');
            $estadoVentaLogistica = $request->input('estado_venta_logistica');
            $tipoEntrega = $request->input('tipo_entrega');

            // Defaults: desde día 1 del mes hasta hoy
            if (!$fechaDesde) {
                $fechaDesde = Carbon::now()->startOfMonth()->format('Y-m-d');
            }
            if (!$fechaHasta) {
                $fechaHasta = Carbon::now()->format('Y-m-d');
            }

            // Construir query de entregas
            $entregas = Entrega::where('chofer_id', $chofer)
                ->whereBetween('fecha_entrega', [$fechaDesde . ' 00:00:00', $fechaHasta . ' 23:59:59'])
                ->with([
                    'chofer',
                    'estadoEntrega',
                    'ventas.cliente',
                    'ventas.estadoDocumento',
                    'ventas.estadoLogistica',
                    'ventas.detalles.producto',
                    'ventas.confirmaciones',
                ])
                ->orderByDesc('fecha_entrega');

            // Filtro por estado logístico
            if ($estadoLogistico) {
                $entregas->whereHas('estadoEntrega', function ($query) use ($estadoLogistico) {
                    $query->where('codigo', $estadoLogistico);
                });
            }

            // Filtro por estado documento (de las ventas)
            if ($estadoDocumento) {
                $entregas->whereHas('ventas.estadoDocumento', function ($query) use ($estadoDocumento) {
                    $query->where('codigo', $estadoDocumento);
                });
            }

            // Filtro por estado venta logística
            if ($estadoVentaLogistica) {
                $entregas->whereHas('ventas', function ($query) use ($estadoVentaLogistica) {
                    $query->whereHas('estadoLogistica', function ($subQuery) use ($estadoVentaLogistica) {
                        $subQuery->where('codigo', $estadoVentaLogistica);
                    });
                });
            }

            // Filtro por tipo de entrega (desde confirmaciones)
            if ($tipoEntrega) {
                $entregas->whereHas('ventas.confirmaciones', function ($query) use ($tipoEntrega) {
                    $query->where('tipo_entrega', $tipoEntrega);
                });
            }

            $entregasData = $entregas->get();

            // Construir respuesta
            $resumen = [
                'total_entregas' => $entregasData->count(),
                'entregas_completas' => 0,
                'entregas_con_novedad' => 0,
                'total_ventas' => 0,
                'total_productos' => 0,
                'total_monetario' => 0,
                'fecha_desde' => $fechaDesde,
                'fecha_hasta' => $fechaHasta,
            ];

            // Mapear entregas con sus datos
            // Calcular resumen de productos
            $productosResumen = [];
            $totalVentas = 0;
            $entregasData->each(function ($entrega) use (&$productosResumen, &$totalVentas) {
                $entrega->ventas->each(function ($venta) use (&$productosResumen, &$totalVentas) {
                    $totalVentas += (float) $venta->total;
                    $venta->detalles->each(function ($detalle) use (&$productosResumen) {
                        $productoId = $detalle->producto->id;

                        if (!isset($productosResumen[$productoId])) {
                            $productosResumen[$productoId] = [
                                'id' => $productoId,
                                'nombre' => $detalle->producto->nombre,
                                'sku' => $detalle->producto->sku,
                                'cantidad' => 0,
                                'subtotal' => 0,
                                'unidad_medida' => $detalle->producto->unidad?->nombre ?? 'Unidad',
                            ];
                        }

                        $productosResumen[$productoId]['cantidad'] += (float) $detalle->cantidad;
                        $productosResumen[$productoId]['subtotal'] += (float) $detalle->subtotal;
                    });
                });
            });

            // Reordenar y convertir a array
            $productosResumen = collect($productosResumen)
                ->sortByDesc('cantidad')
                ->values()
                ->toArray();

            $entregas_mapeadas = $entregasData->map(function ($entrega) use (&$resumen) {
                // Contar tipos de entrega
                $tiposEntrega = $entrega->ventas
                    ->flatMap(fn($v) => $v->confirmaciones)
                    ->pluck('tipo_entrega')
                    ->unique();

                if ($tiposEntrega->contains('COMPLETA')) {
                    $resumen['entregas_completas']++;
                }
                if ($tiposEntrega->contains('CON_NOVEDAD')) {
                    $resumen['entregas_con_novedad']++;
                }

                return [
                    'id' => $entrega->id,
                    'numero_entrega' => $entrega->numero_entrega,
                    'fecha_entrega' => $entrega->fecha_entrega,
                    'estado_logistico' => [
                        'id' => $entrega->estadoEntrega?->id,
                        'codigo' => $entrega->estadoEntrega?->codigo,
                        'nombre' => $entrega->estadoEntrega?->nombre,
                    ],
                    'ventas' => $entrega->ventas->map(function ($venta) use (&$resumen) {
                        $resumen['total_ventas']++;
                        $resumen['total_monetario'] += (float) $venta->total;

                        // Productos de esta venta
                        $productos = $venta->detalles->map(function ($detalle) use (&$resumen) {
                            $resumen['total_productos']++;
                            return [
                                'id' => $detalle->producto->id,
                                'nombre' => $detalle->producto->nombre,
                                'sku' => $detalle->producto->sku,
                                'cantidad' => (float) $detalle->cantidad,
                                'precio_unitario' => (float) $detalle->precio_unitario,
                                'subtotal' => (float) $detalle->subtotal,
                            ];
                        })->toArray();

                        return [
                            'id' => $venta->id,
                            'numero' => $venta->numero,
                            'cliente' => [
                                'id' => $venta->cliente?->id,
                                'nombre' => $venta->cliente?->nombre,
                                'nit' => $venta->cliente?->nit,
                            ],
                            'estado_documento' => [
                                'id' => $venta->estadoDocumento?->id,
                                'codigo' => $venta->estadoDocumento?->codigo,
                                'nombre' => $venta->estadoDocumento?->nombre,
                            ],
                            'total' => (float) $venta->total,
                            'productos' => $productos,
                            'confirmaciones' => $venta->confirmaciones->map(function ($conf) {
                                return [
                                    'id' => $conf->id,
                                    'tipo_entrega' => $conf->tipo_entrega,
                                    'tipo_confirmacion' => $conf->tipo_confirmacion,
                                    'fecha' => $conf->fecha,
                                    'observaciones' => $conf->observaciones,
                                ];
                            })->toArray(),
                        ];
                    })->toArray(),
                ];
            })->toArray();

            return response()->json([
                'success' => true,
                'data' => [
                    'chofer' => [
                        'id' => $choferModel->id,
                        'nombre' => $choferModel->name,
                        'email' => $choferModel->email,
                    ],
                    'filtros' => [
                        'fecha_desde' => $fechaDesde,
                        'fecha_hasta' => $fechaHasta,
                        'estado_logistico' => $estadoLogistico,
                        'estado_documento' => $estadoDocumento,
                        'estado_venta_logistica' => $estadoVentaLogistica,
                        'tipo_entrega' => $tipoEntrega,
                    ],
                    'resumen' => $resumen,
                    'productos_resumen' => $productosResumen,
                    'total_ventas' => $totalVentas,
                    'entregas' => $entregas_mapeadas,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo reporte',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
