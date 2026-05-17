<?php

namespace App\Events;

use App\Models\Ruta;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithBroadcasting;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RutaPlanificada implements ShouldBroadcast
{
    use Dispatchable, InteractsWithBroadcasting, SerializesModels;

    public function __construct(
        public Ruta $ruta
    ) {
        $this->broadcastAs('ruta.planificada');
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            // Canal público para todas las rutas
            new Channel('rutas'),
            // Canal privado para el chofer asignado
            new PrivateChannel('chofer.' . $this->ruta->chofer_id),
            // Canal privado para la localidad/zona
            new PrivateChannel('localidad.' . $this->ruta->localidad_id),
        ];
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'ruta_id' => $this->ruta->id,
            'codigo' => $this->ruta->codigo,
            'fecha_ruta' => $this->ruta->fecha_ruta->format('Y-m-d'),
            'localidad_id' => $this->ruta->localidad_id,
            'chofer_id' => $this->ruta->chofer_id,
            'chofer_nombre' => $this->ruta->chofer?->empleado?->nombre ?? $this->ruta->chofer?->name ?? 'N/A',
            'vehiculo_id' => $this->ruta->vehiculo_id,
            'vehiculo_placa' => $this->ruta->vehiculo->placa ?? 'N/A',
            'estado' => $this->ruta->estado,
            'cantidad_paradas' => $this->ruta->cantidad_paradas,
            'distancia_km' => $this->ruta->distancia_km,
            'tiempo_estimado_minutos' => $this->ruta->tiempo_estimado_minutos,
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
