<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PrestamoCliente extends Model
{
    protected $table = 'prestamo_cliente';

    protected $fillable = [
        'cliente_id',
        'venta_id',
        'chofer_id',
        'telefono_cliente_1',
        'telefono_cliente_2',
        'tipo_prestamo',
        'es_venta',
        'es_evento',
        'monto_garantia',
        'fecha_prestamo',
        'fecha_esperada_devolucion',
        'estado',
        'observaciones',
    ];

    protected $casts = [
        'es_venta' => 'boolean',
        'es_evento' => 'boolean',
        'monto_garantia' => 'decimal:2',
        'fecha_prestamo' => 'date',
        'fecha_esperada_devolucion' => 'date',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class);
    }

    public function chofer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'chofer_id');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(PrestamoClienteDetalle::class, 'prestamo_cliente_id');
    }

    public function devoluciones(): HasMany
    {
        return $this->hasMany(DevolucionCliente::class, 'prestamo_cliente_id');
    }
}
