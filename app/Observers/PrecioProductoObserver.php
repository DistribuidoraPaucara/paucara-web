<?php

namespace App\Observers;

use App\Models\HistorialPrecio;
use App\Models\PrecioProducto;
use Illuminate\Support\Facades\Auth;

class PrecioProductoObserver
{
    /**
     * Handle the PrecioProducto "updating" event.
     */
    public function updating(PrecioProducto $precioProducto): void
    {
        // Se compara como número: "210" y "210.0000" son el mismo precio
        if ($precioProducto->isDirty('precio') && abs((float) $precioProducto->getOriginal('precio') - (float) $precioProducto->precio) >= 0.00005) {
            HistorialPrecio::create([
                'precio_producto_id' => $precioProducto->id,
                'valor_anterior' => $precioProducto->getOriginal('precio'),
                'valor_nuevo' => $precioProducto->precio,
                'fecha_cambio' => now(),
                'motivo' => $precioProducto->motivo_cambio ?? 'Actualización de precio',
                'usuario' => $precioProducto->usuarioCambio ?? Auth::user()?->name ?? 'sistema',
                'tipo_precio_id' => $precioProducto->tipo_precio_id,
            ]);
        }
    }
}
