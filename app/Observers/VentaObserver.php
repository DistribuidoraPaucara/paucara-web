<?php

namespace App\Observers;

use App\Models\Venta;
use App\Models\EstadoLogistica;
use App\Events\VentaEstadoCambiado;
use Illuminate\Support\Facades\Log;

/**
 * VentaObserver - Dispara eventos cuando la venta cambia de estado
 *
 * RESPONSABILIDADES:
 * ✓ Detectar cambios en estado_logistico_id
 * ✓ Obtener estados anterior y nuevo desde estados_logistica
 * ✓ Disparar evento VentaEstadoCambiado
 * ✓ Registrar en logs
 *
 * CICLO DE VIDA:
 * - updating(): Detecta antes de guardar si cambió estado_logistico_id
 * - updated(): Dispara evento DESPUÉS de que se persistió cambio
 */
class VentaObserver
{
    /**
     * Detectar si está cambiando estado_logistico_id
     */
    public function updating(Venta $venta): void
    {
        if ($venta->isDirty('estado_logistico_id')) {
            Log::info('🔔 VentaObserver: Detectado cambio de estado_logistico_id', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'estado_anterior_id' => $venta->getOriginal('estado_logistico_id'),
                'estado_nuevo_id' => $venta->estado_logistico_id,
            ]);
        }
    }

    /**
     * Disparar evento cuando cambia estado
     */
    public function updated(Venta $venta): void
    {
        // Solo procesar si cambió el estado_logistico_id
        if (!$venta->wasChanged('estado_logistico_id')) {
            return;
        }

        try {
            // Obtener IDs de estados
            $estadoAnteriorId = $venta->getOriginal('estado_logistico_id');
            $estadoNuevoId = $venta->estado_logistico_id;

            Log::info('🔄 VentaObserver: Cambio de estado detectado en updated()', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'estado_anterior_id' => $estadoAnteriorId,
                'estado_nuevo_id' => $estadoNuevoId,
            ]);

            // Obtener estados desde la BD (usando estados_logistica)
            $estadoAnterior = null;
            $estadoNuevo = null;

            if ($estadoAnteriorId) {
                $estadoAnterior = EstadoLogistica::find($estadoAnteriorId);
            }

            if ($estadoNuevoId) {
                $estadoNuevo = EstadoLogistica::find($estadoNuevoId);
            }

            if ($estadoNuevo) {
                // Disparar evento VentaEstadoCambiado
                event(new VentaEstadoCambiado(
                    $venta,
                    $estadoAnterior,
                    $estadoNuevo,
                    "Cambio automático detectado por VentaObserver"
                ));

                Log::info('✅ VentaObserver: Evento VentaEstadoCambiado disparado', [
                    'venta_id' => $venta->id,
                    'evento' => 'VentaEstadoCambiado',
                    'estado_nuevo' => $estadoNuevo->codigo,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ VentaObserver: Error disparando evento', [
                'venta_id' => $venta->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            // No relanzar - los observadores no deben fallar
        }
    }
}
