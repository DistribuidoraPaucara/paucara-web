<?php

namespace App\Events;

use App\Models\Venta;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento disparado cuando se registra un pago en una venta
 *
 * DISPARO:
 * - Cuando VentaService::registrarPago() registra un pago
 * - Se dispara incluso si el pago es parcial
 * - También se dispara cuando se completa el pago (estado = PAGADA)
 *
 * LISTENERS:
 * - Notificar al cliente del pago recibido
 * - Actualizar estado de cobranza
 * - Generar recibos/comprobantes
 * - Sincronizar con contabilidad
 * - Actualizar flujo de tesorería
 */
class VentaPagada
{
    use Dispatchable, SerializesModels;

    public Venta $venta;
    public float $monto;

    public function __construct(Venta $venta, float $monto)
    {
        $this->venta = $venta;
        $this->monto = $monto;
        
        // Cargar relaciones necesarias
        $this->venta->load(['cliente', 'detalles.producto', 'usuario']);
    }
}
