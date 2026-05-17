<?php

namespace App\Models;

use App\Models\Traits\HasActiveScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Zona extends Model
{
    use HasFactory, HasActiveScope, SoftDeletes;

    protected $fillable = [
        'nombre',
        'codigo',
        'descripcion',
        // 'localidades', // DEPRECATED: Usar relación localidades() many-to-many
        'latitud_centro',
        'longitud_centro',
        'tiempo_estimado_entrega',
        'activa',
        'preventista_id',
    ];

    protected function casts(): array
    {
        return [
            // 'localidades' => 'array', // DEPRECATED: Campo JSON deprecated
            'latitud_centro' => 'decimal:8',
            'longitud_centro' => 'decimal:8',
            'activa' => 'boolean',
            'tiempo_estimado_entrega' => 'integer',
        ];
    }

    /**
     * Preventista responsable de la zona
     */
    public function preventista(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'preventista_id');
    }

    /**
     * Clientes en esta zona
     */
    public function clientes()
    {
        // Asume que clientes tienen localidad/zona
        return $this->hasMany(Cliente::class, 'zona_id');
    }

    /**
     * Rutas en esta zona
     */
    public function rutas(): HasMany
    {
        return $this->hasMany(Ruta::class);
    }

    /**
     * Localidades asociadas a esta zona (relación many-to-many)
     */
    public function localidades(): BelongsToMany
    {
        return $this->belongsToMany(Localidad::class, 'localidad_zona')
                    ->withTimestamps();
    }

    /**
     * DEPRECATED: Usar $zona->localidades (relación) en su lugar
     * Este método se mantiene solo para backward compatibility
     *
     * @deprecated v2.0 Use $zona->localidades relationship instead
     */
    public function getLocalidadesArrayAttribute(): array
    {
        \Log::warning('DEPRECATED: getLocalidadesArrayAttribute() - Use $zona->localidades relationship');
        return $this->localidades()->pluck('localidades.id')->toArray();
    }

    /**
     * DEPRECATED: Usar $zona->localidades()->sync($ids) en su lugar
     *
     * @deprecated v2.0 Use $zona->localidades()->sync($ids)
     */
    public function setLocalidadesArray(array $localidadesData): void
    {
        \Log::warning('DEPRECATED: setLocalidadesArray() - Use $zona->localidades()->sync($ids)');
        $this->syncLocalidadesFromArray($localidadesData);
    }

    /**
     * Obtener cantidad de clientes en zona
     */
    public function cantidadClientes(): int
    {
        return Cliente::where('zona_id', $this->id)->count();
    }

    /**
     * Verificar si la zona tiene preventista asignado
     */
    public function tienePreventista(): bool
    {
        return $this->preventista_id !== null;
    }

    /**
     * Sincronizar localidades desde array (helper para transición)
     */
    protected function syncLocalidadesFromArray(array $localidadesData): void
    {
        $localidadIds = [];

        foreach ($localidadesData as $data) {
            if (is_numeric($data)) {
                $localidadIds[] = $data;
            } elseif (is_string($data)) {
                $localidad = Localidad::where('nombre', $data)
                                   ->orWhere('codigo', $data)
                                   ->first();
                if ($localidad) {
                    $localidadIds[] = $localidad->id;
                }
            } elseif (is_array($data) && isset($data['id'])) {
                $localidadIds[] = $data['id'];
            }
        }

        $this->localidades()->sync($localidadIds);
    }

    /**
     * Obtener IDs de localidades (nuevo método preferido)
     */
    public function getLocalidadesIds(): array
    {
        return $this->localidades()->pluck('localidades.id')->toArray();
    }

    /**
     * Verificar si zona tiene una localidad específica
     */
    public function tieneLocalidad(int $localidadId): bool
    {
        return $this->localidades()->where('localidades.id', $localidadId)->exists();
    }
}
