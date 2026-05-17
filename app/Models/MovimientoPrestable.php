<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class MovimientoPrestable extends Model
{
    use SoftDeletes;

    protected $table = 'movimientos_prestables';

    protected $fillable = [
        'prestable_stock_id',
        'almacenes_prestables_id',
        'usuario_id',
        'tipo',
        'cantidad',
        'disponible_anterior',
        'prestamo_cliente_anterior',
        'prestamo_proveedor_anterior',
        'vendida_anterior',
        'disponible_posterior',
        'prestamo_cliente_posterior',
        'prestamo_proveedor_posterior',
        'vendida_posterior',
        'categoria_afectada',
        'motivo',
        'observaciones',
        'numero_referencia',
        'referencia_tipo',
        'referencia_id',
        'tipo_prestamo',
        'ip_usuario',
        'user_agent',
        'anulado',
        'motivo_anulacion',
        'usuario_anulacion_id',
        'fecha_anulacion',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'fecha_anulacion' => 'datetime',
        'anulado' => 'boolean',
    ];

    /**
     * Relación con PrestableStock
     */
    public function prestableStock(): BelongsTo
    {
        return $this->belongsTo(PrestableStock::class, 'prestable_stock_id');
    }

    /**
     * Relación con Usuario que registra el movimiento
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    /**
     * Relación con Usuario que anula el movimiento
     */
    public function usuarioAnulacion(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_anulacion_id');
    }

    /**
     * Calcula el cambio total en la cantidad
     */
    public function getTotalAnteriorAttribute(): int
    {
        return $this->disponible_anterior +
               $this->prestamo_cliente_anterior +
               $this->prestamo_proveedor_anterior +
               $this->vendida_anterior;
    }

    /**
     * Calcula el total después del movimiento
     */
    public function getTotalPosteriorAttribute(): int
    {
        return $this->disponible_posterior +
               $this->prestamo_cliente_posterior +
               $this->prestamo_proveedor_posterior +
               $this->vendida_posterior;
    }

    /**
     * Calcula el cambio neto
     */
    public function getCambioAttribute(): int
    {
        return $this->total_posterior - $this->total_anterior;
    }

    /**
     * Obtiene los cambios por categoría
     */
    public function getCambiosPorCategoriaAttribute(): array
    {
        return [
            'disponible' => $this->disponible_posterior - $this->disponible_anterior,
            'prestamo_cliente' => $this->prestamo_cliente_posterior - $this->prestamo_cliente_anterior,
            'prestamo_proveedor' => $this->prestamo_proveedor_posterior - $this->prestamo_proveedor_anterior,
            'vendida' => $this->vendida_posterior - $this->vendida_anterior,
        ];
    }

    /**
     * Scope para filtrar por tipo de movimiento
     */
    public function scopePorTipo($query, string $tipo)
    {
        return $query->where('tipo', $tipo);
    }

    /**
     * Scope para filtrar por almacén
     */
    public function scopePorAlmacen($query, int $almacenId)
    {
        return $query->where('almacenes_prestables_id', $almacenId);
    }

    /**
     * Scope para filtrar por prestable
     */
    public function scopePorPrestable($query, int $prestableId)
    {
        return $query->whereHas('prestableStock', function ($q) use ($prestableId) {
            $q->where('prestable_id', $prestableId);
        });
    }

    /**
     * Scope para filtrar por usuario
     */
    public function scopePorUsuario($query, int $usuarioId)
    {
        return $query->where('usuario_id', $usuarioId);
    }

    /**
     * Scope para filtrar movimientos no anulados
     */
    public function scopeActivos($query)
    {
        return $query->where('anulado', false);
    }

    /**
     * Scope para filtrar movimientos anulados
     */
    public function scopeAnulados($query)
    {
        return $query->where('anulado', true);
    }

    /**
     * Scope para filtrar por rango de fechas
     */
    public function scopePorFecha($query, $desde, $hasta)
    {
        return $query->whereBetween('created_at', [$desde, $hasta]);
    }
}
