<?php

namespace Database\Seeders;

use App\Models\Capability;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CreditosPermissionsSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ============================================
        // CREAR CAPACIDAD DE CRÉDITOS
        // ============================================
        $capability = Capability::updateOrCreate(
            ['name' => 'creditos'],
            [
                'label'       => 'Gestionar Créditos (Importación histórica)',
                'description' => 'Capacidad para importar créditos históricos desde otros sistemas',
                'icon'        => '📥',
            ]
        );

        // ============================================
        // CREAR PERMISO DE IMPORTACIÓN DE CRÉDITOS
        // ============================================
        $permission = Permission::firstOrCreate(
            ['name' => 'admin.creditos.importar', 'guard_name' => 'web'],
            ['capability' => 'creditos']
        );

        // ============================================
        // ASIGNAR PERMISO A ROLES ADMINISTRATIVOS
        // ============================================
        $adminRole = Role::where('name', 'admin')->first();
        $managerRole = Role::where('name', 'manager')->first();
        $superAdminRole = Role::where('name', 'Super Admin')->first();

        if ($adminRole && !$adminRole->hasPermissionTo($permission)) {
            $adminRole->givePermissionTo($permission);
            echo "✅ Permiso 'admin.creditos.importar' asignado al rol 'admin'\n";
        }

        if ($managerRole && !$managerRole->hasPermissionTo($permission)) {
            $managerRole->givePermissionTo($permission);
            echo "✅ Permiso 'admin.creditos.importar' asignado al rol 'manager'\n";
        }

        if ($superAdminRole && !$superAdminRole->hasPermissionTo($permission)) {
            $superAdminRole->givePermissionTo($permission);
            echo "✅ Permiso 'admin.creditos.importar' asignado al rol 'Super Admin'\n";
        }

        // Reset cached roles and permissions AFTER creating/assigning
        app('cache')->forget('spatie.permission.cache');

        echo "\n🟢 Seeder de Créditos completado exitosamente\n";
    }
}
