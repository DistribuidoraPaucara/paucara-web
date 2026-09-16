<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HorarioNotificacion extends Model
{
    use HasFactory;

    protected $table = 'horarios_notificacion';

    protected $fillable = [
        'notificacion_recurrente_id',
        'hora',
        'activo',
        'ultimo_envio',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
            'ultimo_envio' => 'datetime',
        ];
    }

    public function notificacion(): BelongsTo
    {
        return $this->belongsTo(NotificacionRecurrente::class, 'notificacion_recurrente_id');
    }

    public function yaFueEnviadaHoy(): bool
    {
        return $this->ultimo_envio &&
               $this->ultimo_envio->toDateString() === now()->toDateString();
    }

    public function incrementarEnvio(): void
    {
        $this->update(['ultimo_envio' => now()]);
    }
}
