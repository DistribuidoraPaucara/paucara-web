<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class EstadoLogistica extends Model
{
    protected $table = 'estados_logistica';

    protected $fillable = [
        'codigo',
        'categoria',
        'nombre',
        'descripcion',
        'orden',
        'activo',
        'color',
        'icono',
        'es_estado_final',
        'permite_edicion',
        'requiere_aprobacion',
        'metadatos',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'es_estado_final' => 'boolean',
        'permite_edicion' => 'boolean',
        'requiere_aprobacion' => 'boolean',
        'metadatos' => 'array',
    ];

    // ===== RELATIONSHIPS =====

    /**
     * Transiciones que SALEN desde este estado
     */
    public function transicionesDesde(): HasMany
    {
        return $this->hasMany(TransicionEstado::class, 'estado_origen_id');
    }

    /**
     * Transiciones que LLEGAN a este estado
     */
    public function transicionesHacia(): HasMany
    {
        return $this->hasMany(TransicionEstado::class, 'estado_destino_id');
    }

    /**
     * Estados destino reachables desde este estado
     */
    public function estadosDestino(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            EstadoLogistica::class,
            'transiciones_estado',
            'estado_origen_id',
            'estado_destino_id'
        )->wherePivot('activa', true);
    }

    /**
     * Mapeos donde este estado es origen
     */
    public function mapeosOrigen(): HasMany
    {
        return $this->hasMany(MapeoEstado::class, 'estado_origen_id');
    }

    /**
     * Mapeos donde este estado es destino
     */
    public function mapeosDestino(): HasMany
    {
        return $this->hasMany(MapeoEstado::class, 'estado_destino_id');
    }

    // ===== SCOPES =====

    /**
     * Filtrar por categoría
     */
    public function scopePorCategoria(Builder $query, string $categoria): Builder
    {
        return $query->where('categoria', $categoria)
                    ->where('activo', true)
                    ->orderBy('orden');
    }

    /**
     * Solo estados activos
     */
    public function scopeActivos(Builder $query): Builder
    {
        return $query->where('activo', true);
    }

    /**
     * Solo estados finales
     */
    public function scopeFinales(Builder $query): Builder
    {
        return $query->where('es_estado_final', true);
    }

    /**
     * Filtrar por código
     */
    public function scopePorCodigo(Builder $query, string $codigo): Builder
    {
        return $query->where('codigo', $codigo);
    }

    /**
     * Filtrar que permitan edición
     */
    public function scopeEditables(Builder $query): Builder
    {
        return $query->where('permite_edicion', true);
    }

    // ===== CUSTOM METHODS =====

    /**
     * Verificar si se puede hacer transición a otro estado
     */
    public function puedeTransicionarA(EstadoLogistica $estadoDestino): bool
    {
        return $this->transicionesDesde()
            ->where('estado_destino_id', $estadoDestino->id)
            ->where('activa', true)
            ->exists();
    }

    /**
     * Obtener todos los estados destino válidos
     */
    public function obtenerTransicionesValidas(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->transicionesDesde()
            ->where('activa', true)
            ->with('estadoDestino')
            ->get()
            ->pluck('estadoDestino');
    }

    /**
     * Obtener estados mapeados a otra categoría
     */
    public function obtenerMapeosA(string $categoriaDestino): \Illuminate\Database\Eloquent\Collection
    {
        return $this->mapeosOrigen()
            ->where('categoria_destino', $categoriaDestino)
            ->where('activo', true)
            ->with('estadoDestino')
            ->orderBy('prioridad', 'desc')
            ->get();
    }

    /**
     * Obtener el estado mapeado a otra categoría
     */
    public function obtenerMapeoA(string $categoriaDestino): ?self
    {
        $mapeo = $this->mapeosOrigen()
            ->where('categoria_destino', $categoriaDestino)
            ->where('activo', true)
            ->orderBy('prioridad', 'desc')
            ->first();

        return $mapeo?->estadoDestino;
    }

    /**
     * Verificar si este estado es final
     */
    public function esEstadoFinal(): bool
    {
        return $this->es_estado_final;
    }

    /**
     * Verificar si este estado permite edición
     */
    public function permiteEdicion(): bool
    {
        return $this->permite_edicion;
    }

    /**
     * Obtener label con estilo visual
     */
    public function toArray(): array
    {
        return array_merge(parent::toArray(), [
            'visual' => [
                'color' => $this->color,
                'icono' => $this->icono,
            ],
        ]);
    }
}
