<?php

namespace App\Http\Controllers\Api;

use App\Models\Egreso;
use App\Models\DetalleEgreso;
use App\Models\DetallePagoEgreso;
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
     * Crear un egreso
     *
     * REQUEST:
     * {
     *   "tipo_operacion_caja_id": 1,
     *   "descripcion": "Gasto operativo",
     *   "monto_efectivo": 100.00,
     *   "monto_transferencia": 50.00,
     *   "detalles": [
     *     {
     *       "concepto": "Café para oficina",
     *       "cantidad": 1,
     *       "monto_unitario": 50.00,
     *       "descuento": 0,
     *       "subtotal": 50.00
     *     }
     *   ],
     *   "observaciones": null
     * }
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'tipo_operacion_caja_id' => 'required|exists:tipo_operacion_caja,id',
                'descripcion' => 'nullable|string',
                'monto_efectivo' => 'nullable|numeric|min:0',
                'monto_transferencia' => 'nullable|numeric|min:0',
                'detalles' => 'required|array|min:1',
                'detalles.*.concepto' => 'required|string',
                'detalles.*.cantidad' => 'required|numeric|min:1',
                'detalles.*.monto_unitario' => 'required|numeric|min:0',
                'detalles.*.descuento' => 'nullable|numeric|min:0',
                'detalles.*.subtotal' => 'required|numeric|min:0',
                'observaciones' => 'nullable|string',
            ]);

            $montoEfectivo = (float) ($validated['monto_efectivo'] ?? 0);
            $montoTransferencia = (float) ($validated['monto_transferencia'] ?? 0);
            $totalPago = $montoEfectivo + $montoTransferencia;

            // Calcular total de detalles
            $totalDetalles = collect($validated['detalles'])->sum('subtotal');

            if ($totalPago < $totalDetalles - 0.01) {
                return response()->json([
                    'success' => false,
                    'message' => "Pago insuficiente. Total: {$totalDetalles}, Pagado: {$totalPago}",
                ], 422);
            }

            $estadoAprobado = EstadoDocumento::obtenerEstadoAprobado();

            Log::info('💰 [EgresosController::store] Iniciando creación de egreso', [
                'tipo_operacion_caja_id' => $validated['tipo_operacion_caja_id'],
                'monto_efectivo' => $montoEfectivo,
                'monto_transferencia' => $montoTransferencia,
                'cantidad_detalles' => count($validated['detalles']),
                'total' => $totalDetalles,
            ]);

            $egreso = DB::transaction(function () use ($validated, $montoEfectivo, $montoTransferencia, $totalDetalles, $totalPago, $estadoAprobado) {
                // Crear egreso
                $egreso = Egreso::create([
                    'numero' => '0',
                    'tipo_operacion_caja_id' => $validated['tipo_operacion_caja_id'],
                    'estado_documento_id' => $estadoAprobado,
                    'usuario_id' => Auth::id(),
                    'fecha' => today(),
                    'descripcion' => $validated['descripcion'],
                    'subtotal' => $totalDetalles,
                    'descuento' => 0,
                    'impuesto' => 0,
                    'total' => $totalDetalles,
                    'estado_pago' => 'PAGADA',
                    'monto_pagado' => $totalPago,
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

                // Crear detalles
                foreach ($validated['detalles'] as $detalle) {
                    DetalleEgreso::create([
                        'egreso_id' => $egreso->id,
                        'concepto' => $detalle['concepto'],
                        'cantidad' => $detalle['cantidad'],
                        'monto_unitario' => $detalle['monto_unitario'],
                        'descuento' => $detalle['descuento'] ?? 0,
                        'subtotal' => $detalle['subtotal'],
                    ]);
                }

                Log::info('✅ [EgresosController::store] Detalles creados', [
                    'egreso_id' => $egreso->id,
                    'cantidad_detalles' => count($validated['detalles']),
                ]);

                // Crear pagos - EFECTIVO
                if ($montoEfectivo > 0) {
                    DetallePagoEgreso::create([
                        'egreso_id' => $egreso->id,
                        'tipo_pago_id' => 1, // EFECTIVO
                        'monto' => $montoEfectivo,
                        'fecha_pago' => now(),
                    ]);

                    Log::info('✅ [EgresosController::store] Pago EFECTIVO registrado', [
                        'egreso_id' => $egreso->id,
                        'monto' => $montoEfectivo,
                    ]);
                }

                // Crear pagos - TRANSFERENCIA
                if ($montoTransferencia > 0) {
                    $tipoPagoTransferencia = TipoPago::where('codigo', 'TRANSFERENCIA')
                        ->orWhere('codigo', 'QR')
                        ->first();

                    if ($tipoPagoTransferencia) {
                        DetallePagoEgreso::create([
                            'egreso_id' => $egreso->id,
                            'tipo_pago_id' => $tipoPagoTransferencia->id,
                            'monto' => $montoTransferencia,
                            'fecha_pago' => now(),
                        ]);

                        Log::info('✅ [EgresosController::store] Pago TRANSFERENCIA registrado', [
                            'egreso_id' => $egreso->id,
                            'monto' => $montoTransferencia,
                        ]);
                    }
                }

                // Registrar movimiento en caja (SALIDA = negativo)
                $cajaAbierta = AperturaCaja::where('user_id', Auth::id())
                    ->abiertas()
                    ->latest('fecha')
                    ->first();

                if ($cajaAbierta) {
                    // Movimiento de SALIDA (negativo)
                    MovimientoCaja::create([
                        'caja_id' => $cajaAbierta->caja_id,
                        'user_id' => Auth::id(),
                        'fecha' => now(),
                        'monto' => -$totalPago, // Negativo para indicar SALIDA
                        'observaciones' => "Egreso #{$egreso->numero}",
                        'numero_documento' => $egreso->numero,
                        'tipo_operacion_id' => $egreso->tipo_operacion_caja_id,
                        'egreso_id' => $egreso->id,
                    ]);

                    Log::info('✅ [EgresosController::store] Movimiento de SALIDA registrado en caja', [
                        'egreso_id' => $egreso->id,
                        'monto' => -$totalPago,
                        'caja_id' => $cajaAbierta->caja_id,
                    ]);
                } else {
                    Log::warning('⚠️ [EgresosController::store] No hay caja abierta', [
                        'user_id' => Auth::id(),
                    ]);
                }

                return $egreso;
            });

            Log::info('🎉 [EgresosController::store] Egreso creado exitosamente', [
                'egreso_id' => $egreso->id,
                'total' => $egreso->total,
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
        $egreso->load(['tipoOperacion', 'estadoDocumento', 'usuario', 'detalles', 'detallesPago']);

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

                // Eliminar movimientos de caja asociados
                MovimientoCaja::where('egreso_id', $egreso->id)->delete();

                Log::info('🧹 [EgresosController::anular] Egreso anulado', [
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
