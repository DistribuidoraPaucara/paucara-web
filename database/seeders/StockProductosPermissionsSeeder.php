<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class StockProductosPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear permisos para gestión de stock de productos
        $permisos = [
            [
                'name' => 'stock-productos.editar-cantidad',
                'guard_name' => 'web',
                'capability' => 'inventario',
                'description' => 'Editar cantidades de stock (total, disponible, reservado) en formulario de productos',
            ],
            [
                'name' => 'stock-productos.ver-movimientos',
                'guard_name' => 'web',
                'capability' => 'inventario',
                'description' => 'Ver historial de movimientos de stock',
            ],
            [
                'name' => 'stock-productos.registrar-movimiento',
                'guard_name' => 'web',
                'capability' => 'inventario',
                'description' => 'Registrar movimientos de inventario (entradas/salidas)',
            ],
        ];

        foreach ($permisos as $permisoData) {
            Permission::updateOrCreate(
                ['name' => $permisoData['name'], 'guard_name' => $permisoData['guard_name']],
                $permisoData
            );
        }

        // Obtener permisos creados
        $permisosNombres = array_column($permisos, 'name');

        // Asignar permisos al rol admin (todos los permisos)
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminRole->syncPermissions($permisosNombres);
            $this->command->info('✅ Permisos asignados al rol: admin');
        }

        // Asignar permisos al rol almacenero
        $almaceneroRole = Role::where('name', 'almacenero')->first();
        if ($almaceneroRole) {
            $almaceneroRole->givePermissionTo([
                'stock-productos.editar-cantidad',
                'stock-productos.ver-movimientos',
                'stock-productos.registrar-movimiento',
            ]);
            $this->command->info('✅ Permisos asignados al rol: almacenero');
        }

        // Asignar permisos al rol manager (solo lectura)
        $managerRole = Role::where('name', 'manager')->first();
        if ($managerRole) {
            $managerRole->givePermissionTo([
                'stock-productos.ver-movimientos',
            ]);
            $this->command->info('✅ Permisos asignados al rol: manager');
        }

        $this->command->info('✅ StockProductosPermissionsSeeder ejecutado exitosamente');
    }
}
