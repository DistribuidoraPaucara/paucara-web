<?php

namespace App\Services;

use App\Models\DetallePagoVenta;
use App\Models\Venta;
use Illuminate\Support\Facades\DB;

class PagoVentaService
{
    /**
     * ✅ MEJORADO: Registrar pago automático basado en tipo_pago de la venta
     *
     * Se llama automáticamente después de crear cada venta
     * - Si la venta no tiene tipo_pago_id, usa el tipo_pago_id=1 como defecto
     * - Actualiza la venta con el tipo_pago_id si no lo tenía
     * - Crea un registro en detalles_pago_venta
     * - Usa monto_pagado si existe, sino usa total
     * - Esto asegura que TODAS las ventas tengan al menos un registro
     */
    public function registrarPagoAutomatico(Venta $venta): ?DetallePagoVenta
    {
        // Si no tiene tipo_pago_id, usar el tipo_pago_id=1 como defecto
        if (!$venta->tipo_pago_id) {
            $venta->update(['tipo_pago_id' => 1]);
            $venta->refresh();
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
            // ✅ VALIDAR: Suma de pagos debe ser >= total
            $totalPagos = array_sum(array_column($pagos, 'monto'));

            if ($totalPagos < $venta->total) {
                throw new \Exception(
                    "Suma de pagos ({$totalPagos}) debe ser mayor o igual al total de la venta ({$venta->total})"
                );
            }

            // Calcular cambio si aplica
            $cambio = $totalPagos - $venta->total;

            // ✅ NUEVO (2026-09-23): NO ESCALAR - Registrar pagos tal como vienen
            // Ejemplo: Si paga 1000 por una venta de 800:
            // - detalles_pago_venta: registro con 1000 (lo que REALMENTE recibió)
            // - movimientos_caja: VENTA +1000, VUELTO -200
            // - Neto en caja: 1000 - 200 = 800 ✅
            $pagosARegistrar = [];
            foreach ($pagos as $pago) {
                $pagosARegistrar[] = [
                    'tipo_pago_id' => $pago['tipo_pago_id'],
                    'monto' => $pago['monto'],  // ✅ Sin escalar, lo real
                    'referencia' => $pago['referencia'] ?? null,
                    'fecha_pago' => $pago['fecha_pago'] ?? now(),
                    'comprobante' => $pago['comprobante'] ?? null,
                    'observaciones' => $pago['observaciones'] ?? null,
                ];
            }

            // Limpiar pagos anteriores si existen
            $venta->detallesPagoVenta()->delete();

            // Registrar pagos SIN ESCALAR
            $detallesPago = [];
            foreach ($pagosARegistrar as $pago) {
                $detallePago = DetallePagoVenta::create([
                    'venta_id' => $venta->id,
                    'tipo_pago_id' => $pago['tipo_pago_id'],
                    'monto' => $pago['monto'],  // ✅ Lo que REALMENTE recibió
                    'referencia' => $pago['referencia'] ?? null,
                    'fecha_pago' => $pago['fecha_pago'] ?? now(),
                    'comprobante' => $pago['comprobante'] ?? null,
                    'observaciones' => $pago['observaciones'] ?? null,
                ]);

                $detallesPago[] = $detallePago;
            }

            // ✅ Actualizar venta: monto_pagado = lo que REALMENTE entra
            $venta->update([
                'monto_pagado' => $totalPagos,  // Lo que realmente pagó
                'monto_pendiente' => 0,  // Sin pendiente
            ]);

            // ✅ NUEVO: Si hay cambio, registrar movimiento de VUELTO en caja
            if ($cambio > 0) {
                $this->registrarVueltoEnCaja($venta, $cambio);

                \Log::info('✅ Cambio/Vuelto registrado como movimiento en caja', [
                    'venta_id' => $venta->id,
                    'venta_numero' => $venta->numero,
                    'total_venta' => $venta->total,
                    'total_pagado' => $totalPagos,
                    'cambio' => $cambio,
                ]);
            }

            \Log::info('✅ Pagos registrados (SIN ESCALAR)', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'total_venta' => $venta->total,
                'total_pagado_real' => $totalPagos,
                'cambio' => $cambio,
                'cantidad_formas_pago' => count($detallesPago),
            ]);

            return [
                'venta_id' => $venta->id,
                'total_venta' => $venta->total,
                'total_pagado' => $totalPagos,
                'cambio' => $cambio,
                'monto_pendiente' => 0,
                'detalles_pago' => $detallesPago,
            ];
        });
    }

    /**
     * ✅ NUEVO: Registrar movimiento de VUELTO en caja
     * Cuando cliente paga más de lo que cuesta la venta
     *
     * Ejemplo: Venta 800, cliente paga 1000
     * - MovimientoCaja: tipo_operacion='VUELTO', monto=-200 (salida)
     */
    private function registrarVueltoEnCaja(Venta $venta, float $cambio): void
    {
        try {
            $tipoOperacionVuelto = \App\Models\TipoOperacionCaja::where('codigo', 'VUELTO')->first();

            if (!$tipoOperacionVuelto) {
                \Log::warning('⚠️ Tipo de operación VUELTO no existe en la BD', [
                    'venta_id' => $venta->id,
                ]);
                return;
            }

            // ✅ Obtener caja abierta actual (sin cierre)
            $cajaAbierta = \App\Models\AperturaCaja::where('user_id', auth()->id() ?? $venta->usuario_id)
                ->whereDoesntHave('cierre')
                ->orderByDesc('id')
                ->first();

            if (!$cajaAbierta) {
                \Log::warning('⚠️ No hay caja abierta para registrar vuelto', [
                    'venta_id' => $venta->id,
                    'user_id' => auth()->id() ?? $venta->usuario_id,
                ]);
                return;
            }

            // ✅ Registrar movimiento VUELTO (negativo = salida)
            \App\Models\MovimientoCaja::create([
                'caja_id' => $cajaAbierta->caja_id,
                'user_id' => auth()->id() ?? $venta->usuario_id,
                'apertura_caja_id' => $cajaAbierta->id,
                'fecha' => now(),
                'monto' => -$cambio,  // Negativo porque es salida
                'observaciones' => "Vuelto/Cambio por venta #{$venta->numero}",
                'numero_documento' => $venta->numero,
                'tipo_operacion_id' => $tipoOperacionVuelto->id,
                'tipo_pago_id' => null,  // El vuelto no tiene tipo de pago específico
                'venta_id' => $venta->id,
            ]);

            \Log::info('✅ Movimiento VUELTO registrado en caja', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'monto_vuelto' => $cambio,
                'apertura_caja_id' => $cajaAbierta->id,
            ]);

        } catch (\Exception $e) {
            // Log pero no fallar la transacción
            \Log::error('❌ Error al registrar vuelto en caja', [
                'venta_id' => $venta->id,
                'error' => $e->getMessage(),
            ]);
        }
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
