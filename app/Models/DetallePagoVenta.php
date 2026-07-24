<?php

namespace App\Models;

use App\Events\DetallePagoVentaCreated;
use Illuminate\Database\Eloquent\Model;

class DetallePagoVenta extends Model
{
    protected $table = 'detalles_pago_venta';

    protected $fillable = [
        'venta_id',
        'tipo_pago_id',
        'monto',
        'referencia',
        'fecha_pago',
        'comprobante',
        'observaciones',
    ];

    // ✅ NUEVO (2026-07-24): Eventos que se disparan cuando se crea el modelo
    protected $dispatchesEvents = [
        'created' => DetallePagoVentaCreated::class,
    ];

    protected function casts(): array
    {
        return [
            'monto' => 'decimal:2',
            'fecha_pago' => 'datetime',
        ];
    }

    public function venta()
    {
        return $this->belongsTo(Venta::class);
    }

    public function tipoPago()
    {
        return $this->belongsTo(TipoPago::class);
    }
}
