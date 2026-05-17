<?php

namespace App\Jobs;

use App\Models\StockProducto;
use App\Models\User;
use App\Notifications\ProductoProximoVencerNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class VerificarVencimientosJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public int $diasAnticipacion = 30
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $fechaLimite = now()->addDays($this->diasAnticipacion);

        // Obtener productos próximos a vencer
        $productosProximosVencer = StockProducto::with(['producto', 'almacen'])
            ->whereNotNull('fecha_vencimiento')
            ->where('fecha_vencimiento', '<=', $fechaLimite)
            ->where('fecha_vencimiento', '>', now()) // Solo futuros, no vencidos
            ->where('cantidad', '>', 0)
            ->orderBy('fecha_vencimiento')
            ->get();

        if ($productosProximosVencer->isEmpty()) {
            return; // No hay productos próximos a vencer
        }

        // Obtener usuarios que deben recibir notificaciones
        $usuarios = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['admin', 'gerente', 'encargado_inventario']);
        })
            ->orWhere('email', 'like', '%admin%')
            ->get();

        if ($usuarios->isEmpty()) {
            $usuarios = User::take(1)->get();
        }

        // Verificar si ya se envió notificación recientemente
        $notificacionReciente = \DB::table('notifications')
            ->where('type', ProductoProximoVencerNotification::class)
            ->where('data->dias_anticipacion', $this->diasAnticipacion)
            ->where('created_at', '>', now()->subHours(24))
            ->exists();

        if ($notificacionReciente) {
            return; // Ya se notificó recientemente
        }

        // Enviar notificación
        foreach ($usuarios as $usuario) {
            $usuario->notify(new ProductoProximoVencerNotification(
                productosProximosVencer: $productosProximosVencer,
                diasAnticipacion: $this->diasAnticipacion
            ));
        }

        // Log
        \Log::info('Notificación de productos próximos a vencer enviada', [
            'cantidad_productos' => $productosProximosVencer->count(),
            'dias_anticipacion' => $this->diasAnticipacion,
            'usuarios_notificados' => $usuarios->count(),
            'productos' => $productosProximosVencer->take(5)->map(function ($item) {
                return [
                    'producto' => $item->producto->nombre,
                    'fecha_vencimiento' => $item->fecha_vencimiento?->format('Y-m-d'),
                    'almacen' => $item->almacen->nombre ?? 'Sin almacén',
                ];
            })->toArray(),
        ]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        \Log::error('Error en VerificarVencimientosJob', [
            'dias_anticipacion' => $this->diasAnticipacion,
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
        ]);
    }
}
