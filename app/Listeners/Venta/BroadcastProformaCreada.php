<?php

namespace App\Listeners\Venta;

use App\Events\ProformaCreada;
use App\Listeners\BaseBroadcastListener;

/**
 * Listener: Broadcast cuando se crea una Proforma
 *
 * Broadcast a:
 * - Vendedor que crea
 * - Cliente (si es desde app)
 * - Gerente de ventas (supervisión)
 */
class BroadcastProformaCreada extends BaseBroadcastListener
{
    protected string $eventName = 'ProformaCreada';

    public function __construct(private ProformaCreada $event) {}

    public function handle(): void
    {
        $this->logBroadcast();
    }

    public function broadcastOn(): array
    {
        return [
            $this->publicChannel('proformas.created'),
            $this->userChannel($this->event->proforma->usuario_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'proforma:created';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->event->proforma->id,
            'numero' => $this->event->proforma->numero,
            'cliente_id' => $this->event->proforma->cliente_id,
            'total' => (float) $this->event->proforma->total,
            'estado' => $this->event->proforma->estado,
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
