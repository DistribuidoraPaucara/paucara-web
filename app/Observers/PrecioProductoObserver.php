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
        if ($precioProducto->isDirty('precio')) {
            HistorialPrecio::create([
                'precio_producto_id' => $precioProducto->id,
                'valor_anterior' => $precioProducto->getOriginal('precio'),
                'valor_nuevo' => $precioProducto->precio,
                'fecha_cambio' => now(),
                'motivo' => $precioProducto->motivo_cambio ?? 'Actualización de precio',
                'usuario' => Auth::user()?->name ?? 'sistema',
                'tipo_precio_id' => $precioProducto->tipo_precio_id,
            ]);
        }
    }
}
