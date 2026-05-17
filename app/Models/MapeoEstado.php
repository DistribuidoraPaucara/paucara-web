<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class MapeoEstado extends Model
{
    protected $table = 'mapeos_estado';

    protected $fillable = [
        'categoria_origen',
        'estado_origen_id',
        'categoria_destino',
        'estado_destino_id',
        'prioridad',
        'activo',
        'descripcion',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    // ===== RELATIONSHIPS =====

    /**
     * Estado origen del mapeo
     */
    public function estadoOrigen(): BelongsTo
    {
        return $this->belongsTo(EstadoLogistica::class, 'estado_origen_id');
    }

    /**
     * Estado destino del mapeo
     */
    public function estadoDestino(): BelongsTo
    {
        return $this->belongsTo(EstadoLogistica::class, 'estado_destino_id');
    }

    // ===== SCOPES =====

    /**
     * Filtrar mapeos activos
     */
    public function scopeActivos(Builder $query): Builder
    {
        return $query->where('activo', true);
    }

    /**
     * Filtrar por categoría origen
     */
    public function scopeDesdeCategoria(Builder $query, string $categoria): Builder
    {
        return $query->where('categoria_origen', $categoria);
    }

    /**
     * Filtrar por categoría destino
     */
    public function scopeHaciaCategoria(Builder $query, string $categoria): Builder
    {
        return $query->where('categoria_destino', $categoria);
    }

    /**
     * Filtrar por estado origen
     */
    public function scopeDesdeEstado(Builder $query, EstadoLogistica $estado): Builder
    {
        return $query->where('estado_origen_id', $estado->id);
    }

    /**
     * Filtrar por categoría origen y destino
     */
    public function scopeEntreCategorias(Builder $query, string $categoriaOrigen, string $categoriaDestino): Builder
    {
        return $query->where('categoria_origen', $categoriaOrigen)
                    ->where('categoria_destino', $categoriaDestino);
    }

    /**
     * Ordenar por prioridad descendente
     */
    public function scopePorPrioridad(Builder $query): Builder
    {
        return $query->orderBy('prioridad', 'desc');
    }

    // ===== CUSTOM METHODS =====

    /**
     * Mapear estado: busca el estado destino equivalente
     *
     * @param EstadoLogistica|string $estadoOrigen El estado a mapear (objeto o código)
     * @param string $categoriaDestino Categoría objetivo del mapeo
     * @return EstadoLogistica|null El estado mapeado o null si no existe mapeo
     */
    public static function mapear($estadoOrigen, string $categoriaDestino): ?EstadoLogistica
    {
        // Si recibe un string, buscar el estado primero
        if (is_string($estadoOrigen)) {
            $estadoOrigen = EstadoLogistica::porCodigo($estadoOrigen)->first();
            if (!$estadoOrigen) {
                return null;
            }
        }

        $mapeo = self::activos()
            ->where('estado_origen_id', $estadoOrigen->id)
            ->where('categoria_destino', $categoriaDestino)
            ->porPrioridad()
            ->first();

        return $mapeo?->estadoDestino;
    }

    /**
     * Obtener todos los mapeos desde un estado a una categoría
     */
    public static function obtenerMapeos(EstadoLogistica $estado, string $categoriaDestino): \Illuminate\Database\Eloquent\Collection
    {
        return self::activos()
            ->desdeEstado($estado)
            ->haciaCategoria($categoriaDestino)
            ->with('estadoDestino')
            ->porPrioridad()
            ->get();
    }

    /**
     * Obtener descripción del mapeo
     */
    public function getDescripcion(): string
    {
        if ($this->descripcion) {
            return $this->descripcion;
        }

        return "{$this->estadoOrigen->codigo} ({$this->categoria_origen}) → {$this->estadoDestino->codigo} ({$this->categoria_destino})";
    }

    /**
     * Convertir a array con información completa
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'origen' => [
                'codigo' => $this->estadoOrigen->codigo,
                'nombre' => $this->estadoOrigen->nombre,
                'categoria' => $this->categoria_origen,
            ],
            'destino' => [
                'codigo' => $this->estadoDestino->codigo,
                'nombre' => $this->estadoDestino->nombre,
                'categoria' => $this->categoria_destino,
            ],
            'prioridad' => $this->prioridad,
            'descripcion' => $this->getDescripcion(),
            'activo' => $this->activo,
        ];
    }
}
