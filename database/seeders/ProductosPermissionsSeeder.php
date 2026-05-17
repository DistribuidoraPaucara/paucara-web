<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class ProductosPermissionsSeeder extends Seeder
{
    /**
     * Crea los permisos para la gestión de productos
     *
     * ✅ NUEVO (2026-03-30): Permisos para gestión de productos
     * - Estrategia: TODOS PUEDEN por defecto, solo remover a usuarios específicos
     *
     * Permisos:
     * 1. ver_precio_costo: Ver precio de costo en listados y formularios
     * 2. productos.edit: Editar productos (acceso a formulario de edición)
     * 3. productos.delete: Eliminar productos
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()['cache.store']->forget('spatie.permission.cache');

        // ============================================
        // CREAR PERMISOS DE PRODUCTOS
        // ============================================
        $permisos = [
            [
                'name' => 'ver_precio_costo',
                'description' => 'Permite ver el precio de costo de productos en listado, tabla y formularios'
            ],
            [
                'name' => 'productos.edit',
                'description' => 'Permite editar productos y acceder al formulario de edición'
            ],
            [
                'name' => 'productos.delete',
                'description' => 'Permite eliminar productos del sistema'
            ],
        ];

        $permisosCreados = [];
        foreach ($permisos as $permisoData) {
            $permiso = Permission::firstOrCreate(
                ['name' => $permisoData['name']],
                ['description' => $permisoData['description']]
            );
            $permisosCreados[] = $permiso;
            $this->command->info("✅ Permiso '{$permisoData['name']}' creado en BD");
        }

        // ============================================
        // ASIGNAR A TODOS LOS USUARIOS
        // (Estrategia: Todos pueden por defecto)
        // ============================================
        $usuarios = User::all();
        $contadorPorPermiso = array_fill(0, count($permisosCreados), 0);

        foreach ($usuarios as $usuario) {
            foreach ($permisosCreados as $index => $permiso) {
                if (!$usuario->hasPermissionTo($permiso)) {
                    $usuario->givePermissionTo($permiso);
                    $contadorPorPermiso[$index]++;
                }
            }
        }

        // ============================================
        // REPORTE FINAL
        // ============================================
        app()['cache.store']->forget('spatie.permission.cache');

        $this->command->info('');
        $this->command->info('✅ Seeder ProductosPermissionsSeeder ejecutado correctamente');
        $this->command->line('');

        foreach ($permisos as $index => $permisoData) {
            $this->command->info("  📌 {$permisoData['name']}: {$contadorPorPermiso[$index]} usuarios");
        }

        $this->command->line('');
        $this->command->info('📝 ESTRATEGIA: Todos pueden por defecto');
        $this->command->info('🔑 Para bloquear un usuario específico:');
        $this->command->line('');
        $this->command->line('   php artisan tinker');
        $this->command->line('   >>> $user = User::find(ID_DEL_USUARIO)');
        $this->command->line('   >>> $user->revokePermissionTo("ver_precio_costo")    # No ver precio costo');
        $this->command->line('   >>> $user->revokePermissionTo("productos.edit")      # No editar');
        $this->command->line('   >>> $user->revokePermissionTo("productos.delete")    # No eliminar');
        $this->command->line('');
    }
}
