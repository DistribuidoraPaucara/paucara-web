<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Role;
use Illuminate\Database\Seeder;

class SimplifiedRolesSeeder extends Seeder
{
    /**
     * ============================================
     * FASE 3: SIMPLIFICACIÓN A 5 ROLES BASE
     * ============================================
     *
     * Reemplaza los 18 roles complejos con 5 roles base.
     * Cada rol base tiene una plantilla de capacidades asociada.
     * Los usuarios usan roles base + plantillas de capacidades.
     */
    public function run(): void
    {
        $baseRoles = [
            [
                'name' => 'Super Admin',
                'description' => 'Acceso total al sistema. Solo para administradores supremos.',
                'role_type' => 'base',
                'is_base' => true,
                'template_name' => 'admin-sistema',
                'display_order' => 1,
            ],

            [
                'name' => 'Admin',
                'description' => 'Administrador del sistema. Puede gestionar usuarios, roles y configuración.',
                'role_type' => 'base',
                'is_base' => true,
                'template_name' => 'admin-operaciones',
                'display_order' => 2,
            ],

            [
                'name' => 'Manager',
                'description' => 'Gerente operativo. Supervisa todas las operaciones del negocio.',
                'role_type' => 'base',
                'is_base' => true,
                'template_name' => 'gerente',
                'display_order' => 3,
            ],

            [
                'name' => 'Empleado',
                'description' => 'Empleado base. Acceso limitado, requiere asignar capacidades específicas.',
                'role_type' => 'base',
                'is_base' => true,
                'template_name' => null,
                'display_order' => 4,
            ],

            [
                'name' => 'Cliente',
                'description' => 'Cliente/usuario final. Puede crear proformas y ver sus pedidos.',
                'role_type' => 'base',
                'is_base' => true,
                'template_name' => null,
                'display_order' => 5,
            ],
        ];

        // Crear/actualizar los 5 roles base
        foreach ($baseRoles as $roleData) {
            Role::updateOrCreate(
                ['name' => $roleData['name']],
                $roleData
            );
        }

        // Marcar roles legacy como deprecados
        $legacyRoles = [
            'Gerente',
            'Vendedor',
            'Compras',
            'Comprador',
            'Gestor de Inventario',
            'Gestor de Almacén',
            'Gestor de Logística',
            'Chofer',
            'Cajero',
            'Contabilidad',
            'Reportes',
            'Gestor de Clientes',
            'Preventista',
            'Empleado',  // El role Empleado viejo
        ];

        foreach ($legacyRoles as $roleName) {
            $role = Role::where('name', $roleName)->first();
            if ($role && !$role->is_base) {
                $role->update([
                    'is_base' => false,
                    'role_type' => 'funcional',
                    'deprecated_at' => now(),
                ]);
            }
        }

        echo "\n✅ Fase 3: Roles simplificados exitosamente\n";
        echo "📌 5 roles base creados/actualizados\n";
        echo "📌 Roles legacy marcados como deprecados\n";
        echo "\n💡 Próximos pasos:\n";
        echo "   1. Asignar plantillas de capacidades a usuarios existentes\n";
        echo "   2. Migrar usuarios de roles legacy a roles base + capacidades\n";
        echo "   3. Eliminar roles legacy después de migración\n\n";
    }
}
