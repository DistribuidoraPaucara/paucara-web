<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Localidad extends Model
{
    use HasFactory;

    protected $table = 'localidades';

    protected $fillable = [
        'nombre',
        'codigo',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
        ];
    }

    /**
     * Zonas que incluyen esta localidad
     */
    public function zonas(): BelongsToMany
    {
        return $this->belongsToMany(Zona::class, 'localidad_zona')
                    ->withTimestamps();
    }

    /**
     * Clientes en esta localidad
     */
    public function clientes(): HasMany
    {
        return $this->hasMany(Cliente::class, 'localidad_id');
    }

    /**
     * Rutas en esta localidad
     */
    public function rutas(): HasMany
    {
        return $this->hasMany(Ruta::class);
    }

    /**
     * Direcciones de clientes en esta localidad
     */
    public function direccionesCliente(): HasMany
    {
        return $this->hasMany(DireccionCliente::class);
    }

    /**
     * Scope para localidades activas
     */
    public function scopeActivas($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Obtener zona principal (si existe solo una zona)
     */
    public function getZonaPrincipalAttribute(): ?Zona
    {
        return $this->zonas()->first();
    }
}
