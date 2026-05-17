<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AjusteStockPrestable extends Model
{
    use HasFactory;

    protected $table = 'ajustes_stock_prestables';

    protected $fillable = [
        'prestable_id',
        'prestable_stock_id',
        'almacenes_prestables_id',
        'usuario_id',
        'cantidad_disponible_antes',
        'cantidad_en_prestamo_cliente_antes',
        'cantidad_en_prestamo_proveedor_antes',
        'cantidad_vendida_antes',
        'cantidad_disponible_despues',
        'cantidad_en_prestamo_cliente_despues',
        'cantidad_en_prestamo_proveedor_despues',
        'cantidad_vendida_despues',
        'motivo',
        'comentarios',
        'tipo_ajuste',
        'ip_usuario',
        'user_agent',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ==================== RELACIONES ====================

    /**
     * Prestable asociado al ajuste
     */
    public function prestable(): BelongsTo
    {
        return $this->belongsTo(Prestable::class);
    }

    /**
     * Stock del prestable que fue ajustado
     */
    public function prestableStock(): BelongsTo
    {
        return $this->belongsTo(PrestableStock::class);
    }

    /**
     * Almacén de prestables donde ocurrió el ajuste
     */
    public function almacenPrestable(): BelongsTo
    {
        return $this->belongsTo(AlmacenPrestable::class, 'almacenes_prestables_id');
    }

    /**
     * Usuario que realizó el ajuste
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ==================== GETTERS ====================

    /**
     * Calcular cambio total
     */
    public function getTotalAnteriorAttribute(): int
    {
        return $this->cantidad_disponible_antes +
               $this->cantidad_en_prestamo_cliente_antes +
               $this->cantidad_en_prestamo_proveedor_antes +
               $this->cantidad_vendida_antes;
    }

    /**
     * Calcular total después del ajuste
     */
    public function getTotalDespuesAttribute(): int
    {
        return $this->cantidad_disponible_despues +
               $this->cantidad_en_prestamo_cliente_despues +
               $this->cantidad_en_prestamo_proveedor_despues +
               $this->cantidad_vendida_despues;
    }

    /**
     * Cambio total en el inventario
     */
    public function getCambioTotalAttribute(): int
    {
        return $this->total_despues - $this->total_anterior;
    }

    /**
     * Cambios por categoría
     */
    public function getCambiosAttribute(): array
    {
        return [
            'disponible' => $this->cantidad_disponible_despues - $this->cantidad_disponible_antes,
            'prestamo_cliente' => $this->cantidad_en_prestamo_cliente_despues - $this->cantidad_en_prestamo_cliente_antes,
            'prestamo_proveedor' => $this->cantidad_en_prestamo_proveedor_despues - $this->cantidad_en_prestamo_proveedor_antes,
            'vendida' => $this->cantidad_vendida_despues - $this->cantidad_vendida_antes,
        ];
    }
}
