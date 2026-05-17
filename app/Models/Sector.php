<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sector extends Model
{
    use HasFactory;

    protected $table = 'sectores';

    protected $fillable = [
        'almacen_id',
        'nombre',
        'es_generico',
        'descripcion',
        'stock_minimo',
        'stock_maximo',
    ];

    protected function casts(): array
    {
        return [
            'es_generico' => 'boolean',
        ];
    }

    /**
     * Relación: Un sector pertenece a un almacén
     */
    public function almacen(): BelongsTo
    {
        return $this->belongsTo(Almacen::class, 'almacen_id');
    }

    /**
     * Relación: Un sector tiene muchos stocks de productos
     */
    public function stockProductos(): HasMany
    {
        return $this->hasMany(StockProducto::class, 'sector_id');
    }

    /**
     * Scope: Obtener solo sectores genéricos
     */
    public function scopeGenerico($query)
    {
        return $query->where('es_generico', true);
    }

    /**
     * Scope: Obtener solo sectores personalizados (no genéricos)
     */
    public function scopePersonalizado($query)
    {
        return $query->where('es_generico', false);
    }

    /**
     * Scope: Filtrar por almacén
     */
    public function scopePorAlmacen($query, $almacenId)
    {
        return $query->where('almacen_id', $almacenId);
    }

    /**
     * Obtener el sector genérico de un almacén
     * Uso: Almacen::find(1)->sectorGenerico()
     */
    public static function obtenerGenericoDelAlmacen($almacenId): ?self
    {
        return self::where('almacen_id', $almacenId)
            ->where('es_generico', true)
            ->first();
    }

    /**
     * Método auxiliar para obtener nombre formateado
     */
    public function getNombreFormateadoAttribute(): string
    {
        if ($this->es_generico) {
            return "{$this->nombre} ({$this->almacen->nombre})";
        }
        return $this->nombre;
    }
}
