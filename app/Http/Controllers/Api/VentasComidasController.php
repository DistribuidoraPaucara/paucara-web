<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\DetallePagoVenta;
use App\Models\EstadoDocumento;
use App\Models\EstadoLogistica;
use App\Models\Moneda;
use App\Models\Producto;
use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;
use App\Models\Caja;
use App\Models\AperturaCaja;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VentasComidasController extends Controller
{
    /**
     * Crear una venta de comidas/helados
     *
     * FLUJO:
     * 1. Validar productos y cantidades
     * 2. Crear Venta
     * 3. Crear DetalleVenta para cada producto
     * 4. Crear DetallePagoVenta para EFECTIVO (si monto_efectivo > 0)
     * 5. Crear DetallePagoVenta para TRANSFERENCIA (si monto_transferencia > 0)
     *
     * REQUEST:
     * {
     *   "cliente_id": 1 | null (optional),
     *   "tipo_pago_id": 2,
     *   "monto_efectivo": 35.00,
     *   "monto_transferencia": 35.00,
     *   "productos_comida": [
     *     {
     *       "producto_id": 1,
     *       "nombre": "Helado Acaí",
     *       "precio_base": 25.00,
     *       "adicionales_ids": [1, 3],
     *       "cantidad": 2,
     *       "subtotal": 60.00
     *     }
     *   ],
     *   "total": 70.00,
     *   "observaciones": null
     * }
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validar datos básicos
            $validated = $request->validate([
                'cliente_id'            => 'nullable|exists:clientes,id',
                'tipo_pago_id'          => 'required|exists:tipos_pago,id',
                'monto_efectivo'        => 'nullable|numeric|min:0',
                'monto_transferencia'   => 'nullable|numeric|min:0',
                'productos_comida'      => 'required|array|min:1',
                'productos_comida.*.producto_id' => 'required|exists:productos,id',
                'productos_comida.*.nombre' => 'required|string',
                'productos_comida.*.precio_base' => 'required|numeric|min:0',
                'productos_comida.*.cantidad' => 'required|numeric|min:1',
                'productos_comida.*.subtotal' => 'required|numeric|min:0',
                'total' => 'required|numeric|min:0',
                'observaciones' => 'nullable|string',
            ]);

            // Convertir valores null a 0
            $montoEfectivo = (float) ($validated['monto_efectivo'] ?? 0);
            $montoTransferencia = (float) ($validated['monto_transferencia'] ?? 0);
            $totalPago = $montoEfectivo + $montoTransferencia;
            $totalVenta = (float) $validated['total'];

            // Validar que el pago sea >= al total de la venta (permitir cambio)
            if ($totalPago < $totalVenta - 0.01) { // Pequeña tolerancia por redondeo
                return response()->json([
                    'success' => false,
                    'message' => "Pago insuficiente. Total: {$totalVenta}, Pagado: {$totalPago}",
                ], 422);
            }

            // Calcular vuelto (cambio)
            $vuelto = $totalPago - $totalVenta;

            // 💳 Determinar tipo_pago_id: si hay múltiples pagos, usar MIXTO (id 4)
            $tipoPagoIdFinal = $validated['tipo_pago_id'];
            if ($montoEfectivo > 0 && $montoTransferencia > 0) {
                // Hay pagos en efectivo Y transferencia → usar MIXTO
                $tipoPagoMixto = \App\Models\TipoPago::where('codigo', 'MIXTO')
                    ->orWhere('id', 4)
                    ->first();
                if ($tipoPagoMixto) {
                    $tipoPagoIdFinal = $tipoPagoMixto->id;
                }
            }

            Log::info('🍦 [VentasComidasController::store] Iniciando creación de venta de comidas', [
                'cliente_id' => $validated['cliente_id'],
                'tipo_pago_id_original' => $validated['tipo_pago_id'],
                'tipo_pago_id_final' => $tipoPagoIdFinal,
                'monto_efectivo' => $montoEfectivo,
                'monto_transferencia' => $montoTransferencia,
                'cantidad_productos' => count($validated['productos_comida']),
                'total' => $validated['total'],
            ]);

            // Validar que todos los productos son de comida
            $productosIds = collect($validated['productos_comida'])->pluck('producto_id')->unique();
            $productosValidar = Producto::whereIn('id', $productosIds)->get();

            foreach ($productosValidar as $producto) {
                if (!$producto->es_producto_comida) {
                    return response()->json([
                        'success' => false,
                        'message' => "Producto '{$producto->nombre}' no es un producto de comida",
                    ], 422);
                }
            }

            // Obtener caja del usuario actual (para comidas PRESENCIAL)
            $cajaUsuario = AperturaCaja::where('user_id', Auth::id())
                ->abiertas()
                ->latest('fecha')
                ->first();

            // Crear dentro de una transacción
            $venta = DB::transaction(function () use ($validated, $montoEfectivo, $montoTransferencia, $totalVenta, $totalPago, $vuelto, $cajaUsuario, $tipoPagoIdFinal) {
                // ✅ Ventas de comidas se crean directamente APROBADAS (se pagan inmediatamente)
                $estadoAprobado = EstadoDocumento::obtenerEstadoAprobado();

                // Obtener estado logístico SIN_ENTREGA
                $estadoSinEntrega = EstadoLogistica::where('codigo', 'SIN_ENTREGA')
                    ->where('categoria', 'venta_logistica')
                    ->first();

                // Obtener moneda por defecto (BOB)
                $monedaDefecto = Moneda::where('codigo', 'BOB')->first() ??
                    Moneda::first();

                // Crear Venta
                $venta = Venta::create([
                    'numero'                 => '0', // Se asignará después
                    'cliente_id'             => $validated['cliente_id'],
                    'usuario_id'             => Auth::id(),
                    'fecha'                  => today(),
                    'subtotal'               => $validated['total'],
                    'descuento'              => 0,
                    'impuesto'               => 0,
                    'total'                  => $validated['total'],
                    'observaciones'          => $validated['observaciones'],
                    'estado_documento_id'    => $estadoAprobado,
                    'moneda_id'              => $monedaDefecto->id,
                    'tipo_pago_id'           => $tipoPagoIdFinal, // ✅ Usar tipo_pago_id determinado (puede ser MIXTO)
                    'estado_logistico_id'    => $estadoSinEntrega?->id,
                    'requiere_envio'         => false, // Comidas no requieren envío
                    'canal_origen'           => 'PRESENCIAL', // ✅ Venta presencial
                    'politica_pago'          => 'ANTICIPADO_100', // ✅ Se paga el 100% al crear
                    'estado_pago'            => 'PAGADA', // ✅ Se paga completamente al crear
                    'monto_pagado'           => $totalPago, // ✅ Lo que realmente pagó (efectivo + transferencia)
                    'monto_pendiente'        => 0, // ✅ No hay monto pendiente
                    'caja_id'                => $cajaUsuario?->caja_id, // ✅ Asignar a caja del usuario
                ]);

                // ✅ Asignar número con formato estándar: VEN20260502-0001
                $numeroVenta = 'VEN' . now()->format('Ymd') . '-' . str_pad($venta->id, 4, '0', STR_PAD_LEFT);
                $venta->update(['numero' => $numeroVenta]);

                Log::info('✅ [VentasComidasController::store] Venta creada', [
                    'venta_id' => $venta->id,
                    'numero' => $venta->numero,
                    'canal' => $venta->canal_origen,
                    'politica_pago' => $venta->politica_pago,
                    'caja_id' => $venta->caja_id,
                    'monto_pendiente' => $venta->monto_pendiente,
                ]);

                // Crear DetalleVenta para cada producto
                foreach ($validated['productos_comida'] as $producto) {
                    DetalleVenta::create([
                        'venta_id'       => $venta->id,
                        'producto_id'    => $producto['producto_id'],
                        'cantidad'       => $producto['cantidad'],
                        'precio_unitario' => $producto['precio_base'],
                        'descuento'      => 0,
                        'subtotal'       => $producto['subtotal'],
                    ]);
                }

                Log::info('✅ [VentasComidasController::store] Detalles de venta creados', [
                    'venta_id' => $venta->id,
                    'cantidad_detalles' => count($validated['productos_comida']),
                ]);

                // 💰 Crear DetallePagoVenta para EFECTIVO (si tiene monto)
                if ($montoEfectivo > 0) {
                    DetallePagoVenta::create([
                        'venta_id'     => $venta->id,
                        'tipo_pago_id' => $validated['tipo_pago_id'],
                        'monto'        => $montoEfectivo,
                        'fecha_pago'   => now(),
                    ]);

                    Log::info('✅ [VentasComidasController::store] Detalle de pago EFECTIVO creado', [
                        'venta_id' => $venta->id,
                        'monto_efectivo' => $montoEfectivo,
                    ]);
                }

                // 💳 Crear DetallePagoVenta para TRANSFERENCIA (si tiene monto)
                if ($montoTransferencia > 0) {
                    // Buscar tipo de pago para TRANSFERENCIA/QR
                    $tipoPagoTransferencia = \App\Models\TipoPago::where('codigo', 'TRANSFERENCIA')
                        ->orWhere('codigo', 'QR')
                        ->first();

                    if (!$tipoPagoTransferencia) {
                        // Si no existe, intentar con "TRANSFERENCIA" en el nombre
                        $tipoPagoTransferencia = \App\Models\TipoPago::where('nombre', 'LIKE', '%TRANSFERENCIA%')
                            ->orWhere('nombre', 'LIKE', '%QR%')
                            ->first();
                    }

                    if ($tipoPagoTransferencia) {
                        DetallePagoVenta::create([
                            'venta_id'     => $venta->id,
                            'tipo_pago_id' => $tipoPagoTransferencia->id,
                            'monto'        => $montoTransferencia,
                            'fecha_pago'   => now(),
                        ]);

                        Log::info('✅ [VentasComidasController::store] Detalle de pago TRANSFERENCIA creado', [
                            'venta_id' => $venta->id,
                            'monto_transferencia' => $montoTransferencia,
                            'tipo_pago_id' => $tipoPagoTransferencia->id,
                        ]);
                    } else {
                        Log::warning('⚠️ [VentasComidasController::store] No se encontró tipo de pago TRANSFERENCIA/QR', [
                            'venta_id' => $venta->id,
                        ]);
                    }
                }

                // 💵 Log del vuelto si aplica
                if ($vuelto > 0.01) {
                    Log::info('💵 [VentasComidasController::store] VUELTO A ENTREGAR', [
                        'venta_id' => $venta->id,
                        'vuelto' => $vuelto,
                    ]);
                }

                // 📊 Registrar movimientos en la caja
                $cajaAbierta = AperturaCaja::where('user_id', Auth::id())
                    ->abiertas()
                    ->latest('fecha')
                    ->first();

                if ($cajaAbierta) {
                    $tipoVenta = TipoOperacionCaja::where('codigo', TipoOperacionCaja::VENTA)->first();

                    // Registrar movimiento EFECTIVO si aplica
                    if ($montoEfectivo > 0) {
                        MovimientoCaja::create([
                            'caja_id' => $cajaAbierta->caja_id,
                            'user_id' => Auth::id(),
                            'fecha' => now(),
                            'monto' => $montoEfectivo,
                            'observaciones' => "Venta de comidas #{$venta->numero}",
                            'numero_documento' => $venta->numero,
                            'tipo_operacion_id' => $tipoVenta?->id,
                            'tipo_pago_id' => $validated['tipo_pago_id'],
                            'venta_id' => $venta->id,
                        ]);

                        Log::info('✅ [VentasComidasController::store] Movimiento EFECTIVO registrado en caja', [
                            'venta_id' => $venta->id,
                            'monto_efectivo' => $montoEfectivo,
                            'caja_id' => $cajaAbierta->caja_id,
                        ]);
                    }

                    // Registrar movimiento TRANSFERENCIA si aplica
                    if ($montoTransferencia > 0) {
                        MovimientoCaja::create([
                            'caja_id' => $cajaAbierta->caja_id,
                            'user_id' => Auth::id(),
                            'fecha' => now(),
                            'monto' => $montoTransferencia,
                            'observaciones' => "Venta de comidas #{$venta->numero} (Transferencia/QR)",
                            'numero_documento' => $venta->numero,
                            'tipo_operacion_id' => $tipoVenta?->id,
                            'tipo_pago_id' => $validated['tipo_pago_id'],
                            'venta_id' => $venta->id,
                        ]);

                        Log::info('✅ [VentasComidasController::store] Movimiento TRANSFERENCIA registrado en caja', [
                            'venta_id' => $venta->id,
                            'monto_transferencia' => $montoTransferencia,
                            'caja_id' => $cajaAbierta->caja_id,
                        ]);
                    }
                } else {
                    Log::warning('⚠️ [VentasComidasController::store] No hay caja abierta para registrar movimientos', [
                        'user_id' => Auth::id(),
                        'venta_id' => $venta->id,
                    ]);
                }

                return $venta;
            });

            Log::info('🎉 [VentasComidasController::store] Venta de comidas creada exitosamente', [
                'venta_id' => $venta->id,
                'total' => $venta->total,
                'total_pagado' => $totalPago,
                'vuelto' => $vuelto,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Venta de comidas registrada exitosamente',
                'ventaId' => $venta->id,
                'numero' => $venta->numero,
                'total' => $venta->total,
                'pagado' => $totalPago,
                'vuelto' => $vuelto > 0 ? $vuelto : 0,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('❌ [VentasComidasController::store] Validación fallida', [
                'errors' => $e->errors(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ [VentasComidasController::store] Error al crear venta', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al guardar la venta: ' . $e->getMessage(),
            ], 500);
        }
    }
}
