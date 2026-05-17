<?php

namespace App\Events;

use App\Models\Venta;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento disparado cuando se rechaza una venta
 *
 * DISPARO:
 * - Cuando VentaService::rechazar() cambia estado a RECHAZADA
 * - Después de revertir stock y cambiar estado
 *
 * LISTENERS:
 * - Pueden notificar al cliente del rechazo
 * - Registrar motivo en auditoría
 * - Sincronizar con contabilidad
 * - Generar reportes de rechazos
 */
class VentaRechazada
{
    use Dispatchable, SerializesModels;

    public Venta $venta;
    public string $motivo;

    public function __construct(Venta $venta, string $motivo = '')
    {
        $this->venta = $venta;
        $this->motivo = $motivo;
        
        // Cargar relaciones necesarias
        $this->venta->load(['cliente', 'detalles.producto', 'usuario']);
    }
}
