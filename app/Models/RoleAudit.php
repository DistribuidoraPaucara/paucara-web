<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoleAudit extends Model
{
    protected $table = 'role_audits';

    protected $fillable = [
        'role_id',
        'user_id',
        'accion',
        'permiso_nombre',
        'antes',
        'despues',
        'descripcion',
        'usuarios_afectados',
    ];

    protected function casts(): array
    {
        return [
            'antes' => 'array',
            'despues' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Relación: El rol que fue modificado
     */
    public function rol(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    /**
     * Relación: El usuario que hizo el cambio
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Registrar un cambio en el rol
     */
    public static function registrar(
        \Spatie\Permission\Models\Role $rol,
        User $usuario,
        string $accion,
        string $descripcion,
        ?string $permisoNombre = null,
        ?array $antes = null,
        ?array $despues = null,
        int $usuariosAfectados = 0
    ): self {
        return self::create([
            'role_id' => $rol->id,
            'user_id' => $usuario->id,
            'accion' => $accion,
            'descripcion' => $descripcion,
            'permiso_nombre' => $permisoNombre,
            'antes' => $antes,
            'despues' => $despues,
            'usuarios_afectados' => $usuariosAfectados,
        ]);
    }
}
