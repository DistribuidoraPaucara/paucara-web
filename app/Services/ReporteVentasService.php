<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReporteVentasService
{
    /**
     * Obtener ventas agrupadas por período (día/semana/mes/año)
     */
    public function obtenerVentasPorPeriodo(array $filtros): Collection
    {
        $fechaInicio = $filtros['fecha_inicio'] ?? now()->subMonth();
        $fechaFin = $filtros['fecha_fin'] ?? now();
        $granularidad = $filtros['granularidad'] ?? 'dia'; // dia, semana, mes, año

        // Definir la expresión SQL según granularidad
        $selectRaw = match ($granularidad) {
            'semana' => "DATE_FORMAT(fecha, '%Y-W') as periodo",
            'mes' => "DATE_FORMAT(fecha, '%Y-%m') as periodo",
            'año' => "YEAR(fecha) as periodo",
            default => "DATE(fecha) as periodo", // día
        };

        $query = DB::table('ventas')
            ->select([
                DB::raw($selectRaw),
                DB::raw('COUNT(*) as total_ventas'),
                DB::raw('SUM(COALESCE(total, 0)) as monto_total'),
                DB::raw('SUM(COALESCE(descuento, 0)) as descuentos_totales'),
                DB::raw('AVG(COALESCE(total, 0)) as ticket_promedio'),
                DB::raw('COUNT(DISTINCT cliente_id) as clientes_unicos'),
            ])
            ->whereBetween('fecha', [$fechaInicio, $fechaFin])
            ->where('estado_documento_id', '!=', null) // Excluir sin estado
            ->groupBy(DB::raw('DATE(fecha)'));

        // Ajustar groupBy según granularidad
        if ($granularidad !== 'dia') {
            $query->groupBy(DB::raw(match ($granularidad) {
                'semana' => "DATE_FORMAT(fecha, '%Y-W')",
                'mes' => "DATE_FORMAT(fecha, '%Y-%m')",
                'año' => "YEAR(fecha)",
            }));
        }

        $resultados = $query->orderBy('periodo')->get();

        return $resultados->map(function ($item) {
            return [
                'periodo' => $item->periodo,
                'total_ventas' => (int) $item->total_ventas,
                'monto_total' => round($item->monto_total ?? 0, 2),
                'descuentos_totales' => round($item->descuentos_totales ?? 0, 2),
                'ticket_promedio' => round($item->ticket_promedio ?? 0, 2),
                'clientes_unicos' => (int) $item->clientes_unicos,
            ];
        });
    }

    /**
     * Obtener ventas agrupadas por cliente y producto
     */
    public function obtenerVentasPorClienteProducto(array $filtros): Collection
    {
        $fechaInicio = $filtros['fecha_inicio'] ?? now()->subMonth();
        $fechaFin = $filtros['fecha_fin'] ?? now();
        $clienteId = $filtros['cliente_id'] ?? null;
        $productoId = $filtros['producto_id'] ?? null;
        $montoMinimo = $filtros['monto_minimo'] ?? 0;

        $query = DB::table('ventas as v')
            ->select([
                'c.id as cliente_id',
                'c.nombre as cliente_nombre',
                'p.id as producto_id',
                'p.nombre as producto_nombre',
                DB::raw('COUNT(DISTINCT v.id) as total_ventas'),
                DB::raw('SUM(COALESCE(dv.cantidad, 0)) as cantidad_total'),
                DB::raw('SUM(COALESCE(dv.subtotal, 0)) as monto_total'),
                DB::raw('MAX(v.fecha) as ultima_venta'),
            ])
            ->join('detalle_ventas as dv', 'v.id', '=', 'dv.venta_id')
            ->join('productos as p', 'dv.producto_id', '=', 'p.id')
            ->join('clientes as c', 'v.cliente_id', '=', 'c.id')
            ->whereBetween('v.fecha', [$fechaInicio, $fechaFin])
            ->where('v.estado_documento_id', '!=', null);

        if ($clienteId) {
            $query->where('v.cliente_id', $clienteId);
        }

        if ($productoId) {
            $query->where('dv.producto_id', $productoId);
        }

        $resultados = $query
            ->groupBy('c.id', 'c.nombre', 'p.id', 'p.nombre')
            ->havingRaw('SUM(COALESCE(dv.subtotal, 0)) >= ?', [$montoMinimo])
            ->orderByDesc('monto_total')
            ->limit(500)
            ->get();

        return $resultados->map(function ($item) {
            return [
                'cliente_id' => $item->cliente_id,
                'cliente_nombre' => $item->cliente_nombre,
                'producto_id' => $item->producto_id,
                'producto_nombre' => $item->producto_nombre,
                'total_ventas' => (int) $item->total_ventas,
                'cantidad_total' => round($item->cantidad_total ?? 0, 2),
                'monto_total' => round($item->monto_total ?? 0, 2),
                'ultima_venta' => $item->ultima_venta,
            ];
        });
    }

    /**
     * Obtener ventas agrupadas por vendedor y estado de pago
     */
    public function obtenerVentasPorVendedorEstadoPago(array $filtros): Collection
    {
        $fechaInicio = $filtros['fecha_inicio'] ?? now()->subMonth();
        $fechaFin = $filtros['fecha_fin'] ?? now();
        $usuarioId = $filtros['usuario_id'] ?? null;
        $estadoPago = $filtros['estado_pago'] ?? null;

        $query = DB::table('ventas as v')
            ->select([
                'u.id as usuario_id',
                'u.name as vendedor_nombre',
                'v.estado_pago',
                DB::raw('COUNT(*) as total_ventas'),
                DB::raw('SUM(COALESCE(v.total, 0)) as monto_total'),
                DB::raw('SUM(COALESCE(v.monto_pagado, 0)) as monto_pagado'),
                DB::raw('SUM(COALESCE(v.monto_pendiente, 0)) as monto_pendiente'),
            ])
            ->join('users as u', 'v.usuario_id', '=', 'u.id')
            ->whereBetween('v.fecha', [$fechaInicio, $fechaFin])
            ->where('v.estado_documento_id', '!=', null);

        if ($usuarioId) {
            $query->where('v.usuario_id', $usuarioId);
        }

        if ($estadoPago) {
            $query->where('v.estado_pago', $estadoPago);
        }

        $resultados = $query
            ->groupBy('u.id', 'u.name', 'v.estado_pago')
            ->orderBy('u.name')
            ->orderBy('v.estado_pago')
            ->get();

        return $resultados->map(function ($item) {
            return [
                'usuario_id' => $item->usuario_id,
                'vendedor_nombre' => $item->vendedor_nombre,
                'estado_pago' => $item->estado_pago ?? 'SIN_ESPECIFICAR',
                'total_ventas' => (int) $item->total_ventas,
                'monto_total' => round($item->monto_total ?? 0, 2),
                'monto_pagado' => round($item->monto_pagado ?? 0, 2),
                'monto_pendiente' => round($item->monto_pendiente ?? 0, 2),
            ];
        });
    }

    /**
     * Obtener estadísticas generales de ventas
     */
    public function obtenerEstadisticas(array $filtros): array
    {
        $fechaInicio = $filtros['fecha_inicio'] ?? now()->subMonth();
        $fechaFin = $filtros['fecha_fin'] ?? now();

        $stats = DB::table('ventas')
            ->select([
                DB::raw('COUNT(*) as total_ventas'),
                DB::raw('SUM(COALESCE(total, 0)) as monto_total'),
                DB::raw('SUM(COALESCE(descuento, 0)) as descuentos_totales'),
                DB::raw('AVG(COALESCE(total, 0)) as ticket_promedio'),
                DB::raw('COUNT(DISTINCT cliente_id) as clientes_unicos'),
                DB::raw('COUNT(DISTINCT usuario_id) as vendedores'),
            ])
            ->whereBetween('fecha', [$fechaInicio, $fechaFin])
            ->where('estado_documento_id', '!=', null)
            ->first();

        return [
            'total_ventas' => (int) ($stats->total_ventas ?? 0),
            'monto_total' => round($stats->monto_total ?? 0, 2),
            'descuentos_totales' => round($stats->descuentos_totales ?? 0, 2),
            'ticket_promedio' => round($stats->ticket_promedio ?? 0, 2),
            'clientes_unicos' => (int) ($stats->clientes_unicos ?? 0),
            'vendedores' => (int) ($stats->vendedores ?? 0),
        ];
    }
}
