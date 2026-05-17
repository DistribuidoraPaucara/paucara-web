<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistorialCodigoBarra extends Model
{
    protected $table = 'historial_codigos_barra';

    protected $fillable = [
        'codigo_barra_id',
        'producto_id',
        'tipo_evento',
        'valores_anteriores',
        'valores_nuevos',
        'codigo_anterior',
        'codigo_nuevo',
        'es_principal_anterior',
        'es_principal_nuevo',
        'activo_anterior',
        'activo_nuevo',
        'razon',
        'descripcion',
        'usuario_id',
        'usuario_nombre',
        'fecha_evento',
    ];

    protected function casts(): array
    {
        return [
            'valores_anteriores' => 'array',
            'valores_nuevos' => 'array',
            'es_principal_anterior' => 'boolean',
            'es_principal_nuevo' => 'boolean',
            'activo_anterior' => 'boolean',
            'activo_nuevo' => 'boolean',
            'fecha_evento' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Relación: código de barra
     */
    public function codigoBarra(): BelongsTo
    {
        return $this->belongsTo(CodigoBarra::class);
    }

    /**
     * Relación: producto
     */
    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    /**
     * Relación: usuario que realizó el cambio
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope: obtener historial de un código
     */
    public function scopeDelCodigo($query, int $codigoBarraId)
    {
        return $query->where('codigo_barra_id', $codigoBarraId)
            ->orderByDesc('fecha_evento');
    }

    /**
     * Scope: obtener historial de un producto
     */
    public function scopeDelProducto($query, int $productoId)
    {
        return $query->where('producto_id', $productoId)
            ->orderByDesc('fecha_evento');
    }

    /**
     * Scope: obtener eventos de un tipo específico
     */
    public function scopePorTipo($query, string $tipoEvento)
    {
        return $query->where('tipo_evento', $tipoEvento);
    }

    /**
     * Scope: obtener eventos de un rango de fechas
     */
    public function scopeEntreFechas($query, $fechaInicio, $fechaFin)
    {
        return $query->whereBetween('fecha_evento', [$fechaInicio, $fechaFin]);
    }

    /**
     * Scope: obtener eventos de un usuario
     */
    public function scopeDelUsuario($query, int $usuarioId)
    {
        return $query->where('usuario_id', $usuarioId);
    }

    /**
     * Obtener descripción legible del evento
     */
    public function getDescripcionEventoAttribute(): string
    {
        return match ($this->tipo_evento) {
            'CREADO' => 'Código creado',
            'ACTUALIZADO' => 'Código actualizado',
            'MARCADO_PRINCIPAL' => 'Marcado como principal',
            'DESMARCADO_PRINCIPAL' => 'Desmarcado como principal',
            'INACTIVADO' => 'Código inactivado',
            'REACTIVADO' => 'Código reactivado',
            default => 'Evento desconocido',
        };
    }

    /**
     * Obtener detalles del cambio en formato legible
     */
    public function getDetallesDelCambioAttribute(): array
    {
        $detalles = [];

        if ($this->codigo_anterior && $this->codigo_nuevo && $this->codigo_anterior !== $this->codigo_nuevo) {
            $detalles['codigo'] = "{$this->codigo_anterior} → {$this->codigo_nuevo}";
        }

        if ($this->es_principal_anterior !== null && $this->es_principal_nuevo !== null) {
            $anterior = $this->es_principal_anterior ? 'Sí' : 'No';
            $nuevo = $this->es_principal_nuevo ? 'Sí' : 'No';
            if ($anterior !== $nuevo) {
                $detalles['principal'] = "{$anterior} → {$nuevo}";
            }
        }

        if ($this->activo_anterior !== null && $this->activo_nuevo !== null) {
            $anterior = $this->activo_anterior ? 'Activo' : 'Inactivo';
            $nuevo = $this->activo_nuevo ? 'Activo' : 'Inactivo';
            if ($anterior !== $nuevo) {
                $detalles['estado'] = "{$anterior} → {$nuevo}";
            }
        }

        return $detalles;
    }
}
