<?php

namespace App\Models;

use App\Models\Traits\HasActiveScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConfiguracionGanancia extends Model
{
    use HasFactory, HasActiveScope;

    protected $table = 'configuracion_ganancias';

    protected $fillable = [
        'producto_id',
        'tipo_precio_id',
        'margen_minimo',
        'margen_maximo',
        'porcentaje_ganancia_esperado',
        'precio_base_referencia',
        'calcular_automatico',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'margen_minimo' => 'decimal:2',
            'margen_maximo' => 'decimal:2',
            'porcentaje_ganancia_esperado' => 'decimal:2',
            'precio_base_referencia' => 'decimal:2',
            'calcular_automatico' => 'boolean',
            'activo' => 'boolean',
        ];
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    public function tipoPrecio()
    {
        return $this->belongsTo(TipoPrecio::class, 'tipo_precio_id');
    }

    /**
     * Calcular ganancia basada en precio de costo y precio de venta
     */
    public function calcularGanancia(float $precioCosto, float $precioVenta): float
    {
        return $precioVenta - $precioCosto;
    }

    /**
     * Calcular porcentaje de ganancia
     */
    public function calcularPorcentajeGanancia(float $precioCosto, float $precioVenta): float
    {
        if ($precioCosto == 0) {
            return 0;
        }

        return (($precioVenta - $precioCosto) / $precioCosto) * 100;
    }

    /**
     * Validar si el margen está dentro de los límites permitidos
     */
    public function validarMargen(float $ganancia): bool
    {
        if ($ganancia < $this->margen_minimo) {
            return false;
        }
        if ($this->margen_maximo && $ganancia > $this->margen_maximo) {
            return false;
        }

        return true;
    }

    /**
     * Calcular precio automáticamente basado en la configuración
     */
    public function calcularPrecioAutomatico(float $precioCosto): float
    {
        if (! $this->calcular_automatico) {
            return 0;
        }

        $gananciaEsperada = ($precioCosto * $this->porcentaje_ganancia_esperado) / 100;

        return $precioCosto + $gananciaEsperada;
    }

    /**
     * Obtener porcentaje de ganancia efectivo (configuración específica o global)
     */
    public function getPorcentajeGananciaEfectivo(): float
    {
        return $this->porcentaje_ganancia_esperado ?? ConfiguracionGlobal::porcentajeInteresGeneral();
    }

    /**
     * Obtener margen mínimo efectivo (configuración específica o global)
     */
    public function getMargenMinimoEfectivo(): float
    {
        return $this->margen_minimo ?? ConfiguracionGlobal::margenMinimoGlobal();
    }

    /**
     * Verificar si debe calcularse automáticamente (configuración específica o global)
     */
    public function debeCalcularseAutomatico(): bool
    {
        return $this->calcular_automatico ?? ConfiguracionGlobal::aplicarInteresAutomatico();
    }

    /**
     * Aplicar configuración global como valores por defecto
     */
    public function aplicarConfiguracionGlobal(): self
    {
        $this->fill([
            'margen_minimo' => $this->margen_minimo ?? ConfiguracionGlobal::margenMinimoGlobal(),
            'porcentaje_ganancia_esperado' => $this->porcentaje_ganancia_esperado ?? ConfiguracionGlobal::porcentajeInteresGeneral(),
            'calcular_automatico' => $this->calcular_automatico ?? ConfiguracionGlobal::aplicarInteresAutomatico(),
        ]);

        return $this;
    }

    /**
     * Scope para obtener configuraciones que usan valores automáticos
     */
    public function scopeAutomaticas($query)
    {
        return $query->where('calcular_automatico', true);
    }

    /**
     * Boot del modelo
     */
    protected static function boot()
    {
        parent::boot();

        // Al crear, aplicar valores globales si no se especifican
        static::creating(function ($configuracion) {
            $configuracion->aplicarConfiguracionGlobal();
        });
    }
}
