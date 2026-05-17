<?php

namespace App\Events;

use App\Models\Venta;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento disparado cuando se crea una nueva venta
 *
 * ✅ Se dispara al finalizar la creación de una venta
 * ✅ Los listeners manejan:
 *    - Crear CuentaPorCobrar si politica_pago='CREDITO'
 *    - Actualizar Cliente crédito disponible
 *    - Notificaciones
 */
class VentaCreada
{
    use Dispatchable, SerializesModels;

    public Venta $venta;

    public function __construct(Venta $venta)
    {
        $this->venta = $venta;

        // Cargar relaciones necesarias
        $this->venta->load(['cliente', 'detalles']);
    }
}
