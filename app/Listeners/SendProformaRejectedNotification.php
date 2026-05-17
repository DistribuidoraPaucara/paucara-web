<?php

namespace App\Listeners;

use App\Events\ProformaRechazada;
use App\Services\Notifications\ProformaNotificationService;
use Illuminate\Support\Facades\Log;

/**
 * Listener que envía notificaciones cuando una proforma es rechazada
 *
 * Se ejecuta automáticamente cuando se dispara el evento ProformaRechazada
 *
 * ✅ Utiliza ProformaNotificationService que:
 *    - Guarda la notificación en BD (persistente)
 *    - Envía notificación en tiempo real vía WebSocket
 */
class SendProformaRejectedNotification
{
    protected ProformaNotificationService $notificationService;

    public function __construct(ProformaNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle the event.
     */
    public function handle(ProformaRechazada $event): void
    {
        try {
            $proforma = $event->proforma;
            $motivoRechazo = $event->motivoRechazo ?? 'Sin motivo especificado';

            Log::info('🔔 SendProformaRejectedNotification - Listener disparado', [
                'proforma_id' => $proforma->id,
                'proforma_numero' => $proforma->numero,
                'motivo' => $motivoRechazo,
            ]);

            // Cargar relaciones necesarias si no están cargadas
            if (!$proforma->relationLoaded('cliente')) {
                $proforma->load('cliente');
            }

            // ✅ Usar el servicio especializado de proformas
            $result = $this->notificationService->notifyRejected($proforma, $motivoRechazo);

            if ($result) {
                Log::info('✅ Notificación de proforma rechazada procesada exitosamente', [
                    'proforma_id' => $proforma->id,
                    'proforma_numero' => $proforma->numero,
                ]);
            } else {
                Log::warning('⚠️ La notificación WebSocket no pudo enviarse (pero se guardó en BD)', [
                    'proforma_id' => $proforma->id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de proforma rechazada', [
                'proforma_id' => $event->proforma->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
