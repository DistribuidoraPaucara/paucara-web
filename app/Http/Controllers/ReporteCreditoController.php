<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\CuentaPorCobrar;
use App\Http\Traits\ApiInertiaUnifiedResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;
use Inertia\Inertia;

class ReporteCreditoController extends Controller
{
    use ApiInertiaUnifiedResponse;

    /**
     * ✅ CRÉDITO: Mostrar reporte de crédito de clientes
     * Incluye: clientes con crédito vencido, cercanos al límite, etc.
     */
    public function index(Request $request): Response
    {
        // Autorizar acceso al reporte
        $this->authorize('viewAny', Cliente::class);

        // Obtener parámetros de filtro
        $estado = $request->input('estado'); // 'normal', 'critico', 'vencido', 'excedido'
        $buscar = $request->input('q');
        $ordenar = $request->input('order_by', 'saldo_utilizado');
        $direccion = $request->input('order_dir', 'desc');

        // Obtener clientes con crédito y sus detalles
        $clientes = Cliente::where('activo', true)
            ->where('puede_tener_credito', true)
            ->with(['cuentasPorCobrar' => function ($q) {
                $q->where('estado', 'pendiente');
            }])
            ->when($buscar, function ($query) use ($buscar) {
                $query->where(function ($q) use ($buscar) {
                    $q->whereRaw('LOWER(nombre) like ?', ["%{$buscar}%"])
                        ->orWhereRaw('LOWER(razon_social) like ?', ["%{$buscar}%"])
                        ->orWhereRaw('LOWER(nit) like ?', ["%{$buscar}%"])
                        ->orWhereRaw('LOWER(codigo_cliente) like ?', ["%{$buscar}%"]);
                });
            })
            ->get()
            ->map(function ($cliente) {
                $saldoUtilizado = $cliente->cuentasPorCobrar->sum('saldo_pendiente');
                $saldoDisponible = $cliente->calcularSaldoDisponible();
                $porcentajeUtilizacion = $cliente->limite_credito > 0
                    ? ($saldoUtilizado / $cliente->limite_credito) * 100
                    : 0;

                // Determinar estado del cliente
                $estadoCliente = 'normal';
                if ($porcentajeUtilizacion > 100) {
                    $estadoCliente = 'excedido';
                } elseif ($porcentajeUtilizacion > 80) {
                    $estadoCliente = 'critico';
                }

                // Obtener cuentas vencidas
                $cuentasVencidas = $cliente->cuentasPorCobrar
                    ->where('fecha_vencimiento', '<', now())
                    ->values();

                if ($cuentasVencidas->count() > 0) {
                    $estadoCliente = 'vencido';
                }

                return [
                    'id' => $cliente->id,
                    'codigo_cliente' => $cliente->codigo_cliente,
                    'nombre' => $cliente->nombre,
                    'razon_social' => $cliente->razon_social,
                    'nit' => $cliente->nit,
                    'limite_credito' => $cliente->limite_credito,
                    'saldo_utilizado' => $saldoUtilizado,
                    'saldo_disponible' => $saldoDisponible,
                    'porcentaje_utilizacion' => round($porcentajeUtilizacion, 1),
                    'estado' => $estadoCliente,
                    'cantidad_cuentas_pendientes' => $cliente->cuentasPorCobrar->count(),
                    'cantidad_cuentas_vencidas' => $cuentasVencidas->count(),
                    'monto_vencido' => $cuentasVencidas->sum('saldo_pendiente'),
                    'dias_maximo_vencido' => $cuentasVencidas->count() > 0
                        ? max($cuentasVencidas->map(fn($c) => now()->diffInDays($c->fecha_vencimiento))->toArray())
                        : 0,
                ];
            })
            // Filtrar por estado si se especifica
            ->when($estado && $estado !== 'todos', function ($collection) use ($estado) {
                return $collection->filter(fn($c) => $c['estado'] === $estado);
            })
            // Ordenar
            ->when(true, function ($collection) use ($ordenar, $direccion) {
                if ($ordenar === 'saldo_utilizado') {
                    return $collection->sort(fn($a, $b) =>
                        $direccion === 'desc'
                            ? $b['saldo_utilizado'] <=> $a['saldo_utilizado']
                            : $a['saldo_utilizado'] <=> $b['saldo_utilizado']
                    );
                } elseif ($ordenar === 'nombre') {
                    return $collection->sort(fn($a, $b) =>
                        $direccion === 'desc'
                            ? $b['nombre'] <=> $a['nombre']
                            : $a['nombre'] <=> $b['nombre']
                    );
                } elseif ($ordenar === 'porcentaje') {
                    return $collection->sort(fn($a, $b) =>
                        $direccion === 'desc'
                            ? $b['porcentaje_utilizacion'] <=> $a['porcentaje_utilizacion']
                            : $a['porcentaje_utilizacion'] <=> $b['porcentaje_utilizacion']
                    );
                }
                return $collection;
            })
            ->values();

        // Paginar manualmente
        $per_page = $request->integer('per_page', 25);
        $page = $request->integer('page', 1);
        $total = $clientes->count();
        $paginatedData = $clientes->slice(($page - 1) * $per_page, $per_page)->values();

        // Calcular estadísticas generales del reporte
        $estadisticas = [
            'total_clientes' => $clientes->count(),
            'total_credito' => $clientes->sum('limite_credito'),
            'total_utilizado' => $clientes->sum('saldo_utilizado'),
            'total_disponible' => $clientes->sum('saldo_disponible'),
            'clientes_vencidos' => $clientes->where('estado', 'vencido')->count(),
            'clientes_criticos' => $clientes->where('estado', 'critico')->count(),
            'clientes_excedidos' => $clientes->where('estado', 'excedido')->count(),
            'monto_total_vencido' => $clientes->sum('monto_vencido'),
        ];

        return Inertia::render('reportes/credito', [
            'clientes' => [
                'data' => $paginatedData,
                'current_page' => $page,
                'per_page' => $per_page,
                'total' => $total,
                'last_page' => ceil($total / $per_page),
            ],
            'estadisticas' => $estadisticas,
            'filtros' => [
                'estado' => $estado,
                'buscar' => $buscar,
                'orden_by' => $ordenar,
                'orden_dir' => $direccion,
            ],
        ]);
    }

    /**
     * ✅ CRÉDITO: API: Obtener datos para gráficos de crédito
     */
    public function obtenerGraficosCreditoApi(): JsonResponse
    {
        // Autorizar acceso
        $this->authorize('viewAny', Cliente::class);

        // Top 10 clientes por crédito utilizado
        $top10 = Cliente::where('activo', true)
            ->where('puede_tener_credito', true)
            ->with(['cuentasPorCobrar' => function ($q) {
                $q->where('estado', 'pendiente');
            }])
            ->get()
            ->map(function ($cliente) {
                $saldoUtilizado = $cliente->cuentasPorCobrar->sum('saldo_pendiente');
                return [
                    'nombre' => $cliente->nombre,
                    'utilizado' => $saldoUtilizado,
                    'disponible' => $cliente->calcularSaldoDisponible(),
                    'limite' => $cliente->limite_credito,
                ];
            })
            ->sortByDesc('utilizado')
            ->take(10)
            ->values();

        // Contar estados
        $estados = [
            'normal' => 0,
            'critico' => 0,
            'vencido' => 0,
            'excedido' => 0,
        ];

        foreach (Cliente::where('activo', true)->where('puede_tener_credito', true)->get() as $cliente) {
            $saldoUtilizado = $cliente->cuentasPorCobrar()
                ->where('estado', 'pendiente')
                ->sum('saldo_pendiente');

            $porcentaje = $cliente->limite_credito > 0 ? ($saldoUtilizado / $cliente->limite_credito) * 100 : 0;

            $cuentasVencidas = $cliente->cuentasPorCobrar()
                ->where('estado', 'pendiente')
                ->where('fecha_vencimiento', '<', now())
                ->exists();

            if ($cuentasVencidas) {
                $estados['vencido']++;
            } elseif ($porcentaje > 100) {
                $estados['excedido']++;
            } elseif ($porcentaje > 80) {
                $estados['critico']++;
            } else {
                $estados['normal']++;
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'top_clientes' => $top10,
                'labels' => $top10->pluck('nombre')->toArray(),
                'utilizado' => $top10->pluck('utilizado')->toArray(),
                'disponible' => $top10->pluck('disponible')->toArray(),
                'estados' => $estados,
                'estados_labels' => ['Normal', 'Crítico', 'Vencido', 'Excedido'],
                'estados_data' => [
                    $estados['normal'],
                    $estados['critico'],
                    $estados['vencido'],
                    $estados['excedido'],
                ],
            ],
        ]);
    }

    /**
     * ✅ CRÉDITO: API: Obtener clientes con crédito vencido
     */
    public function obtenerClientesVencidosApi(): JsonResponse
    {
        // Autorizar acceso
        $this->authorize('viewAny', Cliente::class);

        $clientesVencidos = CuentaPorCobrar::where('estado', 'pendiente')
            ->where('fecha_vencimiento', '<', now())
            ->with(['cliente', 'venta'])
            ->get()
            ->groupBy('cliente_id')
            ->map(function ($cuentas) {
                $cliente = $cuentas->first()->cliente;
                $montoVencido = $cuentas->sum('saldo_pendiente');
                $diasMaximo = $cuentas->max(fn($c) => now()->diffInDays($c->fecha_vencimiento));

                return [
                    'cliente_id' => $cliente->id,
                    'nombre' => $cliente->nombre,
                    'codigo' => $cliente->codigo_cliente,
                    'monto_vencido' => $montoVencido,
                    'cantidad_cuentas' => $cuentas->count(),
                    'dias_maximo_vencido' => $diasMaximo,
                    'fecha_vencimiento_proxima' => $cuentas->min('fecha_vencimiento')->format('Y-m-d'),
                ];
            })
            ->sortByDesc('monto_vencido')
            ->values();

        return response()->json([
            'success' => true,
            'data' => $clientesVencidos,
            'total' => $clientesVencidos->count(),
            'monto_total_vencido' => $clientesVencidos->sum('monto_vencido'),
        ]);
    }
}
