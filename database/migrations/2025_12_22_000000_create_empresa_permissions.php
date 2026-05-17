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
        // Crear permisos para gestión de empresas
        $permissions = [
            'empresas.index',
            'empresas.create',
            'empresas.show',
            'empresas.edit',
            'empresas.update',
            'empresas.delete',
            'empresas.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        // Asignar permisos al rol Admin
        $adminRole = Role::where('name', 'Admin')->first();
        if ($adminRole) {
            $adminRole->givePermissionTo($permissions);
        }

        // Asignar también al Super Admin si existe
        $superAdminRole = Role::where('name', 'Super Admin')->orWhere('name', 'SUPERADMIN')->first();
        if ($superAdminRole) {
            $superAdminRole->givePermissionTo($permissions);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revocar permisos del rol Admin
        $adminRole = Role::where('name', 'Admin')->first();
        if ($adminRole) {
            $adminRole->revokePermissionTo([
                'empresas.index',
                'empresas.create',
                'empresas.show',
                'empresas.edit',
                'empresas.update',
                'empresas.delete',
                'empresas.manage',
            ]);
        }

        // Eliminar permisos
        Permission::whereIn('name', [
            'empresas.index',
            'empresas.create',
            'empresas.show',
            'empresas.edit',
            'empresas.update',
            'empresas.delete',
            'empresas.manage',
        ])->delete();
    }
};
