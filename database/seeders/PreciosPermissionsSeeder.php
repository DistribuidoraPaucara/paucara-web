<?php
namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class PreciosPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()['cache.store']->forget('spatie.permission.cache');

        // ============================================
        // 1. CREAR PERMISOS PARA GESTIÓN DE PRECIOS
        // ============================================
        $permissions = [
            'precios.index' => 'Ver página de gestión de precios',
            'precios.update' => 'Actualizar precios de productos',
        ];

        foreach ($permissions as $name => $description) {
            Permission::findOrCreate($name, 'web');
            $permission = Permission::where('name', $name)->first();
            if ($permission) {
                $permission->update(['description' => $description]);
            }
        }

        // ============================================
        // 2. ASIGNAR PERMISOS A ROLES
        // ============================================

        // Super Admin: tiene todos los permisos (se asignan automáticamente)
        $superAdmin = Role::where('name', 'Super Admin')->first();
        if ($superAdmin) {
            $superAdmin->givePermissionTo(['precios.index', 'precios.update']);
        }

        // Admin: tiene permisos de precios
        $admin = Role::where('name', 'admin')->first();
        if ($admin) {
            $admin->givePermissionTo(['precios.index', 'precios.update']);
        }

        // Gerente: tiene permisos de precios
        $gerente = Role::where('name', 'gerente')->first();
        if ($gerente) {
            $gerente->givePermissionTo(['precios.index', 'precios.update']);
        }

        // ============================================
        // 3. ASIGNAR PERMISOS AL USUARIO ADMIN
        // ============================================
        $adminUser = User::where('email', 'admin@admin.com')->first();
        if ($adminUser) {
            // Si no tiene Super Admin, asignarle permisos directos
            if (!$adminUser->hasRole('Super Admin')) {
                $adminUser->givePermissionTo(['precios.index', 'precios.update']);
            }
        }

        $this->command->info('✅ Permisos de precios creados y asignados correctamente');
        $this->command->line('   - precios.index: Ver página de gestión de precios');
        $this->command->line('   - precios.update: Actualizar precios de productos');
    }
}
