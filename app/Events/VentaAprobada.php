<?php

namespace App\Events;

use App\Models\Venta;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento disparado cuando se aprueba una venta
 *
 * DISPARO:
 * - Cuando VentaService::aprobar() cambia estado a APROBADA
 * - Después de actualizar la venta en base de datos
 *
 * LISTENERS:
 * - Pueden notificar al cliente
 * - Actualizar reportes
 * - Sincronizar con contabilidad
 */
class VentaAprobada
{
    use Dispatchable, SerializesModels;

    public Venta $venta;

    public function __construct(Venta $venta)
    {
        $this->venta = $venta;
        
        // Cargar relaciones necesarias
        $this->venta->load(['cliente', 'detalles.producto', 'usuario']);
    }
}
