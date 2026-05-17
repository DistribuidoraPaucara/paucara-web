<?php

namespace App\Services;

use App\Models\User;
use App\Models\Capability;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionService
{
    /**
     * ✅ Obtener todos los permisos agrupados por módulo
     * Usado por: Panel web, API mobile, etc.
     */
    public function getPermissionsGrouped()
    {
        $permissions = Permission::all();

        // Agrupar por prefijo de módulo (ej: 'ventas.', 'compras.', etc.)
        return $permissions->groupBy(function ($permission) {
            $parts = explode('.', $permission->name);
            return $parts[0] ?? 'general';
        })->map(function ($group, $module) {
            return [
                'module' => $module,
                'count' => $group->count(),
                'permissions' => $group->map(function ($permission) {
                    return [
                        'id' => $permission->id,
                        'name' => $permission->name,
                        'description' => $permission->description ?? '',
                        'label' => str_replace('.', ' → ', $permission->name),
                        'guard_name' => $permission->guard_name,
                        'roles_count' => $permission->roles()->count(),
                        'users_count' => 0, // Will be calculated if needed
                    ];
                })->values(),
            ];
        })->values();
    }

    /**
     * ✅ Obtener permisos de un rol
     */
    public function getRolePermissions(Role $role)
    {
        return $role->permissions()->pluck('name')->toArray();
    }

    /**
     * ✅ Asignar múltiples permisos a un usuario
     * Usado por: Panel de admin, API, Web
     */
    public function assignPermissionsToUser(User $user, array $permissionIds)
    {
        // Obtener permisos anteriores para auditoría
        $permisosAnteriores = $user->getAllPermissions()->pluck('id')->toArray();

        $permissions = Permission::whereIn('id', $permissionIds)->pluck('name')->toArray();
        $user->syncPermissions($permissions);

        // ✅ Registrar en auditoría
        AuditService::registrarCambioUsuario(
            $user,
            $permisosAnteriores,
            $permissionIds,
            request()
        );

        return true;
    }

    /**
     * ✅ Asignar múltiples permisos a un rol
     */
    public function assignPermissionsToRole(Role $role, array $permissionIds)
    {
        // Obtener permisos anteriores para auditoría
        $permisosAnteriores = $role->permissions()->pluck('id')->toArray();

        $permissions = Permission::whereIn('id', $permissionIds)->pluck('name')->toArray();
        $role->syncPermissions($permissions);

        // ✅ Registrar en auditoría
        AuditService::registrarCambioRol(
            $role,
            $permisosAnteriores,
            $permissionIds,
            request()
        );

        return true;
    }

    /**
     * ✅ Obtener estructura de permisos para UI
     * Agrupa permisos por módulo para presentarlos mejor
     */
    public function getPermissionsForUI()
    {
        $permissions = Permission::all();

        return $permissions->groupBy(function ($permission) {
            $parts = explode('.', $permission->name);
            return $parts[0] ?? 'general';
        })
        ->map(function ($group, $module) {
            return [
                'module' => $module,
                'module_label' => $this->formatModuleLabel($module),
                'permissions' => $group->map(fn($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'label' => str_replace('.', ' - ', $p->name),
                ])->values(),
            ];
        })
        ->sortBy('module')
        ->values();
    }

    /**
     * ✅ Formatear etiqueta del módulo
     */
    private function formatModuleLabel(string $module): string
    {
        $labels = [
            'ventas' => '💼 Ventas',
            'compras' => '📥 Compras',
            'inventario' => '📦 Inventario',
            'clientes' => '👥 Clientes',
            'empleados' => '👔 Empleados',
            'usuarios' => '👤 Usuarios',
            'roles' => '🔐 Roles',
            'permissions' => '🔑 Permisos',
            'proformas' => '📋 proformas',
            'envios' => '🚚 Envíos',
            'logistica' => '📍 Logística',
            'cajas' => '💰 Cajas',
            'contabilidad' => '📊 Contabilidad',
            'reportes' => '📈 Reportes',
            'configuracion' => '⚙️ Configuración',
            'admin' => '🛡️ Administración',
        ];

        return $labels[$module] ?? ucfirst($module);
    }

    /**
     * ✅ Obtener permisos de un usuario (desde usuario directo + roles)
     */
    public function getUserPermissions(User $user)
    {
        return $user->getAllPermissions()->pluck('name')->toArray();
    }

    /**
     * ✅ Verificar si usuario tiene permiso específico
     */
    public function hasPermission(User $user, string $permission): bool
    {
        return $user->hasPermissionTo($permission);
    }

    /**
     * ✅ Obtener todos los permisos para un rol (directo + heredado)
     */
    public function getRoleAllPermissions(Role $role)
    {
        return $role->getAllPermissions()->pluck('name')->toArray();
    }

    /**
     * ✅ NUEVO: Buscar usuarios por nombre o email
     */
    public function buscarUsuarios(string $query, int $limit = 20)
    {
        return User::where('name', 'ilike', "%{$query}%")
            ->orWhere('email', 'ilike', "%{$query}%")
            ->with('roles')
            ->limit($limit)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name')->toArray(),
                    'permissions_count' => $user->getAllPermissions()->count(),
                ];
            });
    }

    /**
     * ✅ NUEVO: Buscar roles por nombre
     */
    public function buscarRoles(string $query, int $limit = 20)
    {
        return Role::where('name', 'ilike', "%{$query}%")
            ->limit($limit)
            ->get()
            ->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'display_name' => $role->name, // Usar name como display_name
                    'permissions_count' => $role->permissions()->count(),
                ];
            });
    }

    /**
     * ✅ NUEVO: Filtrar usuarios por rol
     */
    public function filtrarUsuariosPorRol(string $rol)
    {
        $role = Role::where('name', $rol)->first();

        if (!$role) {
            return collect([]);
        }

        return $role->users()
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name')->toArray(),
                    'permissions_count' => $user->getAllPermissions()->count(),
                ];
            });
    }

    /**
     * ✅ NUEVO: Obtener usuarios con paginación y búsqueda
     */
    public function obtenerUsuariosPaginados(
        int $page = 1,
        int $perPage = 50,
        ?string $search = null,
        ?string $rol = null
    ) {
        $query = User::with('roles');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        if ($rol) {
            $query->whereHas('roles', function ($q) use ($rol) {
                $q->where('name', $rol);
            });
        }

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * ✅ NUEVO: Obtener roles con paginación y búsqueda
     */
    public function obtenerRolesPaginados(
        int $page = 1,
        int $perPage = 50,
        ?string $search = null
    ) {
        $query = Role::with('permissions');

        if ($search) {
            $query->where('name', 'ilike', "%{$search}%");
        }

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * ============================================
     * FASE 1: NUEVOS MÉTODOS PARA CAPACIDADES
     * ============================================
     */

    /**
     * ✅ NUEVO: Obtener todas las capacidades con sus permisos
     * Usado para mostrar UI organizada por CAPACIDADES (no por módulos)
     */
    public function getCapabilitiesWithPermissions()
    {
        return Capability::orderBy('order')
            ->get()
            ->map(function ($capability) {
                $permissions = $capability->permissions()->get();
                return [
                    'id' => $capability->id,
                    'name' => $capability->name,
                    'label' => $capability->label,
                    'description' => $capability->description,
                    'icon' => $capability->icon,
                    'permissions_count' => $permissions->count(),
                    'permissions' => $permissions
                        ->map(fn($p) => [
                            'id' => $p->id,
                            'name' => $p->name,
                            'label' => str_replace('.', ' → ', $p->name),
                        ])
                        ->values()
                ];
            });
    }

    /**
     * ✅ NUEVO: Obtener capacidades para mostrar en UI
     * Incluyendo información sobre qué capacidades tienen usuarios/roles
     */
    public function getCapabilitiesForUI()
    {
        return $this->getCapabilitiesWithPermissions();
    }

    /**
     * ✅ NUEVO: Obtener capacidades de un usuario
     * Retorna la lista de capacidades que tiene un usuario basado en sus permisos
     */
    public function getUserCapabilities(User $user)
    {
        $userPermissions = $user->getAllPermissions()->pluck('name')->toArray();

        return Capability::get()
            ->map(function ($capability) use ($userPermissions) {
                $capPermissions = $capability->permissions()
                    ->pluck('name')
                    ->toArray();

                $hasAllPermissions = count($capPermissions) > 0
                    && count(array_intersect($capPermissions, $userPermissions)) === count($capPermissions);
                $hasPartialPermissions = count(array_intersect($capPermissions, $userPermissions)) > 0;

                return [
                    'name' => $capability->name,
                    'label' => $capability->label,
                    'icon' => $capability->icon,
                    'has_full' => $hasAllPermissions,
                    'has_partial' => $hasPartialPermissions,
                    'permissions_count' => count($capPermissions),
                    'user_permissions_count' => count(array_intersect($capPermissions, $userPermissions)),
                ];
            });
    }

    /**
     * ✅ NUEVO: Obtener capacidades de un rol
     * Retorna la lista de capacidades que tiene un rol
     */
    public function getRoleCapabilities(Role $role)
    {
        $rolePermissions = $role->permissions()->pluck('name')->toArray();

        return Capability::get()
            ->map(function ($capability) use ($rolePermissions) {
                $capPermissions = $capability->permissions()
                    ->pluck('name')
                    ->toArray();

                $hasAllPermissions = count($capPermissions) > 0
                    && count(array_intersect($capPermissions, $rolePermissions)) === count($capPermissions);
                $hasPartialPermissions = count(array_intersect($capPermissions, $rolePermissions)) > 0;

                return [
                    'name' => $capability->name,
                    'label' => $capability->label,
                    'icon' => $capability->icon,
                    'has_full' => $hasAllPermissions,
                    'has_partial' => $hasPartialPermissions,
                    'permissions_count' => count($capPermissions),
                    'role_permissions_count' => count(array_intersect($capPermissions, $rolePermissions)),
                ];
            });
    }

    /**
     * ✅ NUEVO: Asignar capacidad completa a un usuario
     * Asigna TODOS los permisos de una capacidad a un usuario
     */
    public function assignCapabilityToUser(User $user, string $capabilityName)
    {
        $capability = Capability::where('name', $capabilityName)->first();
        if (!$capability) {
            return false;
        }

        $permissions = $capability->permissions()
            ->pluck('name')
            ->toArray();

        $permissionIds = Permission::whereIn('name', $permissions)
            ->pluck('id')
            ->toArray();

        $this->assignPermissionsToUser($user, $permissionIds);
        return true;
    }

    /**
     * ✅ NUEVO: Asignar capacidad completa a un rol
     * Asigna TODOS los permisos de una capacidad a un rol
     */
    public function assignCapabilityToRole(Role $role, string $capabilityName)
    {
        $capability = Capability::where('name', $capabilityName)->first();
        if (!$capability) {
            return false;
        }

        $permissions = $capability->permissions()
            ->pluck('name')
            ->toArray();

        $permissionIds = Permission::whereIn('name', $permissions)
            ->pluck('id')
            ->toArray();

        $this->assignPermissionsToRole($role, $permissionIds);
        return true;
    }

    /**
     * ✅ NUEVO: Remover capacidad de un usuario
     * Remueve TODOS los permisos de una capacidad de un usuario
     */
    public function removeCapabilityFromUser(User $user, string $capabilityName)
    {
        $capability = Capability::where('name', $capabilityName)->first();
        if (!$capability) {
            return false;
        }

        $permissions = $capability->permissions()
            ->pluck('name')
            ->toArray();

        $user->revokePermissionTo($permissions);
        return true;
    }

    /**
     * ✅ NUEVO: Remover capacidad de un rol
     * Remueve TODOS los permisos de una capacidad de un rol
     */
    public function removeCapabilityFromRole(Role $role, string $capabilityName)
    {
        $capability = Capability::where('name', $capabilityName)->first();
        if (!$capability) {
            return false;
        }

        $permissions = $capability->permissions()
            ->pluck('name')
            ->toArray();

        $role->revokePermissionTo($permissions);
        return true;
    }
}
