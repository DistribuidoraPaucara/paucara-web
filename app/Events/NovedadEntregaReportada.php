<?php

namespace App\Events;

use App\Models\Entrega;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PublicChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Event fired when an issue/incident is reported during delivery
 *
 * Triggered: When driver calls POST /api/chofer/entregas/{id}/reportar-novedad
 * Broadcast channels: entrega.{id}, chofer.{id}, admin.pedidos, pedido.{proforma_id}
 */
class NovedadEntregaReportada implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Entrega $entrega;
    public string $motivo;
    public ?string $descripcion;
    public ?string $fotoUrl;

    /**
     * Create a new event instance.
     *
     * @param Entrega $entrega The delivery record
     * @param string $motivo Reason for the incident
     * @param string|null $descripcion Detailed description
     * @param string|null $fotoUrl URL to evidence photo
     */
    public function __construct(
        Entrega $entrega,
        string $motivo,
        ?string $descripcion = null,
        ?string $fotoUrl = null
    ) {
        $this->entrega = $entrega;
        $this->motivo = $motivo;
        $this->descripcion = $descripcion;
        $this->fotoUrl = $fotoUrl;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('entrega.' . $this->entrega->id),
            new PrivateChannel('chofer.' . $this->entrega->chofer_id),
            new PrivateChannel('admin.pedidos'),
            new PrivateChannel('pedido.' . $this->entrega->proforma_id),
        ];
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'entrega_id' => $this->entrega->id,
            'proforma_id' => $this->entrega->proforma_id,
            'chofer' => $this->entrega->chofer ? [
                'id' => $this->entrega->chofer->id,
                'nombre' => $this->entrega->chofer->user->nombre . ' ' . $this->entrega->chofer->user->apellidos,
                'telefono' => $this->entrega->chofer->user->telefono ?? null,
            ] : null,
            'cliente' => $this->entrega->proforma?->cliente ? [
                'id' => $this->entrega->proforma->cliente->id,
                'nombre' => $this->entrega->proforma->cliente->nombre,
                'email' => $this->entrega->proforma->cliente->email,
            ] : null,
            'estado' => $this->entrega->estado,
            'motivo_novedad' => $this->motivo,
            'descripcion' => $this->descripcion,
            'foto_url' => $this->fotoUrl,
            'mensaje' => 'Se ha reportado una novedad en la entrega',
            'tipo_alerta' => 'warning',
            'timestamp' => now(),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'entrega.novedad-reportada';
    }
}
