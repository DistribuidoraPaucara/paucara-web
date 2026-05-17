<?php

namespace App\Http\Controllers;

use App\Models\CierreDiarioGeneral;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CierreDiarioGeneralController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:cajas.index');
    }

    /**
     * Mostrar historial de cierres diarios generales
     * GET /cajas/admin/reportes-diarios
     *
     * ✅ ACTUALIZADO: Obtiene datos directamente de cierres_caja
     * Consolida por fecha y usuario
     */
    public function index(Request $request)
    {
        // ✅ Obtener cierres directamente de cierres_caja
        $query = \App\Models\CierreCaja::with(['usuario', 'caja', 'apertura'])
            ->orderBy('fecha', 'desc');

        // Filtro por fecha
        if ($request->filled('fecha')) {
            $query->whereDate('fecha', $request->fecha);
        }

        // Filtro por rango de fechas
        if ($request->filled('desde') && $request->filled('hasta')) {
            $query->whereBetween('fecha', [
                $request->desde . ' 00:00:00',
                $request->hasta . ' 23:59:59'
            ]);
        }

        // Filtro por usuario
        if ($request->filled('usuario_id')) {
            $query->where('user_id', $request->usuario_id);
        }

        // Filtro por discrepancias
        if ($request->boolean('solo_discrepancias')) {
            $query->where('diferencia', '!=', 0);
        }

        $cierres = $query->paginate(20);

        // ✅ Transformar datos para el frontend
        $cierresFormateados = $cierres->getCollection()->map(function ($cierre) {
            return [
                'id' => $cierre->id,
                'usuario_id' => $cierre->user_id,
                'fecha_ejecucion' => $cierre->fecha,
                'total_cajas_procesadas' => 1,
                'total_cajas_cerradas' => 1,
                'total_cajas_con_discrepancia' => $cierre->diferencia != 0 ? 1 : 0,
                'total_monto_esperado' => (float) $cierre->monto_esperado,
                'total_monto_real' => (float) $cierre->monto_real,
                'total_diferencias' => (float) $cierre->diferencia,
                'usuario' => [
                    'id' => $cierre->usuario->id,
                    'name' => $cierre->usuario->name,
                ],
                'caja' => [
                    'id' => $cierre->caja->id,
                    'nombre' => $cierre->caja->nombre ?? 'Caja ' . $cierre->caja_id,
                ],
                'apertura_monto' => (float) $cierre->apertura?->monto_apertura,
            ];
        });

        $cierres->setCollection($cierresFormateados);

        // ✅ Estadísticas generales calculadas desde cierres_caja
        $allCierres = \App\Models\CierreCaja::query();

        $estadisticas = [
            'total_cierres' => $allCierres->count(),
            'total_cajas_cerradas' => $allCierres->count(),
            'total_monto_procesado' => (float) $allCierres->sum('monto_real'),
            'cierres_con_discrepancias' => $allCierres->where('diferencia', '!=', 0)->count(),
        ];

        // Usuarios disponibles para filtro
        $usuarios = \App\Models\User::whereIn('id',
                \App\Models\CierreCaja::distinct()->pluck('user_id')
            )
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Cajas/ReportesDiarios', [
            'cierres' => $cierres,
            'estadisticas' => $estadisticas,
            'usuarios' => $usuarios,
            'filtros' => [
                'fecha' => $request->fecha,
                'desde' => $request->desde,
                'hasta' => $request->hasta,
                'usuario_id' => $request->usuario_id,
                'solo_discrepancias' => $request->boolean('solo_discrepancias'),
            ],
        ]);
    }

    /**
     * DEBUG: Ver datos en JSON para verificar qué se está obteniendo
     * GET /cajas/admin/reportes-diarios/{id}/debug
     */
    public function debug($id)
    {
        try {
            $cierre = \App\Models\CierreCaja::with(['usuario', 'caja', 'apertura'])->findOrFail($id);

            // ✅ ACTUALIZADO (2026-05-04): Usar apertura_id para filtrado preciso
            $movimientos = \App\Models\MovimientoCaja::where('apertura_caja_id', $cierre->apertura->id)
                ->with(['tipoOperacion', 'tipoPago', 'usuario', 'venta', 'pago', 'comprobantes'])
                ->orderBy('id', 'desc')
                ->get();

            return response()->json([
                'cierre' => [
                    'id' => $cierre->id,
                    'caja_id' => $cierre->caja_id,
                    'user_id' => $cierre->user_id,
                    'fecha_apertura' => $cierre->apertura->fecha,
                    'fecha_cierre' => $cierre->fecha,
                    'monto_esperado' => $cierre->monto_esperado,
                    'monto_real' => $cierre->monto_real,
                    'diferencia' => $cierre->diferencia,
                ],
                'movimientos_count' => $movimientos->count(),
                'movimientos_tipos' => $movimientos->groupBy('tipoOperacion.codigo')->map(function($g) {
                    return ['tipo' => $g->first()->tipoOperacion?->codigo ?? 'SIN_TIPO', 'cantidad' => $g->count(), 'total' => $g->sum('monto')];
                })->values(),
                'movimientos_sample' => $movimientos->take(5)->map(function($m) {
                    return [
                        'id' => $m->id,
                        'fecha' => $m->fecha,
                        'tipo' => $m->tipoOperacion?->codigo,
                        'monto' => $m->monto,
                        'documento' => $m->numero_documento,
                    ];
                }),
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()], 500);
        }
    }

    /**
     * Ver detalles completos de un cierre diario
     * GET /cajas/admin/reportes-diarios/{id}
     *
     * ✅ Muestra los movimientos de caja entre apertura y cierre
     * Considera que la caja pudo estar abierta desde días anteriores
     */
    public function show($id)
    {
        try {
            // ✅ Obtener cierre directamente de cierres_caja
            $cierre = \App\Models\CierreCaja::with(['usuario', 'caja', 'apertura'])->findOrFail($id);

            // ✅ ACTUALIZADO (2026-05-04): Usar apertura_id directamente para garantizar que solo se muestren movimientos de ESTA apertura
            // Antes: Filtraba por rango de fechas, lo que podía incluir movimientos de aperturas anteriores
            // Ahora: Filtra por apertura_id específica - mucho más preciso
            $movimientos = \App\Models\MovimientoCaja::where('apertura_caja_id', $cierre->apertura->id)
                ->with(['tipoOperacion', 'tipoPago', 'usuario', 'venta', 'venta.estadoDocumento', 'venta.cliente', 'venta.tipoPago', 'venta.detallesPagoVenta.tipoPago', 'pago', 'comprobantes'])  // ✅ NUEVO: Cargar tipoPago de venta también
                ->orderBy('id', 'asc')
                ->get();

            // ✅ Calcular totales por tipo de operación (filtrando los que tienen tipoOperacion)
            $totalesPorTipo = $movimientos
                ->filter(fn($mov) => $mov->tipoOperacion !== null)
                ->groupBy('tipoOperacion.codigo')
                ->map(fn($group) => [
                    'codigo' => $group->first()->tipoOperacion->codigo ?? 'OTRO',
                    'nombre' => $group->first()->tipoOperacion->nombre ?? 'Otro',
                    'cantidad' => $group->count(),
                    'total' => (float) $group->sum('monto'),
                ])
                ->values();

            // ✅ Transformar movimientos para el frontend
            $movimientosFormateados = $movimientos->map(fn($mov) => [
                'id' => $mov->id,
                'fecha' => $mov->fecha->toIso8601String(),
                'usuario' => $mov->usuario ? [
                    'id' => $mov->usuario->id,
                    'name' => $mov->usuario->name,
                ] : ['id' => null, 'name' => 'N/A'],
                'tipo_operacion' => $mov->tipoOperacion ? [
                    'codigo' => $mov->tipoOperacion->codigo,
                    'nombre' => $mov->tipoOperacion->nombre,
                ] : ['codigo' => 'OTRO', 'nombre' => 'Otro'],
                'numero_documento' => $mov->numero_documento ?? 'N/A',
                'monto' => (float) $mov->monto,
                'observaciones' => $mov->observaciones,
                'venta_id' => $mov->venta_id,
                'pago_id' => $mov->pago_id,
                // ✅ ACTUALIZADO (2026-05-04): Incluir tipo de pago (fallback a venta.tipo_pago_id)
                'tipo_pago_id' => $mov->tipo_pago_id ?? ($mov->venta?->tipo_pago_id ?? null),
                'tipo_pago' => $mov->tipoPago ? [
                    'id' => $mov->tipoPago->id,
                    'nombre' => $mov->tipoPago->nombre,
                ] : ($mov->venta?->tipoPago ? [
                    'id' => $mov->venta->tipoPago->id,
                    'nombre' => $mov->venta->tipoPago->nombre,
                ] : null),
                // ✅ NUEVO (2026-05-04): Incluir relación VENTA completa
                'venta' => $mov->venta ? [
                    'id' => $mov->venta->id,
                    'numero_documento' => $mov->venta->numero ?? 'N/A',
                    'total' => (float) ($mov->venta->total ?? 0),
                    'monto_pagado' => (float) ($mov->venta->monto_pagado ?? 0),
                    'monto_pendiente' => (float) ($mov->venta->monto_pendiente ?? 0),
                    'tipo_pago_id' => (int) ($mov->venta->tipo_pago_id ?? 0),  // ✅ NUEVO (2026-05-04): Tipo de pago de la venta
                    'estado_documento' => $mov->venta->estadoDocumento ? [
                        'id' => $mov->venta->estadoDocumento->id,
                        'codigo' => $mov->venta->estadoDocumento->codigo,
                        'nombre' => $mov->venta->estadoDocumento->nombre,
                    ] : null,
                    'cliente' => $mov->venta->cliente ? [
                        'id' => $mov->venta->cliente->id,
                        'nombre' => $mov->venta->cliente->nombre,
                    ] : null,
                    'detallesPagoVenta' => $mov->venta->detallesPagoVenta ? $mov->venta->detallesPagoVenta->map(fn($detalle) => [
                        'id' => $detalle->id,
                        'monto' => (float) $detalle->monto,
                        'tipo_pago_id' => $detalle->tipo_pago_id,
                        'tipoPago' => $detalle->tipoPago ? [
                            'id' => $detalle->tipoPago->id,
                            'nombre' => $detalle->tipoPago->nombre,
                        ] : null,
                    ])->toArray() : [],
                ] : null,
            ])->toArray();

            // ✅ Obtener tipos de operación disponibles para filtros
            $tiposOperacionDisponibles = \App\Models\TipoOperacionCaja::obtenerTiposClasificados();
            $tiposOperacionFlat = collect($tiposOperacionDisponibles)->flatten(1)->values()->all();

            // ✅ NUEVO: Obtener tipos de pago disponibles
            $tiposPago = \App\Models\TipoPago::activos()
                ->orderBy('nombre')
                ->get(['id', 'nombre'])
                ->toArray();

            // ✅ NUEVO (2026-05-04): Obtener datos completos de CierreCajaService
            $cierreCajaService = new \App\Services\CierreCajaService();
            $datosCalculados = $cierreCajaService->calcularDatos($cierre->apertura);

            // ✅ Logging para debug
            \Log::info('CierreDiarioGeneralController::show', [
                'cierre_id' => $cierre->id,
                'caja_id' => $cierre->caja_id,
                'movimientos_count' => $movimientos->count(),
                'totales_count' => $totalesPorTipo->count(),
            ]);

            return Inertia::render('Cajas/ReportesDiariosDetalle', [
                'cierre' => [
                    'id' => $cierre->id,
                    'usuario_id' => $cierre->user_id,
                    'usuario' => [
                        'id' => $cierre->usuario->id,
                        'name' => $cierre->usuario->name,
                    ],
                    'caja' => [
                        'id' => $cierre->caja->id,
                        'nombre' => $cierre->caja->nombre,
                    ],
                    'fecha_apertura' => $cierre->apertura->fecha->toIso8601String(),
                    'fecha_cierre' => $cierre->fecha->toIso8601String(),
                    'monto_apertura' => (float) $cierre->apertura->monto_apertura,
                    'monto_esperado' => (float) $cierre->monto_esperado,
                    'monto_real' => (float) $cierre->monto_real,
                    'diferencia' => (float) $cierre->diferencia,
                ],
                'movimientos' => $movimientosFormateados,
                'totales_por_tipo' => $totalesPorTipo->toArray(),
                'tipos_operacion' => $tiposOperacionFlat,
                'tipos_pago' => $tiposPago,  // ✅ NUEVO: Enviar tipos de pago al frontend
                // ✅ NUEVO (2026-05-04): Datos completos del resumen de caja
                'datosResumen' => [
                    'totalVentas' => (float) ($datosCalculados['totalVentas'] ?? 0),
                    'ventasAnuladas' => (float) ($datosCalculados['sumatorialAnulaciones'] ?? 0),
                    'pagosCredito' => (float) ($datosCalculados['detalleEfectivo']['pagos_credito'] ?? 0),
                    'totalIngresos' => (float) ($datosCalculados['totalIngresos'] ?? 0),
                    'totalEgresos' => (float) ($datosCalculados['totalEgresos'] ?? 0),
                    'sumatorialGastos' => (float) ($datosCalculados['sumatorialGastos'] ?? 0),
                    'sumatorialPagosSueldo' => (float) ($datosCalculados['sumatorialPagosSueldo'] ?? 0),
                    'sumatorialAnticipos' => (float) ($datosCalculados['sumatorialAnticipos'] ?? 0),
                    'sumatorialCompras' => (float) ($datosCalculados['sumatorialCompras'] ?? 0),
                    'sumatorialServicio' => (float) ($datosCalculados['sumatorialServicio'] ?? 0),
                    'sumatorialDevoluciones' => (float) ($datosCalculados['sumatorialDevoluciones'] ?? 0),
                    'detallesPagosVentaPorTipo' => $datosCalculados['detallesPagosVentaPorTipo'] ?? [],
                ],
            ]);
        } catch (\Throwable $e) {
            \Log::error('Error en show() de CierreDiarioGeneralController', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Descargar PDF del resumen diario
     * GET /cajas/admin/reportes-diarios/{id}/descargar?formato=A4|TICKET_58|TICKET_80
     */
    public function descargar($id, Request $request)
    {
        $formato = $request->query('formato', 'A4');
        $accion = $request->query('accion', 'download');
        $fuente = $request->query('fuente', 'consolas');

        // ✅ Obtener cierre directamente de cierres_caja
        $cierre = \App\Models\CierreCaja::with(['usuario', 'caja', 'apertura'])->findOrFail($id);

        // ✅ Preparar datos para el servicio - pasar el objeto completo
        $datos = [
            'cierre' => $cierre,
        ];

        // Usar ImpresionService para generar el PDF
        $impresionService = app(\App\Services\ImpresionService::class);
        $pdf = $impresionService->generarPDF('cierre_diario_general', $datos, $formato, ['fuente' => $fuente]);

        $nombreArchivo = 'cierre-diario-' . $cierre->fecha->format('Y-m-d-His') . '.pdf';

        if ($accion === 'stream') {
            return $pdf->stream($nombreArchivo);
        }

        return $pdf->download($nombreArchivo);
    }

    /**
     * Descargar PDF con filtros aplicados
     * GET /cajas/admin/reportes-diarios/{id}/descargar-filtrado
     *
     * Parámetros de query:
     * - tipos: Array de códigos de tipo de operación (ej: VENTA,PAGO)
     * - busqueda: Texto para buscar en numero_documento
     * - monto_min: Monto mínimo
     * - monto_max: Monto máximo
     * - formato: A4|TICKET_58|TICKET_80
     */
    public function descargarFiltrado($id, Request $request)
    {
        try {
            $formato = $request->query('formato', 'A4');
            $accion = $request->query('accion', 'download');
            $fuente = $request->query('fuente', 'consolas');

            // Obtener cierre
            $cierre = \App\Models\CierreCaja::with(['usuario', 'caja', 'apertura'])->findOrFail($id);

            // Obtener movimientos (igual que en show())
            // ✅ Ordenamiento: por ID ascendente (menor a mayor)
            $movimientos = \App\Models\MovimientoCaja::where('caja_id', $cierre->caja_id)
                ->where('user_id', $cierre->user_id)
                ->where('fecha', '>=', $cierre->apertura->fecha)
                ->where('fecha', '<=', $cierre->fecha)
                ->with(['tipoOperacion', 'tipoPago', 'usuario'])
                ->orderBy('id', 'asc')
                ->get();

            // ✅ Aplicar filtros
            $tipos = $request->query('tipos');
            $tiposPago = $request->query('tipos_pago');  // ✅ NUEVO: Filtro de tipos de pago
            $busqueda = $request->query('busqueda');
            $montoMin = $request->query('monto_min');
            $montoMax = $request->query('monto_max');

            // Filtro por tipos de operación
            if ($tipos) {
                $tiposArray = is_array($tipos) ? $tipos : explode(',', $tipos);
                $movimientos = $movimientos->filter(function ($mov) use ($tiposArray) {
                    return in_array($mov->tipoOperacion?->codigo, $tiposArray);
                });
            }

            // ✅ NUEVO: Filtro por tipos de pago
            if ($tiposPago) {
                $tiposPagoArray = is_array($tiposPago) ? $tiposPago : explode(',', $tiposPago);
                $tiposPagoIds = array_map('intval', $tiposPagoArray);
                $movimientos = $movimientos->filter(function ($mov) use ($tiposPagoIds) {
                    return $mov->tipo_pago_id && in_array($mov->tipo_pago_id, $tiposPagoIds);
                });
            }

            // Filtro por búsqueda de documento
            if ($busqueda) {
                $searchLower = strtolower($busqueda);
                $movimientos = $movimientos->filter(function ($mov) use ($searchLower) {
                    return strpos(strtolower($mov->numero_documento ?? ''), $searchLower) !== false;
                });
            }

            // Filtro por rango de montos
            if ($montoMin !== null) {
                $movimientos = $movimientos->filter(function ($mov) use ($montoMin) {
                    return abs($mov->monto) >= floatval($montoMin);
                });
            }
            if ($montoMax !== null) {
                $movimientos = $movimientos->filter(function ($mov) use ($montoMax) {
                    return abs($mov->monto) <= floatval($montoMax);
                });
            }

            // ✅ Calcular totales filtrados
            $totalIngresos = $movimientos->filter(fn($m) => $m->monto > 0)->sum('monto');
            $totalEgresos = $movimientos->filter(fn($m) => $m->monto < 0)->sum('monto');
            $totalNeto = $totalIngresos + $totalEgresos;

            // Preparar datos para el PDF
            $movimientosFormateados = $movimientos->map(fn($mov) => [
                'id' => $mov->id,
                'fecha' => $mov->fecha->format('d/m/Y H:i:s'),
                'usuario' => $mov->usuario?->name ?? 'N/A',
                'tipo_operacion' => $mov->tipoOperacion?->nombre ?? 'Otro',
                'numero_documento' => $mov->numero_documento ?? 'N/A',
                'monto' => (float) $mov->monto,
            ])->toArray();

            $datos = [
                'cierre' => $cierre,
                'movimientos' => $movimientosFormateados,
                'movimientos_count' => count($movimientosFormateados),
                'total_ingresos' => (float) $totalIngresos,
                'total_egresos' => (float) $totalEgresos,
                'total_neto' => (float) $totalNeto,
                'filtros_aplicados' => [
                    'tipos' => $tipos ? (is_array($tipos) ? $tipos : explode(',', $tipos)) : [],
                    'tipos_pago' => $tiposPago ? (is_array($tiposPago) ? $tiposPago : explode(',', $tiposPago)) : [],  // ✅ NUEVO
                    'busqueda' => $busqueda,
                    'monto_min' => $montoMin,
                    'monto_max' => $montoMax,
                ],
            ];

            // Usar ImpresionService para generar el PDF
            $impresionService = app(\App\Services\ImpresionService::class);
            $pdf = $impresionService->generarPDF('cierre_diario_filtrado', $datos, $formato, ['fuente' => $fuente]);

            $nombreArchivo = 'cierre-diario-filtrado-' . $cierre->fecha->format('Y-m-d-His') . '.pdf';

            if ($accion === 'stream') {
                return $pdf->stream($nombreArchivo);
            }

            return $pdf->download($nombreArchivo);
        } catch (\Throwable $e) {
            \Log::error('Error en descargarFiltrado() de CierreDiarioGeneralController', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

}
