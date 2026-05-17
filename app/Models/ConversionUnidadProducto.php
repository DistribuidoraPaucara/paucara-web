<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConversionUnidadProducto extends Model
{
    protected $table = 'conversiones_unidad_producto';

    protected $fillable = [
        'producto_id',
        'unidad_base_id',
        'unidad_destino_id',
        'factor_conversion',
        'activo',
        'es_conversion_principal',
    ];

    protected function casts(): array
    {
        return [
            'factor_conversion' => 'decimal:6',
            'activo' => 'boolean',
            'es_conversion_principal' => 'boolean',
        ];
    }

    /**
     * Relación: Producto al que pertenece esta conversión
     */
    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    /**
     * Relación: Unidad base (ej: CAJA - en la que se compra/almacena)
     */
    public function unidadBase(): BelongsTo
    {
        return $this->belongsTo(UnidadMedida::class, 'unidad_base_id');
    }

    /**
     * Relación: Unidad destino (ej: TABLETA - en la que se vende)
     */
    public function unidadDestino(): BelongsTo
    {
        return $this->belongsTo(UnidadMedida::class, 'unidad_destino_id');
    }

    /**
     * Convertir cantidad de unidad base a unidad destino
     * Ej: 1 caja * 100 = 100 tabletas
     *
     * @param float $cantidadBase
     * @return float
     */
    public function convertirADestino(float $cantidadBase): float
    {
        return $cantidadBase * (float) $this->factor_conversion;
    }

    /**
     * Convertir cantidad de unidad destino a unidad base
     * Ej: 100 tabletas / 100 = 1 caja
     *
     * @param float $cantidadDestino
     * @return float
     */
    public function convertirABase(float $cantidadDestino): float
    {
        return $cantidadDestino / (float) $this->factor_conversion;
    }

    /**
     * Validaciones antes de guardar
     */
    protected static function booted(): void
    {
        static::saving(function ($conversion) {
            // Validar que factor > 0
            if ((float) $conversion->factor_conversion <= 0) {
                throw new \InvalidArgumentException('El factor de conversión debe ser mayor a 0');
            }

            // Validar que unidades sean diferentes
            if ($conversion->unidad_base_id === $conversion->unidad_destino_id) {
                throw new \InvalidArgumentException('La unidad base y destino deben ser diferentes');
            }

            // Si es conversión principal, desactivar otras
            if ($conversion->es_conversion_principal && $conversion->activo) {
                static::where('producto_id', $conversion->producto_id)
                    ->where('id', '!=', $conversion->id ?? 0)
                    ->update(['es_conversion_principal' => false]);
            }
        });
    }

    /**
     * Scope: Solo conversiones activas
     */
    public function scopeActivas($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Scope: Por producto
     */
    public function scopeDelProducto($query, int $productoId)
    {
        return $query->where('producto_id', $productoId);
    }

    /**
     * Scope: Conversión principal
     */
    public function scopePrincipal($query)
    {
        return $query->where('es_conversion_principal', true)
            ->where('activo', true);
    }
}
