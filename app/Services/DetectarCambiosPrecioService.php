<?php
namespace App\Services;

use App\Models\Compra;
use App\Models\HistorialPrecio;
use App\Models\PrecioProducto;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DetectarCambiosPrecioService
{
    /**
     * Al aprobar compra, detectar si los precios de costo cambiaron
     * y crear alertas para que el usuario revise precios de venta
     *
     * @param Compra $compra
     * @return array Productos con cambios de precio
     */
    public function procesarCompraAprobada(Compra $compra): array
    {
        $productosConCambio = [];

        foreach ($compra->detalles as $detalle) {
            $producto = $detalle->producto;

            // Obtener precio de costo actual (COSTO)
            $precioCosto = $producto->obtenerPrecio('COSTO');

            if (!$precioCosto) {
                continue;
            }

            // Comparar con el precio de la compra
            $precioCompra = (float) $detalle->precio_unitario;
            $precioCostoActual = (float) $precioCosto->precio;

            // Si hay diferencia, es un cambio
            if (abs($precioCostoActual - $precioCompra) > 0.01) { // Permitir pequeñas variaciones de redondeo
                $porcentajeCambio = $precioCostoActual != 0
                    ? (($precioCompra - $precioCostoActual) / $precioCostoActual) * 100
                    : 0;

                $cambio = [
                    'producto_id' => $producto->id,
                    'producto_nombre' => $producto->nombre,
                    'precio_anterior' => $precioCostoActual,
                    'precio_nuevo' => $precioCompra,
                    'porcentaje_cambio' => $porcentajeCambio,
                    'compra_numero' => $compra->numero,
                ];

                // Actualizar precio de costo
                $precioCosto->actualizarPrecio(
                    $precioCompra,
                    "Actualización por compra #{$compra->numero}",
                    Auth::user()?->name ?? 'Sistema'
                );

                Log::info("Precio de costo actualizado", [
                    'producto_id' => $producto->id,
                    'precio_anterior' => $precioCostoActual,
                    'precio_nuevo' => $precioCompra,
                    'compra_numero' => $compra->numero,
                    'porcentaje_cambio' => $porcentajeCambio,
                ]);

                $productosConCambio[] = $cambio;
            }
        }

        return $productosConCambio;
    }

    /**
     * Obtener todos los precios que cambiaron en los últimos N días
     */
    public function obtenerCambiosRecientes(int $dias = 7): array
    {
        $cambios = HistorialPrecio::with([
            'precioProducto' => function ($q) {
                $q->with('producto');
            }
        ])
        ->whereNotNull('tipo_precio_id')
        ->where('fecha_cambio', '>=', now()->subDays($dias))
        ->latest('fecha_cambio')
        ->get();

        return $cambios->groupBy('precio_producto_id')->map(function ($grupo) {
            $ultimoCambio = $grupo->first();
            return [
                'producto_id' => $ultimoCambio->precioProducto?->producto_id,
                'producto_nombre' => $ultimoCambio->precioProducto?->producto?->nombre,
                'precio_id' => $ultimoCambio->precio_producto_id,
                'tipo_precio' => $ultimoCambio->tipoPrecio?->nombre,
                'valor_anterior' => $ultimoCambio->valor_anterior,
                'valor_nuevo' => $ultimoCambio->valor_nuevo,
                'porcentaje_cambio' => $ultimoCambio->porcentaje_cambio,
                'motivo' => $ultimoCambio->motivo,
                'usuario' => $ultimoCambio->usuario,
                'fecha_cambio' => $ultimoCambio->fecha_cambio,
                'total_cambios' => $grupo->count(),
            ];
        })->values()->toArray();
    }
}
