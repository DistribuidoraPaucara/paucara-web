<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    protected $fillable = ['name', 'guard_name', 'capability', 'description'];

    /**
     * Obtener la capacidad a la que pertenece este permiso
     */
    public function capability(): BelongsTo
    {
        return $this->belongsTo(Capability::class);
    }
}
