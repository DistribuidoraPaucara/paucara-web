<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Mapeo de roles duplicados a roles tradicionales
        $mapping = [
            'preventista' => 'Preventista',
            'chofer' => 'Chofer',
            'cajero' => 'Cajero',
            'vendedor-basico' => 'Vendedor',
            'vendedor-avanzado' => 'Vendedor',
            'comprador' => 'Comprador',
            'gestor-inventario' => 'Gestor de Inventario',
            'gestor-almacen' => 'Gestor de Almacén',
            'contador' => 'Contabilidad',
            'gerente' => 'Gerente',
            'admin-operaciones' => 'Admin',
            'admin-sistema' => 'Super Admin',
            'analista-reportes' => 'Reportes',
        ];

        // 2. Migrar usuarios de roles duplicados a roles tradicionales
        foreach ($mapping as $oldRole => $newRole) {
            // Obtener ID del rol nuevo
            $newRoleId = DB::table('roles')->where('name', $newRole)->value('id');

            // Si el rol nuevo existe
            if ($newRoleId) {
                // Obtener ID del rol duplicado
                $oldRoleId = DB::table('roles')->where('name', $oldRole)->value('id');

                if ($oldRoleId) {
                    // Actualizar usuarios que tengan el rol duplicado
                    DB::table('model_has_roles')
                        ->where('role_id', $oldRoleId)
                        ->update(['role_id' => $newRoleId]);
                }
            }
        }

        // 3. Eliminar roles duplicados
        $duplicateRoles = array_keys($mapping);
        DB::table('roles')
            ->whereIn('name', $duplicateRoles)
            ->delete();

        // 4. Marcar tipo de roles (si las columnas existen)
        if (Schema::hasColumn('roles', 'role_type')) {
            $functionalRoles = [
                'Preventista', 'Chofer', 'Cajero', 'Vendedor', 'Comprador',
                'Gestor de Inventario', 'Gestor de Almacén', 'Gestor de Logística',
                'Contabilidad', 'Reportes', 'Gestor de Clientes', 'Gerente', 'Compras',
            ];

            DB::table('roles')
                ->whereIn('name', $functionalRoles)
                ->update(['role_type' => 'funcional', 'is_base' => false]);

            $baseRoles = ['Super Admin', 'Admin', 'Manager', 'Empleado', 'Cliente'];
            DB::table('roles')
                ->whereIn('name', $baseRoles)
                ->update(['role_type' => 'base', 'is_base' => true]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No se implementa rollback - los roles duplicados no deben recrearse automáticamente
        // Si es necesario deshacer, hacer rollback de base de datos antes de aplicar migración
    }
};
