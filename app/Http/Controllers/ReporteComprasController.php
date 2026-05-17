<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use App\Models\CuentaPorPagar;
use App\Models\LoteVencimiento;
use App\Models\Pago;
use App\Models\Proveedor;
use App\Models\Moneda;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReporteComprasController extends Controller
{
    public function index(Request $request)
    {
        $fechaDesde = $request->fecha_desde ? Carbon::parse($request->fecha_desde) : now()->subMonths(6);
        $fechaHasta = $request->fecha_hasta ? Carbon::parse($request->fecha_hasta) : now();

        // ✅ ESTADÍSTICAS GENERALES
        $comprasEnPeriodo = Compra::with('proveedor')
            ->whereBetween('fecha', [$fechaDesde, $fechaHasta])
            ->get();

        // Calcular variación respecto al mes anterior
        $fechaMesAnterior = $fechaDesde->copy()->subMonth();
        $comprasMesAnterior = Compra::whereBetween('fecha', [
            $fechaMesAnterior->startOfMonth(),
            $fechaMesAnterior->endOfMonth()
        ])->sum('total');

        $montoTotal = $comprasEnPeriodo->sum('total');
        $variacionMesAnterior = $comprasMesAnterior > 0
            ? (($montoTotal - $comprasMesAnterior) / $comprasMesAnterior) * 100
            : 0;

        // Obtener proveedor con mayores compras
        $proveedorPrincipal = $comprasEnPeriodo
            ->groupBy('proveedor_id')
            ->map(function ($grupo) {
                return [
                    'proveedor_id' => $grupo->first()->proveedor_id,
                    'nombre' => $grupo->first()->proveedor->nombre,
                    'total' => $grupo->sum('total'),
                ];
            })
            ->sortByDesc('total')
            ->first();

        // Obtener mes con mayores compras
        $porMes = $comprasEnPeriodo->groupBy(function ($item) {
            return $item->fecha->format('M Y');
        })->map(fn($g) => $g->sum('total'));
        $mesMayorCompra = $porMes->keys()[0] ?? 'N/A';

        $estadisticas_generales = [
            'total_compras_periodo' => $montoTotal,
            'cantidad_compras_periodo' => $comprasEnPeriodo->count(),
            'promedio_compra_periodo' => $comprasEnPeriodo->avg('total') ?? 0,
            'variacion_mes_anterior' => $variacionMesAnterior,
            'proveedor_principal' => $proveedorPrincipal ? [
                'id' => $proveedorPrincipal['proveedor_id'],
                'nombre' => $proveedorPrincipal['nombre'],
            ] : ['id' => 0, 'nombre' => 'N/A'],
            'categoria_principal' => 'Todas',
            'mes_mayor_compra' => $mesMayorCompra,
            'total_proveedores' => $comprasEnPeriodo->pluck('proveedor_id')->unique()->count(),
            'cuentas_pendientes' => CuentaPorPagar::where('estado', 'PENDIENTE')->sum('saldo_pendiente') ?? 0,
        ];

        // ✅ RESUMEN POR PERÍODO (mensual)
        $resumen_por_periodo = $this->obtenerResumenPorPeriodo($fechaDesde, $fechaHasta);

        // ✅ COMPRAS POR PROVEEDOR
        $montoTotalGeneral = $comprasEnPeriodo->sum('total');

        $compras_por_proveedor = $comprasEnPeriodo
            ->groupBy('proveedor_id')
            ->map(function ($grupo) use ($montoTotalGeneral) {
                $proveedor = $grupo->first()->proveedor;
                $totalCompras = $grupo->sum('total');

                return [
                    'proveedor' => [
                        'id' => $proveedor->id,
                        'nombre' => $proveedor->nombre,
                        'nit' => $proveedor->nit ?? 'N/A',
                    ],
                    'total_compras' => $totalCompras,
                    'cantidad_compras' => $grupo->count(),
                    'promedio_compra' => $grupo->avg('total') ?? 0,
                    'porcentaje_total' => $montoTotalGeneral > 0 ? ($totalCompras / $montoTotalGeneral) * 100 : 0,
                    'ultima_compra' => $grupo->max('fecha')->format('Y-m-d'),
                ];
            })
            ->sortByDesc('total_compras')
            ->values()
            ->toArray();

        // ✅ COMPRAS POR CATEGORÍA (usando Eloquent)
        $compras_por_categoria = $this->obtenerComprasPorCategoria($fechaDesde, $fechaHasta);

        // ✅ TENDENCIAS MENSUALES
        $tendencias_mensuales = $this->obtenerTendenciasMensuales($fechaDesde, $fechaHasta);

        // ✅ PROVEEDORES (para select en filtros)
        $proveedores = Proveedor::where('activo', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre'])
            ->toArray();

        // ✅ MONEDAS
        $monedas = Moneda::where('activo', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'codigo'])
            ->toArray();

        return Inertia::render('compras/reportes/index', [
            'estadisticas_generales' => $estadisticas_generales,
            'resumen_por_periodo' => $resumen_por_periodo,
            'compras_por_proveedor' => $compras_por_proveedor,
            'compras_por_categoria' => $compras_por_categoria,
            'tendencias_mensuales' => $tendencias_mensuales,
            'proveedores' => $proveedores,
            'monedas' => $monedas,
            'filtros' => [
                'fecha_desde' => $fechaDesde->format('Y-m-d'),
                'fecha_hasta' => $fechaHasta->format('Y-m-d'),
                'proveedor_id' => null,
                'moneda_id' => null,
            ],
        ]);
    }

    private function obtenerComprasPorCategoria(Carbon $fechaDesde, Carbon $fechaHasta): array
    {
        // Usar Eloquent en lugar de raw query para evitar problemas con PostgreSQL
        $compras = Compra::with('detalles.producto.categoria')
            ->whereBetween('fecha', [$fechaDesde, $fechaHasta])
            ->get();

        $porCategoria = [];
        $montoTotalGeneral = 0;

        // Primer paso: agrupar por categoría
        foreach ($compras as $compra) {
            foreach ($compra->detalles as $detalle) {
                $categoria = $detalle->producto->categoria;
                if (!$categoria) continue;

                $key = $categoria->id;
                if (!isset($porCategoria[$key])) {
                    $porCategoria[$key] = [
                        'categoria_id' => $categoria->id,
                        'categoria' => $categoria->nombre,
                        'cantidad_compras' => 0,
                        'total_compras' => 0,
                    ];
                }

                $porCategoria[$key]['cantidad_compras']++;
                $porCategoria[$key]['total_compras'] += $compra->total;
                $montoTotalGeneral += $compra->total;
            }
        }

        // Segundo paso: calcular porcentajes
        $resultado = array_map(function ($item) use ($montoTotalGeneral) {
            return [
                ...$item,
                'porcentaje_total' => $montoTotalGeneral > 0 ? ($item['total_compras'] / $montoTotalGeneral) * 100 : 0,
            ];
        }, $porCategoria);

        // Ordenar por total_compras descendente
        usort($resultado, fn($a, $b) => $b['total_compras'] <=> $a['total_compras']);

        return array_values($resultado);
    }

    private function obtenerResumenPorPeriodo(Carbon $fechaDesde, Carbon $fechaHasta): array
    {
        $periodos = [];
        $fecha = $fechaDesde->copy();
        $periodoAnterior = null;

        while ($fecha <= $fechaHasta) {
            $mesDesde = $fecha->copy()->startOfMonth();
            $mesHasta = $fecha->copy()->endOfMonth();

            $compras = Compra::whereBetween('fecha', [$mesDesde, $mesHasta])->get();
            $totalCompras = $compras->sum('total') ?? 0;
            $cantidadCompras = $compras->count();
            $promedio = $cantidadCompras > 0 ? $totalCompras / $cantidadCompras : 0;

            // Calcular variación respecto al período anterior
            $variacionAnterior = 0;
            if ($periodoAnterior !== null && $periodoAnterior > 0) {
                $variacionAnterior = (($totalCompras - $periodoAnterior) / $periodoAnterior) * 100;
            }

            $periodos[] = [
                'periodo' => $fecha->format('M Y'),
                'fecha' => $fecha->format('Y-m'),
                'total_compras' => $totalCompras,
                'cantidad_compras' => $cantidadCompras,
                'promedio_compra' => $promedio,
                'variacion_anterior' => $variacionAnterior,
            ];

            $periodoAnterior = $totalCompras;
            $fecha->addMonth();
        }

        return $periodos;
    }

    private function obtenerTendenciasMensuales(Carbon $fechaDesde, Carbon $fechaHasta): array
    {
        $compras = Compra::whereBetween('fecha', [$fechaDesde, $fechaHasta])->get();

        $porMes = $compras->groupBy(function ($item) {
            return $item->fecha->format('Y-m');
        })->map(function ($grupo) {
            $primerFecha = $grupo->first()->fecha;
            return [
                'mes' => $primerFecha->format('M Y'),
                'fecha' => $primerFecha->format('Y-m-01'),
                'cantidad' => $grupo->count(),
                'total' => $grupo->sum('total') ?? 0,
                'promedio' => $grupo->avg('total') ?? 0,
                'cantidad_proveedores' => $grupo->pluck('proveedor_id')->unique()->count(),
            ];
        })
        ->sortBy('fecha')
        ->values()
        ->toArray();

        return $porMes;
    }

    public function export(Request $request)
    {
        \Log::info('🔍 INICIO EXPORTACIÓN CSV');
        \Log::info('📅 Parámetros recibidos', $request->all());

        try {
            $fechaDesde = $request->fecha_desde ? Carbon::parse($request->fecha_desde) : now()->subMonths(6);
            $fechaHasta = $request->fecha_hasta ? Carbon::parse($request->fecha_hasta) : now();

            \Log::info('📅 Fechas parseadas', [
                'desde' => $fechaDesde->format('Y-m-d'),
                'hasta' => $fechaHasta->format('Y-m-d'),
            ]);

            // Recolectar todos los datos del reporte
            \Log::info('📊 Calculando estadísticas...');
            $estadisticas = $this->calcularEstadisticas($fechaDesde, $fechaHasta);
            \Log::info('✅ Estadísticas calculadas', ['total_compras' => $estadisticas['total_compras_periodo']]);

            \Log::info('📦 Obteniendo proveedores...');
            $proveedores = $this->obtenerComprasPorProveedor($fechaDesde, $fechaHasta);
            \Log::info('✅ Proveedores obtenidos', ['cantidad' => count($proveedores)]);

            \Log::info('📋 Obteniendo categorías...');
            $categorias = $this->obtenerComprasPorCategoria($fechaDesde, $fechaHasta);
            \Log::info('✅ Categorías obtenidas', ['cantidad' => count($categorias)]);

            \Log::info('📈 Obteniendo períodos...');
            $periodos = $this->obtenerResumenPorPeriodo($fechaDesde, $fechaHasta);
            \Log::info('✅ Períodos obtenidos', ['cantidad' => count($periodos)]);

            // Generar CSV
            \Log::info('🔄 Generando CSV...');

            $response = response()->streamDownload(
                function () use ($estadisticas, $proveedores, $categorias, $periodos) {
                    $output = fopen('php://output', 'w');

                    // Escribir BOM UTF-8 para compatibilidad con Excel
                    fprintf($output, "\xEF\xBB\xBF");

                    // Encabezado
                    fprintf($output, "REPORTE DE COMPRAS\n");
                    fprintf($output, "Fecha: %s\n\n", now()->format('d/m/Y H:i'));

                    // Estadísticas Generales
                    fprintf($output, "ESTADÍSTICAS GENERALES\n");
                    fprintf($output, "Total Compras,Cantidad Compras,Promedio,Variación Mes Anterior\n");
                    fprintf($output, "%.2f,%.0f,%.2f,%.2f%%\n\n",
                        $estadisticas['total_compras_periodo'],
                        $estadisticas['cantidad_compras_periodo'],
                        $estadisticas['promedio_compra_periodo'],
                        $estadisticas['variacion_mes_anterior']
                    );

                    // Compras por Proveedor
                    fprintf($output, "COMPRAS POR PROVEEDOR\n");
                    fprintf($output, "Proveedor,Total Compras,Cantidad,Promedio,Porcentaje\n");
                    foreach ($proveedores as $proveedor) {
                        fprintf($output, "%s,%.2f,%.0f,%.2f,%.2f%%\n",
                            $this->escapeCsvValue($proveedor['proveedor']['nombre']),
                            $proveedor['total_compras'],
                            $proveedor['cantidad_compras'],
                            $proveedor['promedio_compra'],
                            $proveedor['porcentaje_total']
                        );
                    }
                    fprintf($output, "\n");

                    // Compras por Categoría
                    fprintf($output, "COMPRAS POR CATEGORÍA\n");
                    fprintf($output, "Categoría,Total Compras,Cantidad,Porcentaje\n");
                    foreach ($categorias as $categoria) {
                        fprintf($output, "%s,%.2f,%.0f,%.2f%%\n",
                            $this->escapeCsvValue($categoria['categoria']),
                            $categoria['total_compras'],
                            $categoria['cantidad_compras'],
                            $categoria['porcentaje_total']
                        );
                    }
                    fprintf($output, "\n");

                    // Resumen por Período
                    fprintf($output, "RESUMEN POR PERÍODO\n");
                    fprintf($output, "Período,Total Compras,Cantidad,Promedio,Variación\n");
                    foreach ($periodos as $periodo) {
                        fprintf($output, "%s,%.2f,%.0f,%.2f,%.2f%%\n",
                            $this->escapeCsvValue($periodo['periodo']),
                            $periodo['total_compras'],
                            $periodo['cantidad_compras'],
                            $periodo['promedio_compra'],
                            $periodo['variacion_anterior']
                        );
                    }

                    fclose($output);
                },
                'reporte-compras-' . now()->format('Y-m-d') . '.csv',
                [
                    'Content-Type' => 'text/csv; charset=UTF-8',
                    'Content-Disposition' => 'attachment; filename="reporte-compras-' . now()->format('Y-m-d') . '.csv"',
                ]
            );

            \Log::info('✅ CSV generado exitosamente', [
                'tamaño_estadisticas' => count($estadisticas),
                'tamaño_proveedores' => count($proveedores),
                'tamaño_categorias' => count($categorias),
                'tamaño_periodos' => count($periodos),
            ]);
            return $response;

        } catch (\Exception $e) {
            \Log::error('❌ ERROR EN EXPORTACIÓN', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    public function exportPdf(Request $request)
    {
        \Log::info('🔍 INICIO EXPORTACIÓN PDF');
        \Log::info('📅 Parámetros recibidos', $request->all());

        try {
            $fechaDesde = $request->fecha_desde ? Carbon::parse($request->fecha_desde) : now()->subMonths(6);
            $fechaHasta = $request->fecha_hasta ? Carbon::parse($request->fecha_hasta) : now();

            \Log::info('📅 Fechas parseadas', [
                'desde' => $fechaDesde->format('Y-m-d'),
                'hasta' => $fechaHasta->format('Y-m-d'),
            ]);

            // Recolectar todos los datos del reporte
            $estadisticas = $this->calcularEstadisticas($fechaDesde, $fechaHasta);
            $proveedores = $this->obtenerComprasPorProveedor($fechaDesde, $fechaHasta);
            $categorias = $this->obtenerComprasPorCategoria($fechaDesde, $fechaHasta);
            $periodos = $this->obtenerResumenPorPeriodo($fechaDesde, $fechaHasta);

            \Log::info('📊 Datos obtenidos para PDF');

            // Generar HTML para el PDF
            $html = view('pdf.reportes-compras', [
                'estadisticas' => $estadisticas,
                'proveedores' => $proveedores,
                'categorias' => $categorias,
                'periodos' => $periodos,
                'fecha_desde' => $fechaDesde->format('d/m/Y'),
                'fecha_hasta' => $fechaHasta->format('d/m/Y'),
                'fecha_generacion' => now()->format('d/m/Y H:i'),
            ])->render();

            \Log::info('📄 HTML generado para PDF');

            // Generar PDF usando DomPDF
            $pdf = \PDF::loadHTML($html)
                ->setPaper('a4', 'portrait')
                ->setOption('margin-top', 10)
                ->setOption('margin-bottom', 10)
                ->setOption('margin-left', 10)
                ->setOption('margin-right', 10);

            \Log::info('✅ PDF generado exitosamente');

            return $pdf->download('reporte-compras-' . now()->format('Y-m-d') . '.pdf');

        } catch (\Exception $e) {
            \Log::error('❌ ERROR EN EXPORTACIÓN PDF', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    private function calcularEstadisticas(Carbon $fechaDesde, Carbon $fechaHasta): array
    {
        $comprasEnPeriodo = Compra::with('proveedor')
            ->whereBetween('fecha', [$fechaDesde, $fechaHasta])
            ->get();

        $fechaMesAnterior = $fechaDesde->copy()->subMonth();
        $comprasMesAnterior = Compra::whereBetween('fecha', [
            $fechaMesAnterior->startOfMonth(),
            $fechaMesAnterior->endOfMonth()
        ])->sum('total');

        $montoTotal = $comprasEnPeriodo->sum('total');
        $variacionMesAnterior = $comprasMesAnterior > 0
            ? (($montoTotal - $comprasMesAnterior) / $comprasMesAnterior) * 100
            : 0;

        $proveedorPrincipal = $comprasEnPeriodo
            ->groupBy('proveedor_id')
            ->map(function ($grupo) {
                return [
                    'proveedor_id' => $grupo->first()->proveedor_id,
                    'nombre' => $grupo->first()->proveedor->nombre,
                    'total' => $grupo->sum('total'),
                ];
            })
            ->sortByDesc('total')
            ->first();

        $porMes = $comprasEnPeriodo->groupBy(function ($item) {
            return $item->fecha->format('M Y');
        })->map(fn($g) => $g->sum('total'));
        $mesMayorCompra = $porMes->keys()[0] ?? 'N/A';

        return [
            'total_compras_periodo' => $montoTotal,
            'cantidad_compras_periodo' => $comprasEnPeriodo->count(),
            'promedio_compra_periodo' => $comprasEnPeriodo->avg('total') ?? 0,
            'variacion_mes_anterior' => $variacionMesAnterior,
            'proveedor_principal' => $proveedorPrincipal ? [
                'id' => $proveedorPrincipal['proveedor_id'],
                'nombre' => $proveedorPrincipal['nombre'],
            ] : ['id' => 0, 'nombre' => 'N/A'],
            'categoria_principal' => 'Todas',
            'mes_mayor_compra' => $mesMayorCompra,
        ];
    }

    private function obtenerComprasPorProveedor(Carbon $fechaDesde, Carbon $fechaHasta): array
    {
        $comprasEnPeriodo = Compra::with('proveedor')
            ->whereBetween('fecha', [$fechaDesde, $fechaHasta])
            ->get();

        $montoTotalGeneral = $comprasEnPeriodo->sum('total');

        return $comprasEnPeriodo
            ->groupBy('proveedor_id')
            ->map(function ($grupo) use ($montoTotalGeneral) {
                $proveedor = $grupo->first()->proveedor;
                $totalCompras = $grupo->sum('total');

                return [
                    'proveedor' => [
                        'id' => $proveedor->id,
                        'nombre' => $proveedor->nombre,
                        'nit' => $proveedor->nit ?? 'N/A',
                    ],
                    'total_compras' => $totalCompras,
                    'cantidad_compras' => $grupo->count(),
                    'promedio_compra' => $grupo->avg('total') ?? 0,
                    'porcentaje_total' => $montoTotalGeneral > 0 ? ($totalCompras / $montoTotalGeneral) * 100 : 0,
                    'ultima_compra' => $grupo->max('fecha')->format('Y-m-d'),
                ];
            })
            ->sortByDesc('total_compras')
            ->values()
            ->toArray();
    }

    private function reporteComprasPorPeriodo(Request $request): \Illuminate\Http\JsonResponse
    {
        $query = Compra::with(['proveedor', 'detalleCompras.producto'])
            ->when($request->fecha_desde && $request->fecha_hasta, function ($q) use ($request) {
                $q->whereBetween('fecha', [$request->fecha_desde, $request->fecha_hasta]);
            })
            ->when($request->proveedor_id, function ($q) use ($request) {
                $q->where('proveedor_id', $request->proveedor_id);
            });

        $compras = $query->get();

        $resumen = [
            'total_compras' => $compras->count(),
            'monto_total' => $compras->sum('total'),
            'promedio_compra' => $compras->avg('total'),
            'compras_por_proveedor' => $compras->groupBy('proveedor.nombre')
                ->map(function ($grupo) {
                    return [
                        'cantidad' => $grupo->count(),
                        'total' => $grupo->sum('total'),
                    ];
                }),
        ];

        return response()->json([
            'compras' => $compras,
            'resumen' => $resumen,
        ]);
    }

    private function reporteCuentasPorPagar(Request $request): \Illuminate\Http\JsonResponse
    {
        $query = CuentaPorPagar::with(['compra.proveedor'])
            ->when($request->estado, function ($q) use ($request) {
                $q->where('estado', $request->estado);
            })
            ->when($request->proveedor_id, function ($q) use ($request) {
                $q->whereHas('compra', function ($compraQ) use ($request) {
                    $compraQ->where('proveedor_id', $request->proveedor_id);
                });
            })
            ->when($request->dias_vencimiento, function ($q) use ($request) {
                $diasVencimiento = (int) $request->dias_vencimiento;
                $fechaLimite = now()->addDays($diasVencimiento);
                $q->where('fecha_vencimiento', '<=', $fechaLimite);
            });

        $cuentas = $query->get();

        $resumen = [
            'total_cuentas' => $cuentas->count(),
            'monto_total_pendiente' => $cuentas->sum('saldo_pendiente'),
            'cuentas_vencidas' => $cuentas->filter(function ($cuenta) {
                return $cuenta->fecha_vencimiento < now();
            })->count(),
            'por_estado' => $cuentas->groupBy('estado')
                ->map(function ($grupo) {
                    return [
                        'cantidad' => $grupo->count(),
                        'monto' => $grupo->sum('saldo_pendiente'),
                    ];
                }),
        ];

        return response()->json([
            'cuentas' => $cuentas,
            'resumen' => $resumen,
        ]);
    }

    private function reportePagosRealizados(Request $request): \Illuminate\Http\JsonResponse
    {
        $query = Pago::with(['cuentaPorPagar.compra.proveedor', 'tipoPago'])
            ->whereNotNull('cuenta_por_pagar_id')
            ->when($request->fecha_desde && $request->fecha_hasta, function ($q) use ($request) {
                $q->whereBetween('fecha_pago', [$request->fecha_desde, $request->fecha_hasta]);
            })
            ->when($request->tipo_pago_id, function ($q) use ($request) {
                $q->where('tipo_pago_id', $request->tipo_pago_id);
            })
            ->when($request->proveedor_id, function ($q) use ($request) {
                $q->whereHas('cuentaPorPagar.compra', function ($compraQ) use ($request) {
                    $compraQ->where('proveedor_id', $request->proveedor_id);
                });
            });

        $pagos = $query->get();

        $resumen = [
            'total_pagos' => $pagos->count(),
            'monto_total_pagado' => $pagos->sum('monto'),
            'promedio_pago' => $pagos->avg('monto'),
            'por_tipo_pago' => $pagos->groupBy('tipoPago.nombre')
                ->map(function ($grupo) {
                    return [
                        'cantidad' => $grupo->count(),
                        'monto' => $grupo->sum('monto'),
                    ];
                }),
        ];

        return response()->json([
            'pagos' => $pagos,
            'resumen' => $resumen,
        ]);
    }

    private function reporteProductosVencimiento(Request $request): \Illuminate\Http\JsonResponse
    {
        $query = LoteVencimiento::with(['detalleCompra.producto', 'detalleCompra.compra.proveedor'])
            ->when($request->dias_vencimiento, function ($q) use ($request) {
                $diasVencimiento = (int) $request->dias_vencimiento;
                $fechaLimite = now()->addDays($diasVencimiento);
                $q->where('fecha_vencimiento', '<=', $fechaLimite);
            })
            ->when($request->proveedor_id, function ($q) use ($request) {
                $q->whereHas('detalleCompra.compra', function ($compraQ) use ($request) {
                    $compraQ->where('proveedor_id', $request->proveedor_id);
                });
            })
            ->where('estado', 'ACTIVO');

        $lotes = $query->get();

        $resumen = [
            'total_lotes' => $lotes->count(),
            'cantidad_productos' => $lotes->sum('cantidad_disponible'),
            'valor_inventario' => $lotes->sum(function ($lote) {
                return $lote->cantidad_disponible * $lote->precio_unitario;
            }),
            'por_categoria' => $lotes->groupBy('detalleCompra.producto.categoria.nombre')
                ->map(function ($grupo) {
                    return [
                        'cantidad_lotes' => $grupo->count(),
                        'cantidad_productos' => $grupo->sum('cantidad_disponible'),
                        'valor' => $grupo->sum(function ($lote) {
                            return $lote->cantidad_disponible * $lote->precio_unitario;
                        }),
                    ];
                }),
        ];

        return response()->json([
            'lotes' => $lotes,
            'resumen' => $resumen,
        ]);
    }

    private function escapeCsvValue($value): string
    {
        if ($value === null || $value === '') {
            return '';
        }

        $value = (string) $value;

        // Si contiene comillas, comas o saltos de línea, envolver en comillas y duplicar las comillas internas
        if (strpos($value, '"') !== false || strpos($value, ',') !== false || strpos($value, "\n") !== false) {
            return '"' . str_replace('"', '""', $value) . '"';
        }

        return $value;
    }

    private function reporteAnalisisProveedores(Request $request): \Illuminate\Http\JsonResponse
    {
        $fechaDesde = $request->fecha_desde ?? now()->subMonths(6);
        $fechaHasta = $request->fecha_hasta ?? now();

        // Estadísticas por proveedor
        $analisisProveedores = DB::select('
            SELECT
                p.id,
                p.nombre,
                COUNT(DISTINCT c.id) as total_compras,
                COALESCE(SUM(c.total), 0) as monto_total_compras,
                COALESCE(AVG(c.total), 0) as promedio_compra,
                COUNT(DISTINCT pag.id) as total_pagos,
                COALESCE(SUM(pag.monto), 0) as monto_total_pagos,
                COALESCE(SUM(cpp.saldo_pendiente), 0) as saldo_pendiente
            FROM proveedores p
            LEFT JOIN compras c ON p.id = c.proveedor_id
                AND c.fecha BETWEEN ? AND ?
            LEFT JOIN cuentas_por_pagar cpp ON c.id = cpp.compra_id
            LEFT JOIN pagos pag ON cpp.id = pag.cuenta_por_pagar_id
            WHERE p.activo = true
            GROUP BY p.id, p.nombre
            HAVING total_compras > 0
            ORDER BY monto_total_compras DESC
        ', [$fechaDesde, $fechaHasta]);

        return response()->json([
            'analisis_proveedores' => $analisisProveedores,
            'periodo' => [
                'fecha_desde' => $fechaDesde,
                'fecha_hasta' => $fechaHasta,
            ],
        ]);
    }
}
