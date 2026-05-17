<?php

namespace App\Events;

use App\Models\Entrega;
use App\Models\EstadoLogistica;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * EntregaEstadoCambiado - Evento centralizado de cambio de estado
 *
 * FASE 1: Evento único que se dispara para CUALQUIER cambio de estado en entregas
 *
 * ✅ VENTAJAS:
 * - Un solo listener para manejar todos los cambios
 * - Información completa: estado anterior + nuevo + razón
 * - Broadcasta a múltiples canales (admin, chofer, cliente)
 * - Información visual integrada (color, icono)
 *
 * ESCUCHADORES:
 * - WebSocket: Sincronizar estado en tiempo real
 * - Notificaciones: Notificar a usuarios relevantes
 * - Auditoría: Registrar cambios para compliance
 */
class EntregaEstadoCambiado implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public Entrega $entrega,
        public EstadoLogistica $estadoAnterior,
        public EstadoLogistica $estadoNuevo,
        public string $razon = ''
    ) {
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * Channels:
     * - entrega.{id}: Canal privado para esta entrega específica
     * - admin.logistica: Todos los admins que ven logística
     * - chofer.{id}: El chofer asignado a esta entrega
     * - cliente.{id}: El cliente que recibe esta entrega
     */
    public function broadcastOn(): array
    {
        $channels = [
            // Canal específico de la entrega
            new PrivateChannel('entrega.' . $this->entrega->id),
            // Admins y supervisores de logística
            new PrivateChannel('admin.logistica'),
        ];

        // Si hay chofer asignado
        if ($this->entrega->chofer_id) {
            $channels[] = new PrivateChannel('chofer.' . $this->entrega->chofer_id);
        }

        // Si hay cliente asociado (vía primera venta)
        if ($this->entrega->ventas?->first()?->cliente_id) {
            $channels[] = new PrivateChannel('cliente.' . $this->entrega->ventas->first()->cliente_id);
        }

        return $channels;
    }

    /**
     * Get the data to broadcast.
     *
     * Estructura optimizada para WebSocket:
     * - Estados con información visual
     * - Información de entrega actualizada
     * - Metadatos del cambio
     */
    public function broadcastWith(): array
    {
        return [
            // IDs y referencias
            'entrega_id' => $this->entrega->id,
            'numero_entrega' => $this->entrega->numero_entrega,

            // Estados con información completa
            'estado_anterior' => [
                'id' => $this->estadoAnterior->id,
                'codigo' => $this->estadoAnterior->codigo,
                'nombre' => $this->estadoAnterior->nombre,
                'color' => $this->estadoAnterior->color,
                'icono' => $this->estadoAnterior->icono,
            ],
            'estado_nuevo' => [
                'id' => $this->estadoNuevo->id,
                'codigo' => $this->estadoNuevo->codigo,
                'nombre' => $this->estadoNuevo->nombre,
                'color' => $this->estadoNuevo->color,
                'icono' => $this->estadoNuevo->icono,
                'es_estado_final' => $this->estadoNuevo->es_estado_final,
            ],

            // Información de quién/qué cambió
            'razon' => $this->razon,
            'timestamp' => now()->toIso8601String(),
            'usuario_id' => auth()?->user()?->id,

            // Información adicional de la entrega para actualización en tiempo real
            'entrega' => [
                'id' => $this->entrega->id,
                'chofer' => $this->entrega->chofer ? [
                    'id' => $this->entrega->chofer->id,
                    'nombre' => $this->entrega->chofer->user->nombre . ' ' . $this->entrega->chofer->user->apellidos,
                ] : null,
                'vehiculo' => $this->entrega->vehiculo ? [
                    'id' => $this->entrega->vehiculo->id,
                    'placa' => $this->entrega->vehiculo->placa,
                ] : null,
                'latitud_actual' => $this->entrega->latitud_actual,
                'longitud_actual' => $this->entrega->longitud_actual,
                'fecha_ultima_ubicacion' => $this->entrega->fecha_ultima_ubicacion?->toIso8601String(),
            ],

            // Información de ventas asociadas (para notificar a clientes)
            'total_ventas' => $this->entrega->ventas?->count() ?? 0,
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'entrega.estado_cambio';
    }
}
