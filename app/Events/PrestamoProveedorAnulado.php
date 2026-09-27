<?php

namespace App\Events;

use App\Models\PrestamoProveedor;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PrestamoProveedorAnulado
{
    use Dispatchable, SerializesModels;

    public PrestamoProveedor $prestamo;
    public ?string $razon;

    public function __construct(PrestamoProveedor $prestamo, ?string $razon = null)
    {
        $this->prestamo = $prestamo;
        $this->razon = $razon;
        $this->prestamo->load(['creador', 'detalles.prestable', 'proveedor']);
    }
}
