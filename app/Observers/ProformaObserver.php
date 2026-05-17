<?php

namespace App\Observers;

use App\Models\Proforma;

class ProformaObserver
{
    /**
     * Handle the Proforma "created" event.
     */
    public function created(Proforma $proforma): void
    {
        // Actualizar número de proforma con ID concatenado
        $fecha = $proforma->created_at->format('Ymd');
        $nuevoNumero = "PRO-{$fecha}-" . str_pad($proforma->id, 4, '0', STR_PAD_LEFT);

        // Actualizar sin disparar eventos para evitar loop infinito
        $proforma->updateQuietly(['numero' => $nuevoNumero]);

        // ✅ DESACTIVADO: ProformaService::crear() ahora maneja las reservas de stock
        // Antes: if ($proforma->esDeAppExterna() && $proforma->estado === Proforma::PENDIENTE) {
        //            $proforma->reservarStock();
        //        }
    }

    /**
     * Handle the Proforma "updated" event.
     */
    public function updated(Proforma $proforma): void
    {
        // Si la proforma fue aprobada, extender las reservas
        if ($proforma->wasChanged('estado') && $proforma->estado === Proforma::APROBADA) {
            $proforma->extenderReservas(48); // 48 horas para convertir a venta
        }

        // ✅ REFACTORIZADO (2026-03-27): Si la proforma fue rechazada o expiró
        // NOTA: La liberación de reservas se maneja EXPLÍCITAMENTE en:
        // - ProformaService::rechazar() → usa updateQuietly() para evitar observer
        // - Proforma::rechazar() (API) → usa updateQuietly() para evitar observer
        // Este observer es ahora un FALLBACK por si acaso una proforma se marca como
        // RECHAZADA usando update() en lugar de updateQuietly()
        if ($proforma->wasChanged('estado') &&
            in_array($proforma->estado, [Proforma::RECHAZADA, Proforma::VENCIDA])) {
            // Verificar si hay reservas activas (si no las hay, ya fueron liberadas)
            $reservasActivas = $proforma->reservasActivas()->count();

            if ($reservasActivas > 0) {
                // ⚠️ WARNING: La liberación de reservas NO debería ocurrir aquí en el flujo normal
                // (debería haber sido manejada por ProformaService o Proforma::rechazar con updateQuietly())
                \Illuminate\Support\Facades\Log::warning('⚠️ [ProformaObserver] Liberación de reservas iniciada desde observer (FALLBACK INESPERADO)', [
                    'proforma_id' => $proforma->id,
                    'proforma_numero' => $proforma->numero,
                    'estado' => $proforma->estado,
                    'reservas_activas' => $reservasActivas,
                    'note' => 'Esto debería ser manejado explícitamente por ProformaService o Proforma::rechazar usando updateQuietly()',
                ]);

                try {
                    // ✅ NUEVO (2026-03-27): Usar el nuevo servicio centralizado (fallback)
                    $reservaService = new \App\Services\Reservas\ReservaDistribucionService();
                    $motivo = $proforma->estado === Proforma::RECHAZADA
                        ? "Rechazo de proforma: {$proforma->observaciones_rechazo}"
                        : "Proforma vencida";

                    $resultado = $reservaService->liberarTodasLasReservas($proforma, $motivo);

                    if ($resultado['success']) {
                        \Illuminate\Support\Facades\Log::warning('✅ [ProformaObserver] Reservas liberadas exitosamente desde fallback', [
                            'proforma_id' => $proforma->id,
                            'cantidad_liberada' => $resultado['cantidad_liberada'],
                        ]);
                    } else {
                        \Illuminate\Support\Facades\Log::error('❌ [ProformaObserver] Error al liberar reservas en fallback', [
                            'proforma_id' => $proforma->id,
                            'error' => $resultado['error'],
                        ]);
                    }
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('❌ [ProformaObserver] Excepción al liberar reservas en fallback', [
                        'proforma_id' => $proforma->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            } else {
                \Illuminate\Support\Facades\Log::info('ℹ️ [ProformaObserver] Proforma rechazada/vencida sin reservas activas (ya fueron liberadas)', [
                    'proforma_id' => $proforma->id,
                    'proforma_numero' => $proforma->numero,
                    'estado' => $proforma->estado,
                ]);
            }
        }

        // ✅ REFACTORIZADO (2026-03-27): Si la proforma fue convertida a venta
        // NOTA: El consumo de reservas se maneja EXPLÍCITAMENTE en:
        // - ProformaService::convertirAVenta() → usa updateQuietly() para evitar observer
        // - ApiProformaController::convertirAVenta() → usa updateQuietly() para evitar observer
        // Este observer es ahora un FALLBACK/SAFETY NET por si acaso una proforma se marca como
        // CONVERTIDA usando update() en lugar de updateQuietly()
        if ($proforma->wasChanged('estado') && $proforma->estado === Proforma::CONVERTIDA) {
            // Verificar si hay reservas activas (si no las hay, ya fueron consumidas)
            $reservasActivas = $proforma->reservasActivas()->count();

            if ($reservasActivas > 0) {
                // ⚠️ WARNING: El consumo de reservas NO debería ocurrir aquí en el flujo normal
                // (debería haber sido manejado por ProformaService o ApiProformaController)
                \Illuminate\Support\Facades\Log::warning('⚠️ [ProformaObserver] Consumo de reservas iniciado desde observer (FALLBACK INESPERADO)', [
                    'proforma_id' => $proforma->id,
                    'proforma_numero' => $proforma->numero,
                    'reservas_activas' => $reservasActivas,
                    'note' => 'Esto debería ser manejado explícitamente por ProformaService o ApiProformaController usando updateQuietly()',
                ]);

                try {
                    // ✅ NUEVO (2026-03-27): Usar el nuevo servicio centralizado (fallback)
                    $reservaService = new \App\Services\Reservas\ReservaDistribucionService();
                    $numeroVenta = $proforma->venta?->numero ?? "VENTA-{$proforma->id}";
                    $resultado = $reservaService->consumirReservasAgrupadas($proforma, $numeroVenta);

                    if ($resultado['success']) {
                        \Illuminate\Support\Facades\Log::warning('✅ [ProformaObserver] Reservas consumidas exitosamente desde fallback', [
                            'proforma_id' => $proforma->id,
                            'cantidad_consumida' => $resultado['cantidad_consumida'],
                        ]);
                    } else {
                        \Illuminate\Support\Facades\Log::error('❌ [ProformaObserver] Error al consumir reservas en fallback', [
                            'proforma_id' => $proforma->id,
                            'error' => $resultado['error'],
                        ]);
                    }
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('❌ [ProformaObserver] Excepción al consumir reservas en fallback', [
                        'proforma_id' => $proforma->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            } else {
                \Illuminate\Support\Facades\Log::info('ℹ️ [ProformaObserver] Proforma CONVERTIDA sin reservas activas (ya fueron consumidas)', [
                    'proforma_id' => $proforma->id,
                    'proforma_numero' => $proforma->numero,
                ]);
            }
        }
    }

    /**
     * Handle the Proforma "deleted" event.
     */
    public function deleted(Proforma $proforma): void
    {
        // Liberar todas las reservas al eliminar proforma
        $proforma->liberarReservas();
    }

    /**
     * Handle the Proforma "restored" event.
     */
    public function restored(Proforma $proforma): void
    {
        //
    }

    /**
     * Handle the Proforma "force deleted" event.
     */
    public function forceDeleted(Proforma $proforma): void
    {
        // Liberar todas las reservas al eliminar definitivamente
        $proforma->liberarReservas();
    }
}
