<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DashboardMetricsUpdated implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public array $metricas;
    public string $periodo;

    public function __construct(array $metricas, string $periodo = 'mes_actual')
    {
        $this->metricas = $metricas;
        $this->periodo = $periodo;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('dashboard.metrics'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'dashboard.metrics-updated';
    }

    public function broadcastWith(): array
    {
        return [
            'metricas' => $this->metricas,
            'periodo' => $this->periodo,
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
