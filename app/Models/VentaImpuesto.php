<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VentaImpuesto extends Model
{
    use HasFactory;

    protected $table = 'venta_impuestos';

    protected $fillable = [
        'venta_id',
        'impuesto_id',
        'base_imponible',
        'monto_impuesto',
        'porcentaje_aplicado',
    ];

    protected function casts(): array
    {
        return [
            'base_imponible' => 'decimal:2',
            'monto_impuesto' => 'decimal:2',
            'porcentaje_aplicado' => 'decimal:4',
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
     * Relación con impuesto
     */
    public function impuesto(): BelongsTo
    {
        return $this->belongsTo(Impuesto::class);
    }

    /**
     * Calcular el monto del impuesto basado en la tasa y base imponible
     */
    public function calcularMontoImpuesto(): float
    {
        if ($this->impuesto->tipo_calculo === 'porcentaje') {
            return $this->base_imponible * ($this->porcentaje_aplicado / 100);
        } else {
            // Tipo fijo
            return $this->porcentaje_aplicado;
        }
    }

    /**
     * Verificar si el impuesto es IVA
     */
    public function esIva(): bool
    {
        return $this->impuesto->codigo === 'IVA';
    }

    /**
     * Verificar si el impuesto es ICE (Impuesto al Consumo Específico)
     */
    public function esIce(): bool
    {
        return $this->impuesto->codigo === 'ICE';
    }

    /**
     * Verificar si el impuesto es IT (Impuesto a las Transacciones)
     */
    public function esIt(): bool
    {
        return $this->impuesto->codigo === 'IT';
    }
}
