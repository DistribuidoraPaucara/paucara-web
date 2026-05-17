<?php

namespace App\Events;

use App\Models\Proforma;
use App\Models\Venta;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento disparado cuando una proforma es convertida a venta
 *
 * ✅ NO implementa ShouldBroadcast
 * ✅ El listener SendProformaConvertedNotification maneja las notificaciones
 * ✅ Usa el patrón correcto como ProformaAprobada (que SÍ funciona)
 */
class ProformaConvertida
{
    use Dispatchable, SerializesModels;

    public Proforma $proforma;
    public Venta $venta;

    public function __construct(Proforma $proforma, Venta $venta)
    {
        $this->proforma = $proforma;
        $this->venta = $venta;

        $this->proforma->load(['cliente', 'usuarioCreador']);
        $this->venta->load(['cliente']);
    }
}
