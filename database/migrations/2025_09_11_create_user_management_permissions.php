<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Limpiar caché de permisos
        app()['cache.store']->forget('spatie.permission.cache');

        // Permisos para gestión de usuarios
        $userPermissions = [
            'usuarios.index' => 'Ver listado de usuarios',
            'usuarios.create' => 'Crear nuevos usuarios',
            'usuarios.show' => 'Ver detalles de usuarios',
            'usuarios.edit' => 'Editar usuarios',
            'usuarios.delete' => 'Eliminar usuarios',
            'usuarios.toggle-status' => 'Activar/Desactivar usuarios',
            'usuarios.manage-roles' => 'Gestionar roles de usuarios',
            'usuarios.manage-permissions' => 'Gestionar permisos directos de usuarios',
        ];

        // Permisos para gestión de roles
        $rolePermissions = [
            'roles.index' => 'Ver listado de roles',
            'roles.create' => 'Crear nuevos roles',
            'roles.show' => 'Ver detalles de roles',
            'roles.edit' => 'Editar roles',
            'roles.delete' => 'Eliminar roles',
            'roles.manage-permissions' => 'Gestionar permisos de roles',
        ];

        // Permisos para gestión de permisos
        $permissionPermissions = [
            'permissions.index' => 'Ver listado de permisos',
            'permissions.create' => 'Crear nuevos permisos',
            'permissions.show' => 'Ver detalles de permisos',
            'permissions.edit' => 'Editar permisos',
            'permissions.delete' => 'Eliminar permisos',
        ];

        $allPermissions = array_merge($userPermissions, $rolePermissions, $permissionPermissions);

        foreach ($allPermissions as $name => $description) {
            Permission::findOrCreate($name, 'web');
        }

        // Asignar todos los permisos al rol Admin
        $adminRole = Role::where('name', 'Admin')->first();
        if ($adminRole) {
            $adminRole->givePermissionTo(array_keys($allPermissions));
        }

        // Crear rol específico para gestión de usuarios si no existe
        $userManagerRole = Role::firstOrCreate([
            'name' => 'Gestor de Usuarios',
            'guard_name' => 'web',
        ]);

        // Asignar permisos de gestión de usuarios al nuevo rol
        $userManagerRole->givePermissionTo(array_keys($userPermissions));
        $userManagerRole->givePermissionTo(['roles.index', 'roles.show']);
        $userManagerRole->givePermissionTo(['permissions.index', 'permissions.show']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $permissionsToDelete = [
            // Usuarios
            'usuarios.index',
            'usuarios.create',
            'usuarios.show',
            'usuarios.edit',
            'usuarios.delete',
            'usuarios.toggle-status',
            'usuarios.manage-roles',
            'usuarios.manage-permissions',

            // Roles
            'roles.index',
            'roles.create',
            'roles.show',
            'roles.edit',
            'roles.delete',
            'roles.manage-permissions',

            // Permisos
            'permissions.index',
            'permissions.create',
            'permissions.show',
            'permissions.edit',
            'permissions.delete',
        ];

        Permission::whereIn('name', $permissionsToDelete)->delete();

        // Eliminar rol de gestor de usuarios
        Role::where('name', 'Gestor de Usuarios')->delete();
    }
};
