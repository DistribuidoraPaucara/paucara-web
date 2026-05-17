<?php

namespace App\Services;

use App\Models\DetallePagoVenta;
use App\Models\Venta;
use Illuminate\Support\Facades\DB;

class PagoVentaService
{
    /**
     * ✅ NUEVO: Registrar pago automático basado en tipo_pago de la venta
     *
     * Se llama automáticamente después de crear cada venta
     * - Si la venta tiene tipo_pago_id, crea un registro en detalles_pago_venta
     * - Usa monto_pagado si existe, sino usa total
     * - Esto asegura que TODAS las ventas tengan al menos un registro
     */
    public function registrarPagoAutomatico(Venta $venta): ?DetallePagoVenta
    {
        // Solo registrar si la venta tiene tipo_pago_id
        if (!$venta->tipo_pago_id) {
            return null;
        }

        // Usar monto_pagado si existe y es > 0, sino usar total
        $monto = ($venta->monto_pagado && $venta->monto_pagado > 0)
            ? $venta->monto_pagado
            : $venta->total;

        try {
            // Crear el registro de pago
            $detallePago = DetallePagoVenta::create([
                'venta_id' => $venta->id,
                'tipo_pago_id' => $venta->tipo_pago_id,
                'monto' => $monto,
                'fecha_pago' => now(),
                'numero_comprobante' => null,
                'observaciones' => 'Pago automático al crear la venta',
            ]);

            // Actualizar monto_pagado en la venta si no estaba establecido
            if (!$venta->monto_pagado || $venta->monto_pagado <= 0) {
                $venta->update([
                    'monto_pagado' => $monto,
                    'monto_pendiente' => max(0, $venta->total - $monto),
                ]);
            }

            return $detallePago;
        } catch (\Exception $e) {
            // Log pero no fallar la creación de venta
            \Log::error('⚠️ Error registrando pago automático', [
                'venta_id' => $venta->id,
                'tipo_pago_id' => $venta->tipo_pago_id,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    public function registrarPagos(Venta $venta, array $pagos): array
    {
        return DB::transaction(function () use ($venta, $pagos) {
            // ✅ ACTUALIZADO (2026-05-03): Validar que la suma de pagos sea >= al total
            // Permite pagos mayores (genera cambio/vuelto)
            $totalPagos = array_sum(array_column($pagos, 'monto'));

            if ($totalPagos < $venta->total) {
                throw new \Exception(
                    "Suma de pagos ({$totalPagos}) debe ser mayor o igual al total de la venta ({$venta->total})"
                );
            }

            // Calcular cambio si aplica
            $cambio = $totalPagos - $venta->total;

            // ✅ NUEVO (2026-05-04): Escalar proporcionalmente los pagos
            // Si el usuario paga 200 por una venta de 196, los pagos se escalan:
            // - Efectivo 100 → 98
            // - Transferencia 100 → 98
            // - Vuelto 4 se registra en movimientos_caja como tipo VUELTO
            $pagosEscalados = [];
            if ($cambio > 0) {
                $factorEscala = $venta->total / $totalPagos;

                foreach ($pagos as $pago) {
                    $pagosEscalados[] = [
                        'tipo_pago_id' => $pago['tipo_pago_id'],
                        'monto' => round($pago['monto'] * $factorEscala, 2),
                        'monto_original' => $pago['monto'],
                        'referencia' => $pago['referencia'] ?? null,
                        'fecha_pago' => $pago['fecha_pago'] ?? now(),
                        'comprobante' => $pago['comprobante'] ?? null,
                        'observaciones' => $pago['observaciones'] ?? null,
                    ];
                }

                \Log::info('🔄 [registrarPagos] Pagos escalados proporcionalmente', [
                    'venta_id' => $venta->id,
                    'venta_numero' => $venta->numero,
                    'total_venta' => $venta->total,
                    'total_pagado_original' => $totalPagos,
                    'factor_escala' => $factorEscala,
                    'cambio' => $cambio,
                    'detalle' => $pagosEscalados,
                ]);
            } else {
                // Sin vuelto, registrar pagos tal como vienen
                foreach ($pagos as $pago) {
                    $pagosEscalados[] = [
                        'tipo_pago_id' => $pago['tipo_pago_id'],
                        'monto' => $pago['monto'],
                        'monto_original' => $pago['monto'],
                        'referencia' => $pago['referencia'] ?? null,
                        'fecha_pago' => $pago['fecha_pago'] ?? now(),
                        'comprobante' => $pago['comprobante'] ?? null,
                        'observaciones' => $pago['observaciones'] ?? null,
                    ];
                }
            }

            // Limpiar pagos anteriores si existen
            $venta->detallesPagoVenta()->delete();

            // Registrar nuevos pagos con montos escalados
            $detallesPago = [];
            foreach ($pagosEscalados as $pago) {
                $detallePago = DetallePagoVenta::create([
                    'venta_id' => $venta->id,
                    'tipo_pago_id' => $pago['tipo_pago_id'],
                    'monto' => $pago['monto'],  // ✅ Monto escalado, no original
                    'referencia' => $pago['referencia'] ?? null,
                    'fecha_pago' => $pago['fecha_pago'] ?? now(),
                    'comprobante' => $pago['comprobante'] ?? null,
                    'observaciones' => $pago['observaciones'] ?? null,
                ]);

                $detallesPago[] = $detallePago;
            }

            // ✅ ACTUALIZADO (2026-05-04): monto_pagado = total de la venta (dinero real que entra)
            // El vuelto se resta en el listener como movimiento VUELTO
            $venta->update([
                'monto_pagado' => $venta->total,  // Dinero real que entra por la venta
                'monto_pendiente' => 0,  // No hay pendiente si pagó (igual o más que el total)
            ]);

            // Log con información del cambio
            \Log::info('✅ Pagos desglosados registrados (con escalado proporcional)', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'total_venta' => $venta->total,
                'total_pagado_original' => $totalPagos,
                'total_registrado_en_detalles' => array_sum(array_column($pagosEscalados, 'monto')),
                'cambio' => $cambio,
                'cantidad_formas_pago' => count($detallesPago),
            ]);

            return [
                'venta_id' => $venta->id,
                'total_venta' => $venta->total,
                'total_pagado_original' => $totalPagos,
                'total_registrado' => array_sum(array_column($pagosEscalados, 'monto')),
                'cambio' => $cambio,
                'monto_pendiente' => 0,
                'detalles_pago' => $detallesPago,
            ];
        });
    }

    public function obtenerResumenPagos(Venta $venta): array
    {
        $pagos = $venta->detallesPagoVenta()->with('tipoPago')->get();

        $resumen = [];
        foreach ($pagos as $pago) {
            if (!isset($resumen[$pago->tipoPago->codigo])) {
                $resumen[$pago->tipoPago->codigo] = [
                    'tipo_pago' => $pago->tipoPago->nombre,
                    'codigo' => $pago->tipoPago->codigo,
                    'cantidad' => 0,
                    'monto_total' => 0,
                ];
            }

            $resumen[$pago->tipoPago->codigo]['cantidad']++;
            $resumen[$pago->tipoPago->codigo]['monto_total'] += $pago->monto;
        }

        return array_values($resumen);
    }

    public function validarPagos(array $pagos): array
    {
        $errores = [];

        if (empty($pagos)) {
            $errores[] = 'Debe registrar al menos un método de pago';
        }

        foreach ($pagos as $index => $pago) {
            if (!isset($pago['tipo_pago_id'])) {
                $errores[] = "Pago {$index}: tipo_pago_id es requerido";
            }

            if (!isset($pago['monto']) || $pago['monto'] <= 0) {
                $errores[] = "Pago {$index}: monto debe ser mayor a 0";
            }
        }

        return $errores;
    }

    public function obtenerReporteCaja($fechaDesde, $fechaHasta): array
    {
        $pagos = DetallePagoVenta::whereHas('venta', function ($query) use ($fechaDesde, $fechaHasta) {
            $query->whereBetween('fecha', [$fechaDesde, $fechaHasta]);
        })
        ->with(['tipoPago', 'venta'])
        ->get();

        $reporte = [
            'fecha_desde' => $fechaDesde,
            'fecha_hasta' => $fechaHasta,
            'total_general' => 0,
            'por_tipo_pago' => [],
            'detalles' => [],
        ];

        foreach ($pagos as $pago) {
            $codigo = $pago->tipoPago->codigo;

            if (!isset($reporte['por_tipo_pago'][$codigo])) {
                $reporte['por_tipo_pago'][$codigo] = [
                    'tipo_pago' => $pago->tipoPago->nombre,
                    'total' => 0,
                    'cantidad_transacciones' => 0,
                ];
            }

            $reporte['por_tipo_pago'][$codigo]['total'] += $pago->monto;
            $reporte['por_tipo_pago'][$codigo]['cantidad_transacciones']++;
            $reporte['total_general'] += $pago->monto;

            $reporte['detalles'][] = [
                'venta_numero' => $pago->venta->numero,
                'tipo_pago' => $pago->tipoPago->nombre,
                'monto' => $pago->monto,
                'referencia' => $pago->referencia,
                'fecha_pago' => $pago->fecha_pago,
                'observaciones' => $pago->observaciones,
            ];
        }

        return $reporte;
    }
}
