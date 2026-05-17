<?php

namespace App\Events;

use App\Models\Ruta;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithBroadcasting;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RutaModificada implements ShouldBroadcast
{
    use Dispatchable, InteractsWithBroadcasting, SerializesModels;

    public function __construct(
        public Ruta $ruta,
        public string $tipo_cambio = 'estado'
    ) {
        $this->broadcastAs('ruta.modificada');
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('rutas'),
            new PrivateChannel('chofer.' . $this->ruta->chofer_id),
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
            'estado' => $this->ruta->estado,
            'tipo_cambio' => $this->tipo_cambio,
            'hora_salida' => $this->ruta->hora_salida?->format('H:i:s'),
            'hora_llegada' => $this->ruta->hora_llegada?->format('H:i:s'),
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
