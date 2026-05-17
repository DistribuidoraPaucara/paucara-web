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
        // Crear permisos específicos para tipos de pago
        $permisos = [
            // Gestión de tipos de pago
            'tipos-pago.index' => 'Ver listado de tipos de pago',
            'tipos-pago.create' => 'Crear nuevos tipos de pago',
            'tipos-pago.show' => 'Ver detalles de tipos de pago',
            'tipos-pago.edit' => 'Editar tipos de pago',
            'tipos-pago.delete' => 'Eliminar tipos de pago',
            'tipos-pago.manage' => 'Gestión completa de tipos de pago',
        ];

        foreach ($permisos as $nombre => $descripcion) {
            // Verificar si el permiso ya existe antes de crearlo
            if (!Permission::where('name', $nombre)->exists()) {
                Permission::create([
                    'name' => $nombre,
                    'guard_name' => 'web',
                ]);
            }
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
                'tipos-pago.index',
                'tipos-pago.create',
                'tipos-pago.show',
                'tipos-pago.edit',
                'tipos-pago.manage',
            ]);
        }

        // Asignar permisos al rol cajero si existe
        $cajeroRole = Role::where('name', 'cajero')->first();
        if ($cajeroRole) {
            $cajeroRole->givePermissionTo([
                'tipos-pago.index',
                'tipos-pago.show',
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
            'tipos-pago.index',
            'tipos-pago.create',
            'tipos-pago.show',
            'tipos-pago.edit',
            'tipos-pago.delete',
            'tipos-pago.manage',
        ];

        Permission::whereIn('name', $permisos)->delete();
    }
};
