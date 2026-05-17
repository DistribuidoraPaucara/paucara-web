<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ✅ Modelo para auditoría de cambios de permisos
 * Registra quién cambió qué permisos, cuándo y desde dónde
 */
class PermissionAudit extends Model
{
    protected $fillable = [
        'admin_id',
        'target_type',
        'target_id',
        'target_name',
        'action',
        'permisos_anteriores',
        'permisos_nuevos',
        'descripcion',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'permisos_anteriores' => 'array',
            'permisos_nuevos' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Relación con el usuario que realizó el cambio
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Obtener el usuario o rol afectado (dinámico)
     */
    public function getTargetAttribute()
    {
        if ($this->target_type === 'usuario') {
            return User::find($this->target_id);
        }

        return \Spatie\Permission\Models\Role::find($this->target_id);
    }

    /**
     * Scopear por tipo de cambio
     */
    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Scopear por tipo de objetivo (usuario o rol)
     */
    public function scopeByTargetType($query, string $type)
    {
        return $query->where('target_type', $type);
    }

    /**
     * Scopear por usuario que realizó el cambio
     */
    public function scopeByAdmin($query, int $adminId)
    {
        return $query->where('admin_id', $adminId);
    }

    /**
     * Obtener cambios recientes (últimos 30 días)
     */
    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days))
            ->orderByDesc('created_at');
    }

    /**
     * Obtener cambios para un usuario específico
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('target_type', 'usuario')
            ->where('target_id', $userId);
    }

    /**
     * Obtener cambios para un rol específico
     */
    public function scopeForRole($query, int $roleId)
    {
        return $query->where('target_type', 'rol')
            ->where('target_id', $roleId);
    }

    /**
     * Obtener descripción legible del cambio
     */
    public function getDescripcionLegibleAttribute(): string
    {
        $tipo = $this->target_type === 'usuario' ? 'Usuario' : 'Rol';
        $accion = match ($this->action) {
            'crear' => 'Creó',
            'editar' => 'Editó',
            'eliminar' => 'Eliminó',
            'restaurar' => 'Restauró',
            default => 'Modificó',
        };

        return "{$accion} permisos del {$tipo}: {$this->target_name}";
    }

    /**
     * Obtener cantidad de permisos cambiados
     */
    public function getPermisosChangedAttribute(): int
    {
        $anteriores = collect($this->permisos_anteriores ?? []);
        $nuevos = collect($this->permisos_nuevos ?? []);

        // Contar agregados, eliminados y modificados
        $agregados = $nuevos->diff($anteriores)->count();
        $eliminados = $anteriores->diff($nuevos)->count();

        return $agregados + $eliminados;
    }
}
