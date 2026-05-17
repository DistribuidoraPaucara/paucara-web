<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EstadoDocumento;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApiReporteVentasController extends Controller
{
    /**
     * Obtener reporte de productos vendidos en JSON
     * GET /api/reportes/productos-vendidos
     *
     * Query Parameters:
     * - fecha_desde: YYYY-MM-DD (default: hace 30 días)
     * - fecha_hasta: YYYY-MM-DD (default: hoy)
     * - usuario_creador_id: ID del preventista (opcional, usa el usuario actual si es preventista)
     * - cliente_id: ID del cliente (opcional)
     */
    public function productosVendidos(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();

            // Validar fechas
            $fechaDesde = $request->filled('fecha_desde') ? $request->date('fecha_desde') : now()->subMonth();
            $fechaHasta = $request->filled('fecha_hasta') ? $request->date('fecha_hasta') : now();

            // Obtener el ID del estado APROBADO
            $estadoAprobadoId = EstadoDocumento::where('codigo', 'APROBADO')
                ->value('id');

            if (!$estadoAprobadoId) {
                return response()->json([
                    'success' => false,
                    'error' => 'Estado APROBADO no encontrado',
                ], 400);
            }

            // Construir query para obtener productos vendidos
            $query = DB::table('proformas')
                ->join('ventas', 'ventas.proforma_id', '=', 'proformas.id')
                ->join('detalle_proformas', 'proformas.id', '=', 'detalle_proformas.proforma_id')
                ->join('productos', 'detalle_proformas.producto_id', '=', 'productos.id')
                ->select(
                    'productos.id',
                    'productos.nombre as producto_nombre',
                    'productos.sku as producto_codigo',
                    DB::raw('SUM(CAST(detalle_proformas.cantidad AS DECIMAL(15,2))) as cantidad_total'),
                    DB::raw('AVG(CAST(detalle_proformas.precio_unitario AS DECIMAL(15,2))) as precio_promedio'),
                    DB::raw('SUM(CAST(detalle_proformas.subtotal AS DECIMAL(15,2))) as total_venta'),
                    'proformas.usuario_creador_id'
                )
                ->where('ventas.estado_documento_id', $estadoAprobadoId)
                ->whereDate('ventas.created_at', '>=', $fechaDesde)
                ->whereDate('ventas.created_at', '<=', $fechaHasta)
                ->whereNotNull('ventas.proforma_id');

            // Filtro por usuario creador
            if ($request->filled('usuario_creador_id')) {
                $query->where('proformas.usuario_creador_id', $request->usuario_creador_id);
            } elseif ($user->hasRole('Preventista')) {
                // Si el usuario es preventista, mostrar solo sus productos vendidos
                $query->where('proformas.usuario_creador_id', $user->id);
            }

            // Filtro por cliente
            if ($request->filled('cliente_id')) {
                $query->where('proformas.cliente_id', $request->cliente_id);
            }

            $productos = $query->groupBy('productos.id', 'productos.nombre', 'productos.sku', 'proformas.usuario_creador_id')
                ->orderBy('productos.nombre', 'asc')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'nombre' => $item->producto_nombre,
                        'codigo' => $item->producto_codigo,
                        'cantidad_total' => (float) $item->cantidad_total,
                        'precio_promedio' => (float) $item->precio_promedio,
                        'total_venta' => (float) $item->total_venta,
                        'usuario_creador_id' => $item->usuario_creador_id,
                    ];
                });

            // Calcular totales
            $totales = [
                'cantidad_productos' => $productos->count(),
                'cantidad_total_vendida' => (float) $productos->sum('cantidad_total'),
                'total_venta_general' => (float) $productos->sum('total_venta'),
                'precio_promedio_general' => $productos->count() > 0
                    ? (float) ($productos->sum('total_venta') / $productos->sum('cantidad_total'))
                    : 0,
            ];

            // Obtener las ventas aprobadas que se usaron en el reporte
            $ventasQuery = DB::table('ventas')
                ->join('proformas', 'ventas.proforma_id', '=', 'proformas.id')
                ->join('clientes', 'proformas.cliente_id', '=', 'clientes.id')
                ->join('users', 'proformas.usuario_creador_id', '=', 'users.id')
                ->join('estados_documento', 'ventas.estado_documento_id', '=', 'estados_documento.id')
                ->leftJoin('entregas', 'ventas.entrega_id', '=', 'entregas.id')
                ->leftJoin('estados_logistica', 'entregas.estado_entrega_id', '=', 'estados_logistica.id')
                ->select(
                    'ventas.id as venta_id',
                    'ventas.numero as numero_venta',
                    'proformas.numero as numero_proforma',
                    'clientes.nombre as cliente_nombre',
                    'users.name as usuario_nombre',
                    'ventas.total',
                    'ventas.created_at as fecha_venta',
                    'estados_documento.codigo as estado_codigo',
                    'estados_logistica.codigo as estado_entrega'
                )
                ->where('ventas.estado_documento_id', $estadoAprobadoId)
                ->whereDate('ventas.created_at', '>=', $fechaDesde)
                ->whereDate('ventas.created_at', '<=', $fechaHasta)
                ->whereNotNull('ventas.proforma_id');

            // Aplicar los mismos filtros a las ventas
            if ($request->filled('usuario_creador_id')) {
                $ventasQuery->where('proformas.usuario_creador_id', $request->usuario_creador_id);
            } elseif ($user->hasRole('Preventista')) {
                $ventasQuery->where('proformas.usuario_creador_id', $user->id);
            }

            if ($request->filled('cliente_id')) {
                $ventasQuery->where('proformas.cliente_id', $request->cliente_id);
            }

            $ventas = $ventasQuery->orderByDesc('ventas.id')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->venta_id,
                        'numero' => $item->numero_venta,
                        'proforma_numero' => $item->numero_proforma,
                        'cliente' => $item->cliente_nombre,
                        'usuario' => $item->usuario_nombre,
                        'total' => (float) $item->total,
                        'fecha' => $item->fecha_venta,
                        'estado' => $item->estado_codigo,
                        'estado_entrega' => $item->estado_entrega,
                    ];
                });

            return response()->json([
                'success' => true,
                'productos' => $productos,
                'ventas' => $ventas,
                'totales' => $totales,
                'fecha_desde' => $fechaDesde->format('Y-m-d'),
                'fecha_hasta' => $fechaHasta->format('Y-m-d'),
                'es_preventista' => $user->hasRole('Preventista'),
            ]);

        } catch (\Exception $e) {
            \Log::error('Error en ApiReporteVentasController::productosVendidos', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'error' => 'Error al generar reporte: ' . $e->getMessage(),
            ], 500);
        }
    }
}
