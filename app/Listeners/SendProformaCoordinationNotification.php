<?php

namespace App\Listeners;

use App\Events\ProformaCoordinacionActualizada;
use App\Services\Notifications\ProformaNotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendProformaCoordinationNotification implements ShouldQueue
{
    use InteractsWithQueue;

    protected ProformaNotificationService $notificationService;

    /**
     * Create the event listener.
     */
    public function __construct(ProformaNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle the event.
     */
    public function handle(ProformaCoordinacionActualizada $event): void
    {
        // Notificar sobre la coordinación actualizada
        $this->notificationService->notifyCoordination(
            $event->proforma,
            $event->usuarioId
        );
    }
}
