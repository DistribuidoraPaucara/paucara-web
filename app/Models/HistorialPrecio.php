<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistorialPrecio extends Model
{
    use HasFactory;

    protected $table = 'historial_precios';

    protected $fillable = [
        'precio_producto_id',
        'valor_anterior',
        'valor_nuevo',
        'fecha_cambio',
        'motivo',
        'usuario',
        'tipo_precio_id', // Cambiar de 'tipo_precio' a 'tipo_precio_id'
        'porcentaje_cambio',
    ];

    protected function casts(): array
    {
        return [
            'valor_anterior' => 'decimal:2',
            'valor_nuevo' => 'decimal:2',
            'fecha_cambio' => 'datetime',
            'porcentaje_cambio' => 'decimal:2',
        ];
    }

    public function precioProducto()
    {
        return $this->belongsTo(PrecioProducto::class);
    }

    public function tipoPrecio()
    {
        return $this->belongsTo(TipoPrecio::class, 'tipo_precio_id');
    }

    /**
     * Calcular automáticamente el porcentaje de cambio
     */
    public static function boot()
    {
        parent::boot();

        static::creating(function ($historial) {
            if ($historial->valor_anterior > 0) {
                $historial->porcentaje_cambio = (($historial->valor_nuevo - $historial->valor_anterior) / $historial->valor_anterior) * 100;
            }
        });
    }

    /**
     * Scope para obtener cambios por tipo de precio
     */
    public function scopePorTipoPrecio($query, $tipoPrecio)
    {
        if (is_numeric($tipoPrecio)) {
            return $query->where('tipo_precio_id', $tipoPrecio);
        }

        if (is_string($tipoPrecio)) {
            $tipo = TipoPrecio::porCodigo($tipoPrecio);

            return $query->where('tipo_precio_id', $tipo?->id);
        }

        if ($tipoPrecio instanceof TipoPrecio) {
            return $query->where('tipo_precio_id', $tipoPrecio->id);
        }

        return $query;
    }

    /**
     * Scope para obtener cambios en un rango de fechas
     */
    public function scopeEntreFechas($query, $fechaInicio, $fechaFin)
    {
        return $query->whereBetween('fecha_cambio', [$fechaInicio, $fechaFin]);
    }
}
