<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class CreateLowercaseRolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Crea los roles en minúsculas que espera el ApiProformaController
     */
    public function run(): void
    {
        // Roles que necesita el ApiProformaController en minúsculas
        $roles = [
            'admin',
            'chofer',
            'preventista',
            'cajero',
            'logistica',
            'manager',
            'encargado',
            'cliente',
        ];

        foreach ($roles as $roleName) {
            Role::findOrCreate($roleName);
            $this->command->info("Rol '{$roleName}' creado o verificado.");
        }

        $this->command->info('Todos los roles en minúsculas han sido creados exitosamente.');
    }
}
