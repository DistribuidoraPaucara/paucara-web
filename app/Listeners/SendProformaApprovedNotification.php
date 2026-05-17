<?php

namespace App\Listeners;

use App\Events\ProformaAprobada;
use App\Services\Notifications\ProformaNotificationService;
use Illuminate\Support\Facades\Log;

/**
 * Listener que envía notificaciones cuando una proforma es aprobada
 *
 * Se ejecuta automáticamente cuando se dispara el evento ProformaAprobada
 *
 * ✅ Utiliza ProformaNotificationService que:
 *    - Guarda la notificación en BD (persistente)
 *    - Envía notificación en tiempo real vía WebSocket
 */
class SendProformaApprovedNotification
{
    protected ProformaNotificationService $notificationService;

    public function __construct(ProformaNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle the event.
     */
    public function handle(ProformaAprobada $event): void
    {
        try {
            $proforma = $event->proforma;

            Log::info('🔔 SendProformaApprovedNotification - Listener disparado', [
                'proforma_id' => $proforma->id,
                'proforma_numero' => $proforma->numero,
            ]);

            // Cargar relaciones necesarias si no están cargadas
            if (!$proforma->relationLoaded('cliente')) {
                $proforma->load('cliente');
            }
            if (!$proforma->relationLoaded('usuarioAprobador')) {
                $proforma->load('usuarioAprobador');
            }

            // ✅ Usar el servicio especializado de proformas
            $result = $this->notificationService->notifyApproved($proforma);

            if ($result) {
                Log::info('✅ Notificación de proforma aprobada procesada exitosamente', [
                    'proforma_id' => $proforma->id,
                    'proforma_numero' => $proforma->numero,
                ]);
            } else {
                Log::warning('⚠️ La notificación WebSocket no pudo enviarse (pero se guardó en BD)', [
                    'proforma_id' => $proforma->id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de proforma aprobada', [
                'proforma_id' => $event->proforma->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
