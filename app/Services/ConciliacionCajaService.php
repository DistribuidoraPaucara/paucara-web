<?php

namespace App\Services;

use App\Models\Venta;
use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ConciliacionCajaService
{
    /**
     * Obtener conciliación del día (comparativa ventas vs movimientos de caja)
     */
    public function conciliacionDelDia(?string $fecha = null): array
    {
        $fecha = $fecha ? Carbon::parse($fecha)->toDateString() : today()->toDateString();

        // 1. Obtener totales de ventas del día
        $ventasDelDia = Venta::whereDate('created_at', $fecha)
            ->where('estado', 'COMPLETADA')
            ->get();

        $totalVentas = $ventasDelDia->sum('monto_total');
        $cantidadVentas = $ventasDelDia->count();

        // 2. Obtener movimientos de INGRESO del día (excluir egresos)
        $movimientosIngreso = MovimientoCaja::whereDate('fecha', $fecha)
            ->where('monto', '>', 0)
            ->with(['tipoOperacion', 'tipoPago', 'usuario'])
            ->get();

        $totalIngresos = $movimientosIngreso->sum('monto');
        $cantidadMovimientos = $movimientosIngreso->count();

        // 3. Calcular diferencia
        $diferencia = $totalVentas - $totalIngresos;
        $hayDiscrepancia = abs($diferencia) > 0.01; // Permitir margen de error mínimo

        // 4. Desglose por tipo de pago
        $desglosePorTipoPago = $this->desglosePorTipoPago($ventasDelDia, $movimientosIngreso);

        // 5. Desglose por rango de cliente
        $desglosePorRangoCliente = $this->desglosePorRangoCliente($ventasDelDia);

        // 6. Datos detallados de ventas
        $detallesVentas = $this->obtenerDetallesVentas($ventasDelDia);

        // 7. Datos detallados de movimientos
        $detallesMovimientos = $this->obtenerDetallesMovimientos($movimientosIngreso);

        return [
            'fecha' => $fecha,
            'resumen' => [
                'total_ventas' => round($totalVentas, 2),
                'total_ingresos_caja' => round($totalIngresos, 2),
                'diferencia' => round($diferencia, 2),
                'hay_discrepancia' => $hayDiscrepancia,
                'cantidad_ventas' => $cantidadVentas,
                'cantidad_movimientos' => $cantidadMovimientos,
            ],
            'desglose_tipo_pago' => $desglosePorTipoPago,
            'desglose_rango_cliente' => $desglosePorRangoCliente,
            'detalles_ventas' => $detallesVentas,
            'detalles_movimientos' => $detallesMovimientos,
        ];
    }

    /**
     * Desglose de ventas y movimientos por tipo de pago
     */
    private function desglosePorTipoPago($ventas, $movimientos): array
    {
        $desglose = [];

        // Tipos de pago posibles
        $tiposPago = [
            'EFECTIVO' => 'Efectivo',
            'TARJETA' => 'Tarjeta',
            'TRANSFERENCIA' => 'Transferencia',
            'CREDITO' => 'Crédito',
        ];

        foreach ($tiposPago as $codigo => $nombre) {
            $ventasDelTipo = $ventas
                ->filter(fn($v) => $v->tipo_pago === $codigo || ($v->tipoPago && $v->tipoPago->codigo === $codigo))
                ->sum('monto_total');

            $movimientosDelTipo = $movimientos
                ->filter(fn($m) => $m->tipoPago && $m->tipoPago->codigo === $codigo)
                ->sum('monto');

            $diferencia = $ventasDelTipo - $movimientosDelTipo;

            if ($ventasDelTipo > 0 || $movimientosDelTipo > 0) {
                $desglose[] = [
                    'tipo_pago' => $nombre,
                    'codigo' => $codigo,
                    'total_ventas' => round($ventasDelTipo, 2),
                    'total_movimientos' => round($movimientosDelTipo, 2),
                    'diferencia' => round($diferencia, 2),
                    'coincide' => abs($diferencia) < 0.01,
                ];
            }
        }

        return $desglose;
    }

    /**
     * Desglose de ventas por rango de cliente
     */
    private function desglosePorRangoCliente($ventas): array
    {
        $desglose = [];

        $ventasPorRango = $ventas->groupBy(function ($venta) {
            return $venta->cliente?->rango_cliente ?? 'SIN_ASIGNAR';
        });

        foreach ($ventasPorRango as $rango => $ventasRango) {
            $total = $ventasRango->sum('monto_total');
            $cantidad = $ventasRango->count();

            // Convertir código de rango a nombre legible
            $nombreRango = $this->obtenerNombreRango($rango);

            $desglose[] = [
                'rango_cliente' => $nombreRango,
                'codigo_rango' => $rango,
                'total' => round($total, 2),
                'cantidad_ventas' => $cantidad,
                'promedio' => round($total / $cantidad, 2),
            ];
        }

        return collect($desglose)->sortBy('rango_cliente')->values()->toArray();
    }

    /**
     * Obtener nombre legible del rango de cliente
     */
    private function obtenerNombreRango(string $codigo): string
    {
        $rangos = [
            'GENERAL' => 'General',
            'DISTRIBUIDOR' => 'Distribuidor',
            'MAYORISTA' => 'Mayorista',
            'PREVENTISTA' => 'Preventista',
            'ESPECIAL' => 'Especial',
            'SIN_ASIGNAR' => 'Sin Asignar',
        ];

        return $rangos[$codigo] ?? $codigo;
    }

    /**
     * Obtener detalles de cada venta
     */
    private function obtenerDetallesVentas($ventas): array
    {
        return $ventas->map(function ($venta) {
            return [
                'id' => $venta->id,
                'numero_venta' => $venta->numero_venta ?? 'N/A',
                'cliente' => $venta->cliente?->nombre ?? 'Cliente Desconocido',
                'rango_cliente' => $venta->cliente?->rango_cliente ?? 'SIN_ASIGNAR',
                'monto_total' => round($venta->monto_total, 2),
                'tipo_pago' => $venta->tipo_pago,
                'estado' => $venta->estado,
                'fecha' => $venta->created_at?->format('H:i:s'),
            ];
        })->values()->toArray();
    }

    /**
     * Obtener detalles de cada movimiento de caja
     */
    private function obtenerDetallesMovimientos($movimientos): array
    {
        return $movimientos->map(function ($movimiento) {
            return [
                'id' => $movimiento->id,
                'tipo_operacion' => $movimiento->tipoOperacion?->nombre ?? 'N/A',
                'tipo_pago' => $movimiento->tipoPago?->nombre ?? 'N/A',
                'monto' => round($movimiento->monto, 2),
                'usuario' => $movimiento->usuario?->name ?? 'N/A',
                'descripcion' => $movimiento->observaciones ?? '-',
                'fecha' => $movimiento->fecha->format('H:i:s'),
                'venta_id' => $movimiento->venta_id,
                'pago_id' => $movimiento->pago_id,
            ];
        })->values()->toArray();
    }
}
