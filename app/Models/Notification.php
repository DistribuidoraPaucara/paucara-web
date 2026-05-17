<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    /**
     * Atributos que se pueden asignar masivamente
     */
    protected $fillable = [
        'user_id',
        'type',
        'data',
        'read',
        'read_at',
        'proforma_id',
        'venta_id',
    ];

    /**
     * Atributos que deben ser castados
     */
    protected function casts(): array
    {
        return [
            'data' => 'json',
            'read' => 'boolean',
            'read_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Relación: Una notificación pertenece a un usuario
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación: Una notificación puede estar relacionada a una proforma
     */
    public function proforma(): BelongsTo
    {
        return $this->belongsTo(Proforma::class);
    }

    /**
     * Relación: Una notificación puede estar relacionada a una venta
     */
    public function venta(): BelongsTo
    {
        return $this->belongsTo(Venta::class);
    }

    /**
     * Scope: Obtener solo notificaciones no leídas
     */
    public function scopeUnread($query)
    {
        return $query->where('read', false);
    }

    /**
     * Scope: Obtener solo notificaciones leídas
     */
    public function scopeRead($query)
    {
        return $query->where('read', true);
    }

    /**
     * Marcar como leída
     */
    public function markAsRead(): void
    {
        $this->update([
            'read' => true,
            'read_at' => now(),
        ]);
    }

    /**
     * Marcar como no leída
     */
    public function markAsUnread(): void
    {
        $this->update([
            'read' => false,
            'read_at' => null,
        ]);
    }
}
