<?php

namespace Database\Seeders;

use App\Models\ModuloSidebar;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PrestamosSidebarSeeder extends Seeder
{
    /**
     * Seeder específico para las rutas del módulo de préstamos.
     *
     * Agrupa en un solo módulo principal:
     * - Préstamos a clientes
     * - Préstamos a proveedores
     * - Compras de prestables
     * - Ventas de prestables
     * - Prestables
     * - Stock
     * - Historial de ajustes
     * - Movimientos de ajustes
     */
    public function run(): void
    {
        $maxOrden = ModuloSidebar::max('orden') ?? 0;

        $moduloPrestamos = ModuloSidebar::updateOrCreate(
            [
                'titulo' => 'Préstamos',
                'ruta' => '/prestamos',
                'es_submenu' => false,
            ],
            [
                'icono' => 'HandCoins',
                'descripcion' => 'Gestión de préstamos a clientes, proveedores y ajustes',
                'orden' => $maxOrden + 1,
                'activo' => true,
                'categoria' => 'Finanzas',
                'visible_dashboard' => true,
                'modulo_padre_id' => null,
                'permisos' => ['prestamos.index'],
            ]
        );

        $submenu = [
            [
                'titulo' => 'Dashboard',
                'ruta' => '/prestamos',
                'icono' => 'BarChart3',
                'orden' => 1,
                'permisos' => ['prestamos.index'],
            ],
            [
                'titulo' => 'Prestables',
                'ruta' => '/prestamos/prestables',
                'icono' => 'Package2',
                'orden' => 2,
                'permisos' => ['prestamos.prestables'],
            ],
            [
                'titulo' => 'Stock',
                'ruta' => '/prestamos/stock',
                'icono' => 'Package',
                'orden' => 3,
                'permisos' => ['prestamos.stock'],
            ],
            [
                'titulo' => 'Préstamos a Clientes',
                'ruta' => '/prestamos/clientes',
                'icono' => 'Users',
                'orden' => 4,
                'permisos' => ['prestamos.clientes.index'],
            ],
            [
                'titulo' => 'Préstamos a Proveedores',
                'ruta' => '/prestamos/proveedores',
                'icono' => 'Truck',
                'orden' => 5,
                'permisos' => ['prestamos.proveedores.index'],
            ],
            [
                'titulo' => 'Compras de Prestables',
                'ruta' => '/prestamos/compras',
                'icono' => 'ShoppingBag',
                'orden' => 6,
                'permisos' => ['prestamos.compras.listado'],
            ],
            [
                'titulo' => 'Ventas de Prestables',
                'ruta' => '/prestamos/ventas',
                'icono' => 'ShoppingCart',
                'orden' => 7,
                'permisos' => ['prestamos.ventas.listado'],
            ],
            // Gestion de alertas para la ruta ->> prestamos/alertas
            [
                'titulo' => 'Alertas',
                'ruta' => '/prestamos/alertas',
                'icono' => 'AlertCircle',
                'orden' => 8,
                'permisos' => ['prestamos.alertas'],
            ],
            [
                'titulo' => 'Historial de Ajustes',
                'ruta' => '/prestamos/ajustes/historial',
                'icono' => 'History',
                'orden' => 8,
                'permisos' => ['prestamos.ajustes.historial'],
            ],
            [
                'titulo' => 'Movimientos de Ajustes',
                'ruta' => '/prestamos/ajustes/movimientos',
                'icono' => 'ArrowUpDown',
                'orden' => 9,
                'permisos' => ['prestamos.ajustes.movimientos'],
            ],
        ];

        foreach ($submenu as $item) {
            ModuloSidebar::updateOrCreate(
                [
                    'titulo' => $item['titulo'],
                    'ruta' => $item['ruta'],
                    'es_submenu' => true,
                    'modulo_padre_id' => $moduloPrestamos->id,
                ],
                [
                    'icono' => $item['icono'],
                    'descripcion' => null,
                    'orden' => $item['orden'],
                    'activo' => true,
                    'categoria' => 'Finanzas',
                    'visible_dashboard' => false,
                    'permisos' => $item['permisos'],
                ]
            );
        }

        $this->asegurarPermisosParaAdmin($submenu);

        $this->command?->info('✅ Módulos de Préstamos creados o actualizados exitosamente');
    }

    /**
     * Crea los permisos faltantes y los asigna al rol admin sin borrar otros permisos.
     */
    private function asegurarPermisosParaAdmin(array $submenu): void
    {
        $permisoNombres = ['prestamos.index'];

        foreach ($submenu as $item) {
            foreach ($item['permisos'] ?? [] as $permiso) {
                $permisoNombres[] = $permiso;
            }
        }

        $permisoNombres = array_values(array_unique($permisoNombres));

        // ✅ MEJORADO (2026-04-16): Crear permisos con tracking
        $permisosCreados = 0;
        foreach ($permisoNombres as $permisoNombre) {
            $permiso = Permission::firstOrCreate(
                ['name' => $permisoNombre, 'guard_name' => 'web']
            );
            if ($permiso->wasRecentlyCreated) {
                $permisosCreados++;
            }
        }

        // ✅ MEJORADO (2026-04-16): Asignar permisos a roles admin y Super Admin
        $admin = Role::firstOrCreate(['name' => 'admin'], ['guard_name' => 'web']);
        $admin->syncPermissions($permisoNombres); // syncPermissions = reemplaza todos los permisos

        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin'], ['guard_name' => 'web']);
        $superAdmin->syncPermissions($permisoNombres);

        $this->command?->info("✅ Permisos de Préstamos: {$permisosCreados} creados, " . count($permisoNombres) . " total asignado a admin");
    }
}