<?php

namespace App\Listeners;

use App\Events\CompraCompletada;
use App\Services\Notifications\CompraNotificationService;
use Illuminate\Support\Facades\Log;

/**
 * Listener que envía notificaciones cuando se completa una compra
 *
 * Se ejecuta automáticamente y síncronamente cuando se dispara CompraCompletada
 * No implementa ShouldQueue porque queremos ejecución inmediata
 */
class SendCompraCompletedNotification
{
    protected CompraNotificationService $notificationService;

    public function __construct(CompraNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle the event
     *
     * Delega al CompraNotificationService para:
     * 1. Guardar la notificación en BD
     * 2. Enviar notificación en tiempo real al servidor WebSocket
     */
    public function handle(CompraCompletada $event): void
    {
        try {
            $compra = $event->compra;

            Log::info('🔔 SendCompraCompletedNotification - Listener disparado', [
                'compra_id' => $compra->id,
                'compra_numero' => $compra->numero,
                'proveedor' => $compra->proveedor?->nombre,
            ]);

            // Cargar relaciones necesarias si no están cargadas
            if (!$compra->relationLoaded('proveedor')) {
                $compra->load('proveedor');
            }
            if (!$compra->relationLoaded('detalles')) {
                $compra->load('detalles.producto');
            }
            if (!$compra->relationLoaded('usuario')) {
                $compra->load('usuario');
            }

            // Usar el servicio especializado de compras
            $result = $this->notificationService->notifyCompleted($compra);

            if ($result) {
                Log::info('✅ Notificación de compra completada procesada exitosamente', [
                    'compra_id' => $compra->id,
                    'compra_numero' => $compra->numero,
                ]);
            } else {
                Log::warning('⚠️ La notificación WebSocket no pudo enviarse (pero se guardó en BD)', [
                    'compra_id' => $compra->id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error procesando notificación de compra completada', [
                'compra_id' => $event->compra->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
