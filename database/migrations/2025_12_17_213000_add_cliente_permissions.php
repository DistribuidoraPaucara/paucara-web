<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Crear permisos si no existen
        $permisos = [
            // Lectura
            ['name' => 'clientes.view', 'guard_name' => 'web'],
            ['name' => 'clientes.view-all', 'guard_name' => 'web'],

            // Crear
            ['name' => 'clientes.create', 'guard_name' => 'web'],

            // Editar
            ['name' => 'clientes.edit', 'guard_name' => 'web'],
            ['name' => 'clientes.edit-own', 'guard_name' => 'web'],

            // Eliminar
            ['name' => 'clientes.delete', 'guard_name' => 'web'],
            ['name' => 'clientes.delete-own', 'guard_name' => 'web'],

            // Bloquear/Estado
            ['name' => 'clientes.block', 'guard_name' => 'web'],
            ['name' => 'clientes.block-own', 'guard_name' => 'web'],

            // Auditoría
            ['name' => 'clientes.audit', 'guard_name' => 'web'],
            ['name' => 'clientes.audit-own', 'guard_name' => 'web'],
        ];

        foreach ($permisos as $permiso) {
            Permission::firstOrCreate(
                ['name' => $permiso['name'], 'guard_name' => $permiso['guard_name']],
                $permiso
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar permisos creados
        $permisos = [
            'clientes.view',
            'clientes.view-all',
            'clientes.create',
            'clientes.edit',
            'clientes.edit-own',
            'clientes.delete',
            'clientes.delete-own',
            'clientes.block',
            'clientes.block-own',
            'clientes.audit',
            'clientes.audit-own',
        ];

        Permission::whereIn('name', $permisos)->delete();
    }
};
