<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ApiVentaController extends Controller
{
    /**
     * Cliente confirma que está listo para retirar el pedido
     *
     * POST /api/ventas/{venta}/confirmar-pickup-cliente
     *
     * @param Request $request
     * @param Venta $venta
     * @return \Illuminate\Http\JsonResponse
     */
    public function confirmarPickupCliente(Request $request, Venta $venta)
    {
        try {
            // Validar que es un pedido PICKUP
            if (!$venta->esPickup()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este pedido no es de tipo PICKUP',
                    'tipo_entrega' => $venta->tipo_entrega,
                ], 422);
            }

            // Validar que el estado es PENDIENTE_RETIRO
            if ($venta->estado_logistico_id !== Venta::obtenerIdEstado('PENDIENTE_RETIRO', 'venta_logistica')) {
                $estadoActual = $venta->estadoLogistica?->nombre ?? 'Desconocido';
                return response()->json([
                    'success' => false,
                    'message' => "El pedido no está en estado de PENDIENTE_RETIRO. Estado actual: {$estadoActual}",
                    'estado_actual' => $estadoActual,
                ], 422);
            }

            // Validar que el usuario sea el cliente propietario del pedido
            $clienteId = $venta->cliente_id;
            $usuarioActual = Auth::id();

            if ($clienteId !== $usuarioActual) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permiso para confirmar este pedido',
                ], 403);
            }

            // Validar que el cliente pueda confirmar (sin confirmación previa)
            if (!$venta->puedeConfirmarsePickupPorCliente()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este pedido ya ha sido confirmado por el cliente',
                    'pickup_confirmado_cliente_en' => $venta->pickup_confirmado_cliente_en,
                ], 422);
            }

            // Marcar confirmación del cliente
            $venta->update([
                'pickup_confirmado_cliente_en' => now(),
                'pickup_confirmado_cliente_por_id' => $usuarioActual,
            ]);

            // Si también está confirmado por empleado, cambiar estado a RETIRADO
            if ($venta->pickupCompletamenteConfirmado()) {
                $estadoRetiradoId = Venta::obtenerIdEstado('RETIRADO', 'venta_logistica');
                $venta->update([
                    'estado_logistico_id' => $estadoRetiradoId,
                ]);

                Log::info("Pickup completamente confirmado para venta {$venta->id}", [
                    'cliente_confirmado_en' => $venta->pickup_confirmado_cliente_en,
                    'empleado_confirmado_en' => $venta->pickup_confirmado_empleado_en,
                    'nuevo_estado' => 'RETIRADO',
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Confirmación de pickup registrada correctamente',
                'venta' => [
                    'id' => $venta->id,
                    'numero_venta' => $venta->numero_venta,
                    'tipo_entrega' => $venta->tipo_entrega,
                    'pickup_confirmado_cliente_en' => $venta->pickup_confirmado_cliente_en,
                    'pickup_confirmado_empleado_en' => $venta->pickup_confirmado_empleado_en,
                    'pickup_completamente_confirmado' => $venta->pickupCompletamenteConfirmado(),
                    'estado_logistico' => $venta->estadoLogistica?->nombre,
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error("Error en confirmarPickupCliente para venta {$venta->id}: {$e->getMessage()}", [
                'exception' => $e,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la confirmación de pickup',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Empleado del almacén confirma que el cliente retiró el pedido
     *
     * POST /api/ventas/{venta}/confirmar-pickup-empleado
     *
     * @param Request $request
     * @param Venta $venta
     * @return \Illuminate\Http\JsonResponse
     */
    public function confirmarPickupEmpleado(Request $request, Venta $venta)
    {
        try {
            // Validar que es un pedido PICKUP
            if (!$venta->esPickup()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este pedido no es de tipo PICKUP',
                    'tipo_entrega' => $venta->tipo_entrega,
                ], 422);
            }

            // Validar que el estado es PENDIENTE_RETIRO
            if ($venta->estado_logistico_id !== Venta::obtenerIdEstado('PENDIENTE_RETIRO', 'venta_logistica')) {
                $estadoActual = $venta->estadoLogistica?->nombre ?? 'Desconocido';
                return response()->json([
                    'success' => false,
                    'message' => "El pedido no está en estado de PENDIENTE_RETIRO. Estado actual: {$estadoActual}",
                    'estado_actual' => $estadoActual,
                ], 422);
            }

            // Validar que el usuario sea empleado/administrador con permiso de almacén
            $usuarioActual = Auth::user();
            if (!$usuarioActual || !$this->tienePermisoAlmacen($usuarioActual)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permisos para confirmar retiros en el almacén',
                ], 403);
            }

            // Validar que el empleado pueda confirmar (sin confirmación previa)
            if (!$venta->puedeConfirmarsePickupPorEmpleado()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este pedido ya ha sido confirmado por un empleado',
                    'pickup_confirmado_empleado_en' => $venta->pickup_confirmado_empleado_en,
                ], 422);
            }

            // Marcar confirmación del empleado
            $venta->update([
                'pickup_confirmado_empleado_en' => now(),
                'pickup_confirmado_empleado_por_id' => $usuarioActual->id,
            ]);

            // Si también está confirmado por cliente, cambiar estado a RETIRADO
            if ($venta->pickupCompletamenteConfirmado()) {
                $estadoRetiradoId = Venta::obtenerIdEstado('RETIRADO', 'venta_logistica');
                $venta->update([
                    'estado_logistico_id' => $estadoRetiradoId,
                ]);

                Log::info("Pickup completamente confirmado para venta {$venta->id}", [
                    'cliente_confirmado_en' => $venta->pickup_confirmado_cliente_en,
                    'empleado_confirmado_en' => $venta->pickup_confirmado_empleado_en,
                    'empleado_id' => $usuarioActual->id,
                    'nuevo_estado' => 'RETIRADO',
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Confirmación de retiro registrada correctamente',
                'venta' => [
                    'id' => $venta->id,
                    'numero_venta' => $venta->numero_venta,
                    'tipo_entrega' => $venta->tipo_entrega,
                    'pickup_confirmado_cliente_en' => $venta->pickup_confirmado_cliente_en,
                    'pickup_confirmado_empleado_en' => $venta->pickup_confirmado_empleado_en,
                    'pickup_completamente_confirmado' => $venta->pickupCompletamenteConfirmado(),
                    'estado_logistico' => $venta->estadoLogistica?->nombre,
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error("Error en confirmarPickupEmpleado para venta {$venta->id}: {$e->getMessage()}", [
                'exception' => $e,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la confirmación de retiro',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ NUEVO: Registrar venta en movimientos_caja
     * POST /api/ventas/{venta}/registrar-en-caja
     *
     * Permite registrar manualmente una venta en movimientos_caja si no se registró automáticamente
     */
    public function registrarEnCaja(Venta $venta, Request $request)
    {
        try {
            // ✅ Cargar relaciones necesarias
            $venta->load('estadoDocumento');

            $usuario = Auth::user();
            $this->authorize('cajas.transacciones');

            // Validar que la venta esté aprobada
            if ($venta->estadoDocumento?->codigo !== 'APROBADO') {
                return response()->json([
                    'success' => false,
                    'message' => 'Solo se pueden registrar ventas aprobadas',
                    'estado_actual' => $venta->estadoDocumento?->nombre,
                ], 422);
            }

            // Validar que la venta no esté ya registrada en caja
            $movimientoExistente = \App\Models\MovimientoCaja::where('venta_id', $venta->id)->exists();

            if ($movimientoExistente) {
                return response()->json([
                    'success' => false,
                    'message' => 'Esta venta ya ha sido registrada en movimientos de caja',
                ], 422);
            }

            // Validar caja abierta
            $cajaAbierta = \App\Models\AperturaCaja::where('user_id', $usuario->id)
                ->whereDoesntHave('cierre')
                ->first();

            if (!$cajaAbierta) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tiene una caja abierta. Por favor abra una caja primero',
                ], 422);
            }

            // Crear movimiento de caja
            $movimiento = \App\Models\MovimientoCaja::create([
                'caja_id' => $cajaAbierta->caja_id,
                'user_id' => $usuario->id,
                'fecha' => now(),
                'monto' => (float) $venta->total,
                'tipo_operacion_id' => \App\Models\TipoOperacionCaja::where('codigo', 'INGRESO')
                    ->first()?->id ?? 1,
                'tipo_pago_id' => $venta->tipo_pago_id,
                'venta_id' => $venta->id,
                'numero_documento' => $venta->numero,
                'observaciones' => "Venta #{$venta->numero} registrada manualmente desde listado",
            ]);

            Log::info('✅ Venta registrada en movimientos_caja manualmente', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'movimiento_id' => $movimiento->id,
                'usuario_id' => $usuario->id,
                'monto' => (float) $venta->total,
            ]);

            return response()->json([
                'success' => true,
                'message' => "Venta #{$venta->numero} registrada en caja exitosamente",
                'data' => [
                    'movimiento_id' => $movimiento->id,
                    'venta_numero' => $venta->numero,
                    'monto' => (float) $venta->total,
                    'fecha' => $movimiento->fecha->format('Y-m-d H:i:s'),
                ],
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error al registrar venta en caja', [
                'venta_id' => $venta->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al registrar la venta en caja: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Verificar si el usuario tiene permisos de almacén
     *
     * @param mixed $user
     * @return bool
     */
    private function tienePermisoAlmacen($user): bool
    {
        // Verificar si es admin
        if ($user->admin === 1) {
            return true;
        }

        // Verificar si tiene rol de almacén (si existe sistema de roles)
        if (method_exists($user, 'hasRole')) {
            return $user->hasRole(['Gestor de Almacén', 'Admin']);
        }

        // Verificar si tiene permisos explícitos
        if (method_exists($user, 'hasPermission')) {
            return $user->hasPermission('confirmar-pickup');
        }

        return false;
    }
}
