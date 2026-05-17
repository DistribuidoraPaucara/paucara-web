<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class VentaAccessToken extends Model
{
    protected $fillable = [
        'venta_id',
        'token',
        'accessed_at',
        'access_count',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'accessed_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Relación con Venta
     */
    public function venta()
    {
        return $this->belongsTo(Venta::class);
    }

    /**
     * Generar un token único
     */
    public static function generateToken(): string
    {
        return Str::random(32) . Str::random(32);
    }

    /**
     * Obtener venta por token
     */
    public static function getVentaByToken($token): ?Venta
    {
        $accessToken = self::where('token', $token)
            ->where('is_active', true)
            ->first();

        if (!$accessToken) {
            return null;
        }

        // Verificar si el token ha expirado
        if ($accessToken->expires_at && $accessToken->expires_at->isPast()) {
            return null;
        }

        // Registrar acceso
        $accessToken->update([
            'accessed_at' => now(),
            'access_count' => $accessToken->access_count + 1,
        ]);

        return $accessToken->venta;
    }
}
