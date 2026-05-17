<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Permission\Models\Permission;

class Capability extends Model
{
    public $timestamps = false;

    protected $fillable = ['name', 'label', 'description', 'icon', 'order'];

    /**
     * Obtener todos los permisos de esta capacidad
     * Nota: Usa where() en lugar de hasMany porque la relación es por string, no por ID
     */
    public function permissions()
    {
        return Permission::where('capability', $this->name);
    }
}
