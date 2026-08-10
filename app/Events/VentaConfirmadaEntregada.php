<?php

namespace App\Events;

use App\Models\Venta;
use App\Models\Entrega;
use App\Models\EntregaVentaConfirmacion;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento que se dispara cuando un chofer confirma que una venta fue entregada
 *
 * La notificación WebSocket se envía a través de SendVentaConfirmadaEntregadaNotification listener
 * que hace HTTP POST al servidor Node.js (no usamos Broadcasting nativo de Laravel)
 *
 * Participantes:
 * - Cliente: "Tu pedido ha sido entregado"
 * - Preventista (si existe): "Tu venta fue entregada"
 * - Admins/Cajeros: Notificación de control
 */
class VentaConfirmadaEntregada
{
    use Dispatchable, SerializesModels;

    public Venta $venta;
    public Entrega $entrega;
    public EntregaVentaConfirmacion $confirmacion;
    public string $tipoEntrega;      // COMPLETA o CON_NOVEDAD
    public ?string $tipoNovedad;     // Tipo específico de novedad si aplica
    public ?string $estadoPago;      // PAGADO, PARCIAL, NO_PAGADO, CREDITO
    public ?float $totalRecibido;

    /**
     * Create a new event instance.
     */
    public function __construct(
        Venta $venta,
        Entrega $entrega,
        EntregaVentaConfirmacion $confirmacion,
        string $tipoEntrega = 'COMPLETA',
        ?string $tipoNovedad = null,
        ?string $estadoPago = 'PAGADO',
        ?float $totalRecibido = 0
    ) {
        $this->venta = $venta;
        $this->entrega = $entrega;
        $this->confirmacion = $confirmacion;
        $this->tipoEntrega = $tipoEntrega;
        $this->tipoNovedad = $tipoNovedad;
        $this->estadoPago = $estadoPago ?? 'PAGADO';
        $this->totalRecibido = $totalRecibido ?? 0;

        // Cargar relaciones necesarias
        $this->venta->load(['cliente', 'preventista', 'estadoLogistica']);
        $this->entrega->load('chofer');
    }
}
