<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlantillaImpresion extends Model
{
    use HasFactory;

    protected $table = 'plantillas_impresion';

    protected $fillable = [
        'empresa_id',
        'codigo',
        'nombre',
        'tipo_documento',
        'formato',
        'vista_blade',
        'configuracion',
        'orden',
        'activo',
        'es_default',
    ];

    protected function casts(): array
    {
        return [
            'configuracion' => 'array',
            'activo' => 'boolean',
            'es_default' => 'boolean',
        ];
    }

    /**
     * Relaciones
     */
    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }

    /**
     * Scopes
     */
    public function scopeActivas($query)
    {
        return $query->where('activo', true);
    }

    public function scopePorTipoDocumento($query, string $tipo)
    {
        return $query->where('tipo_documento', $tipo);
    }

    public function scopePorFormato($query, string $formato)
    {
        return $query->where('formato', $formato);
    }

    public function scopeDefaults($query)
    {
        return $query->where('es_default', true);
    }

    /**
     * Obtener plantilla por defecto para un tipo de documento y formato
     *
     * @param string $tipoDocumento 'venta'|'proforma'|'envio'|'reporte'
     * @param string|null $formato 'A4'|'TICKET_80'|'TICKET_58'|null
     * @return self|null
     */
    public static function obtenerDefault(string $tipoDocumento, ?string $formato = null): ?self
    {
        $empresa = Empresa::principal();

        if (!$empresa) {
            return null;
        }

        $query = self::where('empresa_id', $empresa->id)
            ->where('tipo_documento', $tipoDocumento)
            ->where('activo', true);

        // Si se especifica formato, buscar por formato
        if ($formato) {
            $query->where('formato', $formato);
        }

        // Intentar obtener la plantilla por defecto (clonar query para no modificar la original)
        $plantilla = (clone $query)->where('es_default', true)->first();

        // Si no hay plantilla por defecto, obtener la primera disponible
        if (!$plantilla) {
            $plantilla = $query->orderBy('orden')->first();
        }

        return $plantilla;
    }

    /**
     * Obtener todas las plantillas disponibles para un tipo de documento
     *
     * @param string $tipoDocumento
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function obtenerPorTipo(string $tipoDocumento)
    {
        $empresa = Empresa::principal();

        if (!$empresa) {
            return collect();
        }

        return self::where('empresa_id', $empresa->id)
            ->where('tipo_documento', $tipoDocumento)
            ->where('activo', true)
            ->orderBy('orden')
            ->get();
    }
}
