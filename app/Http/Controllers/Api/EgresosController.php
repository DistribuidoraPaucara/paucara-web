<?php

namespace App\Http\Controllers\Api;

use App\Models\Egreso;
use App\Models\DetalleEgreso;
use App\Models\EstadoDocumento;
use App\Models\TipoOperacionCaja;
use App\Models\TipoPago;
use App\Models\MovimientoCaja;
use App\Models\AperturaCaja;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class EgresosController extends Controller
{
    /**
     * Listar egresos
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);

        $egresos = Egreso::with([
            'tipoOperacion',
            'estadoDocumento',
            'usuario',
            'detalles',
            'detallesPago'
        ])
        ->orderBy('fecha', 'desc')
        ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $egresos,
        ]);
    }

    /**
     * Crear un egreso - ESTRUCTURA SIMPLIFICADA
     * Cada detalle solo lleva: concepto, tipo_operacion_caja, monto_efectivo y monto_transferencia
     * Cada detalle creará su propio movimiento_caja
     *
     * REQUEST:
     * {
     *   "descripcion": "Gastos operativos",
     *   "detalles": [
     *     {
     *       "concepto": "Café",
     *       "tipo_operacion_caja_id": 1,
     *       "monto_efectivo": 50.00,
     *       "monto_transferencia": 0
     *     },
     *     {
     *       "concepto": "Papel",
     *       "tipo_operacion_caja_id": 2,
     *       "monto_efectivo": 0,
     *       "monto_transferencia": 60.00
     *     }
     *   ],
     *   "observaciones": null
     * }
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'descripcion' => 'nullable|string',
                'detalles' => 'required|array|min:1',
                'detalles.*.concepto' => 'required|string',
                'detalles.*.tipo_operacion_caja_id' => 'required|exists:tipo_operacion_caja,id',
                'detalles.*.monto_efectivo' => 'nullable|numeric|min:0',
                'detalles.*.monto_transferencia' => 'nullable|numeric|min:0',
                'observaciones' => 'nullable|string',
            ]);

            // Calcular totales por detalle
            $totalEgreso = 0;
            foreach ($validated['detalles'] as $detalle) {
                $montoEfectivo = (float) ($detalle['monto_efectivo'] ?? 0);
                $montoTransferencia = (float) ($detalle['monto_transferencia'] ?? 0);
                $totalPago = $montoEfectivo + $montoTransferencia;

                if ($totalPago <= 0) {
                    return response()->json([
                        'success' => false,
                        'message' => "Detalle '{$detalle['concepto']}': Debe ingresar al menos un monto (efectivo o transferencia)",
                    ], 422);
                }

                $totalEgreso += $totalPago;
            }

            $estadoAprobado = EstadoDocumento::obtenerEstadoAprobado();

            Log::info('💰 [EgresosController::store] Iniciando creación de egreso con detalles granulares', [
                'cantidad_detalles' => count($validated['detalles']),
                'total' => $totalEgreso,
            ]);

            $egreso = DB::transaction(function () use ($validated, $totalEgreso, $estadoAprobado) {
                // Crear egreso (cabecera)
                $egreso = Egreso::create([
                    'numero' => '0',
                    'tipo_operacion_caja_id' => $validated['detalles'][0]['tipo_operacion_caja_id'], // Del primer detalle
                    'estado_documento_id' => $estadoAprobado,
                    'usuario_id' => Auth::id(),
                    'fecha' => today(),
                    'descripcion' => $validated['descripcion'],
                    'subtotal' => $totalEgreso,
                    'descuento' => 0,
                    'impuesto' => 0,
                    'total' => $totalEgreso,
                    'estado_pago' => 'PAGADA',
                    'monto_pagado' => $totalEgreso,
                    'monto_pendiente' => 0,
                    'observaciones' => $validated['observaciones'],
                ]);

                // Asignar número
                $numero = 'EGRE' . now()->format('Ymd') . '-' . str_pad($egreso->id, 4, '0', STR_PAD_LEFT);
                $egreso->update(['numero' => $numero]);

                Log::info('✅ [EgresosController::store] Egreso creado', [
                    'egreso_id' => $egreso->id,
                    'numero' => $egreso->numero,
                ]);

                // Obtener caja abierta una sola vez
                $cajaAbierta = AperturaCaja::where('user_id', Auth::id())
                    ->abiertas()
                    ->latest('fecha')
                    ->first();

                // Procesar cada detalle
                foreach ($validated['detalles'] as $detalle) {
                    $montoEfectivo = (float) ($detalle['monto_efectivo'] ?? 0);
                    $montoTransferencia = (float) ($detalle['monto_transferencia'] ?? 0);
                    $totalPago = $montoEfectivo + $montoTransferencia;

                    // Crear detalle (simplificado: sin cantidad, monto_unitario, descuento)
                    $detalleEgreso = DetalleEgreso::create([
                        'egreso_id' => $egreso->id,
                        'concepto' => $detalle['concepto'],
                        'cantidad' => 1, // Default: 1 unidad
                        'monto_unitario' => $totalPago, // El monto unitario es el total del detalle
                        'descuento' => 0,
                        'subtotal' => $totalPago,
                        'tipo_operacion_caja_id' => $detalle['tipo_operacion_caja_id'],
                        'monto_efectivo' => $montoEfectivo,
                        'monto_transferencia' => $montoTransferencia,
                    ]);

                    Log::info('✅ [EgresosController::store] Detalle creado', [
                        'detalle_id' => $detalleEgreso->id,
                        'concepto' => $detalle['concepto'],
                        'subtotal' => $totalPago,
                    ]);

                    // Crear movimiento en caja si hay caja abierta
                    if ($cajaAbierta) {
                        // Movimiento de SALIDA (negativo) - Un movimiento por detalle
                        MovimientoCaja::create([
                            'caja_id' => $cajaAbierta->caja_id,
                            'user_id' => Auth::id(),
                            'fecha' => now(),
                            'monto' => -$totalPago, // Negativo para indicar SALIDA
                            'observaciones' => "Detalle: {$detalle['concepto']} (Egreso #{$egreso->numero})",
                            'numero_documento' => $egreso->numero,
                            'tipo_operacion_id' => $detalle['tipo_operacion_caja_id'],
                            'egreso_id' => $egreso->id,
                        ]);

                        Log::info('✅ [EgresosController::store] Movimiento de caja creado para detalle', [
                            'concepto' => $detalle['concepto'],
                            'monto' => -$totalPago,
                            'tipo_operacion_id' => $detalle['tipo_operacion_caja_id'],
                        ]);
                    }
                }

                if (!$cajaAbierta) {
                    Log::warning('⚠️ [EgresosController::store] No hay caja abierta para registrar movimientos', [
                        'user_id' => Auth::id(),
                        'egreso_id' => $egreso->id,
                    ]);
                }

                return $egreso;
            });

            Log::info('🎉 [EgresosController::store] Egreso con detalles granulares creado exitosamente', [
                'egreso_id' => $egreso->id,
                'total' => $egreso->total,
                'cantidad_detalles' => count($validated['detalles']),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Egreso registrado exitosamente',
                'egreso_id' => $egreso->id,
                'numero' => $egreso->numero,
                'total' => $egreso->total,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('❌ [EgresosController::store] Validación fallida', [
                'errors' => $e->errors(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ [EgresosController::store] Error al crear egreso', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al guardar el egreso: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mostrar un egreso
     */
    public function show(Egreso $egreso): JsonResponse
    {
        $egreso->load([
            'tipoOperacion',
            'estadoDocumento',
            'usuario',
            'detalles.tipoOperacion',
            'detallesPago.tipoPago'
        ]);

        return response()->json([
            'success' => true,
            'data' => $egreso,
        ]);
    }

    /**
     * Anular un egreso
     */
    public function anular(Egreso $egreso): JsonResponse
    {
        try {
            if ($egreso->estadoDocumento->codigo === 'ANULADO') {
                return response()->json([
                    'success' => false,
                    'message' => 'El egreso ya está anulado',
                ], 422);
            }

            $estadoAnulado = EstadoDocumento::where('codigo', 'ANULADO')->first();

            DB::transaction(function () use ($egreso, $estadoAnulado) {
                // Actualizar estado
                $egreso->update([
                    'estado_documento_id' => $estadoAnulado->id,
                    'estado_pago' => 'PENDIENTE',
                    'monto_pagado' => 0,
                    'monto_pendiente' => $egreso->total,
                ]);

                // Eliminar movimientos de caja asociados (ahora hay uno por detalle)
                MovimientoCaja::where('egreso_id', $egreso->id)->delete();

                Log::info('🧹 [EgresosController::anular] Egreso anulado - Movimientos de caja eliminados', [
                    'egreso_id' => $egreso->id,
                    'numero' => $egreso->numero,
                ]);
            });

            return response()->json([
                'success' => true,
                'message' => 'Egreso anulado exitosamente',
            ]);
        } catch (\Exception $e) {
            Log::error('❌ [EgresosController::anular] Error al anular', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al anular el egreso: ' . $e->getMessage(),
            ], 500);
        }
    }
}
