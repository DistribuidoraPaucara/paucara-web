<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AperturaCaja;
use App\Models\Caja;
use App\Models\CierreCaja;
use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ChoferCajaController extends Controller
{
    /**
     * GET /api/chofer/cajas/estado
     * Obtener el estado actual de la caja del chofer
     */
    public function obtenerEstado()
    {
        try {
            $user = Auth::user();

            // Buscar caja abierta de hoy
            $apertura = AperturaCaja::where('user_id', $user->id)
                ->whereDate('fecha', today())
                ->doesntHave('cierre') // Sin cierre = abierta
                ->with(['caja', 'cierre'])
                ->first();

            if (!$apertura) {
                return response()->json([
                    'success' => true,
                    'message' => 'No hay caja abierta',
                    'data' => null,
                ]);
            }

            // Convertir AperturaCaja a formato Caja
            $cajaData = [
                'id' => $apertura->caja_id,
                'user_id' => $user->id,
                'fecha_apertura' => $apertura->fecha->toIso8601String(),
                'fecha_cierre' => $apertura->cierre?->fecha_cierre->toIso8601String(),
                'monto_apertura' => (float) $apertura->monto_apertura,
                'montos_cierre' => $apertura->cierre ? (float) $apertura->cierre->montos_cierre : null,
                'diferencia' => $apertura->cierre ? (float) $apertura->cierre->diferencia : 0,
                'estado' => $apertura->cierre ? 'CERRADA' : 'ABIERTA',
                'observaciones' => $apertura->observaciones,
                'created_at' => $apertura->created_at->toIso8601String(),
                'updated_at' => $apertura->updated_at->toIso8601String(),
            ];

            Log::info('📦 [CHOFER_CAJA] Estado de caja obtenido', [
                'user_id' => $user->id,
                'estado' => $cajaData['estado'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Estado de caja obtenido',
                'data' => $cajaData,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ [CHOFER_CAJA] Error obtenerEstado: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estado de caja: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/chofer/cajas/abrir
     * Abrir una caja nueva para el chofer
     */
    public function abrirCaja(Request $request)
    {
        $request->validate([
            'monto_apertura' => 'required|numeric|min:0',
        ]);

        try {
            $user = Auth::user();

            // Verificar que no tenga caja abierta hoy
            $cajaExistente = AperturaCaja::where('user_id', $user->id)
                ->whereDate('fecha', today())
                ->doesntHave('cierre')
                ->first();

            if ($cajaExistente) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ya tienes una caja abierta para el día de hoy.',
                ], 409);
            }

            DB::beginTransaction();

            // Obtener la caja del usuario autenticado
            $caja = Caja::where('user_id', $user->id)
                ->where('activa', true)
                ->first();

            if (!$caja) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes una caja asignada. Contacta con administración.',
                ], 409);
            }

            // Crear apertura de caja
            $apertura = AperturaCaja::create([
                'caja_id' => $caja->id,
                'user_id' => $user->id,
                'monto_apertura' => $request->monto_apertura,
                'fecha' => now(),
            ]);

            // Registrar movimiento de apertura
            $tipoApertura = TipoOperacionCaja::where('codigo', 'APERTURA')->first();
            if ($tipoApertura) {
                MovimientoCaja::create([
                    'caja_id' => $caja->id,
                    'tipo_operacion_id' => $tipoApertura->id,
                    'numero_documento' => null,
                    'descripcion' => 'Apertura de caja',
                    'monto' => 0,
                    'fecha' => now(),
                    'user_id' => $user->id,
                ]);
            }

            DB::commit();

            $cajaData = [
                'id' => $caja->id,
                'user_id' => $user->id,
                'fecha_apertura' => $apertura->fecha->toIso8601String(),
                'fecha_cierre' => null,
                'monto_apertura' => (float) $apertura->monto_apertura,
                'montos_cierre' => null,
                'diferencia' => 0,
                'estado' => 'ABIERTA',
                'observaciones' => null,
                'created_at' => $apertura->created_at->toIso8601String(),
                'updated_at' => $apertura->updated_at->toIso8601String(),
            ];

            Log::info('✅ [CHOFER_CAJA] Caja abierta', [
                'user_id' => $user->id,
                'caja_id' => $caja->id,
                'monto' => $request->monto_apertura,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Caja abierta exitosamente',
                'data' => $cajaData,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('❌ [CHOFER_CAJA] Error abrirCaja: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al abrir caja: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/chofer/cajas/cerrar
     * Cerrar la caja abierta del chofer
     */
    public function cerrarCaja(Request $request)
    {
        $request->validate([
            'montos_cierre' => 'required|numeric|min:0',
            'observaciones' => 'nullable|string|max:500',
        ]);

        try {
            $user = Auth::user();

            // Buscar caja abierta
            $apertura = AperturaCaja::where('user_id', $user->id)
                ->whereDate('fecha', today())
                ->doesntHave('cierre')
                ->first();

            if (!$apertura) {
                return response()->json([
                    'success' => false,
                    'message' => 'No hay caja abierta para cerrar',
                ], 404);
            }

            DB::beginTransaction();

            // Calcular diferencia
            $movimientos = MovimientoCaja::where('caja_id', $apertura->caja_id)
                ->where('user_id', $user->id)
                ->whereDate('fecha', today())
                ->sum('monto');

            $saldoEsperado = $apertura->monto_apertura + $movimientos;
            $diferencia = $request->montos_cierre - $saldoEsperado;

            // Crear cierre de caja
            $cierre = CierreCaja::create([
                'apertura_caja_id' => $apertura->id,
                'montos_cierre' => $request->montos_cierre,
                'diferencia' => $diferencia,
                'observaciones' => $request->observaciones,
                'fecha_cierre' => now(),
                'user_id' => $user->id,
            ]);

            // Registrar movimiento de cierre
            $tipoApertura = TipoOperacionCaja::where('codigo', 'CIERRE')->first();
            if ($tipoApertura) {
                MovimientoCaja::create([
                    'caja_id' => $apertura->caja_id,
                    'tipo_operacion_id' => $tipoApertura->id,
                    'numero_documento' => null,
                    'descripcion' => 'Cierre de caja',
                    'monto' => 0,
                    'fecha' => now(),
                    'user_id' => $user->id,
                ]);
            }

            DB::commit();

            $cajaData = [
                'id' => $apertura->caja_id,
                'user_id' => $user->id,
                'fecha_apertura' => $apertura->fecha->toIso8601String(),
                'fecha_cierre' => $cierre->fecha_cierre->toIso8601String(),
                'monto_apertura' => (float) $apertura->monto_apertura,
                'montos_cierre' => (float) $cierre->montos_cierre,
                'diferencia' => (float) $diferencia,
                'estado' => 'CERRADA',
                'observaciones' => $cierre->observaciones,
                'created_at' => $apertura->created_at->toIso8601String(),
                'updated_at' => $cierre->updated_at->toIso8601String(),
            ];

            Log::info('🔐 [CHOFER_CAJA] Caja cerrada', [
                'user_id' => $user->id,
                'caja_id' => $apertura->caja_id,
                'diferencia' => $diferencia,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Caja cerrada exitosamente',
                'data' => $cajaData,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('❌ [CHOFER_CAJA] Error cerrarCaja: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al cerrar caja: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/chofer/cajas/movimientos
     * Obtener movimientos de la caja abierta
     */
    public function obtenerMovimientos(Request $request)
    {
        try {
            $user = Auth::user();

            // Buscar caja abierta
            $apertura = AperturaCaja::where('user_id', $user->id)
                ->whereDate('fecha', today())
                ->doesntHave('cierre')
                ->first();

            if (!$apertura) {
                return response()->json([
                    'success' => true,
                    'message' => 'No hay caja abierta',
                    'data' => [],
                ]);
            }

            // Obtener movimientos
            $movimientos = MovimientoCaja::where('caja_id', $apertura->caja_id)
                ->where('user_id', $user->id)
                ->whereDate('fecha', today())
                ->with(['tipoOperacion', 'usuario'])
                ->orderBy('id', 'desc')
                ->get();

            Log::info('📋 [CHOFER_CAJA] Movimientos obtenidos', [
                'user_id' => $user->id,
                'cantidad' => $movimientos->count(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Movimientos obtenidos',
                'data' => $movimientos,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ [CHOFER_CAJA] Error obtenerMovimientos: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener movimientos: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/chofer/cajas/resumen
     * Obtener resumen financiero de la caja
     */
    public function obtenerResumen()
    {
        try {
            $user = Auth::user();

            // Buscar caja abierta
            $apertura = AperturaCaja::where('user_id', $user->id)
                ->whereDate('fecha', today())
                ->doesntHave('cierre')
                ->first();

            if (!$apertura) {
                return response()->json([
                    'success' => true,
                    'message' => 'No hay caja abierta',
                    'data' => [
                        'total_ingresos' => 0,
                        'total_egresos' => 0,
                        'saldo_actual' => 0,
                    ],
                ]);
            }

            // Calcular ingresos y egresos
            $movimientos = MovimientoCaja::where('caja_id', $apertura->caja_id)
                ->where('user_id', $user->id)
                ->whereDate('fecha', today())
                ->get();

            $totalIngresos = $movimientos->where('monto', '>', 0)->sum('monto');
            $totalEgresos = abs($movimientos->where('monto', '<', 0)->sum('monto'));
            $saldoActual = $apertura->monto_apertura + $totalIngresos - $totalEgresos;

            Log::info('💰 [CHOFER_CAJA] Resumen obtenido', [
                'user_id' => $user->id,
                'ingresos' => $totalIngresos,
                'egresos' => $totalEgresos,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Resumen obtenido',
                'data' => [
                    'total_ingresos' => $totalIngresos,
                    'total_egresos' => $totalEgresos,
                    'saldo_actual' => $saldoActual,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('❌ [CHOFER_CAJA] Error obtenerResumen: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener resumen: ' . $e->getMessage(),
            ], 500);
        }
    }
}
