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
 *    - Crear CuentaPorCobrar si tipo_pago.es_credito=true
 *    - Actualizar Cliente crédito disponible
 *    - Notificaciones
 */
class VentaCreada
{
    use Dispatchable, SerializesModels;

    public Venta $venta;
    public bool $tienePagosDesglosados; // ✅ NUEVO (2026-07-24): Flag para saber si se crearán pagos desglosados

    public function __construct(Venta $venta, bool $tienePagosDesglosados = false)
    {
        $this->venta = $venta;
        $this->tienePagosDesglosados = $tienePagosDesglosados;

        // Cargar relaciones necesarias
        $this->venta->load(['cliente', 'detalles', 'tipoPago']);
    }
}
