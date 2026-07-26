<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class AssignAllPermissionsToAdminSeeder extends Seeder
{
    /**
     * Asigna TODOS los permisos registrados directamente al usuario admin.
     *
     * - Es idempotente: se puede correr múltiples veces sin duplicar.
     * - Funciona aunque se agreguen nuevos permisos en el futuro.
     * - Los permisos se asignan directo al usuario (además de los que
     *   ya tenga por rol), usando syncPermissions para evitar duplicados.
     */
    public function run(): void
    {
        // Limpiar caché de permisos de Spatie
        app()['cache.store']->forget('spatie.permission.cache');

        $admin = User::where('email', 'admin@admin.com')->first();

        if (! $admin) {
            $this->command->warn('⚠️  No se encontró el usuario admin@admin.com. Abortando.');
            return;
        }

        $allPermissions = Permission::all();

        if ($allPermissions->isEmpty()) {
            $this->command->warn('⚠️  No hay permisos registrados en la base de datos.');
            return;
        }

        // Asignar todos los permisos directamente al usuario (idempotente)
        $admin->syncPermissions($allPermissions);

        $this->command->info("✅ Usuario [{$admin->email}] ahora tiene {$allPermissions->count()} permisos asignados directamente.");
    }
}
