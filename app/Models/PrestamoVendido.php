<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PrestamoVendido extends Model
{
    protected $table = 'prestamos_vendidos';

    protected $fillable = [
        'numero_venta',
        'cliente_id',
        'usuario_id',
        'estado',
        'subtotal',
        'iva',
        'total',
        'observaciones',
        'motivo_cancelacion',
        'ip_usuario',
        'user_agent',
        'fecha_venta',
        'fecha_confirmacion',
        'fecha_cancelacion',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'fecha_venta' => 'datetime',
        'fecha_confirmacion' => 'datetime',
        'fecha_cancelacion' => 'datetime',
        'subtotal' => 'decimal:2',
        'iva' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    // ==================== RELACIONES ====================

    /**
     * Cliente asociado a la venta
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    /**
     * Usuario que realizó la venta
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Detalles de la venta
     */
    public function detalles(): HasMany
    {
        return $this->hasMany(PrestamoVendidoDetalle::class, 'prestamo_vendido_id');
    }

    // ==================== MÉTODOS ====================

    /**
     * Confirmar la venta
     */
    public function confirmar(): self
    {
        $this->update([
            'estado' => 'CONFIRMADA',
            'fecha_confirmacion' => now(),
        ]);

        return $this;
    }

    /**
     * Cancelar la venta
     */
    public function cancelar(string $motivo): self
    {
        $this->update([
            'estado' => 'CANCELADA',
            'motivo_cancelacion' => $motivo,
            'fecha_cancelacion' => now(),
        ]);

        return $this;
    }

    /**
     * Calcular cantidad total de prestables vendidos
     */
    public function getCantidadTotalAttribute(): int
    {
        return $this->detalles()->sum('cantidad');
    }

    /**
     * Scope para ventas confirmadas
     */
    public function scopeConfirmadas($query)
    {
        return $query->where('estado', 'CONFIRMADA');
    }

    /**
     * Scope para ventas no canceladas
     */
    public function scopeActivas($query)
    {
        return $query->where('estado', '!=', 'CANCELADA');
    }

    /**
     * Scope por cliente
     */
    public function scopePorCliente($query, int $clienteId)
    {
        return $query->where('cliente_id', $clienteId);
    }

    /**
     * Scope por usuario
     */
    public function scopePorUsuario($query, int $usuarioId)
    {
        return $query->where('usuario_id', $usuarioId);
    }

    /**
     * Scope por rango de fechas
     */
    public function scopePorFecha($query, $desde, $hasta)
    {
        return $query->whereBetween('fecha_venta', [$desde, $hasta]);
    }
}
