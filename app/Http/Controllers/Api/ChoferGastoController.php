<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGastoRequest;
use App\Models\AperturaCaja;
use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ChoferGastoController extends Controller
{
    /**
     * POST /api/cajas/gastos
     * Registrar un gasto
     */
    public function store(Request $request)
    {
        $request->validate([
            'monto' => 'required|numeric|min:0.01',
            'descripcion' => 'required|string|max:255',
            'categoria' => 'required|in:TRANSPORTE,LIMPIEZA,MANTENIMIENTO,SERVICIOS,VARIOS',
            'numero_comprobante' => 'nullable|string|max:50',
            'proveedor' => 'nullable|string|max:100',
            'observaciones' => 'nullable|string|max:500',
        ]);

        try {
            $user = Auth::user();

            // Verificar que tenga caja abierta
            $apertura = AperturaCaja::where('user_id', $user->id)
                ->whereDate('fecha', today())
                ->doesntHave('cierre')
                ->first();

            if (!$apertura) {
                return response()->json([
                    'success' => false,
                    'message' => 'Debe tener una caja abierta para registrar gastos',
                ], 409);
            }

            DB::beginTransaction();

            // Obtener tipo de operación GASTO
            $tipoGasto = TipoOperacionCaja::where('codigo', 'GASTO')->first();

            if (!$tipoGasto) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Tipo de operación GASTO no configurado',
                ], 500);
            }

            // Crear movimiento de gasto (monto negativo)
            $movimiento = MovimientoCaja::create([
                'caja_id' => $apertura->caja_id,
                'tipo_operacion_id' => $tipoGasto->id,
                'numero_documento' => $request->numero_comprobante,
                'descripcion' => "[{$request->categoria}] {$request->descripcion}",
                'monto' => -abs($request->monto),
                'fecha' => now(),
                'user_id' => $user->id,
                'observaciones' => $request->observaciones,
            ]);

            DB::commit();

            Log::info('✅ [CHOFER_GASTO] Gasto registrado', [
                'user_id' => $user->id,
                'movimiento_id' => $movimiento->id,
                'monto' => $request->monto,
                'categoria' => $request->categoria,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Gasto registrado correctamente',
                'data' => [
                    'id' => $movimiento->id,
                    'caja_id' => $apertura->caja_id,
                    'monto' => abs($request->monto),
                    'descripcion' => $request->descripcion,
                    'categoria' => $request->categoria,
                    'numero_comprobante' => $request->numero_comprobante,
                    'proveedor' => $request->proveedor,
                    'observaciones' => $request->observaciones,
                    'fecha' => $movimiento->fecha,
                    'created_at' => $movimiento->created_at,
                    'updated_at' => $movimiento->updated_at,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('❌ [CHOFER_GASTO] Error registrarGasto: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar gasto: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/cajas/gastos
     * Obtener gastos del chofer
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();

            $query = MovimientoCaja::whereHas('tipoOperacion', fn($q) => $q->where('codigo', 'GASTO'))
                ->where('user_id', $user->id)
                ->with(['tipoOperacion', 'usuario', 'caja'])
                ->when($request->fecha_desde, fn($q) => $q->whereDate('fecha', '>=', $request->fecha_desde))
                ->when($request->fecha_hasta, fn($q) => $q->whereDate('fecha', '<=', $request->fecha_hasta))
                ->when($request->q, function ($q) use ($request) {
                    $q->where('descripcion', 'LIKE', "%{$request->q}%")
                      ->orWhere('numero_documento', 'LIKE', "%{$request->q}%");
                });

            $gastos = $query->orderBy('fecha', 'desc')->paginate(15);

            Log::info('📋 [CHOFER_GASTO] Gastos listados', [
                'user_id' => $user->id,
                'cantidad' => $gastos->count(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Gastos obtenidos',
                'data' => $gastos->items(),
                'pagination' => [
                    'current_page' => $gastos->currentPage(),
                    'per_page' => $gastos->perPage(),
                    'total' => $gastos->total(),
                    'last_page' => $gastos->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('❌ [CHOFER_GASTO] Error index: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener gastos: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * DELETE /api/cajas/gastos/{id}
     * Eliminar un gasto
     */
    public function destroy($id)
    {
        try {
            $user = Auth::user();

            $movimiento = MovimientoCaja::where('id', $id)
                ->where('user_id', $user->id)
                ->whereHas('tipoOperacion', fn($q) => $q->where('codigo', 'GASTO'))
                ->firstOrFail();

            DB::beginTransaction();
            $movimiento->delete();
            DB::commit();

            Log::info('🗑️ [CHOFER_GASTO] Gasto eliminado', [
                'user_id' => $user->id,
                'movimiento_id' => $id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Gasto eliminado correctamente',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gasto no encontrado',
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('❌ [CHOFER_GASTO] Error destroy: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar gasto: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/cajas/gastos/estadisticas
     * Obtener estadísticas de gastos
     */
    public function estadisticas(Request $request)
    {
        try {
            $user = Auth::user();

            $query = MovimientoCaja::whereHas('tipoOperacion', fn($q) => $q->where('codigo', 'GASTO'))
                ->where('user_id', $user->id)
                ->when($request->fecha_desde, fn($q) => $q->whereDate('fecha', '>=', $request->fecha_desde))
                ->when($request->fecha_hasta, fn($q) => $q->whereDate('fecha', '<=', $request->fecha_hasta));

            $totalGasto = abs($query->sum('monto'));
            $cantidadGastos = $query->count();

            Log::info('📊 [CHOFER_GASTO] Estadísticas obtenidas', [
                'user_id' => $user->id,
                'total_gasto' => $totalGasto,
                'cantidad' => $cantidadGastos,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Estadísticas obtenidas',
                'data' => [
                    'total_gasto' => $totalGasto,
                    'cantidad_gastos' => $cantidadGastos,
                    'por_categoria' => [],
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('❌ [CHOFER_GASTO] Error estadisticas: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas: ' . $e->getMessage(),
            ], 500);
        }
    }
}
