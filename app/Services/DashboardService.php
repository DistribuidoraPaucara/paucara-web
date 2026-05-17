<?php

namespace App\Services;

use App\Models\Cliente;
use App\Models\Compra;
use App\Models\MovimientoCaja;
use App\Models\Producto;
use App\Models\Proforma;
use App\Models\StockProducto;
use App\Models\User;
use App\Models\Venta;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * Obtener métricas principales del dashboard
     * @param string $periodo Período a consultar
     * @param int|null $cajaId ID de la caja abierta (opcional). Si se proporciona, filtra datos solo de esta caja
     */
    public function getMainMetrics(string $periodo = 'mes_actual', ?int $cajaId = null): array
    {
        $fechas = $this->getFechasPeriodo($periodo);

        return [
            'ventas' => $this->getMetricasVentas($fechas, $cajaId),
            'compras' => $this->getMetricasCompras($fechas),
            'inventario' => $this->getMetricasInventario(),
            'caja' => $this->getMetricasCaja($fechas, $cajaId),
            'clientes' => $this->getMetricasClientes($fechas),
            'proformas' => $this->getMetricasProformas($fechas, $cajaId),
        ];
    }

    /**
     * Obtener datos para gráficos de ventas por período
     *
     * @param string $periodoODias Período a consultar (mes_actual, año_actual, etc.) o número de días (legacy)
     * @param int|null $cajaId Filtra por caja abierta (opcional)
     */
    public function getGraficoVentas(string $periodoODias = 'mes_actual', ?int $cajaId = null): array
    {
        // Detectar si es un período válido o un número de días (legacy)
        $periodosValidos = ['hoy', 'semana_actual', 'ultimos_30_dias', 'mes_actual', 'año_actual'];

        if (in_array($periodoODias, $periodosValidos)) {
            // Es un período válido
            $fechas = $this->getFechasPeriodo($periodoODias);
        } else {
            // Es un número de días (legacy) - convertir a número
            $dias = (int)$periodoODias;
            $fechas = [
                'inicio' => Carbon::now()->subDays($dias),
                'fin' => Carbon::now(),
            ];
        }

        $query = Venta::select(
            DB::raw('DATE(fecha) as fecha'),
            DB::raw('COUNT(*) as total_ventas'),
            DB::raw('SUM(total) as monto_total'),
            DB::raw('AVG(total) as promedio_venta')
        )
            ->whereBetween('fecha', [$fechas['inicio'], $fechas['fin']])
            ->whereHas('estadoDocumento', function ($query) {
                $query->where('codigo', 'APROBADO');
            });

        if ($cajaId) {
            $query->whereHas('movimientoCaja', function($q) use ($cajaId) {
                $q->where('caja_id', $cajaId);
            });
        }

        $ventas = $query->groupBy(DB::raw('DATE(fecha)'))
            ->orderBy('fecha')
            ->get();

        return [
            'labels' => $ventas->pluck('fecha')->map(function ($fecha) {
                return Carbon::parse($fecha)->format('d/m');
            })->toArray(),
            'datasets' => [
                [
                    'label' => 'Monto de Ventas (Bs)',
                    'data' => $ventas->pluck('monto_total')->toArray(),
                    'backgroundColor' => 'rgba(59, 130, 246, 0.5)',
                    'borderColor' => 'rgb(59, 130, 246)',
                    'tension' => 0.1,
                ],
                [
                    'label' => 'Cantidad de Ventas',
                    'data' => $ventas->pluck('total_ventas')->toArray(),
                    'backgroundColor' => 'rgba(16, 185, 129, 0.5)',
                    'borderColor' => 'rgb(16, 185, 129)',
                    'tension' => 0.1,
                    'yAxisID' => 'y1',
                ],
            ],
        ];
    }

    /**
     * Obtener productos más vendidos por ingresos (dinero generado)
     *
     * @param int $limite Número de productos a retornar
     * @param string $periodo Período a consultar (mes_actual, año_actual, etc.)
     * @param int|null $cajaId Filtra por caja abierta (opcional). Usa JOIN con movimientos_caja
     */
    public function getProductosMasVendidos(int $limite = 10, string $periodo = 'mes_actual', ?int $cajaId = null): array
    {
        $fechas = $this->getFechasPeriodo($periodo);

        $query = DB::table('detalle_ventas')
            ->join('productos', 'detalle_ventas.producto_id', '=', 'productos.id')
            ->join('ventas', 'detalle_ventas.venta_id', '=', 'ventas.id')
            ->join('estados_documento', 'ventas.estado_documento_id', '=', 'estados_documento.id')
            ->whereBetween('ventas.fecha', [$fechas['inicio'], $fechas['fin']])
            ->where('estados_documento.codigo', 'APROBADO');

        if ($cajaId) {
            $query->join('movimientos_caja', 'ventas.numero', '=', 'movimientos_caja.numero_documento')
                  ->where('movimientos_caja.caja_id', $cajaId);
        }

        return $query->select(
                'productos.nombre',
                DB::raw('SUM(detalle_ventas.cantidad) as total_vendido'),
                DB::raw('SUM(detalle_ventas.subtotal) as ingresos_total')
            )
            ->groupBy('productos.id', 'productos.nombre')
            ->orderBy('ingresos_total', 'desc')
            ->limit($limite)
            ->get()
            ->map(function ($item) {
                return [
                    'nombre' => $item->nombre,
                    'total_vendido' => round($item->total_vendido, 2),
                    'ingresos_total' => round($item->ingresos_total, 2),
                ];
            })
            ->toArray();
    }

    /**
     * Obtener alertas de stock bajo
     */
    public function getAlertasStock(): array
    {
        $stockBajo = StockProducto::with(['producto', 'almacen'])
            ->whereColumn('cantidad', '<=', DB::raw('productos.stock_minimo'))
            ->join('productos', 'stock_productos.producto_id', '=', 'productos.id')
            ->where('productos.activo', true)
            ->select('stock_productos.*')
            ->get();

        $stockCritico = $stockBajo->where('cantidad', '<=', function ($item) {
            return $item->producto->stock_minimo * 0.5;
        });

        return [
            'stock_bajo' => $stockBajo->count(),
            'stock_critico' => $stockCritico->count(),
            'productos_afectados' => $stockBajo->take(5)->map(function ($stock) {
                return [
                    'producto' => $stock->producto->nombre,
                    'almacen' => $stock->almacen->nombre,
                    'cantidad_actual' => $stock->cantidad,
                    'stock_minimo' => $stock->producto->stock_minimo,
                ];
            }),
        ];
    }

    /**
     * Obtener distribución de ventas por canal
     */
    public function getVentasPorCanal(string $periodo = 'mes_actual'): array
    {
        $fechas = $this->getFechasPeriodo($periodo);

        return Venta::select('canal_origen', DB::raw('COUNT(*) as total'), DB::raw('SUM(total) as monto'))
            ->whereBetween('fecha', [$fechas['inicio'], $fechas['fin']])
            ->whereHas('estadoDocumento', function($q) {
                $q->where('codigo', 'APROBADO');
            })
            ->groupBy('canal_origen')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->canal_origen => [
                    'total' => $item->total,
                    'monto' => round($item->monto, 2),
                ]];
            })
            ->toArray();
    }

    /**
     * Obtener métricas de ventas
     * @param int|null $cajaId Filtra por caja abierta (opcional). Usa whereHas para filtrar por MovimientoCaja.caja_id
     */
    private function getMetricasVentas(array $fechas, ?int $cajaId = null): array
    {
        $query = Venta::whereBetween('fecha', [$fechas['inicio'], $fechas['fin']])
            ->whereHas('estadoDocumento', function($q) {
                $q->where('codigo', 'APROBADO');
            });
        if ($cajaId) {
            $query->whereHas('movimientoCaja', function($q) use ($cajaId) {
                $q->where('caja_id', $cajaId);
            });
        }
        $ventasActuales = $query->sum('total');

        $queryAnterior = Venta::whereBetween('fecha', [$fechas['inicio_anterior'], $fechas['fin_anterior']])
            ->whereHas('estadoDocumento', function($q) {
                $q->where('codigo', 'APROBADO');
            });
        if ($cajaId) {
            $queryAnterior->whereHas('movimientoCaja', function($q) use ($cajaId) {
                $q->where('caja_id', $cajaId);
            });
        }
        $ventasAnteriores = $queryAnterior->sum('total');

        $cambio = $ventasAnteriores > 0 ? (($ventasActuales - $ventasAnteriores) / $ventasAnteriores) * 100 : 0;

        $queryCount = Venta::whereBetween('fecha', [$fechas['inicio'], $fechas['fin']])
            ->whereHas('estadoDocumento', function($q) {
                $q->where('codigo', 'APROBADO');
            });
        if ($cajaId) {
            $queryCount->whereHas('movimientoCaja', function($q) use ($cajaId) {
                $q->where('caja_id', $cajaId);
            });
        }

        $queryAvg = Venta::whereBetween('fecha', [$fechas['inicio'], $fechas['fin']])
            ->whereHas('estadoDocumento', function($q) {
                $q->where('codigo', 'APROBADO');
            });
        if ($cajaId) {
            $queryAvg->whereHas('movimientoCaja', function($q) use ($cajaId) {
                $q->where('caja_id', $cajaId);
            });
        }

        return [
            'total' => round($ventasActuales, 2),
            'cantidad' => $queryCount->count(),
            'promedio' => round($queryAvg->avg('total') ?? 0, 2),
            'cambio_porcentual' => round($cambio, 2),
        ];
    }

    /**
     * Obtener métricas de compras
     */
    private function getMetricasCompras(array $fechas): array
    {
        $comprasActuales = Compra::whereBetween('fecha', [$fechas['inicio'], $fechas['fin']])->sum('total');
        $comprasAnteriores = Compra::whereBetween('fecha', [$fechas['inicio_anterior'], $fechas['fin_anterior']])->sum('total');

        $cambio = $comprasAnteriores > 0 ? (($comprasActuales - $comprasAnteriores) / $comprasAnteriores) * 100 : 0;

        return [
            'total' => round($comprasActuales, 2),
            'cantidad' => Compra::whereBetween('fecha', [$fechas['inicio'], $fechas['fin']])->count(),
            'promedio' => round(Compra::whereBetween('fecha', [$fechas['inicio'], $fechas['fin']])->avg('total') ?? 0, 2),
            'cambio_porcentual' => round($cambio, 2),
        ];
    }

    /**
     * Obtener métricas de inventario
     */
    private function getMetricasInventario(): array
    {
        $totalProductos = Producto::where('activo', true)->count();
        $stockTotal = StockProducto::sum('cantidad');
        $valorInventario = DB::table('stock_productos')
            ->join('productos', 'stock_productos.producto_id', '=', 'productos.id')
            ->join('precios_producto', function ($join) {
                $join->on('productos.id', '=', 'precios_producto.producto_id')
                    ->where('precios_producto.es_precio_base', true)
                    ->where('precios_producto.activo', true);
            })
            ->sum(DB::raw('stock_productos.cantidad * precios_producto.precio'));

        return [
            'total_productos' => $totalProductos,
            'stock_total' => round($stockTotal, 2),
            'valor_inventario' => round($valorInventario, 2),
            'productos_sin_stock' => StockProducto::where('cantidad', '<=', 0)->count(),
        ];
    }

    /**
     * Obtener métricas de caja
     * @param int|null $cajaId Filtra por caja abierta (opcional)
     */
    private function getMetricasCaja(array $fechas, ?int $cajaId = null): array
    {
        $queryIngresos = MovimientoCaja::join('tipo_operacion_caja', 'movimientos_caja.tipo_operacion_id', '=', 'tipo_operacion_caja.id')
            ->where('tipo_operacion_caja.codigo', 'INGRESO')
            ->whereBetween('movimientos_caja.fecha', [$fechas['inicio'], $fechas['fin']]);
        if ($cajaId) {
            $queryIngresos->where('movimientos_caja.caja_id', $cajaId);
        }
        $ingresos = $queryIngresos->sum('movimientos_caja.monto');

        $queryEgresos = MovimientoCaja::join('tipo_operacion_caja', 'movimientos_caja.tipo_operacion_id', '=', 'tipo_operacion_caja.id')
            ->where('tipo_operacion_caja.codigo', 'EGRESO')
            ->whereBetween('movimientos_caja.fecha', [$fechas['inicio'], $fechas['fin']]);
        if ($cajaId) {
            $queryEgresos->where('movimientos_caja.caja_id', $cajaId);
        }
        $egresos = $queryEgresos->sum('movimientos_caja.monto');

        $queryCount = MovimientoCaja::whereBetween('fecha', [$fechas['inicio'], $fechas['fin']]);
        if ($cajaId) {
            $queryCount->where('caja_id', $cajaId);
        }

        $ingresos = round($ingresos, 2);
        $egresos = round($egresos, 2);

        return [
            'ingresos' => $ingresos,
            'egresos' => $egresos,
            'saldo' => round($ingresos - $egresos, 2),
            'total_movimientos' => $queryCount->count(),
        ];
    }

    /**
     * Obtener métricas de clientes
     */
    private function getMetricasClientes(array $fechas): array
    {
        $clientesNuevos = Cliente::whereBetween('fecha_registro', [$fechas['inicio'], $fechas['fin']])->count();
        $clientesActivos = Cliente::whereHas('ventas', function ($query) use ($fechas) {
            $query->whereBetween('fecha', [$fechas['inicio'], $fechas['fin']])
                  ->whereHas('estadoDocumento', function($q) {
                      $q->where('codigo', 'APROBADO');
                  });
        })->count();

        return [
            'total' => Cliente::where('activo', true)->count(),
            'nuevos' => $clientesNuevos,
            'activos' => $clientesActivos,
            'con_credito' => Cliente::where('limite_credito', '>', 0)->count(),
        ];
    }

    /**
     * Obtener métricas de proformas
     * @param int|null $cajaId NO se usa (proformas no tienen relación con caja)
     *
     * Nota: Las proformas NO tienen relación directa con cajas.
     * Se puede extender en el futuro para obtener el usuario_id del empleado de la caja.
     */
    private function getMetricasProformas(array $fechas, ?int $cajaId = null): array
    {
        // Por ahora, sin filtro específico (retorna todas las proformas)
        // Si se necesita filtrar por usuario (creador), se requeriría pasar el user_id explícitamente
        $query = Proforma::whereBetween('fecha', [$fechas['inicio'], $fechas['fin']]);
        $total = $query->count();

        $queryConvertidas = Proforma::whereHas('estadoLogistica', function ($q) {
            $q->where('codigo', 'CONVERTIDA')->where('categoria', 'proforma');
        })->whereBetween('fecha', [$fechas['inicio'], $fechas['fin']]);
        $convertidas = $queryConvertidas->count();

        // Contar proformas que NO han sido convertidas (pendientes)
        $queryPendientes = Proforma::whereHas('estadoLogistica', function ($q) {
            $q->where('codigo', '!=', 'CONVERTIDA')->where('categoria', 'proforma');
        })->whereBetween('fecha', [$fechas['inicio'], $fechas['fin']]);
        $pendientes = $queryPendientes->count();

        return [
            'total' => $total,
            'aprobadas' => $convertidas,  // Las "aprobadas" son las CONVERTIDAS
            'pendientes' => $pendientes,
            'tasa_aprobacion' => $total > 0 ? round(($convertidas / $total) * 100, 2) : 0,
        ];
    }

    /**
     * Obtener datos dinámicos solo para los módulos permitidos del usuario
     * Optimizado para no cargar datos innecesarios
     */
    public function getDataForAllowedModules(array $modulosPermitidos, string $periodo = 'mes_actual'): array
    {
        $data = [];
        $fechas = $this->getFechasPeriodo($periodo);

        // Mapeo de módulos a métodos de datos
        $modulosData = [
            'general' => function () use ($fechas, $periodo) {
                return [
                    'metricas_principales' => [
                        'ventas' => $this->getMetricasVentas($fechas),
                        'compras' => $this->getMetricasCompras($fechas),
                        'inventario' => $this->getMetricasInventario(),
                        'caja' => $this->getMetricasCaja($fechas),
                    ],
                    'metricas_secundarias' => [
                        'clientes' => $this->getMetricasClientes($fechas),
                        'proformas' => $this->getMetricasProformas($fechas),
                    ],
                    'grafico_ventas' => $this->getGraficoVentas($periodo),
                    'ventas_por_canal' => $this->getVentasPorCanal($periodo),
                    'productos_mas_vendidos' => $this->getProductosMasVendidos(10, $periodo),
                    'alertas_stock' => $this->getAlertasStock(),
                ];
            },
            'compras' => function () use ($fechas, $periodo) {
                return [
                    'metricas_compras' => $this->getMetricasCompras($fechas),
                    'grafico_compras' => $this->getGraficoCompras($fechas),
                    'cuentas_por_pagar' => $this->getCuentasPagar(),
                    'pagos_realizados' => $this->getPagosRealizados($fechas),
                    'lotes_proximos_vencer' => $this->getLotesProximosVencer(),
                ];
            },
            'logistica' => function () use ($fechas) {
                return [
                    'metricas_logistica' => $this->getMetricasLogistica(),
                    'rutas_del_dia' => $this->getRutasDelDia(),
                    'envios_activos' => $this->getEnviosActivos(),
                ];
            },
            'inventario' => function () use ($fechas) {
                return [
                    'metricas_inventario' => $this->getMetricasInventario(),
                    'alertas_stock' => $this->getAlertasStock(),
                ];
            },
            'contabilidad' => function () use ($fechas, $periodo) {
                return [
                    'saldo_caja' => $this->getMetricasCaja($fechas),
                    'movimientos_caja' => $this->getMovimientosCaja($fechas),
                ];
            },
        ];

        // Cargar datos solo para módulos permitidos
        foreach ($modulosPermitidos as $modulo) {
            if (isset($modulosData[$modulo])) {
                $data[$modulo] = $modulosData[$modulo]();
            }
        }

        return $data;
    }

    /**
     * Obtener gráfico de compras
     */
    public function getGraficoCompras(array $fechas): array
    {
        $compras = Compra::select(
            DB::raw('DATE(fecha) as fecha'),
            DB::raw('COUNT(*) as total_compras'),
            DB::raw('SUM(total) as monto_total')
        )
            ->whereBetween('fecha', [$fechas['inicio'], $fechas['fin']])
            ->groupBy(DB::raw('DATE(fecha)'))
            ->orderBy('fecha')
            ->get();

        return [
            'labels' => $compras->pluck('fecha')->map(function ($fecha) {
                return Carbon::parse($fecha)->format('d/m');
            })->toArray(),
            'datasets' => [
                [
                    'label' => 'Monto de Compras (Bs)',
                    'data' => $compras->pluck('monto_total')->toArray(),
                    'backgroundColor' => 'rgba(245, 158, 11, 0.5)',
                    'borderColor' => 'rgb(245, 158, 11)',
                    'tension' => 0.1,
                ],
            ],
        ];
    }

    /**
     * Obtener cuentas por pagar
     */
    public function getCuentasPagar(): array
    {
        return [
            'total_pendiente' => 0,
            'cantidad_cuentas' => 0,
            'proveedores' => [],
        ];
    }

    /**
     * Obtener pagos realizados en período
     */
    public function getPagosRealizados(array $fechas): array
    {
        return [
            'total_pagado' => 0,
            'cantidad_pagos' => 0,
        ];
    }

    /**
     * Obtener lotes próximos a vencer (30 días)
     */
    public function getLotesProximosVencer(): array
    {
        return [
            'cantidad' => 0,
            'lotes' => [],
        ];
    }

    /**
     * Obtener métricas de logística
     */
    public function getMetricasLogistica(): array
    {
        return [
            'rutas_programadas' => 0,
            'rutas_completadas' => 0,
            'km_recorridos' => 0,
        ];
    }

    /**
     * Obtener rutas del día
     */
    public function getRutasDelDia(): array
    {
        return [
            'total' => 0,
            'rutas' => [],
        ];
    }

    /**
     * Obtener envíos activos
     */
    public function getEnviosActivos(): array
    {
        return [
            'en_transito' => 0,
            'entregados' => 0,
            'pendientes' => 0,
        ];
    }

    /**
     * Obtener movimientos de caja
     */
    public function getMovimientosCaja(array $fechas): array
    {
        return MovimientoCaja::whereBetween('fecha', [$fechas['inicio'], $fechas['fin']])
            ->orderBy('id', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($movimiento) {
                return [
                    'fecha' => $movimiento->fecha->format('d/m/Y H:i'),
                    'tipo' => $movimiento->tipoOperacion->nombre ?? 'N/A',
                    'monto' => $movimiento->monto,
                    'descripcion' => $movimiento->descripcion,
                ];
            })
            ->toArray();
    }

    /**
     * Obtener fechas para el período especificado
     */
    public function getFechasPeriodo(string $periodo): array
    {
        switch ($periodo) {
            case 'hoy':
                $inicio = Carbon::today();
                $fin = Carbon::today()->endOfDay();
                $inicioAnterior = Carbon::yesterday();
                $finAnterior = Carbon::yesterday()->endOfDay();
                break;

            case 'semana_actual':
                $inicio = Carbon::now()->startOfWeek();
                $fin = Carbon::now()->endOfWeek();
                $inicioAnterior = Carbon::now()->subWeek()->startOfWeek();
                $finAnterior = Carbon::now()->subWeek()->endOfWeek();
                break;

            case 'ultimos_30_dias':
                $inicio = Carbon::now()->subDays(30);
                $fin = Carbon::now();
                $inicioAnterior = Carbon::now()->subDays(60);
                $finAnterior = Carbon::now()->subDays(30);
                break;

            case 'mes_actual':
                $inicio = Carbon::now()->startOfMonth();
                $fin = Carbon::now()->endOfMonth();
                $inicioAnterior = Carbon::now()->subMonth()->startOfMonth();
                $finAnterior = Carbon::now()->subMonth()->endOfMonth();
                break;

            case 'año_actual':
                $inicio = Carbon::now()->startOfYear();
                $fin = Carbon::now()->endOfYear();
                $inicioAnterior = Carbon::now()->subYear()->startOfYear();
                $finAnterior = Carbon::now()->subYear()->endOfYear();
                break;

            default:
                // Default: últimos 30 días para mostrar datos reales
                $inicio = Carbon::now()->subDays(30);
                $fin = Carbon::now();
                $inicioAnterior = Carbon::now()->subDays(60);
                $finAnterior = Carbon::now()->subDays(30);
                break;
        }

        return [
            'inicio' => $inicio,
            'fin' => $fin,
            'inicio_anterior' => $inicioAnterior,
            'fin_anterior' => $finAnterior,
        ];
    }

    // ══════════════════════════════════════════════════════════
    // WIDGETS & MÓDULOS - Consolidado de DashboardWidgetsService
    // ══════════════════════════════════════════════════════════

    protected array $config;

    /**
     * Obtener configuración de widgets (lazy-loaded)
     */
    private function getWidgetsConfig(): array
    {
        if (isset($this->config)) {
            return $this->config;
        }

        return $this->config = config('dashboard-widgets') ?? $this->getDefaultWidgetsConfig();
    }

    /**
     * Configuración por defecto de widgets
     */
    private function getDefaultWidgetsConfig(): array
    {
        return [
            'role_modules' => [
                'super_admin' => ['general', 'compras', 'logistica', 'inventario', 'contabilidad'],
                'admin' => ['general', 'compras', 'logistica', 'inventario', 'contabilidad'],
                'comprador' => ['general', 'compras'],
                'preventista' => ['general', 'preventista'],
                'chofer' => ['general', 'chofer'],
                'logistica' => ['general', 'logistica'],
                'gestor_almacen' => ['general', 'almacen', 'inventario'],
                'vendedor' => ['general', 'vendedor'],
                'cajero' => ['general', 'vendedor'],
                'contabilidad' => ['general', 'contabilidad'],
            ],
            'modules' => [
                'general' => [
                    'required_permissions' => [],
                    'widgets' => ['metricas_principales', 'metricas_secundarias', 'grafico_ventas'],
                ],
                'preventista' => [
                    'required_permissions' => ['preventista.manage'],
                    'widgets' => ['mis_clientes', 'comisiones', 'proformas_pendientes'],
                ],
                'compras' => [
                    'required_permissions' => ['compras.manage'],
                    'widgets' => ['metricas_compras'],
                ],
                'logistica' => [
                    'required_permissions' => ['logistica.manage'],
                    'widgets' => ['metricas_logistica'],
                ],
            ],
        ];
    }

    /**
     * Obtener módulos permitidos para el usuario
     */
    public function getModulosPermitidos(User $user = null): array
    {
        $user = $user ?? Auth::user();

        if (!$user) {
            return [];
        }

        return Cache::remember(
            "dashboard_modulos_usuario_{$user->id}",
            now()->addHours(1),
            function () use ($user) {
                $config = $this->getWidgetsConfig();
                $roleNames = $user->getRoleNames()->toArray();
                $modulosPermitidos = [];

                foreach ($roleNames as $roleName) {
                    $roleModules = $config['role_modules'][$roleName] ?? [];
                    $modulosPermitidos = array_merge($modulosPermitidos, $roleModules);
                }

                $modulosPermitidos = array_unique($modulosPermitidos);

                return array_filter($modulosPermitidos, function ($modulo) use ($user) {
                    return $this->usuarioTienePermisoModulo($user, $modulo);
                });
            }
        );
    }

    /**
     * Verificar si usuario tiene permisos para un módulo
     */
    public function usuarioTienePermisoModulo(User $user, string $modulo): bool
    {
        $config = $this->getWidgetsConfig();

        if (!isset($config['modules'][$modulo])) {
            return false;
        }

        $moduloConfig = $config['modules'][$modulo];
        $permisosRequeridos = $moduloConfig['required_permissions'] ?? [];

        if (empty($permisosRequeridos)) {
            return true;
        }

        foreach ($permisosRequeridos as $permiso) {
            if ($user->can($permiso)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Obtener widgets a mostrar
     */
    public function getWidgetsAMostrar(User $user = null): array
    {
        $user = $user ?? Auth::user();
        $modulosPermitidos = $this->getModulosPermitidos($user);
        $config = $this->getWidgetsConfig();
        $widgetsAMostrar = [];

        foreach ($modulosPermitidos as $modulo) {
            if (!isset($config['modules'][$modulo])) {
                continue;
            }

            $widgets = $config['modules'][$modulo]['widgets'] ?? [];
            $widgetsAMostrar[$modulo] = $widgets;
        }

        return $widgetsAMostrar;
    }

    /**
     * Obtener widgets en lista plana
     */
    public function getWidgetsPlanos(User $user = null): array
    {
        $widgets = $this->getWidgetsAMostrar($user);
        $planos = [];

        foreach ($widgets as $modulo => $widgetsDelModulo) {
            $planos = array_merge($planos, $widgetsDelModulo);
        }

        return array_unique($planos);
    }

    /**
     * Obtener estructura completa del dashboard
     */
    public function getDashboardStructure(User $user = null): array
    {
        $user = $user ?? Auth::user();

        return [
            'modulos_permitidos' => $this->getModulosPermitidos($user),
            'widgets_por_modulo' => $this->getWidgetsAMostrar($user),
            'widgets_planos' => $this->getWidgetsPlanos($user),
            'roles_usuario' => $user->getRoleNames()->toArray(),
            'permisos_usuario' => $user->getAllPermissions()->pluck('name')->toArray(),
            'dashboard_route' => $this->getDashboardRoute($user),
        ];
    }

    /**
     * Limpiar caché de usuario
     */
    public function limpiarCacheUsuario(User $user): void
    {
        Cache::forget("dashboard_modulos_usuario_{$user->id}");
    }

    // ══════════════════════════════════════════════════════════
    // ROUTER - Consolidado de DashboardRouterService
    // ══════════════════════════════════════════════════════════

    protected array $roleRoutes = [
        'super_admin' => '/admin/dashboard',
        'admin' => '/admin/dashboard',
        'comprador' => '/compras/dashboard',
        'preventista' => '/preventista/dashboard',
        'chofer' => '/chofer/dashboard',
        'logistica' => '/logistica/dashboard',
        'gestor_almacen' => '/almacen/dashboard',
        'vendedor' => '/vendedor/dashboard',
        'cajero' => '/vendedor/dashboard',
        'contabilidad' => '/contabilidad/dashboard',
    ];

    /**
     * Obtener ruta del dashboard para el usuario
     */
    public function getDashboardRoute(User $user = null): string
    {
        $user = $user ?? Auth::user();

        if (!$user) {
            return '/dashboard';
        }

        // ✅ NUEVO: Verificar acceso a plataforma web
        if (!$user->can_access_web) {
            abort(403, 'No tienes acceso a la plataforma web (admin)');
        }

        $roles = $user->getRoleNames()->toArray();

        if (empty($roles)) {
            return '/dashboard';
        }

        $prioridad = [
            'super_admin' => 100,
            'admin' => 99,
            'comprador' => 50,
            'logistica' => 48,
            'gestor_almacen' => 47,
            'contabilidad' => 46,
            'preventista' => 45,
            'vendedor' => 40,
            'cajero' => 40,
            'chofer' => 30,
        ];

        $rolPrincipal = null;
        $maxPrioridad = -1;

        foreach ($roles as $rol) {
            $rolNormalizado = strtolower($rol);
            $p = $prioridad[$rolNormalizado] ?? 0;
            if ($p > $maxPrioridad) {
                $maxPrioridad = $p;
                $rolPrincipal = $rolNormalizado;
            }
        }

        return $this->roleRoutes[$rolPrincipal] ?? '/dashboard';
    }

    /**
     * Obtener nombre del dashboard
     */
    public function getDashboardName(User $user = null): string
    {
        $ruta = $this->getDashboardRoute($user);
        $partes = explode('/', trim($ruta, '/'));
        return $partes[0] ?? 'dashboard';
    }

    /**
     * Obtener información de redirección
     */
    public function getRedirectInfo(User $user = null): array
    {
        $user = $user ?? Auth::user();
        $ruta = $this->getDashboardRoute($user);
        $nombre = $this->getDashboardName($user);

        return [
            'usuario_id' => $user->id ?? null,
            'usuario_email' => $user->email ?? null,
            'roles' => $user->getRoleNames()->toArray() ?? [],
            'dashboard_url' => $ruta,
            'dashboard_nombre' => $nombre,
        ];
    }

    /**
     * Verificar si necesita redirección
     */
    public function needsRedirect(User $user = null): bool
    {
        $user = $user ?? Auth::user();
        $routeActual = request()->path();
        $routeCorrecta = trim($this->getDashboardRoute($user), '/');

        return $routeActual !== $routeCorrecta;
    }

    /**
     * Actualizar mapeo de rol
     */
    public function updateRoleRoute(string $rol, string $ruta): void
    {
        $this->roleRoutes[$rol] = $ruta;
    }

    /**
     * Obtener todos los mapeos de roles
     */
    public function getAllRoleRoutes(): array
    {
        return $this->roleRoutes;
    }

    /**
     * ✅ CRÉDITO: Obtener métricas de crédito de clientes para el dashboard
     */
    public function getMetricasCreditoClientes(): array
    {
        // Total de clientes activos
        $totalClientes = Cliente::where('activo', true)->count();

        // Clientes con crédito habilitado
        $clientesConCredito = Cliente::where('activo', true)
            ->where('puede_tener_credito', true)
            ->count();

        // Calcular crédito total disponible y utilizado
        $clientesConCredito = Cliente::where('activo', true)
            ->where('puede_tener_credito', true)
            ->with(['cuentasPorCobrar' => function ($q) {
                $q->where('estado', 'pendiente');
            }])
            ->get();

        $limiteTotalCredito = 0;
        $saldoUtilizado = 0;
        $clientesCercaLimite = 0;

        foreach ($clientesConCredito as $cliente) {
            $limiteTotalCredito += $cliente->limite_credito;
            $saldoPendiente = $cliente->cuentasPorCobrar->sum('saldo_pendiente');
            $saldoUtilizado += $saldoPendiente;

            // Contar clientes que están usando >80% de su crédito
            if ($cliente->limite_credito > 0) {
                $porcentajeUtilizacion = ($saldoPendiente / $cliente->limite_credito) * 100;
                if ($porcentajeUtilizacion > 80) {
                    $clientesCercaLimite++;
                }
            }
        }

        $saldoDisponible = $limiteTotalCredito - $saldoUtilizado;
        $porcentajeUtilizacion = $limiteTotalCredito > 0
            ? round(($saldoUtilizado / $limiteTotalCredito) * 100, 1)
            : 0;

        return [
            'total_clientes' => $totalClientes,
            'clientes_con_credito' => $clientesConCredito->count(),
            'porcentaje_clientes_credito' => $totalClientes > 0
                ? round(($clientesConCredito->count() / $totalClientes) * 100, 1)
                : 0,
            'limite_total_credito' => (float)$limiteTotalCredito,
            'saldo_utilizado' => (float)$saldoUtilizado,
            'saldo_disponible' => (float)$saldoDisponible,
            'porcentaje_utilizacion' => $porcentajeUtilizacion,
            'clientes_cerca_limite' => $clientesCercaLimite,
        ];
    }
}
