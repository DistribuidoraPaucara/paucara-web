<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LibroVentasIva extends Model
{
    use HasFactory;

    protected $table = 'libro_ventas_iva';

    protected $fillable = [
        'fecha',
        'numero_factura',
        'numero_autorizacion',
        'nit_ci_cliente',
        'razon_social_cliente',
        'importe_total',
        'importe_ice',
        'importe_iehd',
        'importe_ipj',
        'tasas',
        'importe_gift_card',
        'descuentos',
        'importe_base_cf',
        'credito_fiscal',
        'estado_factura',
        'codigo_control',
        'venta_id',
        'tipo_documento_id',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'importe_total' => 'decimal:2',
            'importe_ice' => 'decimal:2',
            'importe_iehd' => 'decimal:2',
            'importe_ipj' => 'decimal:2',
            'tasas' => 'decimal:2',
            'importe_gift_card' => 'decimal:2',
            'descuentos' => 'decimal:2',
            'importe_base_cf' => 'decimal:2',
            'credito_fiscal' => 'decimal:2',
        ];
    }

    /**
     * Relación con venta
     */
    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class);
    }

    /**
     * Relación con tipo de documento
     */
    public function tipoDocumento(): BelongsTo
    {
        return $this->belongsTo(TipoDocumento::class);
    }

    /**
     * Scope para facturas vigentes
     */
    public function scopeVigentes($query)
    {
        return $query->where('estado_factura', 'vigente');
    }

    /**
     * Scope para facturas anuladas
     */
    public function scopeAnuladas($query)
    {
        return $query->where('estado_factura', 'anulada');
    }
}
