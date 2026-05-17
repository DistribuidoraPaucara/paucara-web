<?php

namespace App\Events;

use App\Models\RutaDetalle;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithBroadcasting;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RutaDetalleActualizado implements ShouldBroadcast
{
    use Dispatchable, InteractsWithBroadcasting, SerializesModels;

    public function __construct(
        public RutaDetalle $detalle,
        public string $estado_anterior = ''
    ) {
        $this->broadcastAs('ruta.detalle.actualizado');
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
            new PrivateChannel('ruta.' . $this->detalle->ruta_id),
            new PrivateChannel('chofer.' . $this->detalle->ruta->chofer_id),
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
            'ruta_id' => $this->detalle->ruta_id,
            'detalle_id' => $this->detalle->id,
            'cliente_id' => $this->detalle->cliente_id,
            'cliente_nombre' => $this->detalle->cliente->nombre ?? 'N/A',
            'secuencia' => $this->detalle->secuencia,
            'estado_anterior' => $this->estado_anterior,
            'estado_actual' => $this->detalle->estado,
            'hora_entrega_estimada' => $this->detalle->hora_entrega_estimada?->format('H:i:s'),
            'hora_entrega_real' => $this->detalle->hora_entrega_real?->format('H:i:s'),
            'latitud' => $this->detalle->latitud,
            'longitud' => $this->detalle->longitud,
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
