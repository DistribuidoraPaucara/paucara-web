<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

/**
 * ============================================
 * CREATE ANALISIS ABC PERMISSION SEEDER
 * Crea el permiso inventario.analisis.manage
 * ============================================
 */
class CreateAnalisisAbcPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Crear el permiso si no existe
        Permission::firstOrCreate(
            ['name' => 'inventario.analisis.manage', 'guard_name' => 'web'],
            ['description' => 'Gestionar análisis ABC del inventario']
        );

        $this->command->info('✅ Permiso inventario.analisis.manage creado o ya existía.');
    }
}
