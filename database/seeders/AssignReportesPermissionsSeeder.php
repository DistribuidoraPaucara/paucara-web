<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AssignReportesPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create the reportes-carga.index permission if it doesn't exist
        $permissionCarga = Permission::firstOrCreate(
            ['name' => 'reportes-carga.index'],
            ['guard_name' => 'web']
        );

        // Create the reportes.view permission if it doesn't exist (for barcode reports)
        $permissionReportes = Permission::firstOrCreate(
            ['name' => 'reportes.view'],
            ['guard_name' => 'web']
        );

        // Get Admin and Cajero roles (with correct case)
        $adminRole = Role::where('name', 'Admin')->first();
        $cajeroRole = Role::where('name', 'Cajero')->first();

        // Assign permissions to Admin role
        if ($adminRole) {
            if (!$adminRole->hasPermissionTo($permissionCarga)) {
                $adminRole->givePermissionTo($permissionCarga);
                echo "✓ Permiso 'reportes-carga.index' asignado a Admin\n";
            }
            if (!$adminRole->hasPermissionTo($permissionReportes)) {
                $adminRole->givePermissionTo($permissionReportes);
                echo "✓ Permiso 'reportes.view' asignado a Admin\n";
            }
        }

        // Assign permissions to Cajero role
        if ($cajeroRole) {
            if (!$cajeroRole->hasPermissionTo($permissionCarga)) {
                $cajeroRole->givePermissionTo($permissionCarga);
                echo "✓ Permiso 'reportes-carga.index' asignado a Cajero\n";
            }
            if (!$cajeroRole->hasPermissionTo($permissionReportes)) {
                $cajeroRole->givePermissionTo($permissionReportes);
                echo "✓ Permiso 'reportes.view' asignado a Cajero\n";
            }
        }
    }
}
