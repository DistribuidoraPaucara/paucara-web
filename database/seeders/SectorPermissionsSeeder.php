<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class SectorPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Crea los permisos de sectores y los asigna a roles existentes
     */
    public function run(): void
    {
        // Resetear permisos en caché
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Definir permisos para sectores
        $permisos = [
            'sectores.create',
            'sectores.read',
            'sectores.update',
            'sectores.delete',
            'sectores.manage', // Permiso general (incluye todos)
        ];

        // Crear permisos si no existen
        foreach ($permisos as $nombre) {
            Permission::firstOrCreate(
                ['name' => $nombre, 'guard_name' => 'web']
            );
            $this->command->info("✅ Permiso creado: {$nombre}");
        }

        // Asignar permisos al rol admin
        $roleAdmin = Role::where('name', 'admin')->first();
        if ($roleAdmin) {
            $roleAdmin->syncPermissions($permisos);
            $this->command->info("✅ Permisos asignados al rol 'admin'");
        }

        // Asignar permiso de lectura al rol vendedor (si existe)
        $roleVendedor = Role::where('name', 'vendedor')->first();
        if ($roleVendedor) {
            $roleVendedor->givePermissionTo('sectores.read');
            $this->command->info("✅ Permiso 'sectores.read' asignado al rol 'vendedor'");
        }

        // Asignar permiso de lectura al rol encargado (si existe)
        $roleEncargado = Role::where('name', 'encargado')->first();
        if ($roleEncargado) {
            $roleEncargado->givePermissionTo(['sectores.read', 'sectores.update']);
            $this->command->info("✅ Permisos 'sectores.read' y 'sectores.update' asignados al rol 'encargado'");
        }

        $this->command->info("🎉 Seeder de permisos de sectores completado");
    }
}
