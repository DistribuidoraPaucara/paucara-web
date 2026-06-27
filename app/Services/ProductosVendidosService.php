<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ProductosVendidosService
{
    /**
     * Obtener reporte de productos vendidos por preventista
     *
     * ✅ FLUJO: Solo considera ventas APROBADAS que tengan preventista_id asignado
     * - Las proformas son solo "propuestas" (pueden anularse y generar nuevas ventas)
     * - Las ventas aprobadas con preventista_id son la realidad física
     * - El preventista se asigna MANUALMENTE cuando se crea/recrea la venta
     *
     * @param array $filtros {
     *     'fecha_desde': Carbon|string (default: hace 30 días),
     *     'fecha_hasta': Carbon|string (default: hoy),
     *     'preventista_id': int (opcional),
     *     'cliente_id': int (opcional)
     * }
     * @return array Con estructura: ['productos' => [...], 'ventas' => [...], 'totales' => [...]]
     */
    public static function obtenerProductosVendidos(array $filtros): array
    {
        try {
            $fechaDesde = $filtros['fecha_desde'] ?? now()->subMonth();
            $fechaHasta = $filtros['fecha_hasta'] ?? now();
            $preventistaId = $filtros['preventista_id'] ?? null;
            $clienteId = $filtros['cliente_id'] ?? null;

            // Obtener el ID del estado APROBADO
            $estadoAprobadoId = DB::table('estados_documento')
                ->where('codigo', 'APROBADO')
                ->value('id');

            if (!$estadoAprobadoId) {
                return [
                    'success' => false,
                    'error' => 'Estado APROBADO no encontrado',
                    'productos' => [],
                    'ventas' => [],
                    'totales' => [],
                ];
            }

            // ✅ QUERY 1: Productos DIRECTOS en ventas APROBADAS
            $productosDirectos = DB::table('ventas')
                ->join('detalle_ventas', 'ventas.id', '=', 'detalle_ventas.venta_id')
                ->join('productos', 'detalle_ventas.producto_id', '=', 'productos.id')
                ->select(
                    'productos.id',
                    'productos.nombre as producto_nombre',
                    'productos.sku as producto_codigo',
                    DB::raw('SUM(CAST(detalle_ventas.cantidad AS DECIMAL(15,2))) as cantidad_total'),
                    DB::raw('AVG(CAST(detalle_ventas.precio_unitario AS DECIMAL(15,2))) as precio_promedio'),
                    DB::raw('SUM(CAST(detalle_ventas.subtotal AS DECIMAL(15,2))) as total_venta'),
                    'ventas.preventista_id'
                )
                ->where('ventas.estado_documento_id', $estadoAprobadoId)
                ->whereNotNull('ventas.preventista_id')
                ->whereDate('ventas.created_at', '>=', $fechaDesde)
                ->whereDate('ventas.created_at', '<=', $fechaHasta);

            if ($preventistaId) {
                $productosDirectos->where('ventas.preventista_id', $preventistaId);
            }

            if ($clienteId) {
                $productosDirectos->where('ventas.cliente_id', $clienteId);
            }

            $productosDirectos = $productosDirectos
                ->groupBy('productos.id', 'productos.nombre', 'productos.sku', 'ventas.preventista_id')
                ->get();

            // ✅ QUERY 2: Productos DENTRO DE COMBOS en ventas APROBADAS
            // Cuando se vende un combo, los productos dentro también se cuentan
            // cantidad_producto = cantidad_combo * cantidad_en_combo_items
            $productosEnCombos = DB::table('ventas')
                ->join('detalle_ventas', 'ventas.id', '=', 'detalle_ventas.venta_id')
                ->join('combo_items', 'detalle_ventas.producto_id', '=', 'combo_items.combo_id')
                ->join('productos', 'combo_items.producto_id', '=', 'productos.id')
                ->select(
                    'productos.id',
                    'productos.nombre as producto_nombre',
                    'productos.sku as producto_codigo',
                    DB::raw('SUM(CAST(detalle_ventas.cantidad AS DECIMAL(15,2)) * CAST(combo_items.cantidad AS DECIMAL(15,2))) as cantidad_total'),
                    DB::raw('AVG(CAST(combo_items.precio_unitario AS DECIMAL(15,2))) as precio_promedio'),
                    DB::raw('SUM(CAST(detalle_ventas.cantidad AS DECIMAL(15,2)) * CAST(combo_items.cantidad AS DECIMAL(15,2)) * CAST(combo_items.precio_unitario AS DECIMAL(15,2))) as total_venta'),
                    'ventas.preventista_id'
                )
                ->where('ventas.estado_documento_id', $estadoAprobadoId)
                ->whereNotNull('ventas.preventista_id')
                ->whereDate('ventas.created_at', '>=', $fechaDesde)
                ->whereDate('ventas.created_at', '<=', $fechaHasta);

            if ($preventistaId) {
                $productosEnCombos->where('ventas.preventista_id', $preventistaId);
            }

            if ($clienteId) {
                $productosEnCombos->where('ventas.cliente_id', $clienteId);
            }

            $productosEnCombos = $productosEnCombos
                ->groupBy('productos.id', 'productos.nombre', 'productos.sku', 'ventas.preventista_id')
                ->get();

            // ✅ COMBINAR: Productos directos + productos en combos
            $productosCombinados = collect();

            foreach ($productosDirectos as $item) {
                $productosCombinados->push([
                    'id' => $item->id,
                    'nombre' => $item->producto_nombre,
                    'codigo' => $item->producto_codigo,
                    'cantidad_total' => (float) $item->cantidad_total,
                    'precio_promedio' => (float) $item->precio_promedio,
                    'total_venta' => (float) $item->total_venta,
                    'preventista_id' => $item->preventista_id,
                ]);
            }

            foreach ($productosEnCombos as $item) {
                $existe = $productosCombinados->firstWhere('id', $item->id);
                if ($existe) {
                    // Si el producto ya existe (fue vendido directo), sumar cantidades
                    $existe['cantidad_total'] += (float) $item->cantidad_total;
                    $existe['total_venta'] += (float) $item->total_venta;
                    // Recalcular precio promedio ponderado
                    $cantidadTotal = $existe['cantidad_total'];
                    $existe['precio_promedio'] = $cantidadTotal > 0 ? $existe['total_venta'] / $cantidadTotal : 0;
                } else {
                    // Si no existe, agregarlo
                    $productosCombinados->push([
                        'id' => $item->id,
                        'nombre' => $item->producto_nombre,
                        'codigo' => $item->producto_codigo,
                        'cantidad_total' => (float) $item->cantidad_total,
                        'precio_promedio' => (float) $item->precio_promedio,
                        'total_venta' => (float) $item->total_venta,
                        'preventista_id' => $item->preventista_id,
                    ]);
                }
            }

            $productos = $productosCombinados->sortBy('nombre')->values();

            // Calcular totales consolidados
            $totales = [
                'cantidad_productos' => $productos->count(),
                'cantidad_total_vendida' => (float) $productos->sum('cantidad_total'),
                'total_venta_general' => (float) $productos->sum('total_venta'),
                'precio_promedio_general' => $productos->count() > 0
                    ? (float) ($productos->sum('total_venta') / $productos->sum('cantidad_total'))
                    : 0,
            ];

            // ✅ QUERY DE VENTAS: Detalles de cada venta aprobada con preventista_id
            $ventasQuery = DB::table('ventas')
                ->select(
                    'ventas.id as venta_id',
                    'ventas.numero as numero_venta',
                    'proformas.numero as numero_proforma',
                    'clientes.nombre as cliente_nombre',
                    'users.name as usuario_nombre',
                    'ventas.total',
                    'ventas.created_at as fecha_venta',
                    'estados_documento.codigo as estado_codigo',
                    DB::raw("COALESCE(estados_logistica.codigo, 'SIN_ENTREGA') as estado_entrega"),
                    'ventas.preventista_id'
                )
                ->join('clientes', 'ventas.cliente_id', '=', 'clientes.id')
                ->join('users', 'ventas.usuario_id', '=', 'users.id')
                ->join('estados_documento', 'ventas.estado_documento_id', '=', 'estados_documento.id')
                ->leftJoin('proformas', 'ventas.proforma_id', '=', 'proformas.id')
                ->leftJoin('entregas', 'ventas.entrega_id', '=', 'entregas.id')
                ->leftJoin('estados_logistica', 'entregas.estado_entrega_id', '=', 'estados_logistica.id')
                ->where('ventas.estado_documento_id', $estadoAprobadoId)
                ->whereNotNull('ventas.preventista_id')
                ->whereDate('ventas.created_at', '>=', $fechaDesde)
                ->whereDate('ventas.created_at', '<=', $fechaHasta);

            // Filtro por preventista_id
            if ($preventistaId) {
                $ventasQuery->where('ventas.preventista_id', $preventistaId);
            }

            // Filtro por cliente
            if ($clienteId) {
                $ventasQuery->where('ventas.cliente_id', $clienteId);
            }

            $ventas = $ventasQuery
                ->orderByDesc('ventas.id')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->venta_id,
                        'numero' => $item->numero_venta,
                        'proforma_numero' => $item->numero_proforma ?? 'SIN PROFORMA',
                        'cliente' => $item->cliente_nombre,
                        'usuario' => $item->usuario_nombre,
                        'total' => (float) $item->total,
                        'fecha' => $item->fecha_venta,
                        'estado' => $item->estado_codigo,
                        'estado_entrega' => $item->estado_entrega,
                        'preventista_id' => $item->preventista_id,
                    ];
                });

            return [
                'success' => true,
                'productos' => $productos->toArray(),
                'ventas' => $ventas->toArray(),
                'totales' => $totales,
                'fecha_desde' => $fechaDesde->format('Y-m-d'),
                'fecha_hasta' => $fechaHasta->format('Y-m-d'),
                'filtros' => [
                    'preventista_id' => $preventistaId,
                    'cliente_id' => $clienteId,
                ],
            ];

        } catch (\Exception $e) {
            \Log::error('Error en ProductosVendidosService::obtenerProductosVendidos', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'filtros' => $filtros,
            ]);

            return [
                'success' => false,
                'error' => 'Error al generar reporte: ' . $e->getMessage(),
                'productos' => [],
                'ventas' => [],
                'totales' => [],
            ];
        }
    }
}
