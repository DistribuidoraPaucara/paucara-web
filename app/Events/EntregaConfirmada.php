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
 * Event fired when a delivery is successfully completed
 *
 * Triggered: When driver calls POST /api/chofer/entregas/{id}/confirmar-entrega
 * Broadcast channels: entrega.{id}, chofer.{id}, admin.pedidos, pedido.{proforma_id}
 */
class EntregaConfirmada implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Entrega $entrega;
    public ?string $firmaUrl;
    public array $fotosUrls;
    public ?string $observaciones;

    /**
     * Create a new event instance.
     *
     * @param Entrega $entrega The delivery record
     * @param string|null $firmaUrl URL to digital signature
     * @param array $fotosUrls URLs to delivery photos
     * @param string|null $observaciones Additional observations
     */
    public function __construct(
        Entrega $entrega,
        ?string $firmaUrl = null,
        array $fotosUrls = [],
        ?string $observaciones = null
    ) {
        $this->entrega = $entrega;
        $this->firmaUrl = $firmaUrl;
        $this->fotosUrls = $fotosUrls;
        $this->observaciones = $observaciones;
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
            ] : null,
            'cliente' => $this->entrega->proforma?->cliente ? [
                'id' => $this->entrega->proforma->cliente->id,
                'nombre' => $this->entrega->proforma->cliente->nombre,
                'email' => $this->entrega->proforma->cliente->email,
            ] : null,
            'estado' => $this->entrega->estado,
            'firma_url' => $this->firmaUrl,
            'fotos_urls' => $this->fotosUrls,
            'observaciones' => $this->observaciones,
            'fecha_entrega' => $this->entrega->fecha_entrega,
            'mensaje' => 'Entrega completada exitosamente',
            'timestamp' => now(),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'entrega.confirmada';
    }
}
