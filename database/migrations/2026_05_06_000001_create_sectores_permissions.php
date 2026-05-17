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
        // Crear permisos específicos para sectores
        $permisos = [
            // Gestión de sectores
            'sectores.index' => 'Ver listado de sectores',
            'sectores.create' => 'Crear nuevos sectores',
            'sectores.show' => 'Ver detalles de sectores',
            'sectores.edit' => 'Editar sectores',
            'sectores.delete' => 'Eliminar sectores',
            'sectores.manage' => 'Gestión completa de sectores',
        ];

        foreach ($permisos as $nombre => $descripcion) {
            Permission::create([
                'name' => $nombre,
                'guard_name' => 'web',
            ]);
        }

        // Asignar permisos al rol admin si existe
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminRole->givePermissionTo(array_keys($permisos));
        }

        // Asignar permisos al rol gerente/manager si existe
        $managerRole = Role::where('name', 'manager')->first();
        if ($managerRole) {
            $managerRole->givePermissionTo([
                'sectores.index',
                'sectores.create',
                'sectores.show',
                'sectores.edit',
                'sectores.manage',
            ]);
        }

        // Asignar permisos al rol almacenero si existe
        $almaceneroRole = Role::where('name', 'almacenero')->first();
        if ($almaceneroRole) {
            $almaceneroRole->givePermissionTo([
                'sectores.index',
                'sectores.show',
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar permisos
        $permisos = [
            'sectores.index',
            'sectores.create',
            'sectores.show',
            'sectores.edit',
            'sectores.delete',
            'sectores.manage',
        ];

        Permission::whereIn('name', $permisos)->delete();
    }
};
