<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CompraPrestable extends Model
{
    protected $table = 'compras_prestables';

    protected $fillable = [
        'numero_compra',
        'proveedor_id',
        'usuario_id',
        'estado',
        'subtotal',
        'iva',
        'total',
        'observaciones',
        'motivo_cancelacion',
        'ip_usuario',
        'user_agent',
        'fecha_compra',
        'fecha_confirmacion',
        'fecha_cancelacion',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'fecha_compra' => 'datetime',
        'fecha_confirmacion' => 'datetime',
        'fecha_cancelacion' => 'datetime',
        'subtotal' => 'decimal:2',
        'iva' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    // ==================== RELACIONES ====================

    /**
     * Proveedor de donde se compran los prestables
     */
    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class);
    }

    /**
     * Usuario que realizó la compra
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Detalles de la compra
     */
    public function detalles(): HasMany
    {
        return $this->hasMany(CompraPrestableDetalle::class, 'compra_prestable_id');
    }

    // ==================== MÉTODOS ====================

    /**
     * Confirmar la compra
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
     * Cancelar la compra
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
     * Calcular cantidad total de prestables comprados
     */
    public function getCantidadTotalAttribute(): int
    {
        return $this->detalles()->sum('cantidad');
    }

    /**
     * Scope para compras confirmadas
     */
    public function scopeConfirmadas($query)
    {
        return $query->where('estado', 'CONFIRMADA');
    }

    /**
     * Scope para compras no canceladas
     */
    public function scopeActivas($query)
    {
        return $query->where('estado', '!=', 'CANCELADA');
    }

    /**
     * Scope por proveedor
     */
    public function scopePorProveedor($query, int $proveedorId)
    {
        return $query->where('proveedor_id', $proveedorId);
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
        return $query->whereBetween('fecha_compra', [$desde, $hasta]);
    }
}
