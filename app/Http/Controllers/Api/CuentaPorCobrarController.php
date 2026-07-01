<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CuentaPorCobrar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CuentaPorCobrarController extends Controller
{
    /**
     * Obtener detalle de una Cuenta por Cobrar con sus pagos
     *
     * GET /api/cuentas-por-cobrar/{id}
     *
     * @param CuentaPorCobrar $cuentaPorCobrar
     * @return \Illuminate\Http\JsonResponse
     */
    public function showApi(CuentaPorCobrar $cuentaPorCobrar)
    {
        try {
            $cuentaPorCobrar->load(['cliente', 'venta', 'pagos']);

            return response()->json([
                'success' => true,
                'message' => 'Cuenta por cobrar obtenida correctamente',
                'data' => [
                    'id' => $cuentaPorCobrar->id,
                    'venta_id' => $cuentaPorCobrar->venta_id,
                    'cliente_id' => $cuentaPorCobrar->cliente_id,
                    'monto_original' => (float)$cuentaPorCobrar->monto_original,
                    'monto_pagado' => (float)($cuentaPorCobrar->monto_original - $cuentaPorCobrar->saldo_pendiente),
                    'saldo_pendiente' => (float)$cuentaPorCobrar->saldo_pendiente,
                    'fecha_vencimiento' => $cuentaPorCobrar->fecha_vencimiento?->toDateString(),
                    'dias_vencido' => $cuentaPorCobrar->dias_vencido,
                    'estado' => $cuentaPorCobrar->estado,
                    'referencia_documento' => $cuentaPorCobrar->referencia_documento,
                    'observaciones' => $cuentaPorCobrar->observaciones,
                    'cliente' => $cuentaPorCobrar->cliente ? [
                        'id' => $cuentaPorCobrar->cliente->id,
                        'nombre' => $cuentaPorCobrar->cliente->nombre,
                        'nit' => $cuentaPorCobrar->cliente->nit,
                    ] : null,
                    'venta' => $cuentaPorCobrar->venta ? [
                        'id' => $cuentaPorCobrar->venta->id,
                        'numero' => $cuentaPorCobrar->venta->numero_venta,
                        'fecha' => $cuentaPorCobrar->venta->fecha->toDateString(),
                    ] : null,
                    'pagos' => $cuentaPorCobrar->pagos->map(function ($pago) {
                        return [
                            'id' => $pago->id,
                            'cuenta_por_cobrar_id' => $pago->cuenta_por_cobrar_id,
                            'monto' => (float)$pago->monto,
                            'fecha_pago' => $pago->fecha_pago?->toDateString(),
                            'numero_recibo' => $pago->numero_recibo,
                            'numero_transferencia' => $pago->numero_transferencia,
                            'numero_cheque' => $pago->numero_cheque,
                            'observaciones' => $pago->observaciones,
                            'estado' => $pago->estado,
                            'tipo_pago_id' => $pago->tipo_pago_id,
                            'tipo_pago_nombre' => $pago->tipoPago?->nombre,
                            'usuario_id' => $pago->usuario_id,
                            'usuario_nombre' => $pago->usuario?->name,
                        ];
                    })->toArray(),
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error("Error en showApi de CuentaPorCobrar: {$e->getMessage()}", [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener la cuenta por cobrar',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Listado de Cuentas por Cobrar con filtros y paginación
     *
     * GET /api/cuentas-por-cobrar
     *
     * Query Parameters:
     * - per_page: int (default: 20)
     * - page: int (default: 1)
     * - estado: string (PENDIENTE, PARCIAL, PAGADO)
     * - cliente_id: int
     * - q: string (búsqueda por referencia_documento)
     * - fecha_desde: date (YYYY-MM-DD)
     * - fecha_hasta: date (YYYY-MM-DD)
     * - solo_vencidas: boolean (true para solo vencidas)
     * - sort_by: string (id, cliente_id, fecha_vencimiento, saldo_pendiente)
     * - sort_order: string (asc, desc)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function indexApi(Request $request)
    {
        try {
            $perPage = $request->query('per_page', 20);
            $page = $request->query('page', 1);
            $estado = $request->query('estado');
            $clienteId = $request->query('cliente_id');
            $busqueda = $request->query('q');
            $fechaDesde = $request->query('fecha_desde');
            $fechaHasta = $request->query('fecha_hasta');
            $soloVencidas = $request->query('solo_vencidas');
            $sortBy = $request->query('sort_by', 'id');
            $sortOrder = $request->query('sort_order', 'desc');

            // Validar parámetros
            $perPage = min((int)$perPage, 100); // Máximo 100 items por página
            $page = max((int)$page, 1);
            $sortOrder = strtolower($sortOrder) === 'desc' ? 'desc' : 'asc';

            // Construir query
            $query = CuentaPorCobrar::with(['cliente', 'venta', 'pagos'])
                ->where('estado', '!=', 'ANULADO'); // Excluir anuladas

            // Filtro por estado (case-insensitive con PostgreSQL ILIKE)
            // PENDIENTE incluye tanto PENDIENTE como PARCIAL (ambos indican saldo pendiente)
            if ($estado) {
                $estadoUpper = mb_strtoupper($estado, 'UTF-8');
                if ($estadoUpper === 'PENDIENTE') {
                    // PENDIENTE incluye PENDIENTE y PARCIAL
                    $query->where(function ($q) {
                        $q->whereRaw('estado ILIKE ?', ['PENDIENTE'])
                            ->orWhereRaw('estado ILIKE ?', ['PARCIAL']);
                    });
                } else {
                    // Para otros estados: PAGADO, ANULADO
                    $query->whereRaw('estado ILIKE ?', [$estado]);
                }
            }

            // Filtro por cliente
            if ($clienteId) {
                $query->where('cliente_id', $clienteId);
            }

            // Búsqueda por referencia (case-insensitive con PostgreSQL ILIKE)
            if ($busqueda) {
                $query->where(function ($q) use ($busqueda) {
                    $q->whereRaw('referencia_documento ILIKE ?', ["%{$busqueda}%"])
                        ->orWhereHas('cliente', function ($clienteQ) use ($busqueda) {
                            $clienteQ->whereRaw('nombre ILIKE ?', ["%{$busqueda}%"])
                                ->orWhereRaw('nit ILIKE ?', ["%{$busqueda}%"]);
                        });
                });
            }

            // Filtro de fechas de vencimiento
            if ($fechaDesde) {
                try {
                    $query->where('fecha_vencimiento', '>=', \Carbon\Carbon::parse($fechaDesde)->startOfDay());
                } catch (\Exception $e) {
                    Log::warning("Fecha inválida fecha_desde: {$fechaDesde}");
                }
            }

            if ($fechaHasta) {
                try {
                    $query->where('fecha_vencimiento', '<=', \Carbon\Carbon::parse($fechaHasta)->endOfDay());
                } catch (\Exception $e) {
                    Log::warning("Fecha inválida fecha_hasta: {$fechaHasta}");
                }
            }

            // Filtro de solo vencidas
            if ($soloVencidas === 'true' || $soloVencidas === '1') {
                $query->vencidas();
            }

            // Obtener estadísticas antes de paginar
            $totalCuentas = (clone $query)->count();

            $stats = [
                'total' => $totalCuentas,
                'pendientes' => (clone $query)->where('saldo_pendiente', '>', 0)->count(),
                'cuentas_vencidas' => (clone $query)->vencidas()->count(),
                'monto_total_pendiente' => (clone $query)->sum('saldo_pendiente'),
                'monto_total_vencido' => (clone $query)->vencidas()->sum('saldo_pendiente'),
            ];

            // Ordenamiento
            $validSortBy = ['id', 'cliente_id', 'fecha_vencimiento', 'saldo_pendiente', 'monto_original'];
            if (!in_array($sortBy, $validSortBy)) {
                $sortBy = 'fecha_vencimiento';
            }

            $query->orderBy($sortBy, $sortOrder);

            // 🔍 DEBUG: Log the query
            Log::info('CuentaPorCobrar Query', [
                'sql' => $query->toSql(),
                'bindings' => $query->getBindings(),
                'filters' => [
                    'estado' => $estado,
                    'busqueda' => $busqueda,
                    'clienteId' => $clienteId,
                ],
            ]);

            // Paginación
            $cuentas = $query->paginate($perPage, ['*'], 'page', $page);

            // Transformar datos para la app
            $data = $cuentas->map(function ($cuenta) {
                return [
                    'id' => $cuenta->id,
                    'venta_id' => $cuenta->venta_id,
                    'cliente_id' => $cuenta->cliente_id,
                    'monto_original' => (float)$cuenta->monto_original,
                    'monto_pagado' => (float)($cuenta->monto_original - $cuenta->saldo_pendiente),
                    'saldo_pendiente' => (float)$cuenta->saldo_pendiente,
                    'fecha_vencimiento' => $cuenta->fecha_vencimiento?->toDateString(),
                    'dias_vencido' => $cuenta->dias_vencido,
                    'estado' => $cuenta->estado,
                    'referencia_documento' => $cuenta->referencia_documento,
                    'observaciones' => $cuenta->observaciones,
                    'created_at' => $cuenta->created_at?->toDateTimeString(),
                    'cliente' => $cuenta->cliente ? [
                        'id' => $cuenta->cliente->id,
                        'nombre' => $cuenta->cliente->nombre,
                        'nit' => $cuenta->cliente->nit,
                    ] : null,
                    'venta' => $cuenta->venta ? [
                        'id' => $cuenta->venta->id,
                        'numero' => $cuenta->venta->numero_venta,
                        'fecha' => $cuenta->venta->fecha->toDateString(),
                    ] : null,
                    'pagos_count' => $cuenta->pagos_count ?? 0,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Cuentas por cobrar obtenidas correctamente',
                'data' => $data->toArray(),
                'pagination' => [
                    'total' => $cuentas->total(),
                    'per_page' => $cuentas->perPage(),
                    'current_page' => $cuentas->currentPage(),
                    'last_page' => $cuentas->lastPage(),
                    'from' => $cuentas->firstItem(),
                    'to' => $cuentas->lastItem(),
                    'has_more_pages' => $cuentas->hasMorePages(),
                ],
                'estadisticas' => $stats,
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error en indexApi de CuentaPorCobrar: {$e->getMessage()}", [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
                'request' => $request->all(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener cuentas por cobrar',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
