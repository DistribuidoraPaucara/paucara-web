<?php

namespace App\Services;

use App\Models\MovimientoCaja;
use App\Models\TipoPago;
use Illuminate\Support\Collection;

class MovimientoCajaService
{
    /**
     * ✅ Calcular ventas en EFECTIVO (VENTA + EFECTIVO)
     *
     * @param Collection $movimientos Colección de MovimientoCaja
     * @return float Total en efectivo de ventas
     */
    public function calcularVentasEnEfectivo(Collection $movimientos): float
    {
        return $movimientos
            ->filter(fn($mov) => $mov->tipo_operacion?->codigo === 'VENTA' && $mov->tipo_pago?->codigo === 'EFECTIVO')
            ->sum('monto');
    }

    /**
     * ✅ Calcular ventas a CRÉDITO (VENTA + CRÉDITO)
     *
     * @param Collection $movimientos Colección de MovimientoCaja
     * @return float Total en crédito de ventas
     */
    public function calcularVentasACredito(Collection $movimientos): float
    {
        return $movimientos
            ->filter(fn($mov) => $mov->tipo_operacion?->codigo === 'VENTA' && $mov->tipo_pago?->codigo === 'CREDITO')
            ->sum('monto');
    }

    /**
     * ✅ Calcular pagos de CRÉDITO (PAGO donde pago_id != null)
     *
     * @param Collection $movimientos Colección de MovimientoCaja
     * @return float Total de pagos de crédito recibidos
     */
    public function calcularPagosDeCredito(Collection $movimientos): float
    {
        return $movimientos
            ->filter(fn($mov) =>
                $mov->tipo_operacion?->codigo === 'PAGO' &&
                $mov->pago_id !== null
            )
            ->sum('monto');
    }

    /**
     * ✅ Calcular efectivo REAL = Ventas en efectivo + Pagos de crédito
     *
     * @param Collection $movimientos Colección de MovimientoCaja
     * @return float Efectivo real recibido (solo EFECTIVO y PAGOS de crédito)
     */
    public function calcularEfectivoReal(Collection $movimientos): float
    {
        return $this->calcularVentasEnEfectivo($movimientos) + $this->calcularPagosDeCredito($movimientos);
    }

    /**
     * ✅ Calcular deuda PENDIENTE de crédito = Ventas a crédito - Pagos de crédito
     *
     * @param Collection $movimientos Colección de MovimientoCaja
     * @return float Deuda pendiente de cobranza
     */
    public function calcularDeudaPendiente(Collection $movimientos): float
    {
        return max(0, $this->calcularVentasACredito($movimientos) - $this->calcularPagosDeCredito($movimientos));
    }

    /**
     * ✅ Agrupar VENTAS por tipo de pago
     * ✅ MEJORADO: Muestra TODOS los tipos de pago, incluso si no hay ventas (mostrando 0)
     *
     * @param Collection $movimientos Colección de MovimientoCaja
     * @return array Array con ['tipo_pago' => ['total' => float, 'count' => int]]
     */
    public function calcularVentasPorTipoPago(Collection $movimientos): array
    {
        // ✅ Obtener todos los tipos de pago disponibles
        $todosTiposPago = TipoPago::where('activo', true)
            ->orderBy('nombre')
            ->get();

        // ✅ Agrupar SOLO las ventas por tipo de pago
        $ventasAgrupadas = $movimientos
            ->filter(fn($mov) => $mov->tipo_operacion?->codigo === 'VENTA' && $mov->tipo_pago?->nombre)
            ->groupBy(fn($mov) => $mov->tipo_pago->nombre)
            ->map(fn($grupo) => [
                'total' => (float)$grupo->sum('monto'),
                'count' => $grupo->count(),
            ]);

        // ✅ Crear resultado con TODOS los tipos, inicializados en 0
        $resultado = [];
        foreach ($todosTiposPago as $tipoPago) {
            $resultado[$tipoPago->nombre] = $ventasAgrupadas[$tipoPago->nombre] ?? [
                'total' => 0.0,
                'count' => 0,
            ];
        }

        return $resultado;
    }

    /**
     * ✅ Obtener resumen completo de EFECTIVO para cierre de caja
     *
     * Incluye:
     * - Ventas en efectivo
     * - Ventas a crédito
     * - Pagos de crédito
     * - Efectivo real = Ventas efectivo + Pagos crédito
     * - Deuda pendiente = Ventas crédito - Pagos crédito
     * - Ventas por tipo de pago
     *
     * @param Collection $movimientos Colección de MovimientoCaja
     * @return array Array asociativo con resumen completo
     */
    public function obtenerResumenEfectivo(Collection $movimientos): array
    {
        $ventasEnEfectivo = $this->calcularVentasEnEfectivo($movimientos);
        $ventasACredito = $this->calcularVentasACredito($movimientos);
        $pagosDeCredito = $this->calcularPagosDeCredito($movimientos);
        $efectivoReal = $this->calcularEfectivoReal($movimientos);
        $deudaPendiente = $this->calcularDeudaPendiente($movimientos);
        $ventasPorTipoPago = $this->calcularVentasPorTipoPago($movimientos);

        return [
            'ventas_en_efectivo' => (float)$ventasEnEfectivo,
            'ventas_a_credito' => (float)$ventasACredito,
            'pagos_de_credito' => (float)$pagosDeCredito,
            'efectivo_real' => (float)$efectivoReal,
            'deuda_pendiente' => (float)$deudaPendiente,
            'ventas_por_tipo_pago' => $ventasPorTipoPago,
        ];
    }

    /**
     * ✅ Agrupar movimientos por tipo de OPERACIÓN (VENTA, PAGO, GASTOS, etc.)
     *
     * @param Collection $movimientos Colección de MovimientoCaja
     * @return array Array con agrupación por tipo de operación
     */
    public function calcularMovimientosPorTipoOperacion(Collection $movimientos): array
    {
        return $movimientos
            ->groupBy(fn($mov) => $mov->tipo_operacion?->nombre ?? 'Sin tipo')
            ->map(fn($grupo) => [
                'total' => $grupo->sum('monto'),
                'count' => $grupo->count(),
            ])
            ->toArray();
    }

    /**
     * ✅ Agrupar TODOS los movimientos por tipo de PAGO (EFECTIVO, CRÉDITO, TARJETA, etc.)
     * ✅ MEJORADO: Muestra TODOS los tipos de pago, incluso si no hay movimientos (mostrando 0)
     *
     * @param Collection $movimientos Colección de MovimientoCaja
     * @return array Array con agrupación por tipo de pago
     */
    public function calcularMovimientosPorTipoPago(Collection $movimientos): array
    {
        // ✅ Obtener todos los tipos de pago disponibles
        $todosTiposPago = TipoPago::where('activo', true)
            ->orderBy('nombre')
            ->get();

        // ✅ Agrupar movimientos por tipo de pago
        $movimientosAgrupados = $movimientos
            ->filter(fn($mov) => $mov->tipo_pago?->nombre)  // Excluir movimientos sin tipo de pago
            ->groupBy(fn($mov) => $mov->tipo_pago->nombre)
            ->map(fn($grupo) => [
                'total' => (float)$grupo->sum('monto'),
                'count' => $grupo->count(),
            ]);

        // ✅ Crear resultado con TODOS los tipos, inicializados en 0
        $resultado = [];
        foreach ($todosTiposPago as $tipoPago) {
            $resultado[$tipoPago->nombre] = $movimientosAgrupados[$tipoPago->nombre] ?? [
                'total' => 0.0,
                'count' => 0,
            ];
        }

        return $resultado;
    }

    /**
     * ✅ Calcular rango de ventas (ID mínimo, máximo y total)
     *
     * @param Collection $movimientos Colección de MovimientoCaja
     * @return array|null Array con ['minId', 'maxId', 'totalVentas'] o null si no hay ventas
     */
    public function calcularRangoVentas(Collection $movimientos): ?array
    {
        $ventaIds = $movimientos
            ->filter(fn($mov) => $mov->venta_id !== null && $mov->venta_id > 0)
            ->pluck('venta_id')
            ->unique()
            ->sort();

        if ($ventaIds->isEmpty()) {
            return null;
        }

        return [
            'minId' => $ventaIds->first(),
            'maxId' => $ventaIds->last(),
            'totalVentas' => $ventaIds->count(),
        ];
    }

    /**
     * ✅ Calcular totales de INGRESOS y EGRESOS
     *
     * @param Collection $movimientos Colección de MovimientoCaja
     * @return array Array con ['ingresos' => float, 'egresos' => float]
     */
    public function calcularIngresosYEgresos(Collection $movimientos): array
    {
        return [
            'ingresos' => (float)$movimientos->filter(fn($mov) => $mov->monto > 0)->sum('monto'),
            'egresos' => (float)abs($movimientos->filter(fn($mov) => $mov->monto < 0)->sum('monto')),
        ];
    }
}
