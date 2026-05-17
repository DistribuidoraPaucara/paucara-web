<?php

namespace App\Models;

use App\Models\Traits\HasActiveScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Moneda extends Model
{
    use HasFactory, HasActiveScope;

    protected $table = 'monedas';

    protected $fillable = [
        'nombre',
        'codigo',
        'simbolo',
        'tasa_cambio',
        'es_moneda_base',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'tasa_cambio' => 'decimal:6',
            'es_moneda_base' => 'boolean',
            'activo' => 'boolean',
        ];
    }

    // Scopes
    public function scopeMonedaBase($query)
    {
        return $query->where('es_moneda_base', true);
    }

    // Métodos estáticos
    public static function getMonedaBase()
    {
        return static::monedaBase()->first();
    }

    public static function convertir($monto, $monedaOrigen, $monedaDestino)
    {
        $monedaBase = static::getMonedaBase();

        if (! $monedaBase) {
            throw new \Exception('No hay moneda base configurada');
        }

        // Si es la misma moneda, no convertir
        if ($monedaOrigen->id === $monedaDestino->id) {
            return $monto;
        }

        // Convertir a moneda base primero
        $montoEnBase = $monedaOrigen->es_moneda_base ?
        $monto :
        $monto / $monedaOrigen->tasa_cambio;

        // Convertir de moneda base a destino
        $montoConvertido = $monedaDestino->es_moneda_base ?
        $montoEnBase :
        $montoEnBase * $monedaDestino->tasa_cambio;

        return round($montoConvertido, 6);
    }

    // Validaciones personalizadas
    protected static function booted()
    {
        // Al crear una moneda base, desactivar otras monedas base
        static::creating(function ($moneda) {
            if ($moneda->es_moneda_base) {
                static::where('es_moneda_base', true)->update(['es_moneda_base' => false]);
            }
        });

        // Al actualizar una moneda base, desactivar otras monedas base
        static::updating(function ($moneda) {
            if ($moneda->es_moneda_base && $moneda->isDirty('es_moneda_base')) {
                static::where('es_moneda_base', true)
                    ->where('id', '!=', $moneda->id)
                    ->update(['es_moneda_base' => false]);
            }
        });
    }

    // Relaciones
    public function preciosProductos()
    {
        return $this->hasMany(PrecioProducto::class);
    }

    public function compras()
    {
        return $this->hasMany(Compra::class, 'moneda_id');
    }

    // Accessors
    public function getFormattedTasaCambioAttribute()
    {
        return number_format($this->tasa_cambio, 6, '.', '');
    }

    public function formatMonto($monto, $decimales = 2)
    {
        return $this->simbolo.' '.number_format($monto, $decimales, ',', '.');
    }
}
