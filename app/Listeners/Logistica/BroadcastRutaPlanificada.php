<?php

namespace App\Listeners\Logistica;

use App\Events\RutaPlanificada;
use App\Listeners\BaseBroadcastListener;

/**
 * Listener: Broadcast cuando se planifican rutas diarias
 *
 * Broadcast a:
 * - Choferes (ven sus rutas asignadas)
 * - Supervisor de logística (ve plan del día)
 * - Dashboard (actualiza estado)
 * - Clientes (se enteran quién las entregará)
 */
class BroadcastRutaPlanificada extends BaseBroadcastListener
{
    protected string $eventName = 'RutaPlanificada';

    public function __construct(private RutaPlanificada $event) {}

    public function handle(): void
    {
        $this->logBroadcast();
    }

    public function broadcastOn(): array
    {
        return [
            // Dashboard de logística
            $this->publicChannel('rutas.planned'),

            // Chofer (si se asignó)
            $this->userChannel($this->event->ruta->chofer_id ?? 0),

            // Supervisor
            $this->organizationChannel(1),
        ];
    }

    public function broadcastAs(): string
    {
        return 'ruta:planned';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->event->ruta->id,
            'numero' => $this->event->ruta->numero,
            'zona_id' => $this->event->ruta->zona_id,
            'chofer_id' => $this->event->ruta->chofer_id,
            'chofer_nombre' => $this->event->ruta->chofer?->nombre,
            'cantidad_entregas' => $this->event->ruta->cantidad_entregas,
            'estado' => $this->event->ruta->estado,
            'fecha_planificacion' => $this->event->ruta->fecha_planificacion->toDateString(),
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
