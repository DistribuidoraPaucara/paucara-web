<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * EntregaVenta
 *
 * Tabla pivot que vincula múltiples ventas a una entrega
 *
 * Permite:
 * - Una entrega consolidada con múltiples ventas
 * - Confirmación individual de carga por venta
 * - Auditoría completa del vínculo entrega-venta
 *
 * EJEMPLO:
 * ────────
 * Entrega #100 (para vehículo ABC-123, chofer Juan)
 *   ├─ Venta #1001 (orden=1, confirmada por user_5)
 *   ├─ Venta #1002 (orden=2, pendiente confirmación)
 *   └─ Venta #1003 (orden=3, pendiente confirmación)
 */
class EntregaVenta extends Model
{
    use HasFactory;

    protected $table = 'entrega_venta';

    protected $fillable = [
        'entrega_id',
        'venta_id',
        'orden',
        'confirmado_por',
        'fecha_confirmacion',
        'notas',
    ];

    protected function casts(): array
    {
        return [
            'fecha_confirmacion' => 'datetime',
        ];
    }

    /**
     * ─────────────────────────────────────────────
     * RELACIONES
     * ─────────────────────────────────────────────
     */

    /**
     * Entrega a la que pertenece este vínculo
     */
    public function entrega(): BelongsTo
    {
        return $this->belongsTo(Entrega::class);
    }

    /**
     * Venta vinculada a esta entrega
     */
    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class);
    }

    /**
     * Usuario que confirmó la carga de esta venta
     */
    public function confirmadorCarga(): BelongsTo
    {
        return $this->belongsTo(User::class, 'confirmado_por');
    }

    /**
     * ─────────────────────────────────────────────
     * MÉTODOS DE NEGOCIO
     * ─────────────────────────────────────────────
     */

    /**
     * Verificar si la venta ya fue confirmada como cargada
     *
     * @return bool
     */
    public function estaCargada(): bool
    {
        return $this->fecha_confirmacion !== null;
    }

    /**
     * Confirmar que esta venta fue cargada en el vehículo
     *
     * @param \App\Models\User|null $usuario Usuario que confirma (almacenero)
     * @param string|null $notas Observaciones específicas
     * @return void
     */
    public function confirmarCarga(?User $usuario = null, ?string $notas = null): void
    {
        $this->update([
            'confirmado_por' => $usuario?->id,
            'fecha_confirmacion' => now(),
            'notas' => $notas,
        ]);
    }

    /**
     * Desmarcar confirmación de carga
     * (En caso de que se encuentre un error después de confirmar)
     *
     * @param string|null $razon Razón del desmarcado
     * @return void
     */
    public function desmarcarCarga(?string $razon = null): void
    {
        $this->update([
            'confirmado_por' => null,
            'fecha_confirmacion' => null,
            'notas' => $razon ?? 'Desmarcado',
        ]);
    }

    /**
     * Obtener el cliente de esta venta
     *
     * @return \App\Models\Cliente|null
     */
    public function obtenerCliente()
    {
        return $this->venta?->cliente;
    }

    /**
     * Obtener el número de la venta
     *
     * @return string|null
     */
    public function obtenerNumeroVenta(): ?string
    {
        return $this->venta?->numero;
    }

    /**
     * Obtener el peso estimado de la venta
     *
     * @return float|null
     */
    public function obtenerPeso(): ?float
    {
        return $this->venta?->peso_estimado;
    }

    /**
     * Obtener el volumen estimado de la venta
     *
     * @return float|null
     */
    public function obtenerVolumen(): ?float
    {
        return $this->venta?->volumen_estimado;
    }

    /**
     * ─────────────────────────────────────────────
     * SCOPES
     * ─────────────────────────────────────────────
     */

    /**
     * Filtrar por ventas confirmadas como cargadas
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeConfirmadas($query)
    {
        return $query->whereNotNull('fecha_confirmacion');
    }

    /**
     * Filtrar por ventas pendientes de confirmación
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePendientes($query)
    {
        return $query->whereNull('fecha_confirmacion');
    }

    /**
     * Filtrar por usuario que confirmó
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $usuarioId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeConfirmadosPor($query, int $usuarioId)
    {
        return $query->where('confirmado_por', $usuarioId);
    }

    /**
     * Filtrar por entrega
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $entregaId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePorEntrega($query, int $entregaId)
    {
        return $query->where('entrega_id', $entregaId);
    }

    /**
     * Ordenar por orden de carga
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOrdenado($query)
    {
        return $query->orderBy('orden');
    }
}
