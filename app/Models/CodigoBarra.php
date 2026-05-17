<?php

namespace App\Models;

use App\Models\Traits\HasActiveScope;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CodigoBarra extends Model
{
    use HasFactory, HasActiveScope;

    protected $table = 'codigos_barra';

    protected $fillable = [
        'producto_id',
        'codigo',
        'tipo',
        'es_principal',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'es_principal' => 'boolean',
            'activo' => 'boolean',
        ];
    }

    /**
     * Relación con el producto
     */
    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    /**
     * Scope para códigos activos
     */

    /**
     * Scope para código principal
     */
    public function scopePrincipal($query)
    {
        return $query->where('es_principal', true);
    }

    /**
     * Obtener el segundo código de barra activo (después del principal)
     */
    public static function obtenerSegundoCodigoActivo($productoId): ?string
    {
        return self::where('producto_id', $productoId)
            ->where('activo', true)
            ->orderBy('es_principal', 'desc')
            ->skip(1) // Saltar el primero (principal)
            ->first()?->codigo;
    }
}
