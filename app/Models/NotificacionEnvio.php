<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Historial de envíos push (FCM): un registro por dispositivo y envío.
 */
class NotificacionEnvio extends Model
{
    protected $table = 'notificaciones_envios';

    public const UPDATED_AT = null;

    protected $fillable = [
        'canal',
        'tipo',
        'user_id',
        'token_sufijo',
        'estado',
        'error_codigo',
        'error_detalle',
        'titulo',
        'referencia',
    ];

    protected function casts(): array
    {
        return [
            'referencia' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
