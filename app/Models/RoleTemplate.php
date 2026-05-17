<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoleTemplate extends Model
{
    protected $fillable = [
        'nombre',
        'descripcion',
        'permisos',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'permisos' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Relación: Usuario que creó la plantilla
     */
    public function creador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relación: Usuario que actualizó la plantilla
     */
    public function actualizadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Obtener los permisos como objetos de Permission
     */
    public function permisosPorNombre(): array
    {
        return Permission::whereIn('id', $this->permisos ?? [])->pluck('name')->toArray();
    }
}
