<?php

namespace App\Models;

use App\Models\Traits\GeneratesSequentialCode;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Devolucion extends Model
{
    use HasFactory, SoftDeletes, GeneratesSequentialCode;

    protected $table = 'devoluciones';

    protected $fillable = [
        'numero',
        'fecha',
        'tipo',
        'venta_id',
        'cliente_id',
        'usuario_id',
        'caja_id',
        'motivo',
        'subtotal_devuelto',
        'total_devuelto',
        'tipo_reembolso',
        'monto_reembolso',
        'subtotal_cambio',
        'diferencia',
        'observaciones',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'subtotal_devuelto' => 'decimal:2',
            'total_devuelto' => 'decimal:2',
            'monto_reembolso' => 'decimal:2',
            'subtotal_cambio' => 'decimal:2',
            'diferencia' => 'decimal:2',
        ];
    }

    /**
     * Relaciones
     */
    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class);
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function caja(): BelongsTo
    {
        return $this->belongsTo(Caja::class);
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleDevolucion::class);
    }

    public function detallesCambio(): HasMany
    {
        return $this->hasMany(DetalleCambio::class);
    }

    /**
     * Scopes
     */
    public function scopeDeVenta($query, int $ventaId)
    {
        return $query->where('venta_id', $ventaId);
    }

    public function scopeDelCliente($query, int $clienteId)
    {
        return $query->where('cliente_id', $clienteId);
    }

    public function scopeDelUsuario($query, int $usuarioId)
    {
        return $query->where('usuario_id', $usuarioId);
    }

    public function scopeDevoluciones($query)
    {
        return $query->where('tipo', 'DEVOLUCION');
    }

    public function scopeCambios($query)
    {
        return $query->where('tipo', 'CAMBIO');
    }

    public function scopeConReembolsoEnEfectivo($query)
    {
        return $query->where('tipo_reembolso', 'EFECTIVO')->where('monto_reembolso', '>', 0);
    }

    /**
     * Generar número automático para la devolución
     *
     * Formato: DEV + FECHA_ACTUAL + SECUENCIAL (ej: DEV20260308-0001)
     */
    public static function generarNumero(): string
    {
        return static::generateSequentialCode('DEV', 'numero', true, 'Ymd', 6);
    }
}
