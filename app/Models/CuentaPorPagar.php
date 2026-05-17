<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CuentaPorPagar extends Model
{
    protected $table = 'cuentas_por_pagar';

    protected $fillable = [
        'compra_id',
        'monto_original',
        'monto_total',
        'monto_pagado',
        'saldo_pendiente',
        'fecha_vencimiento',
        'dias_vencido',
        'estado',
        'referencia_documento',
        'observaciones',
        'usuario_id',
    ];

    protected function casts(): array
    {
        return [
            'monto_original' => 'decimal:2',
            'monto_total' => 'decimal:2',
            'monto_pagado' => 'decimal:2',
            'saldo_pendiente' => 'decimal:2',
            'fecha_vencimiento' => 'date',
            'dias_vencido' => 'integer',
        ];
    }

    // Relaciones
    public function compra()
    {
        return $this->belongsTo(Compra::class);
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class, 'cuenta_por_pagar_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    // Métodos auxiliares
    public function estaPagado(): bool
    {
        return $this->saldo_pendiente <= 0;
    }

    public function estaVencido(): bool
    {
        return $this->fecha_vencimiento < now()->toDateString() && $this->saldo_pendiente > 0;
    }

    public function getDiasVencidoAttribute(): int
    {
        if (! $this->estaVencido()) {
            return 0;
        }

        return now()->diffInDays($this->fecha_vencimiento);
    }
}
