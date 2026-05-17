<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrecioRangoCantidadProducto extends Model
{
    use HasFactory;

    protected $table = 'precio_rango_cantidad_producto';

    /**
     * Get the route key for implicit model binding.
     */
    public function getRouteKeyName()
    {
        return 'id';
    }

    protected $fillable = [
        'empresa_id',
        'producto_id',
        'tipo_precio_id',
        'cantidad_minima',
        'cantidad_maxima',
        'fecha_vigencia_inicio',
        'fecha_vigencia_fin',
        'activo',
        'orden',
    ];

    protected function casts(): array
    {
        return [
            'cantidad_minima' => 'integer',
            'cantidad_maxima' => 'integer',
            'fecha_vigencia_inicio' => 'date',
            'fecha_vigencia_fin' => 'date',
            'activo' => 'boolean',
            'orden' => 'integer',
        ];
    }

    // ============================================================================
    // RELACIONES
    // ============================================================================

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'empresa_id');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    public function tipoPrecio()
    {
        return $this->belongsTo(TipoPrecio::class, 'tipo_precio_id');
    }

    // ============================================================================
    // SCOPES
    // ============================================================================

    /**
     * Obtener solo rangos activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Obtener rangos dentro de la vigencia actual
     */
    public function scopeVigentes($query)
    {
        $hoy = now()->toDateString();

        return $query->where(function ($q) use ($hoy) {
            $q->whereNull('fecha_vigencia_inicio')
                ->orWhere('fecha_vigencia_inicio', '<=', $hoy);
        })
            ->where(function ($q) use ($hoy) {
                $q->whereNull('fecha_vigencia_fin')
                    ->orWhere('fecha_vigencia_fin', '>=', $hoy);
            });
    }

    /**
     * Filtrar por empresa y producto
     */
    public function scopePorProducto($query, int|Producto $productoId, int|Empresa $empresaId = null)
    {
        $productoId = is_int($productoId) ? $productoId : $productoId->id;
        $empresaId = $empresaId ? (is_int($empresaId) ? $empresaId : $empresaId->id) : auth()->user()->empresa_id;

        return $query->where('empresa_id', $empresaId)
            ->where('producto_id', $productoId);
    }

    /**
     * Obtener el rango aplicable para una cantidad
     */
    public function scopeParaCantidad($query, int $cantidad)
    {
        return $query->where('cantidad_minima', '<=', $cantidad)
            ->where(function ($q) use ($cantidad) {
                $q->whereNull('cantidad_maxima')
                    ->orWhere('cantidad_maxima', '>=', $cantidad);
            });
    }

    /**
     * Ordenar por cantidad mínima descendente (para obtener el rango más específico)
     */
    public function scopeOrdenadoPorCantidad($query)
    {
        return $query->orderBy('cantidad_minima', 'desc')
            ->orderBy('orden', 'asc');
    }

    // ============================================================================
    // MÉTODOS ÚTILES
    // ============================================================================

    /**
     * Obtener el rango aplicable para una cantidad específica
     */
    public static function obtenerRangoParaCantidad(
        Producto|int $producto,
        int $cantidad,
        Empresa|int|null $empresa = null
    ): ?self {
        $productoId = $producto instanceof Producto ? $producto->id : $producto;
        $empresaId = match ($empresa) {
            null => auth()->user()->empresa_id ?? 1,
            Empresa::class => $empresa->id,
            default => $empresa,
        };

        return self::activos()
            ->vigentes()
            ->porProducto($productoId, $empresaId)
            ->paraCantidad($cantidad)
            ->ordenadoPorCantidad()
            ->first();
    }

    /**
     * Obtener el próximo rango superior a una cantidad
     */
    public static function obtenerProximoRango(
        Producto|int $producto,
        int $cantidad,
        Empresa|int|null $empresa = null
    ): ?self {
        $productoId = $producto instanceof Producto ? $producto->id : $producto;
        $empresaId = match ($empresa) {
            null => auth()->user()->empresa_id ?? 1,
            Empresa::class => $empresa->id,
            default => $empresa,
        };

        return self::activos()
            ->vigentes()
            ->porProducto($productoId, $empresaId)
            ->where('cantidad_minima', '>', $cantidad)
            ->orderBy('cantidad_minima', 'asc')
            ->first();
    }

    /**
     * Validar que no haya solapamiento en rangos
     */
    public static function validarNoSolapamiento(
        int $empresaId,
        int $productoId,
        int $cantidadMin,
        int $cantidadMax = null,
        int|null $excludeId = null
    ): bool {
        $query = self::where('empresa_id', $empresaId)
            ->where('producto_id', $productoId)
            ->where('activo', true);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return !$query->where(function ($q) use ($cantidadMin, $cantidadMax) {
            $q->where(function ($subQ) use ($cantidadMin, $cantidadMax) {
                // Rango actual: [cantidadMin, cantidadMax]
                // Rango BD:      [cantidad_minima, cantidad_maxima]
                // Solapamiento si: cantidad_minima <= cantidadMax AND (cantidad_maxima >= cantidadMin OR cantidad_maxima IS NULL)
                // Si cantidadMax es null (rango abierto), no comparamos cantidad_minima
                if ($cantidadMax !== null) {
                    $subQ->where('cantidad_minima', '<=', $cantidadMax);
                }
                $subQ->where(function ($subSubQ) use ($cantidadMin) {
                    $subSubQ->whereNull('cantidad_maxima')
                        ->orWhere('cantidad_maxima', '>=', $cantidadMin);
                });
            });
        })->exists();
    }
}
