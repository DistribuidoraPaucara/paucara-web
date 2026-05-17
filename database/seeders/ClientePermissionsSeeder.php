<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class ClientePermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Asigna los permisos granulares de clientes a los roles:
     * - Preventista: Puede ver/crear/editar/eliminar SOLO SUS CLIENTES
     * - Admin: Puede VER todos los clientes (read-only)
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()['cache.store']->forget('spatie.permission.cache');

        // Obtener roles
        $preventista = Role::where('name', 'Preventista')->orWhere('name', 'preventista')->first();
        $admin = Role::where('name', 'Admin')->orWhere('name', 'admin')->first();

        if (!$preventista && !$admin) {
            $this->command->warn('Roles "Preventista" y "Admin" no encontrados. Abortando seeder.');
            return;
        }

        // ============================================
        // PERMISOS PARA PREVENTISTA
        // Gestión de sus propios clientes
        // ============================================
        if ($preventista) {
            $preventistaPerms = [
                // Lectura
                'clientes.view',          // Ver cliente individual

                // Crear
                'clientes.create',        // Crear nuevo cliente

                // Editar
                'clientes.edit-own',      // Editar solo sus clientes

                // Eliminar
                'clientes.delete-own',    // Eliminar solo sus clientes

                // Bloquear
                'clientes.block-own',     // Bloquear solo sus clientes

                // Auditoría
                'clientes.audit-own',     // Ver auditoría de sus clientes
            ];

            $preventista->syncPermissions($preventistaPerms);
            $this->command->info("✅ Permisos asignados al rol 'Preventista'");
        }

        // ============================================
        // PERMISOS PARA ADMIN
        // Solo lectura de clientes
        // ============================================
        if ($admin) {
            $adminPerms = [
                // Lectura
                'clientes.view-all',      // Ver todos los clientes

                // Auditoría
                'clientes.audit',         // Ver auditoría de cualquier cliente
            ];

            $admin->syncPermissions($adminPerms);
            $this->command->info("✅ Permisos asignados al rol 'Admin'");
        }

        $this->command->info("✅ Permisos granulares de clientes asignados correctamente.");
    }
}
