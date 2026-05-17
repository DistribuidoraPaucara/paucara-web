<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Crear permisos para gestión de stock de productos
        $permisos = [
            'stock-productos.editar-cantidad' => 'Editar cantidades de stock en productos',
            'stock-productos.ver-movimientos' => 'Ver historial de movimientos de stock',
            'stock-productos.registrar-movimiento' => 'Registrar movimientos de inventario',
        ];

        foreach ($permisos as $nombre => $descripcion) {
            Permission::create([
                'name' => $nombre,
                'guard_name' => 'web',
                'capability' => 'inventario', // Agrupa bajo "inventario"
                'description' => $descripcion,
            ]);
        }

        // Asignar permisos al rol admin
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminRole->givePermissionTo(array_keys($permisos));
        }

        // Asignar permisos al rol almacenero si existe
        $almaceneroRole = Role::where('name', 'almacenero')->first();
        if ($almaceneroRole) {
            $almaceneroRole->givePermissionTo([
                'stock-productos.editar-cantidad',
                'stock-productos.ver-movimientos',
                'stock-productos.registrar-movimiento',
            ]);
        }

        // Asignar permisos al rol manager si existe
        $managerRole = Role::where('name', 'manager')->first();
        if ($managerRole) {
            $managerRole->givePermissionTo([
                'stock-productos.ver-movimientos',
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar permisos
        $permisos = [
            'stock-productos.editar-cantidad',
            'stock-productos.ver-movimientos',
            'stock-productos.registrar-movimiento',
        ];

        Permission::whereIn('name', $permisos)->delete();
    }
};
