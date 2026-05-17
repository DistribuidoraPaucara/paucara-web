<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class TransicionEstado extends Model
{
    protected $table = 'transiciones_estado';

    protected $fillable = [
        'estado_origen_id',
        'estado_destino_id',
        'categoria',
        'requiere_permiso',
        'descripcion',
        'automatica',
        'notificar',
        'activa',
    ];

    protected $casts = [
        'automatica' => 'boolean',
        'notificar' => 'boolean',
        'activa' => 'boolean',
    ];

    // ===== RELATIONSHIPS =====

    /**
     * Estado de origen de la transición
     */
    public function estadoOrigen(): BelongsTo
    {
        return $this->belongsTo(EstadoLogistica::class, 'estado_origen_id');
    }

    /**
     * Estado destino de la transición
     */
    public function estadoDestino(): BelongsTo
    {
        return $this->belongsTo(EstadoLogistica::class, 'estado_destino_id');
    }

    // ===== SCOPES =====

    /**
     * Filtrar transiciones activas
     */
    public function scopeActivas(Builder $query): Builder
    {
        return $query->where('activa', true);
    }

    /**
     * Filtrar por categoría
     */
    public function scopePorCategoria(Builder $query, string $categoria): Builder
    {
        return $query->where('categoria', $categoria);
    }

    /**
     * Filtrar transiciones automáticas
     */
    public function scopeAutomaticas(Builder $query): Builder
    {
        return $query->where('automatica', true);
    }

    /**
     * Filtrar transiciones que requieren permiso
     */
    public function scopeConPermiso(Builder $query): Builder
    {
        return $query->whereNotNull('requiere_permiso');
    }

    /**
     * Filtrar por estado origen
     */
    public function scopeDesdeEstado(Builder $query, EstadoLogistica $estado): Builder
    {
        return $query->where('estado_origen_id', $estado->id);
    }

    /**
     * Filtrar por estado destino
     */
    public function scopeHaciaEstado(Builder $query, EstadoLogistica $estado): Builder
    {
        return $query->where('estado_destino_id', $estado->id);
    }

    // ===== CUSTOM METHODS =====

    /**
     * Verificar si requiere permiso específico
     */
    public function requierePermiso(): bool
    {
        return !empty($this->requiere_permiso);
    }

    /**
     * Obtener descripción de la transición
     */
    public function getDescripcion(): string
    {
        if ($this->descripcion) {
            return $this->descripcion;
        }

        return "{$this->estadoOrigen->nombre} → {$this->estadoDestino->nombre}";
    }

    /**
     * Convertir a array con relaciones expandidas
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'origen' => [
                'id' => $this->estadoOrigen->id,
                'codigo' => $this->estadoOrigen->codigo,
                'nombre' => $this->estadoOrigen->nombre,
            ],
            'destino' => [
                'id' => $this->estadoDestino->id,
                'codigo' => $this->estadoDestino->codigo,
                'nombre' => $this->estadoDestino->nombre,
            ],
            'categoria' => $this->categoria,
            'requiere_permiso' => $this->requiere_permiso,
            'descripcion' => $this->getDescripcion(),
            'automatica' => $this->automatica,
            'notificar' => $this->notificar,
            'activa' => $this->activa,
        ];
    }
}
