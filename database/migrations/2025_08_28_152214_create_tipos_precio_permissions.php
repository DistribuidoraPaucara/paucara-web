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
        // Crear permisos específicos para tipos de precio
        $permisos = [
            // Gestión de tipos de precio
            'tipos-precio.index' => 'Ver listado de tipos de precio',
            'tipos-precio.create' => 'Crear nuevos tipos de precio',
            'tipos-precio.show' => 'Ver detalles de tipos de precio',
            'tipos-precio.edit' => 'Editar tipos de precio',
            'tipos-precio.delete' => 'Eliminar tipos de precio',
            'tipos-precio.toggle-activo' => 'Activar/Desactivar tipos de precio',

            // Reportes de precios y ganancias
            'reportes.precios.index' => 'Ver reportes de precios',
            'reportes.precios.export' => 'Exportar reportes de precios',
            'reportes.ganancias.index' => 'Ver reportes de ganancias',
            'reportes.ganancias.export' => 'Exportar reportes de ganancias',

            // Gestión avanzada de precios en productos
            'productos.precios.gestionar' => 'Gestionar precios avanzados de productos',
            'productos.precios.calcular-ganancias' => 'Ver cálculos de ganancias',
            'productos.configuracion-ganancias' => 'Configurar márgenes de ganancia',
        ];

        foreach ($permisos as $nombre => $descripcion) {
            Permission::create([
                'name' => $nombre,
                'guard_name' => 'web',
            ]);
        }

        // Asignar permisos al rol admin si existe
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminRole->givePermissionTo(array_keys($permisos));
        }

        // Crear rol específico para gestión de precios
        $preciosManagerRole = Role::create([
            'name' => 'precios-manager',
            'guard_name' => 'web',
        ]);

        // Asignar permisos relacionados con precios al nuevo rol
        $preciosManagerRole->givePermissionTo([
            'tipos-precio.index',
            'tipos-precio.create',
            'tipos-precio.show',
            'tipos-precio.edit',
            'tipos-precio.toggle-activo',
            'reportes.precios.index',
            'reportes.precios.export',
            'reportes.ganancias.index',
            'reportes.ganancias.export',
            'productos.precios.gestionar',
            'productos.precios.calcular-ganancias',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar permisos
        $permisos = [
            'tipos-precio.index',
            'tipos-precio.create',
            'tipos-precio.show',
            'tipos-precio.edit',
            'tipos-precio.delete',
            'tipos-precio.toggle-activo',
            'reportes.precios.index',
            'reportes.precios.export',
            'reportes.ganancias.index',
            'reportes.ganancias.export',
            'productos.precios.gestionar',
            'productos.precios.calcular-ganancias',
            'productos.configuracion-ganancias',
        ];

        Permission::whereIn('name', $permisos)->delete();

        // Eliminar rol
        Role::where('name', 'precios-manager')->delete();
    }
};
