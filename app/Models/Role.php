<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    protected $fillable = [
        'name',
        'guard_name',
        'is_base',
        'role_type',
        'template_name',
        'description',
        'display_order',
        'deprecated_at',
    ];

    protected $casts = [
        'deprecated_at' => 'datetime',
    ];
}
