<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacturaElectronica extends Model
{
    use HasFactory;

    protected $table = 'facturas_electronicas';

    protected $fillable = [
        'cuf',
        'numero_factura',
        'nit_emisor',
        'fecha_emision',
        'hora_emision',
        'monto_total',
        'monto_total_sujeto_iva',
        'monto_total_moneda_extranjera',
        'tipo_cambio',
        'codigo_moneda',
        'codigo_punto_venta',
        'modalidad',
        'tipo_emision',
        'tipo_factura_documento',
        'estado',
        'codigo_recepcion',
        'xml_firmado',
        'respuesta_sin',
        'fecha_envio_sin',
        'fecha_procesamiento_sin',
        'observaciones_sin',
        'venta_id',
    ];

    protected function casts(): array
    {
        return [
            'fecha_emision' => 'date',
            'hora_emision' => 'datetime:H:i:s',
            'monto_total' => 'decimal:2',
            'monto_total_sujeto_iva' => 'decimal:2',
            'monto_total_moneda_extranjera' => 'decimal:2',
            'tipo_cambio' => 'decimal:4',
            'codigo_moneda' => 'integer',
            'fecha_envio_sin' => 'datetime',
            'fecha_procesamiento_sin' => 'datetime',
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
     * Scope para facturas vigentes
     */
    public function scopeVigentes($query)
    {
        return $query->where('estado', 'vigente');
    }

    /**
     * Scope para facturas anuladas
     */
    public function scopeAnuladas($query)
    {
        return $query->where('estado', 'anulada');
    }

    /**
     * Scope para facturas observadas
     */
    public function scopeObservadas($query)
    {
        return $query->where('estado', 'observada');
    }

    /**
     * Verificar si la factura fue procesada por el SIN
     */
    public function estaProcesadaPorSin(): bool
    {
        return ! is_null($this->codigo_recepcion) && ! is_null($this->fecha_procesamiento_sin);
    }

    /**
     * Obtener estado de procesamiento SIN
     */
    public function getEstadoProcesamientoAttribute(): string
    {
        if (is_null($this->fecha_envio_sin)) {
            return 'pendiente_envio';
        }

        if (is_null($this->codigo_recepcion)) {
            return 'enviado_sin_respuesta';
        }

        if (! is_null($this->observaciones_sin)) {
            return 'observada';
        }

        return 'procesada_exitosamente';
    }
}
