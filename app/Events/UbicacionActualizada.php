<?php

namespace App\Events;

use App\Models\UbicacionTracking;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * UbicacionActualizada - Event de broadcast para tracking GPS en tiempo real
 *
 * Se dispara cuando:
 * - TrackingService registra una nueva ubicación GPS
 * - Se actualiza la posición de un vehículo en entrega
 *
 * Escucha WebSocket por:
 * - Clientes interesados en seguimiento de una entrega específica
 * - Admin/Encargado para monitoreo global
 */
class UbicacionActualizada implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    // Parámetros del evento
    public int $id;
    public int $entregaId;
    public float $latitud;
    public float $longitud;
    public float $velocidad;
    public float $rumbo;
    public float $altitud;
    public float $precision;
    public string $timestamp;
    public string $choferNombre;

    /**
     * Crear evento de ubicación actualizada
     *
     * Acepta parámetros nombrados para mayor flexibilidad
     */
    public function __construct(
        int $entregaId,
        float $latitud,
        float $longitud,
        float $velocidad = 0,
        float $rumbo = 0,
        float $altitud = 0,
        float $precision = 0,
        string $timestamp = '',
        string $choferNombre = 'Desconocido',
        int $id = 0
    ) {
        $this->id = $id;
        $this->entregaId = $entregaId;
        $this->latitud = $latitud;
        $this->longitud = $longitud;
        $this->velocidad = $velocidad;
        $this->rumbo = $rumbo;
        $this->altitud = $altitud;
        $this->precision = $precision;
        $this->timestamp = $timestamp ?: now()->toIso8601String();
        $this->choferNombre = $choferNombre;
    }

    /**
     * Canales en los que se broadcast el evento
     *
     * - entrega.{id} - Canal privado para clientes de esa entrega
     * - admin.pedidos - Canal privado para admin/encargado
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('entrega.' . $this->entregaId),
            new PrivateChannel('admin.pedidos'),
        ];
    }

    /**
     * Datos que se envían en el broadcast
     */
    public function broadcastWith(): array
    {
        return [
            'id'           => $this->id,
            'entrega_id'   => $this->entregaId,
            'latitud'      => $this->latitud,
            'longitud'     => $this->longitud,
            'velocidad'    => $this->velocidad,
            'rumbo'        => $this->rumbo,
            'altitud'      => $this->altitud,
            'precision'    => $this->precision,
            'timestamp'    => $this->timestamp,
            'chofer_nombre' => $this->choferNombre,
            'mensaje'      => 'Ubicación actualizada en tiempo real',
        ];
    }

    /**
     * Nombre del evento que escuchan los clientes WebSocket
     */
    public function broadcastAs(): string
    {
        return 'ubicacion.actualizada';
    }
}
