<?php

namespace App\Listeners;

use App\Events\DashboardMetricsUpdated;
use App\Services\WebSocket\DashboardWebSocketService;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class BroadcastDashboardMetrics
{
    protected DashboardWebSocketService $wsService;

    /**
     * Create the event listener.
     */
    public function __construct(DashboardWebSocketService $wsService)
    {
        $this->wsService = $wsService;
    }

    /**
     * Handle the event.
     */
    public function handle(DashboardMetricsUpdated $event): void
    {
        $this->wsService->notifyMetricsUpdated(
            $event->metricas,
            $event->periodo
        );
    }
}
