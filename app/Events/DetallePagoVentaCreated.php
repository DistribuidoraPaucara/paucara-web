<?php

namespace App\Events;

use App\Models\DetallePagoVenta;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DetallePagoVentaCreated
{
    use Dispatchable, SerializesModels;

    /**
     * ✅ NUEVO (2026-07-24): Evento disparado cuando se crea un DetallePagoVenta
     */
    public function __construct(public DetallePagoVenta $detallePago)
    {
    }
}
