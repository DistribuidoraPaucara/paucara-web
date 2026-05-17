<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EntregaEstadoHistorial extends Model
{
    use HasFactory;

    protected $table = 'entrega_estado_historials';

    protected $fillable = [
        'entrega_id',
        'usuario_id',
        'estado_anterior',
        'estado_nuevo',
        'comentario',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public $timestamps = true;

    /**
     * Relaciones
     */

    /**
     * Entrega asociada a este historial
     */
    public function entrega(): BelongsTo
    {
        return $this->belongsTo(Entrega::class);
    }

    /**
     * Usuario que realizó el cambio
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scopes
     */

    /**
     * Historial de una entrega específica
     */
    public function scopePorEntrega($query, $entregaId)
    {
        return $query->where('entrega_id', $entregaId)->orderBy('created_at', 'desc');
    }

    /**
     * Cambios realizados por un usuario
     */
    public function scopePorUsuario($query, $usuarioId)
    {
        return $query->where('usuario_id', $usuarioId);
    }
}
