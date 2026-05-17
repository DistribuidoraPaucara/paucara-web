<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class HistorialEstado extends Model
{
    protected $table = 'historial_estados';

    public $timestamps = false; // Solo tiene created_at

    protected $fillable = [
        'entidad_tipo',
        'entidad_id',
        'estado_anterior_id',
        'estado_nuevo_id',
        'usuario_id',
        'motivo',
        'observaciones',
        'metadatos',
    ];

    protected $casts = [
        'metadatos' => 'array',
        'created_at' => 'datetime',
    ];

    // ===== RELATIONSHIPS =====

    /**
     * Estado anterior
     */
    public function estadoAnterior(): BelongsTo
    {
        return $this->belongsTo(EstadoLogistica::class, 'estado_anterior_id');
    }

    /**
     * Estado nuevo
     */
    public function estadoNuevo(): BelongsTo
    {
        return $this->belongsTo(EstadoLogistica::class, 'estado_nuevo_id');
    }

    /**
     * Usuario que hizo el cambio
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    // ===== SCOPES =====

    /**
     * Filtrar por tipo de entidad
     */
    public function scopePorTipoEntidad(Builder $query, string $tipo): Builder
    {
        return $query->where('entidad_tipo', $tipo);
    }

    /**
     * Filtrar por entidad específica
     */
    public function scopePorEntidad(Builder $query, string $tipo, int $id): Builder
    {
        return $query->where('entidad_tipo', $tipo)
                    ->where('entidad_id', $id);
    }

    /**
     * Filtrar por usuario
     */
    public function scopePorUsuario(Builder $query, int $usuarioId): Builder
    {
        return $query->where('usuario_id', $usuarioId);
    }

    /**
     * Filtrar por estado nuevo
     */
    public function scopePorEstadoNuevo(Builder $query, EstadoLogistica $estado): Builder
    {
        return $query->where('estado_nuevo_id', $estado->id);
    }

    /**
     * Filtrar por rango de fechas
     */
    public function scopeEntreFechas(Builder $query, $inicio, $fin): Builder
    {
        return $query->whereBetween('created_at', [$inicio, $fin]);
    }

    /**
     * Ordenar por fecha descendente (más reciente primero)
     */
    public function scopeReciente(Builder $query): Builder
    {
        return $query->orderBy('created_at', 'desc');
    }

    // ===== CUSTOM METHODS =====

    /**
     * Obtener historial de una entidad específica
     */
    public static function obtenerHistorial(string $tipo, int $id, int $limite = 50): \Illuminate\Database\Eloquent\Collection
    {
        return self::porEntidad($tipo, $id)
            ->with(['estadoAnterior', 'estadoNuevo', 'usuario'])
            ->reciente()
            ->limit($limite)
            ->get();
    }

    /**
     * Registrar cambio de estado
     */
    public static function registrar(
        string $entidadTipo,
        int $entidadId,
        EstadoLogistica $estadoNuevo,
        ?EstadoLogistica $estadoAnterior = null,
        ?int $usuarioId = null,
        ?string $motivo = null,
        ?array $metadatos = null
    ): self {
        return self::create([
            'entidad_tipo' => $entidadTipo,
            'entidad_id' => $entidadId,
            'estado_anterior_id' => $estadoAnterior?->id,
            'estado_nuevo_id' => $estadoNuevo->id,
            'usuario_id' => $usuarioId,
            'motivo' => $motivo,
            'observaciones' => null,
            'metadatos' => $metadatos,
        ]);
    }

    /**
     * Obtener descripción del cambio
     */
    public function getDescripcion(): string
    {
        $anterior = $this->estadoAnterior?->nombre ?? 'N/A';
        $nuevo = $this->estadoNuevo->nombre;

        return "{$anterior} → {$nuevo}";
    }

    /**
     * Verificar si hay cambio de estado (anterior ≠ nuevo)
     */
    public function hubocambio(): bool
    {
        return $this->estado_anterior_id !== $this->estado_nuevo_id;
    }

    /**
     * Obtener usuario que hizo el cambio (con fallback)
     */
    public function obtenerUsuarioLabel(): string
    {
        if ($this->usuario) {
            return $this->usuario->name ?? 'Usuario desconocido';
        }

        return 'Sistema';
    }

    /**
     * Convertir a array con información completa
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'entidad' => [
                'tipo' => $this->entidad_tipo,
                'id' => $this->entidad_id,
            ],
            'cambio' => [
                'anterior' => [
                    'id' => $this->estadoAnterior?->id,
                    'codigo' => $this->estadoAnterior?->codigo,
                    'nombre' => $this->estadoAnterior?->nombre,
                ],
                'nuevo' => [
                    'id' => $this->estadoNuevo->id,
                    'codigo' => $this->estadoNuevo->codigo,
                    'nombre' => $this->estadoNuevo->nombre,
                ],
                'descripcion' => $this->getDescripcion(),
            ],
            'usuario' => [
                'id' => $this->usuario_id,
                'nombre' => $this->obtenerUsuarioLabel(),
            ],
            'motivo' => $this->motivo,
            'observaciones' => $this->observaciones,
            'metadatos' => $this->metadatos,
            'fecha' => $this->created_at->toIso8601String(),
        ];
    }
}
