<?php

namespace App\Models;

use App\Models\Traits\HasActiveScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Impuesto extends Model
{
    use HasFactory, HasActiveScope;

    protected $fillable = [
        'codigo',
        'nombre',
        'descripcion',
        'porcentaje',
        'tipo_calculo',
        'monto_fijo',
        'incluido_en_precio',
        'aplica_ventas',
        'aplica_compras',
        'cuenta_contable',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'porcentaje' => 'decimal:2',
            'monto_fijo' => 'decimal:2',
            'incluido_en_precio' => 'boolean',
            'aplica_ventas' => 'boolean',
            'aplica_compras' => 'boolean',
            'activo' => 'boolean',
        ];
    }

    /**
     * Relación many-to-many con ventas
     */
    public function ventas(): BelongsToMany
    {
        return $this->belongsToMany(Venta::class, 'venta_impuestos')
            ->withPivot(['base_imponible', 'porcentaje_aplicado', 'monto_impuesto'])
            ->withTimestamps();
    }

    /**
     * Scope para impuestos activos
     */

    /**
     * Scope para impuestos que aplican a ventas
     */
    public function scopeParaVentas($query)
    {
        return $query->where('aplica_ventas', true);
    }

    /**
     * Scope para impuestos que aplican a compras
     */
    public function scopeParaCompras($query)
    {
        return $query->where('aplica_compras', true);
    }

    /**
     * Calcular el monto del impuesto para una base dada
     */
    public function calcularMonto(float $baseImponible): float
    {
        if ($this->tipo_calculo === 'porcentaje') {
            return $baseImponible * ($this->porcentaje / 100);
        }

        return $this->monto_fijo ?? 0;
    }
}
