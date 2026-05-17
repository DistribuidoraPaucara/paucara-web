<?php

namespace App\Models;

use App\Models\Traits\HasActiveScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class ConfiguracionGlobal extends Model
{
    use HasFactory, HasActiveScope;

    protected $table = 'configuracion_global';

    protected $fillable = [
        'clave',
        'nombre',
        'descripcion',
        'tipo_valor',
        'valor',
        'valor_numerico',
        'categoria',
        'activo',
        'es_sistema',
        'metadatos',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
            'es_sistema' => 'boolean',
            'valor_numerico' => 'decimal:2',
            'metadatos' => 'array',
        ];
    }

    /**
     * Scopes
     */

    public function scopePorCategoria($query, string $categoria)
    {
        return $query->where('categoria', $categoria);
    }

    public function scopeSistema($query)
    {
        return $query->where('es_sistema', true);
    }

    /**
     * Obtener valor por clave con cache
     */
    public static function obtener(string $clave, $valorPorDefecto = null)
    {
        return Cache::remember("config_global_{$clave}", 3600, function () use ($clave, $valorPorDefecto) {
            $config = self::where('clave', $clave)
                ->where('activo', true)
                ->first();

            if (! $config) {
                return $valorPorDefecto;
            }

            return self::convertirValor($config->valor, $config->tipo_valor);
        });
    }

    /**
     * Establecer valor por clave
     */
    public static function establecer(string $clave, $valor, ?string $nombre = null, ?string $descripcion = null, string $categoria = 'general'): self
    {
        $tipoValor = self::detectarTipoValor($valor);
        $valorTexto = self::convertirATexto($valor);
        $valorNumerico = is_numeric($valor) ? (float) $valor : null;

        $config = self::updateOrCreate(
            ['clave' => $clave],
            [
                'nombre' => $nombre ?? ucfirst(str_replace('_', ' ', $clave)),
                'descripcion' => $descripcion,
                'tipo_valor' => $tipoValor,
                'valor' => $valorTexto,
                'valor_numerico' => $valorNumerico,
                'categoria' => $categoria,
                'activo' => true,
            ]
        );

        // Limpiar cache
        Cache::forget("config_global_{$clave}");

        return $config;
    }

    /**
     * Obtener porcentaje de interés general
     */
    public static function porcentajeInteresGeneral(): float
    {
        return (float) self::obtener('porcentaje_interes_general', 20.0);
    }

    /**
     * Obtener margen mínimo global
     */
    public static function margenMinimoGlobal(): float
    {
        return (float) self::obtener('margen_minimo_global', 10.0);
    }

    /**
     * Verificar si aplicar interés automático
     */
    public static function aplicarInteresAutomatico(): bool
    {
        return (bool) self::obtener('aplicar_interes_automatico', true);
    }

    /**
     * Obtener todas las configuraciones de ganancias
     */
    public static function configuracionesGanancias(): array
    {
        return Cache::remember('config_ganancias_global', 3600, function () {
            return self::activos()
                ->porCategoria('ganancias')
                ->get()
                ->mapWithKeys(function ($config) {
                    return [
                        $config->clave => self::convertirValor($config->valor, $config->tipo_valor),
                    ];
                })
                ->toArray();
        });
    }

    /**
     * Convertir valor según el tipo
     */
    private static function convertirValor(string $valor, string $tipo)
    {
        return match ($tipo) {
            'boolean' => filter_var($valor, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $valor,
            'decimal' => (float) $valor,
            'array', 'json' => json_decode($valor, true),
            default => $valor,
        };
    }

    /**
     * Detectar tipo de valor automáticamente
     */
    private static function detectarTipoValor($valor): string
    {
        if (is_bool($valor)) {
            return 'boolean';
        }
        if (is_int($valor)) {
            return 'integer';
        }
        if (is_float($valor)) {
            return 'decimal';
        }
        if (is_array($valor)) {
            return 'array';
        }

        return 'string';
    }

    /**
     * Convertir valor a texto para almacenamiento
     */
    private static function convertirATexto($valor): string
    {
        if (is_bool($valor)) {
            return $valor ? 'true' : 'false';
        }
        if (is_array($valor)) {
            return json_encode($valor);
        }

        return (string) $valor;
    }

    /**
     * Limpiar todo el cache de configuración
     */
    public static function limpiarCache(): void
    {
        $claves = self::pluck('clave');

        foreach ($claves as $clave) {
            Cache::forget("config_global_{$clave}");
        }

        Cache::forget('config_ganancias_global');
    }

    /**
     * Boot del modelo
     */
    protected static function boot()
    {
        parent::boot();

        // Limpiar cache al actualizar o eliminar
        static::saved(function ($model) {
            Cache::forget("config_global_{$model->clave}");
            Cache::forget('config_ganancias_global');
        });

        static::deleted(function ($model) {
            Cache::forget("config_global_{$model->clave}");
            Cache::forget('config_ganancias_global');
        });
    }
}
