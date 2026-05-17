<?php
namespace App\Models;

use App\Models\Traits\HasActiveScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoPrecio extends Model
{
    use HasFactory, HasActiveScope;

    protected $table = 'tipos_precio';

    protected $fillable = [
        'codigo',
        'nombre',
        'descripcion',
        'color',
        'es_ganancia',
        'es_precio_base',
        'porcentaje_ganancia',
        'orden',
        'activo',
        'es_sistema',
        'configuracion',
    ];

    protected function casts(): array
    {
        return [
            'es_ganancia'         => 'boolean',
            'es_precio_base'      => 'boolean',
            'activo'              => 'boolean',
            'es_sistema'          => 'boolean',
            'configuracion'       => 'array',
            'orden'               => 'integer',
            'porcentaje_ganancia' => 'decimal:2',
        ];
    }

    /**
     * Relaciones
     */
    public function precios()
    {
        return $this->hasMany(PrecioProducto::class, 'tipo_precio_id');
    }

    public function configuracionesGanancias()
    {
        return $this->hasMany(ConfiguracionGanancia::class, 'tipo_precio_id');
    }

    /**
     * Scopes
     */

    public function scopeOrdenados($query)
    {
        return $query->orderBy('orden', 'asc')->orderBy('id', 'asc');
    }

    public function scopeGanancias($query)
    {
        return $query->where('es_ganancia', true);
    }

    public function scopePrecioBase($query)
    {
        return $query->where('es_precio_base', true);
    }

    public function scopeSistema($query)
    {
        return $query->where('es_sistema', true);
    }

    public function scopePersonalizados($query)
    {
        return $query->where('es_sistema', false);
    }

    /**
     * Métodos auxiliares
     */
    public function esGanancia(): bool
    {
        return $this->es_ganancia;
    }

    public function esPrecioBase(): bool
    {
        return $this->es_precio_base;
    }

    public function esSistema(): bool
    {
        return $this->es_sistema;
    }

    public function getIcono(): string
    {
        return $this->configuracion['icono'] ?? '💰';
    }

    public function getTooltip(): string
    {
        return $this->configuracion['tooltip'] ?? $this->descripcion ?? '';
    }

    /**
     * Obtener opciones para select/dropdown
     */
    public static function getOptions(): array
    {
        return static::activos()
            ->ordenados()
            ->get()
            ->map(function ($tipo) {
                return [
                    'value'               => $tipo->id,
                    'code'                => $tipo->codigo,
                    'label'               => $tipo->nombre,
                    'description'         => $tipo->descripcion,
                    'color'               => $tipo->color,
                    'es_ganancia'         => $tipo->es_ganancia,
                    'es_precio_base'      => $tipo->es_precio_base,
                    'icono'               => $tipo->getIcono(),
                    'tooltip'             => $tipo->getTooltip(),
                    'configuracion'       => $tipo->configuracion,
                    'porcentaje_ganancia' => $tipo->porcentaje_ganancia,
                ];
            })
            ->toArray();
    }

    /**
     * Buscar por código
     */
    public static function porCodigo(string $codigo): ?self
    {
        return static::where('codigo', strtoupper($codigo))->first();
    }

    /**
     * Obtener tipo de precio de costo (base)
     */
    public static function costo(): ?self
    {
        return static::precioBase()->first();
    }

    /**
     * Validar si se puede eliminar
     */
    public function puedeEliminarse(): bool
    {
        // No se pueden eliminar tipos de sistema
        if ($this->es_sistema) {
            return false;
        }

        // No se puede eliminar si tiene precios asociados
        if ($this->precios()->exists()) {
            return false;
        }

        return true;
    }
}
