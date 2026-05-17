<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CapabilityTemplate extends Model
{
    protected $fillable = [
        'name',
        'label',
        'description',
        'capabilities',
        'created_by',
        'updated_by',
        'order',
        'is_active'
    ];

    protected function casts(): array
    {
        return [
            'capabilities' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Usuario que creó la plantilla
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Último usuario que actualizó la plantilla
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Obtener todas las capacidades en esta plantilla
     */
    public function getCapabilities()
    {
        return Capability::whereIn('name', $this->capabilities ?? [])->get();
    }

    /**
     * Obtener permisos totales de esta plantilla
     */
    public function getPermissions()
    {
        $capabilities = $this->getCapabilities();
        $permissions = collect();

        foreach ($capabilities as $capability) {
            $permissions = $permissions->merge($capability->permissions()->get());
        }

        return $permissions->unique('id');
    }
}
