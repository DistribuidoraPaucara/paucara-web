<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class ConfiguracionSitio extends Model
{
    protected $table = 'configuraciones_sitio';

    protected $fillable = [
        'nombre',
        'imagen',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
        ];
    }

    public static function actual(): ?self
    {
        return Cache::remember('configuracion_sitio_actual', now()->addHour(), function () {
            return self::query()
                ->where('activo', true)
                ->latest('id')
                ->first();
        });
    }

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('configuracion_sitio_actual'));
        static::deleted(fn () => Cache::forget('configuracion_sitio_actual'));
    }
}
