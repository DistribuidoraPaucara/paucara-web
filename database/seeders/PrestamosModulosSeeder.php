<?php

namespace Database\Seeders;

use App\Models\ModuloSidebar;
use Illuminate\Database\Seeder;

class PrestamosModulosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener el orden máximo actual para agregar nuevos módulos al final
        $maxOrden = ModuloSidebar::max('orden') ?? 0;

        // Crear módulo padre "Préstamos"
        $moduloPrestamos = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Préstamos'],
            [
                'ruta' => null,
                'icono' => 'Package2',
                'descripcion' => 'Gestión de préstamos a clientes y proveedores',
                'orden' => $maxOrden + 1,
                'activo' => true,
                'es_submenu' => false,
                'modulo_padre_id' => null,
                'categoria' => 'operaciones',
                'visible_dashboard' => true,
                'permisos' => [],
            ]
        );

        // Crear submódulos bajo "Préstamos"
        ModuloSidebar::firstOrCreate(
            ['titulo' => 'Dashboard', 'modulo_padre_id' => $moduloPrestamos->id],
            [
                'ruta' => '/prestamos/dashboard',
                'icono' => 'BarChart3',
                'descripcion' => 'Dashboard con métricas y KPIs de préstamos',
                'orden' => 1,
                'activo' => true,
                'es_submenu' => true,
                'categoria' => 'operaciones',
                'visible_dashboard' => false,
                'permisos' => [],
            ]
        );

        ModuloSidebar::firstOrCreate(
            ['titulo' => 'Stock', 'modulo_padre_id' => $moduloPrestamos->id],
            [
                'ruta' => '/prestamos/stock',
                'icono' => 'Package',
                'descripcion' => 'Visualización de stock y distribución',
                'orden' => 2,
                'activo' => true,
                'es_submenu' => true,
                'categoria' => 'operaciones',
                'visible_dashboard' => false,
                'permisos' => [],
            ]
        );

        ModuloSidebar::firstOrCreate(
            ['titulo' => 'Alertas', 'modulo_padre_id' => $moduloPrestamos->id],
            [
                'ruta' => '/prestamos/alertas',
                'icono' => 'AlertCircle',
                'descripcion' => 'Gestión de alertas y devoluciones vencidas',
                'orden' => 3,
                'activo' => true,
                'es_submenu' => true,
                'categoria' => 'operaciones',
                'visible_dashboard' => false,
                'permisos' => [],
            ]
        );

        ModuloSidebar::firstOrCreate(
            ['titulo' => 'Gestión de Prestables', 'modulo_padre_id' => $moduloPrestamos->id],
            [
                'ruta' => '/prestamos/prestables',
                'icono' => 'Boxes',
                'descripcion' => 'Administración de prestables por cliente, evento y proveedor',
                'orden' => 4,
                'activo' => true,
                'es_submenu' => true,
                'categoria' => 'operaciones',
                'visible_dashboard' => false,
                'permisos' => [],
            ]
        );

        $this->command->info('✅ Módulos de Préstamos creados exitosamente');
    }
}
