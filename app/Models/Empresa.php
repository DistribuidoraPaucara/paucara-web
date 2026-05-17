<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class Empresa extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nombre_comercial',
        'razon_social',
        'nit',
        'telefono',
        'email',
        'sitio_web',
        'direccion',
        'ciudad',
        'pais',
        'logo_principal',
        'logo_compacto',
        'logo_footer',
        'configuracion_impresion',
        'mensaje_footer',
        'mensaje_legal',
        'activo',
        'es_principal',
        'almacen_id',
        'permite_productos_fraccionados',
        'logistica_envios',      // ✨ NUEVO
        'es_farmacia',           // ✨ NUEVO - Para habilitar campos de medicamentos
    ];

    protected function casts(): array
    {
        return [
            'configuracion_impresion' => 'array',
            'activo' => 'boolean',
            'es_principal' => 'boolean',
            'permite_productos_fraccionados' => 'boolean',
            'logistica_envios' => 'boolean',        // ✨ NUEVO
            'es_farmacia' => 'boolean',             // ✨ NUEVO
        ];
    }

    /**
     * Relaciones
     */
    public function plantillasImpresion()
    {
        return $this->hasMany(PlantillaImpresion::class);
    }

    /**
     * Almacén de la empresa (para búsquedas de stock y ventas)
     */
    public function almacen()
    {
        return $this->belongsTo(Almacen::class, 'almacen_id');
    }

    /**
     * DEPRECADO: Usar almacen() en su lugar
     * Se mantiene para compatibilidad histórica
     */
    public function almacenPrincipal()
    {
        return $this->almacen();
    }

    /**
     * DEPRECADO: Usar almacen() en su lugar
     * Se mantiene para compatibilidad histórica
     */
    public function almacenVenta()
    {
        return $this->almacen();
    }

    /**
     * Obtener la empresa principal activa
     */
    public static function principal(): ?self
    {
        return Cache::remember('empresa_principal', 3600, function () {
            return self::where('es_principal', true)
                ->where('activo', true)
                ->first();
        });
    }

    /**
     * ✅ NUEVO: Obtener empresa principal SIN CACHE (consulta fresca de BD)
     * Útil cuando necesitas el valor actual, ej: es_farmacia
     */
    public static function principalFresh(): ?self
    {
        return self::where('es_principal', true)
            ->where('activo', true)
            ->first();
    }

    /**
     * Obtener URL pública del logo
     *
     * @param string $tipo 'principal'|'compacto'|'footer'
     * @return string|null
     */
    public function getLogoUrl(string $tipo = 'principal'): ?string
    {
        $campo = "logo_{$tipo}";

        if (!$this->$campo) {
            return null;
        }

        return Storage::url($this->$campo);
    }

    /**
     * Obtener configuración de impresión con valores por defecto
     */
    public function getConfiguracionImpresionAttribute($value): array
    {
        $defaults = [
            'formatos_soportados' => ['A4', 'TICKET_58', 'TICKET_80', 'CUSTOM'],
            'formato_default' => 'A4',
            'ancho_ticket_custom' => null,
            'margen_ticket' => '2mm',
            'margen_hoja' => '10mm',
            'mostrar_logo_ticket' => true,
            'mostrar_logo_hoja' => true,
            'fuente_ticket' => 'Courier New',
            'fuente_hoja' => 'Arial',
            'tamaño_fuente_ticket' => '8px',
            'tamaño_fuente_hoja' => '10px',
        ];

        $config = $value ? json_decode($value, true) : [];

        return array_merge($defaults, $config);
    }

    /**
     * Obtener el almacén de la empresa
     *
     * @return Almacen|null
     */
    public function getAlmacen(): ?Almacen
    {
        return $this->almacen;
    }

    /**
     * DEPRECADO: Usar getAlmacen() en su lugar
     */
    public function getPrincipalAlmacen(): ?Almacen
    {
        return $this->getAlmacen();
    }

    /**
     * DEPRECADO: Usar getAlmacen() en su lugar
     */
    public function getVentaAlmacen(): ?Almacen
    {
        return $this->getAlmacen();
    }

    /**
     * Obtener el almacén actual de la empresa
     *
     * @param bool $paraVenta No se usa más, se mantiene para compatibilidad
     * @return Almacen|null
     */
    public function getAlmacenActual(bool $paraVenta = false): ?Almacen
    {
        return $this->getAlmacen();
    }

    /**
     * Boot del modelo
     */
    protected static function boot()
    {
        parent::boot();

        // Limpiar cache al actualizar o eliminar
        static::saved(function ($model) {
            if ($model->es_principal) {
                Cache::forget('empresa_principal');
            }
        });

        static::deleted(function ($model) {
            if ($model->es_principal) {
                Cache::forget('empresa_principal');
            }
        });

        // Asegurar que solo haya una empresa principal
        static::saving(function ($model) {
            if ($model->es_principal && $model->activo) {
                // Desactivar otras empresas principales
                self::where('id', '!=', $model->id)
                    ->where('es_principal', true)
                    ->update(['es_principal' => false]);
            }
        });
    }
}
