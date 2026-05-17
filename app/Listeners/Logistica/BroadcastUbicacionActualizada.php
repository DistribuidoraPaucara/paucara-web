<?php

namespace App\Listeners\Logistica;

use App\Events\UbicacionActualizada;
use App\Listeners\BaseBroadcastListener;

/**
 * Listener: Broadcast de actualizaciones de ubicación (Tracking)
 *
 * IMPORTANTE: Este es un evento de HIGH FREQUENCY
 * Se dispara ~cada 10-30 segundos mientras el chofer está en camino
 *
 * Broadcast a:
 * - Cliente (ve ubicación en tiempo real)
 * - Supervisor (ve flota en mapa)
 * - Dashboard (ve entregas en progreso)
 */
class BroadcastUbicacionActualizada extends BaseBroadcastListener
{
    protected string $eventName = 'UbicacionActualizada';

    public function __construct(private UbicacionActualizada $event) {}

    public function handle(): void
    {
        // Solo log si es evento importante (cada N ubicaciones)
        // static $count = 0;
        // if (++$count % 10 === 0) {
        //     $this->logBroadcast();
        // }
    }

    public function broadcastOn(): array
    {
        return [
            // Broadcast público de tracking (mapa en tiempo real)
            $this->publicChannel('tracking.active'),

            // Cliente específico puede ver su entrega
            $this->organizationChannel(1),

            // Chofer que está entregando
            $this->userChannel($this->event->entrega->chofer_id ?? 0),
        ];
    }

    public function broadcastAs(): string
    {
        return 'tracking:updated';
    }

    public function broadcastWith(): array
    {
        return [
            'entrega_id' => $this->event->entrega->id,
            'venta_id' => $this->event->entrega->venta_id,
            'latitud' => (float) $this->event->ubicacion->latitud,
            'longitud' => (float) $this->event->ubicacion->longitud,
            'eta_minutos' => $this->event->eta_minutos ?? null,
            'precision' => (float) $this->event->ubicacion->precision ?? 0,
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
