<?php

namespace App\Listeners;

use App\Events\ProformaConvertida;
use App\Services\Notifications\ProformaNotificationService;
use Illuminate\Support\Facades\Log;

/**
 * Listener que envía notificaciones cuando una proforma es convertida a venta
 *
 * Se ejecuta automáticamente cuando se dispara el evento ProformaConvertida
 *
 * ✅ Utiliza ProformaNotificationService que:
 *    - Guarda la notificación en BD (persistente)
 *    - Envía notificación en tiempo real vía WebSocket
 */
class SendProformaConvertedNotification
{
    protected ProformaNotificationService $notificationService;

    public function __construct(ProformaNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle the event.
     */
    public function handle(ProformaConvertida $event): void
    {
        try {
            $proforma = $event->proforma;
            $venta = $event->venta;

            Log::info('🔔 SendProformaConvertedNotification - Listener disparado', [
                'proforma_id' => $proforma->id,
                'proforma_numero' => $proforma->numero,
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero ?? null,
            ]);

            // Cargar relaciones necesarias si no están cargadas
            if (!$proforma->relationLoaded('cliente')) {
                $proforma->load('cliente');
            }
            if (!$venta->relationLoaded('cliente')) {
                $venta->load('cliente');
            }

            // ✅ Usar el servicio especializado de proformas
            $result = $this->notificationService->notifyConverted($proforma, $venta);

            if ($result) {
                Log::info('✅ Notificación de proforma convertida procesada exitosamente', [
                    'proforma_id' => $proforma->id,
                    'venta_id' => $venta->id,
                ]);
            } else {
                Log::warning('⚠️ La notificación WebSocket no pudo enviarse (pero se guardó en BD)', [
                    'proforma_id' => $proforma->id,
                    'venta_id' => $venta->id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de proforma convertida', [
                'proforma_id' => $event->proforma->id ?? null,
                'venta_id' => $event->venta->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
