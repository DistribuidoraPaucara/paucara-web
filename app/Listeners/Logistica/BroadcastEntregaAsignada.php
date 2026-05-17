<?php

namespace App\Listeners\Logistica;

use App\Events\EntregaAsignada;
use App\Listeners\BaseBroadcastListener;

/**
 * Listener: Broadcast cuando se asigna una Entrega
 *
 * Broadcast a:
 * - Chofer (recibe su entrega)
 * - Cliente (ve quien la entregará)
 * - Admin/Supervisor (supervisa)
 * - Dashboard (ve entregas asignadas)
 */
class BroadcastEntregaAsignada extends BaseBroadcastListener
{
    protected string $eventName = 'EntregaAsignada';

    public function __construct(private EntregaAsignada $event) {}

    public function handle(): void
    {
        $this->logBroadcast();
    }

    public function broadcastOn(): array
    {
        return [
            // Dashboard público de entregas
            $this->publicChannel('entregas.assigned'),

            // El chofer que recibe la entrega
            $this->userChannel($this->event->entrega->chofer_id ?? 0),

            // El cliente de la entrega
            $this->organizationChannel(1),
        ];
    }

    public function broadcastAs(): string
    {
        return 'entrega:assigned';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->event->entrega->id,
            'venta_id' => $this->event->entrega->venta_id,
            'chofer_id' => $this->event->entrega->chofer_id,
            'chofer_nombre' => $this->event->entrega->chofer?->nombre,
            'vehiculo_id' => $this->event->entrega->vehiculo_id,
            'vehiculo_placa' => $this->event->entrega->vehiculo?->placa,
            'estado' => $this->event->entrega->estado,
            'direccion' => $this->event->entrega->direccion,
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
