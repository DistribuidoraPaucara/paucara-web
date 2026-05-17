<?php

namespace App\Listeners;

use App\Events\ProformaCreada;
use App\Services\Notifications\ProformaNotificationService;
use Illuminate\Support\Facades\Log;

/**
 * Listener que envía notificaciones de proforma creada
 *
 * Se ejecuta automáticamente y síncronamente cuando se dispara el evento ProformaCreada
 * No implementa ShouldQueue porque queremos ejecución inmediata
 *
 * ✅ Utiliza ProformaNotificationService que:
 *    - Guarda la notificación en BD (persistente)
 *    - Envía notificación en tiempo real vía WebSocket
 */
class SendProformaCreatedNotification
{
    protected ProformaNotificationService $notificationService;

    public function __construct(ProformaNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle the event.
     *
     * Delega al ProformaNotificationService para:
     * 1. Guardar la notificación en la base de datos (tabla notifications)
     * 2. Enviar notificación en tiempo real al servidor WebSocket Node.js
     */
    public function handle(ProformaCreada $event): void
    {
        try {
            $proforma = $event->proforma;

            Log::info('🔔 SendProformaCreatedNotification - Listener disparado', [
                'proforma_id' => $proforma->id,
                'proforma_numero' => $proforma->numero,
            ]);

            // Cargar relaciones necesarias si no están cargadas
            if (!$proforma->relationLoaded('cliente')) {
                $proforma->load('cliente');
            }
            if (!$proforma->relationLoaded('detalles')) {
                $proforma->load('detalles.producto');
            }
            if (!$proforma->relationLoaded('usuarioCreador')) {
                $proforma->load('usuarioCreador');
            }

            // ✅ Usar el servicio especializado de proformas
            $result = $this->notificationService->notifyCreated($proforma);

            if ($result) {
                Log::info('✅ Notificación de proforma creada procesada exitosamente', [
                    'proforma_id' => $proforma->id,
                    'proforma_numero' => $proforma->numero,
                ]);
            } else {
                Log::warning('⚠️ La notificación WebSocket no pudo enviarse (pero se guardó en BD)', [
                    'proforma_id' => $proforma->id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de proforma creada', [
                'proforma_id' => $event->proforma->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
