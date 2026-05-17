<?php

namespace App\Services\Logistica;

use App\Models\Entrega;
use App\Models\EstadoLogistica;
use App\Models\Venta;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CancelarEntregaService extends BaseLogisticaService
{
    /**
     * Cancelar una entrega consolidada sin afectar las ventas
     * Las ventas se desvinculan y quedan disponibles para otra entrega
     */
    public function cancelarEntrega(
        int $entregaId,
        ?string $motivo = null,
        bool $reabrirVentas = false,
        ?int $usuarioId = null,
    ): Entrega {
        return $this->transaction(function () use (
            $entregaId,
            $motivo,
            $reabrirVentas,
            $usuarioId
        ) {
            Log::info('Iniciando cancelación de entrega', [
                'entrega_id' => $entregaId,
                'motivo' => $motivo,
                'reabrirVentas' => $reabrirVentas,
            ]);

            // ═════════════════════════════════════════════════════════════
            // PASO 1: OBTENER ENTREGA Y VALIDAR
            // ═════════════════════════════════════════════════════════════
            $entrega = Entrega::lockForUpdate()->findOrFail($entregaId);

            if (!$entrega) {
                throw new Exception("Entrega #{$entregaId} no encontrada");
            }

            Log::info('✅ Entrega encontrada', [
                'entrega_id' => $entregaId,
                'estado_actual' => $entrega->estado,
                'numero_entrega' => $entrega->numero_entrega,
            ]);

            // ═════════════════════════════════════════════════════════════
            // PASO 2: VALIDAR QUE PUEDE SER CANCELADA
            // ═════════════════════════════════════════════════════════════
            $estadosCancelables = ['PROGRAMADO', 'PENDIENTE', 'EN_TRANSITO', 'PREPARACION_CARGA'];

            if (!in_array($entrega->estado, $estadosCancelables)) {
                throw new Exception(
                    "No se puede cancelar entrega en estado: {$entrega->estado}. " .
                    "Estados válidos para cancelar: " . implode(', ', $estadosCancelables)
                );
            }

            if ($entrega->estado === 'CANCELADA') {
                throw new Exception("La entrega ya está cancelada");
            }

            Log::info('✅ Entrega puede ser cancelada', [
                'entrega_id' => $entregaId,
                'estado_actual' => $entrega->estado,
            ]);

            // ═════════════════════════════════════════════════════════════
            // PASO 3: OBTENER VENTAS ASOCIADAS (ANTES DE DESVINCULARSE)
            // ═════════════════════════════════════════════════════════════
            $ventasIds = Venta::where('entrega_id', $entregaId)
                ->pluck('id')
                ->toArray();

            Log::info('✅ Ventas obtendidas directamente de tabla ventas', [
                'cantidad' => count($ventasIds),
                'ventas_ids' => $ventasIds,
            ]);

            // ═════════════════════════════════════════════════════════════
            // PASO 4: LIMPIAR entrega_id EN LAS VENTAS
            // ═════════════════════════════════════════════════════════════
            $desvinculadas = Venta::where('entrega_id', $entregaId)
                ->update(['entrega_id' => null]);

            Log::info('✅ Ventas desvinculadas de la entrega (entrega_id = null)', [
                'cantidad' => $desvinculadas,
                'entrega_id' => $entregaId,
            ]);

            // ═════════════════════════════════════════════════════════════
            // PASO 5: ACTUALIZAR ESTADO DE LA ENTREGA A CANCELADA
            // ═════════════════════════════════════════════════════════════
            $estadoAnterior = $entrega->estado;

            // Obtener el estado CANCELADA de la BD
            $estadoCancelada = EstadoLogistica::where('codigo', 'CANCELADA')
                ->where('categoria', 'entrega')
                ->first();

            if (!$estadoCancelada) {
                throw new Exception("Estado 'CANCELADA' no encontrado en la base de datos");
            }

            $entrega->update([
                'estado' => 'CANCELADA',
                'estado_entrega_id' => $estadoCancelada->id,
                'motivo_cancelacion' => $motivo,
                'cancelada_en' => now(),
                'cancelada_por_id' => $usuarioId ?? Auth::id(),
            ]);

            Log::info('✅ Estado de entrega actualizado a CANCELADA', [
                'entrega_id' => $entregaId,
                'estado_anterior' => $estadoAnterior,
                'estado_nuevo' => 'CANCELADA',
            ]);

            // ═════════════════════════════════════════════════════════════
            // PASO 6: REGISTRAR EN HISTORIAL DE CAMBIOS DE ESTADO
            // ═════════════════════════════════════════════════════════════
            $razonCancelacion = $motivo ? "Entrega cancelada. Motivo: {$motivo}" : "Entrega cancelada";
            $this->registrarCambioEstado(
                $entrega,
                $estadoAnterior,
                'CANCELADA',
                $razonCancelacion
            );

            Log::info('✅ Cambio de estado registrado en historial');

            // ═════════════════════════════════════════════════════════════
            // PASO 7: ACTUALIZAR ESTADO LOGÍSTICO DE LAS VENTAS
            // ═════════════════════════════════════════════════════════════
            if (count($ventasIds) > 0) {
                // Obtener el estado SIN_ENTREGA
                $estadoSinEntrega = EstadoLogistica::where('codigo', 'SIN_ENTREGA')
                    ->where('categoria', 'venta_logistica')
                    ->first();

                if (!$estadoSinEntrega) {
                    Log::warning('⚠️ Estado SIN_ENTREGA no encontrado, usando id 9 directamente');
                    $estadoSinEntregaId = 9;
                } else {
                    $estadoSinEntregaId = $estadoSinEntrega->id;
                }

                // Actualizar estado logístico a SIN_ENTREGA (entrega_id ya fue limpiado en PASO 4)
                $actualizadas = Venta::whereIn('id', $ventasIds)
                    ->update([
                        'estado_logistico_id' => $estadoSinEntregaId,  // Actualizar a SIN_ENTREGA
                    ]);

                Log::info('✅ Estado logístico de ventas actualizado a SIN_ENTREGA', [
                    'cantidad' => $actualizadas,
                    'ventas_ids' => $ventasIds,
                    'estado_logistica_id' => $estadoSinEntregaId,
                ]);

                // Si reabrirVentas=true, cambiar el estado a PENDIENTE_ENVIO
                if ($reabrirVentas) {
                    $reabiertos = Venta::whereIn('id', $ventasIds)
                        ->update([
                            'estado_logistico' => 'PENDIENTE_ENVIO',
                        ]);

                    Log::info('✅ Ventas reabiertos para reasignación', [
                        'cantidad' => $reabiertos,
                        'ventas_ids' => $ventasIds,
                    ]);
                }
            } else {
                Log::info('ℹ️ Sin ventas asociadas a desasignar');
            }

            // ═════════════════════════════════════════════════════════════
            // PASO 8: LOGUEAR ÉXITO
            // ═════════════════════════════════════════════════════════════
            Log::info('✅ Entrega cancelada exitosamente', [
                'entrega_id' => $entregaId,
                'numero_entrega' => $entrega->numero_entrega,
                'ventas_desvinculadas' => $desvinculadas,
                'estado_anterior' => $estadoAnterior,
                'motivo' => $motivo,
                'usuario_id' => $usuarioId ?? Auth::id(),
            ]);

            return $entrega->refresh();
        });
    }

    /**
     * Registrar cambio de estado en la tabla de historial
     */
    private function registrarCambioEstado(
        Entrega $entrega,
        string $estadoAnterior,
        string $estadoNuevo,
        string $razon
    ): void {
        try {
            DB::table('entrega_cambios_estado')->insert([
                'entrega_id' => $entrega->id,
                'estado_anterior' => $estadoAnterior,
                'estado_nuevo' => $estadoNuevo,
                'razon' => $razon,
                'usuario_id' => Auth::id(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            Log::info('✅ Cambio de estado registrado', [
                'entrega_id' => $entrega->id,
                'de' => $estadoAnterior,
                'a' => $estadoNuevo,
            ]);
        } catch (Exception $e) {
            Log::warning('⚠️ Error al registrar cambio de estado (no crítico)', [
                'entrega_id' => $entrega->id,
                'error' => $e->getMessage(),
            ]);
            // No es crítico si no se puede registrar el historial
        }
    }
}
