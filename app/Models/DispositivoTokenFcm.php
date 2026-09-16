<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DispositivoTokenFcm extends Model
{
    use HasFactory;

    protected $table = 'dispositivo_tokens_fcm';

    protected $fillable = [
        'dispositivo_id',
        'token_fcm',
        'platform',
        'device_name',
        'app_version',
        'user_id',
        'activo',
        'ultimo_sync',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
            'ultimo_sync' => 'datetime',
        ];
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Obtener o crear un token para un dispositivo
     */
    public static function registrarOActualizar(
        string $dispositivoId,
        string $tokenFcm,
        ?int $userId = null,
        array $metadata = []
    ): self {
        $dispositivo = self::updateOrCreate(
            ['dispositivo_id' => $dispositivoId],
            [
                'token_fcm' => $tokenFcm,
                'user_id' => $userId,
                'platform' => $metadata['platform'] ?? null,
                'device_name' => $metadata['device_name'] ?? null,
                'app_version' => $metadata['app_version'] ?? null,
                'activo' => true,
                'ultimo_sync' => now(),
            ]
        );

        return $dispositivo;
    }

    /**
     * Obtener todos los tokens activos (para enviar notificaciones)
     */
    public static function tokensActivos()
    {
        return self::where('activo', true)
                   ->pluck('token_fcm')
                   ->toArray();
    }
}
