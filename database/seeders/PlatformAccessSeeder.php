<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class PlatformAccessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Configura el acceso a plataformas según el rol del usuario:
     * - Cliente: Solo móvil
     * - Todos los demás roles: Web + Móvil
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()['cache.store']->forget('spatie.permission.cache');

        // ============================================
        // 1. Bloquear acceso web a usuarios con rol Cliente
        // ============================================
        try {
            User::role('Cliente')
                ->update([
                    'can_access_web' => false,
                    'can_access_mobile' => true,
                ]);
            $this->command->info('✅ Usuarios Cliente: bloqueados en web, permitidos en móvil');
        } catch (\Exception $e) {
            $this->command->warn('⚠️  Rol Cliente no encontrado: ' . $e->getMessage());
        }

        // ============================================
        // 2. Asegurar que todos los demás roles tengan acceso a ambas plataformas
        // ============================================
        User::whereDoesntHave('roles', function($query) {
            $query->where('name', 'LIKE', '%Cliente%');
        })->update([
            'can_access_web' => true,
            'can_access_mobile' => true,
        ]);

        $this->command->info('✅ Otros usuarios: permitidos en web y móvil');

        // ============================================
        // 3. Asegurar que Super-Admin siempre tenga acceso a ambas
        // ============================================
        try {
            User::role('Super Admin')
                ->update([
                    'can_access_web' => true,
                    'can_access_mobile' => true,
                ]);
            $this->command->info('✅ Super-Admin: acceso completo a web y móvil');
        } catch (\Exception $e) {
            $this->command->warn('⚠️  Rol Super Admin no encontrado: ' . $e->getMessage());
        }

        $this->command->info('✅ Configuración de acceso a plataformas completada.');
    }
}
