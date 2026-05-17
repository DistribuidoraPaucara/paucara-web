<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RutaDetalle extends Model
{
    use HasFactory;

    protected $fillable = [
        'ruta_id',
        'cliente_id',
        'entrega_id',
        'secuencia',
        'direccion_entrega',
        'latitud',
        'longitud',
        'estado',
        'hora_entrega_estimada',
        'hora_entrega_real',
        'observaciones',
        'foto_entrega',
        'firma_cliente',
        'razon_no_entrega',
        'intentos_entrega',
    ];

    protected function casts(): array
    {
        return [
            'latitud' => 'decimal:8',
            'longitud' => 'decimal:8',
            'hora_entrega_estimada' => 'datetime',
            'hora_entrega_real' => 'datetime',
        ];
    }

    /**
     * Ruta a la que pertenece
     */
    public function ruta(): BelongsTo
    {
        return $this->belongsTo(Ruta::class);
    }

    /**
     * Cliente a entregar
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    /**
     * Entrega asociada a este detalle de ruta
     */
    public function entrega(): BelongsTo
    {
        return $this->belongsTo(Entrega::class);
    }

    /**
     * Scope para entregas entregadas
     */
    public function scopeEntregadas($query)
    {
        return $query->where('estado', 'entregado');
    }

    /**
     * Scope para entregas pendientes
     */
    public function scopePendientes($query)
    {
        return $query->where('estado', 'pendiente');
    }

    /**
     * Scope para entregas fallidas
     */
    public function scopeFallidas($query)
    {
        return $query->whereIn('estado', ['no_entregado', 'reprogramado']);
    }

    /**
     * Marcar como entregado
     */
    public function marcarEntregado(array $datos = []): bool
    {
        return $this->update(array_merge([
            'estado' => 'entregado',
            'hora_entrega_real' => now(),
        ], $datos));
    }

    /**
     * Marcar como no entregado
     */
    public function marcarNoEntregado(string $razon): bool
    {
        return $this->update([
            'estado' => 'no_entregado',
            'razon_no_entrega' => $razon,
            'hora_entrega_real' => now(),
            'intentos_entrega' => $this->intentos_entrega + 1,
        ]);
    }

    /**
     * Reprogramar entrega
     */
    public function reprogramar(string $razon): bool
    {
        return $this->update([
            'estado' => 'reprogramado',
            'razon_no_entrega' => $razon,
            'intentos_entrega' => $this->intentos_entrega + 1,
        ]);
    }

    /**
     * Incrementar intentos
     */
    public function incrementarIntento(): void
    {
        $this->increment('intentos_entrega');
    }

    /**
     * Obtener porcentaje de completitud
     */
    public function estaCompleto(): bool
    {
        return $this->estado === 'entregado';
    }
}
