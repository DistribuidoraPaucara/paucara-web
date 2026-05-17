<?php
namespace App\Jobs;

use App\Models\Producto;
use App\Models\User;
use App\Notifications\StockBajoNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VerificarStockBajoJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Obtener productos con stock bajo
        $productosStockBajo = Producto::query()->stockBajo()
            ->with(['stock.almacen'])
            ->where('activo', true)
            ->get();

        if ($productosStockBajo->isEmpty()) {
            return; // No hay productos con stock bajo
        }

        // Obtener usuarios que deben recibir notificaciones
        // Puedes ajustar esto según tus roles/permisos
        $usuarios = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['admin', 'gerente', 'encargado_inventario']);
        })
            ->orWhere('email', 'like', '%admin%') // Fallback si no hay roles
            ->get();

        // Si no hay usuarios específicos, notificar al primer admin
        if ($usuarios->isEmpty()) {
            $usuarios = User::take(1)->get(); // Fallback de emergencia
        }

        foreach ($productosStockBajo as $producto) {
            $stockActual = $producto->stockTotal();

            // Verificar si ya se envió notificación recientemente (evitar spam)
            $notificacionReciente = DB::table('notifications')
                ->where('type', StockBajoNotification::class)
                ->where('data->producto_id', $producto->id)
                ->where('created_at', '>', now()->subHours(24))
                ->exists();

            if ($notificacionReciente) {
                continue; // Saltar si ya se notificó en las últimas 24 horas
            }

            // Enviar notificación a todos los usuarios relevantes
            foreach ($usuarios as $usuario) {
                $usuario->notify(new StockBajoNotification(
                    producto: $producto,
                    stockActual: $stockActual,
                    stockMinimo: $producto->stock_minimo
                ));
            }

            // Log para debugging
            Log::info('Notificación de stock bajo enviada', [
                'producto_id'          => $producto->id,
                'producto_nombre'      => $producto->nombre,
                'stock_actual'         => $stockActual,
                'stock_minimo'         => $producto->stock_minimo,
                'usuarios_notificados' => $usuarios->count(),
            ]);
        }

        // Log resumen
        Log::info('Verificación de stock bajo completada', [
            'productos_stock_bajo' => $productosStockBajo->count(),
            'usuarios_notificados' => $usuarios->count(),
        ]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Error en VerificarStockBajoJob', [
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
        ]);
    }
}
