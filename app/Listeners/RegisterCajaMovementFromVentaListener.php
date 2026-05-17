<?php

namespace App\Listeners;

use App\Events\VentaCreada;
use App\Models\AuditoriaCaja;
use App\Models\AperturaCaja;
use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;
use Illuminate\Support\Facades\Log;

/**
 * Listener que registra el movimiento de caja cuando se crea una venta directa
 *
 * RESPONSABILIDADES:
 * ✓ Escucha evento VentaCreada
 * ✓ Obtiene caja abierta del usuario
 * ✓ Registra movimiento si hay pago inicial y política lo requiere
 * ✓ Registra auditoría de la operación
 *
 * DIFERENCIA CON PROFORMA:
 * - Proforma: registra solo si politica es ANTICIPADO_100 o MEDIO_MEDIO
 * - Venta directa: TAMBIÉN registra CONTRA_ENTREGA con pago inicial
 *
 * POLÍTICAS QUE REGISTRAN MOVIMIENTO:
 * - ANTICIPADO_100: 100% pago anticipado
 * - MEDIO_MEDIO: 50% anticipo, 50% contra entrega
 * - CONTRA_ENTREGA: si hay pago inicial (ej: abono)
 */
class RegisterCajaMovementFromVentaListener
{
    /**
     * Handle the event.
     */
    public function handle(VentaCreada $event): void
    {
        try {
            $venta = $event->venta;

            Log::info('🔔 RegisterCajaMovementFromVentaListener - Procesando venta creada', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'politica_pago' => $venta->politica_pago,
                'monto_pagado' => $venta->monto_pagado,
            ]);

            // ✅ 1. Obtener caja_id - primero de la venta (ya guardado en BD), luego fallback
            $cajaId = $venta->caja_id;  // Usar caja_id directo (guardado en creación de venta)

            // 📋 LOG: Búsqueda de caja_id
            Log::info('🔍 [RegisterCajaMovementFromVentaListener] Buscando caja_id', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'caja_id_de_venta' => $cajaId,
            ]);

            // Si no hay caja_id en la venta, buscar la caja abierta del usuario
            // (útil para ventas creadas desde convertir proforma)
            if (!$cajaId) {
                Log::info('ℹ️ [RegisterCajaMovementFromVentaListener] _caja_id no presente, buscando caja abierta', [
                    'venta_id' => $venta->id,
                    'usuario_id' => $venta->usuario_id,
                ]);

                // Buscar caja abierta de HOY primero
                $cajaAbiertaBusqueda = AperturaCaja::where('user_id', $venta->usuario_id)
                    ->whereDate('fecha', today())
                    ->whereDoesntHave('cierre')
                    ->with('caja')
                    ->latest()
                    ->first();

                // Si no hay de hoy, buscar la más reciente (puede ser de ayer)
                if (!$cajaAbiertaBusqueda) {
                    $cajaAbiertaBusqueda = AperturaCaja::where('user_id', $venta->usuario_id)
                        ->whereDoesntHave('cierre')
                        ->with('caja')
                        ->latest('fecha')
                        ->first();

                    if ($cajaAbiertaBusqueda && $cajaAbiertaBusqueda->fecha < today()) {
                        Log::warning('⚠️ [RegisterCajaMovementFromVentaListener] Usando caja de día anterior', [
                            'venta_id' => $venta->id,
                            'usuario_id' => $venta->usuario_id,
                            'apertura_fecha' => $cajaAbiertaBusqueda->fecha,
                            'caja_id' => $cajaAbiertaBusqueda->caja_id,
                        ]);
                    }
                }

                // Usar la caja encontrada
                if ($cajaAbiertaBusqueda) {
                    $cajaId = $cajaAbiertaBusqueda->caja_id;
                    Log::info('✅ [RegisterCajaMovementFromVentaListener] Caja encontrada en búsqueda', [
                        'venta_id' => $venta->id,
                        'caja_id' => $cajaId,
                        'caja_nombre' => $cajaAbiertaBusqueda->caja?->nombre,
                    ]);
                }
            }

            // Si aún así no hay caja_id, no registrar
            if (!$cajaId) {
                Log::info('⏭️ [RegisterCajaMovementFromVentaListener] Sin caja disponible, no registra movimiento', [
                    'venta_id' => $venta->id,
                    'venta_numero' => $venta->numero,
                    'usuario_id' => $venta->usuario_id,
                ]);
                return;
            }

            // ✅ 2. Determinar si es CREDITO o tiene monto a registrar
            $esCREDITO = $venta->politica_pago === 'CREDITO';
            $tieneMontoAPagar = $venta->monto_pagado > 0;

            if (!$esCREDITO && !$tieneMontoAPagar) {
                Log::info('⏭️ RegisterCajaMovementFromVentaListener - Sin monto a pagar y no es crédito, no registra movimiento', [
                    'venta_id' => $venta->id,
                    'venta_numero' => $venta->numero,
                    'monto_pagado' => $venta->monto_pagado,
                    'politica_pago' => $venta->politica_pago,
                ]);
                return;
            }

            // ✅ 3. Validar que la política requiere pago inmediato O es CREDITO
            $politicasConPagoInmediato = ['ANTICIPADO_100', 'MEDIO_MEDIO', 'CONTRA_ENTREGA', 'CREDITO'];
            if (!in_array($venta->politica_pago, $politicasConPagoInmediato)) {
                Log::info('⏭️ RegisterCajaMovementFromVentaListener - Política no requiere pago inmediato ni es crédito', [
                    'venta_id' => $venta->id,
                    'venta_numero' => $venta->numero,
                    'politica' => $venta->politica_pago,
                ]);
                return;
            }

            // ✅ 4. Obtener usuario
            $usuario = $venta->usuario;
            if (!$usuario) {
                Log::warning('⚠️ RegisterCajaMovementFromVentaListener - Usuario no encontrado', [
                    'venta_id' => $venta->id,
                    'usuario_id' => $venta->usuario_id,
                ]);
                return;
            }

            // ✅ 5. Obtener caja abierta del usuario (HOY o la más reciente si es Admin con caja de ayer)
            // Primero intenta HOY
            $cajaAbierta = AperturaCaja::where('caja_id', $cajaId)
                ->where('user_id', $usuario->id)
                ->whereDate('fecha', today())
                ->whereDoesntHave('cierre')
                ->with('caja')
                ->first();

            // Si no hay caja de hoy, busca la más reciente (posiblemente de ayer)
            // ✅ NUEVO: Permite cajas de días anteriores (útil para Admins que usan caja de ayer sin cerrar)
            if (!$cajaAbierta) {
                $cajaAbierta = AperturaCaja::where('caja_id', $cajaId)
                    ->where('user_id', $usuario->id)
                    ->whereDoesntHave('cierre')
                    ->with('caja')
                    ->latest('fecha')
                    ->first();

                if ($cajaAbierta) {
                    $fechaApertura = $cajaAbierta->fecha;
                    $hoy = today();

                    if ($fechaApertura < $hoy) {
                        Log::info('⚠️ RegisterCajaMovementFromVentaListener - Usando caja de día anterior (permitido para Admin)', [
                            'usuario_id' => $usuario->id,
                            'usuario_nombre' => $usuario->name,
                            'caja_id' => $cajaId,
                            'apertura_fecha' => $fechaApertura,
                            'venta_id' => $venta->id,
                            'venta_numero' => $venta->numero,
                        ]);
                    }
                }
            }

            if (!$cajaAbierta) {
                Log::warning('⚠️ RegisterCajaMovementFromVentaListener - Caja no abierta por este usuario (ni hoy ni anterior)', [
                    'usuario_id' => $usuario->id,
                    'usuario_nombre' => $usuario->name,
                    'caja_id' => $cajaId,
                    'venta_id' => $venta->id,
                    'venta_numero' => $venta->numero,
                    'politica' => $venta->politica_pago,
                    'monto' => $venta->monto_pagado,
                ]);

                // ✅ REGISTRAR EN AUDITORÍA: Intento fallido
                AuditoriaCaja::create([
                    'user_id' => $usuario->id,
                    'caja_id' => $cajaId,
                    'apertura_caja_id' => null,
                    'accion' => 'INTENTO_PAGO_SIN_CAJA',
                    'operacion_intentada' => 'POST /ventas',
                    'operacion_tipo' => 'VENTA',
                    'exitosa' => false,
                    'detalle_operacion' => [
                        'venta_id' => $venta->id,
                        'venta_numero' => $venta->numero,
                        'politica' => $venta->politica_pago,
                        'monto_pagado' => $venta->monto_pagado,
                        'motivo' => 'Usuario no tiene caja abierta (ni hoy ni anterior)',
                    ],
                    'codigo_http' => 422,
                    'mensaje_error' => 'Usuario no tiene caja abierta para registrar pago',
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);

                return;
            }

            // ✅ 6. Obtener tipo de operación (CREDITO si es crédito, VENTA si es pago normal)
            $codigoTipoOperacion = $esCREDITO ? 'CREDITO' : 'VENTA';  // ✅ NUEVO: Usar CREDITO para créditos
            $tipoOperacion = TipoOperacionCaja::where('codigo', $codigoTipoOperacion)->first();

            if (!$tipoOperacion) {
                Log::error("❌ RegisterCajaMovementFromVentaListener - Tipo operación {$codigoTipoOperacion} no existe", [
                    'venta_id' => $venta->id,
                    'venta_numero' => $venta->numero,
                    'codigo_buscado' => $codigoTipoOperacion,
                ]);

                // ✅ REGISTRAR EN AUDITORÍA: Error de configuración
                AuditoriaCaja::create([
                    'user_id' => $usuario->id,
                    'caja_id' => $cajaAbierta->caja_id,
                    'apertura_caja_id' => $cajaAbierta->id,
                    'accion' => 'ERROR_OPERACION_NO_EXISTE',
                    'operacion_intentada' => 'POST /ventas',
                    'operacion_tipo' => 'VENTA',
                    'exitosa' => false,
                    'detalle_operacion' => [
                        'venta_id' => $venta->id,
                        'venta_numero' => $venta->numero,
                        'motivo' => "TipoOperacionCaja {$codigoTipoOperacion} no existe en la BD",
                        'codigo_buscado' => $codigoTipoOperacion,
                    ],
                    'codigo_http' => 500,
                    'mensaje_error' => "Tipo operación {$codigoTipoOperacion} no encontrado",
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);

                return;
            }

            // ✅ 7. Determinar descripción y monto según la política
            $descripcionPolitica = match($venta->politica_pago) {
                'ANTICIPADO_100' => '100% ANTICIPADO',
                'MEDIO_MEDIO' => '50% ANTICIPO',
                'CONTRA_ENTREGA' => 'ABONO CONTRA ENTREGA',
                'CREDITO' => 'CREDITO OTORGADO',  // ✅ NUEVO: Descripción para crédito
                default => 'ANTICIPO'
            };

            // ✅ 7.5 Calcular el vuelto/cambio
            // Si monto_pagado > total, hay cambio que debe restarse de caja
            $cambio = max(0, $venta->monto_pagado - $venta->total);

            // ✅ 8. GARANTIZAR: SIEMPRE registrar movimientos_caja.monto = ventas.total
            // Los detalles_pago_venta son solo para desglose de tipos de pago
            // pero el total en caja SIEMPRE debe ser el total de la venta, no lo que envíe el frontend

            $movimientos = [];
            $totalMovimientos = 0;

            // Obtener los pagos desglosados de la venta
            $detallesPago = $venta->detallesPagoVenta()->with('tipoPago')->get();

            if ($detallesPago->isNotEmpty()) {
                // ✅ GARANTÍA: Sumar detalles y compararlos con total
                $sumaPagos = $detallesPago->sum('monto');

                Log::info('🔍 Validación de montos desglosados vs total', [
                    'venta_id' => $venta->id,
                    'venta_numero' => $venta->numero,
                    'total_venta' => $venta->total,
                    'suma_detalles' => $sumaPagos,
                    'diferencia' => abs($venta->total - $sumaPagos),
                ]);

                // ✅ CORRECCIÓN: Si hay diferencia, ajustar el último detalle
                if (abs($venta->total - $sumaPagos) > 0.01) {
                    $ultimoDetalle = $detallesPago->last();
                    $diferencia = $venta->total - $sumaPagos;
                    $montoCorregido = $ultimoDetalle->monto + $diferencia;

                    Log::warning('⚠️ Diferencia detectada en detalles - ajustando último detalle', [
                        'venta_id' => $venta->id,
                        'venta_numero' => $venta->numero,
                        'diferencia' => $diferencia,
                        'monto_original' => $ultimoDetalle->monto,
                        'monto_corregido' => $montoCorregido,
                    ]);

                    // Reemplazar el monto del último detalle en la colección
                    $detallesPago[$detallesPago->count() - 1]->monto = $montoCorregido;
                }

                // Registrar cada pago desglosado (con montos corregidos si fue necesario)
                foreach ($detallesPago as $detallePago) {
                    $movimiento = MovimientoCaja::create([
                        'caja_id' => $cajaAbierta->caja_id,
                        'user_id' => $usuario->id,
                        'apertura_caja_id' => $cajaAbierta->id,
                        'tipo_operacion_id' => $tipoOperacion->id,
                        'tipo_pago_id' => $detallePago->tipo_pago_id,
                        'numero_documento' => $venta->numero,
                        'monto' => (float) $detallePago->monto,
                        'fecha' => now(),
                        'observaciones' => "Venta #{$venta->numero} ({$descripcionPolitica}) - {$detallePago->tipoPago->nombre}: {$detallePago->monto}",
                        'venta_id' => $venta->id,
                    ]);

                    $movimientos[] = $movimiento;
                    $totalMovimientos += (float) $detallePago->monto;

                    Log::info('✅ Movimiento de pago desglosado registrado', [
                        'venta_id' => $venta->id,
                        'venta_numero' => $venta->numero,
                        'tipo_pago' => $detallePago->tipoPago->nombre,
                        'monto' => $detallePago->monto,
                        'movimiento_id' => $movimiento->id,
                    ]);
                }
            } else {
                // Fallback: si no hay detalles_pago_venta, crear UN SOLO movimiento con el total
                $movimiento = MovimientoCaja::create([
                    'caja_id' => $cajaAbierta->caja_id,
                    'user_id' => $usuario->id,
                    'apertura_caja_id' => $cajaAbierta->id,
                    'tipo_operacion_id' => $tipoOperacion->id,
                    'tipo_pago_id' => $venta->tipo_pago_id,
                    'numero_documento' => $venta->numero,
                    'monto' => (float) $venta->total,
                    'fecha' => now(),
                    'observaciones' => "Venta #{$venta->numero} ({$descripcionPolitica}) - Total: {$venta->total}",
                    'venta_id' => $venta->id,
                ]);

                $movimientos[] = $movimiento;
                $totalMovimientos = (float) $venta->total;

                Log::info('✅ Movimiento registrado (sin detalles desglosados)', [
                    'venta_id' => $venta->id,
                    'venta_numero' => $venta->numero,
                    'monto_registrado' => $venta->total,
                    'movimiento_id' => $movimiento->id,
                ]);
            }

            // ✅ GARANTÍA FINAL: Verificar que la suma de movimientos = total de venta
            if (abs($totalMovimientos - $venta->total) > 0.01) {
                Log::error('❌ CRÍTICO: Discrepancia entre suma de movimientos y total de venta', [
                    'venta_id' => $venta->id,
                    'venta_numero' => $venta->numero,
                    'total_venta' => $venta->total,
                    'suma_movimientos' => $totalMovimientos,
                    'diferencia' => abs($venta->total - $totalMovimientos),
                ]);
            }

            // ✅ 8.5 Si hay cambio/vuelto, registrar como egreso
            if ($cambio > 0) {
                $tipoOperacionVuelto = TipoOperacionCaja::where('codigo', 'VUELTO')->first();

                if ($tipoOperacionVuelto) {
                    $movimientoVuelto = MovimientoCaja::create([
                        'caja_id' => $cajaAbierta->caja_id,
                        'user_id' => $usuario->id,
                        'apertura_caja_id' => $cajaAbierta->id,  // ✅ NUEVO: Asignar apertura directa
                        'tipo_operacion_id' => $tipoOperacionVuelto->id,
                        'numero_documento' => $venta->numero . '-VUELTO',
                        'monto' => -abs($cambio),  // Negativo: egreso
                        'fecha' => now(),
                        'observaciones' => "Vuelto venta #{$venta->numero} - Cambio: {$cambio}",
                        'venta_id' => $venta->id,
                    ]);

                    Log::info('✅ Movimiento de vuelto registrado', [
                        'venta_id' => $venta->id,
                        'venta_numero' => $venta->numero,
                        'monto_pagado' => $venta->monto_pagado,
                        'total_venta' => $venta->total,
                        'cambio_registrado' => $cambio,
                        'movimiento_id' => $movimientoVuelto->id,
                    ]);

                    $movimientos[] = $movimientoVuelto;
                } else {
                    Log::warning('⚠️ TipoOperacionCaja VUELTO no existe - cambio no registrado', [
                        'venta_id' => $venta->id,
                        'venta_numero' => $venta->numero,
                        'cambio' => $cambio,
                    ]);
                }
            }

            // Usar el primer movimiento para la variable de referencia
            $movimiento = $movimientos[0] ?? null;

            // ✅ 9. REGISTRAR EN AUDITORÍA: Éxito
            $accionAuditoria = $esCREDITO ? 'CREDITO_OTORGADO' : 'PAGO_REGISTRADO';
            $netoEnCaja = $totalMovimientos - abs($cambio);

            AuditoriaCaja::create([
                'user_id' => $usuario->id,
                'caja_id' => $cajaAbierta->caja_id,
                'apertura_caja_id' => $cajaAbierta->id,
                'accion' => $accionAuditoria,
                'operacion_intentada' => 'POST /ventas',
                'operacion_tipo' => 'VENTA',
                'exitosa' => true,
                'detalle_operacion' => [
                    'venta_id' => $venta->id,
                    'venta_numero' => $venta->numero,
                    'cantidad_movimientos' => count($movimientos),
                    'movimientos_caja_ids' => array_map(fn($m) => $m->id, $movimientos),
                    'caja_numero' => $cajaAbierta->caja?->nombre,
                    'politica' => $venta->politica_pago,
                    'total_venta' => $venta->total,
                    'monto_pagado_cliente' => $venta->monto_pagado,  // Lo que pagó
                    'cambio' => $cambio,  // Lo que se devuelve
                    'neto_en_caja' => $netoEnCaja,  // Lo que se queda (debe = total_venta)
                    'es_credito' => $esCREDITO,
                    'descripcion_politica' => $descripcionPolitica,
                    'fuente' => 'Venta creada directamente (POST /ventas)',
                ],
                'codigo_http' => 201,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            Log::info('✅ RegisterCajaMovementFromVentaListener - Movimientos desglosados registrados exitosamente', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'caja_id' => $cajaAbierta->caja_id,
                'caja_nombre' => $cajaAbierta->caja?->nombre,
                'usuario_id' => $usuario->id,
                'usuario_nombre' => $usuario->name,
                'cantidad_movimientos' => count($movimientos),
                'total_venta' => $venta->total,
                'monto_pagado_cliente' => $venta->monto_pagado,  // Lo que pagó (40 + 70 = 110)
                'cambio' => $cambio,  // Lo que se devuelve (14)
                'neto_en_caja' => $netoEnCaja,  // Lo que se queda (96)
                'es_credito' => $esCREDITO,
                'politica' => $venta->politica_pago,
                'tipo_pago' => $descripcionPolitica,
                'movimiento_principal_id' => $movimiento?->id,
            ]);

        } catch (\Exception $e) {
            // No bloquear la creación de venta si falla el registro en cajas
            Log::error('❌ RegisterCajaMovementFromVentaListener - Error al registrar movimiento de caja', [
                'venta_id' => $event->venta->id ?? null,
                'venta_numero' => $event->venta->numero ?? null,
                'usuario_id' => $event->venta->usuario_id ?? null,
                'monto' => $event->venta->monto_pagado ?? null,
                'politica' => $event->venta->politica_pago ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // ✅ REGISTRAR EN AUDITORÍA: Error al registrar
            try {
                if ($event->venta) {
                    AuditoriaCaja::create([
                        'user_id' => $event->venta->usuario_id,
                        'caja_id' => null,
                        'apertura_caja_id' => null,
                        'accion' => 'ERROR_REGISTRO_PAGO',
                        'operacion_intentada' => 'POST /ventas',
                        'operacion_tipo' => 'VENTA',
                        'exitosa' => false,
                        'detalle_operacion' => [
                            'venta_id' => $event->venta->id,
                            'venta_numero' => $event->venta->numero,
                            'politica' => $event->venta->politica_pago,
                            'monto_pagado' => $event->venta->monto_pagado,
                        ],
                        'codigo_http' => 500,
                        'mensaje_error' => $e->getMessage(),
                        'ip_address' => request()->ip(),
                        'user_agent' => request()->userAgent(),
                    ]);
                }
            } catch (\Exception $auditError) {
                Log::error('❌ RegisterCajaMovementFromVentaListener - Error al registrar auditoría', [
                    'error_audit' => $auditError->getMessage(),
                ]);
            }

            // ⚠️ Importante: No relanzamos la excepción para no bloquear la creación de venta
            // El movimiento de caja es importante pero la venta ya está creada
        }
    }
}
