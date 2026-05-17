<?php

namespace App\Listeners;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

/**
 * Base class para Listeners que hacen Broadcast via WebSocket
 *
 * PATRÓN:
 * 1. Service ejecuta lógica → emit Event
 * 2. Listener escucha Event → hace broadcast
 * 3. WebSocket client recibe broadcast
 *
 * IMPORTANTE:
 * ✓ Listener NO tiene lógica de negocio
 * ✓ Listener solo COMUNICA cambios
 * ✓ Listener puede fallar sin afectar transacción
 */
abstract class BaseBroadcastListener
{
    use SerializesModels;

    /**
     * Nombre del evento para debugging
     */
    protected string $eventName = '';

    /**
     * Canales a los que hacer broadcast
     *
     * @return Channel[]
     */
    abstract public function broadcastOn(): array;

    /**
     * Nombre del evento en el cliente (socket.on)
     *
     * @return string
     */
    abstract public function broadcastAs(): string;

    /**
     * Datos a enviar al cliente
     *
     * @return array
     */
    abstract public function broadcastWith(): array;

    /**
     * Determinar si debe ser broadcast este evento
     *
     * Útil para filtrar: ej, no broadcast si el usuario no tiene permisos
     */
    public function shouldBroadcast(): bool
    {
        return true;
    }

    /**
     * Log del broadcast para debugging
     */
    protected function logBroadcast(): void
    {
        \Illuminate\Support\Facades\Log::info("Broadcast: {$this->eventName}", [
            'event' => $this->broadcastAs(),
            'channels' => array_map(fn($c) => $c->name ?? 'unknown', $this->broadcastOn()),
            'data' => $this->broadcastWith(),
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Helper: crear canal privado
     */
    protected function privateChannel(string $name): Channel
    {
        return new Channel("private.{$name}");
    }

    /**
     * Helper: crear canal privado de usuario
     */
    protected function userChannel(int $userId): Channel
    {
        return new Channel("private.user.{$userId}");
    }

    /**
     * Helper: crear canal privado de equipo/organización
     */
    protected function organizationChannel(int $orgId): Channel
    {
        return new Channel("private.org.{$orgId}");
    }

    /**
     * Helper: crear canal público
     */
    protected function publicChannel(string $name): Channel
    {
        return new Channel("public.{$name}");
    }
}
