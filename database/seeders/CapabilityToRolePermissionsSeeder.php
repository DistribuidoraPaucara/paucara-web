<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

/**
 * ============================================
 * CAPABILITY TO ROLE PERMISSIONS SEEDER
 * Mapea capacidades abstractas a permisos Spatie reales
 * ============================================
 */
class CapabilityToRolePermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Mapear Capacidades a Permisos reales del sidebar
        $capacidadAPermisos = [
            'productos' => [
                'productos.manage',
                'categorias.manage',
                'marcas.manage',
                'unidades.manage',
                'tipos-precio.manage',
            ],
            'inventario' => [
                'inventario.dashboard',
                'inventario.stock-bajo',
                'inventario.proximos-vencer',
                'inventario.vencidos',
                'inventario.movimientos',
                'inventario.transferencias.index',
                'inventario.mermas.index',
                'inventario.ajuste.form',
                'inventario.tipos-ajuste.index',
                'inventario.analisis.manage', // ✅ NUEVO: Análisis ABC
            ],
            'ventas' => [
                'ventas.index',
                'ventas.create',
            ],
            'compras' => [
                'compras.index',
                'compras.create',
                'compras.cuentas-por-pagar.index',
                'compras.pagos.index',
                'compras.lotes-vencimientos.index',
                'compras.reportes.index',
            ],
            'empleados' => [
                'empleados.index',
                'empleados.create',
            ],
            'logistica' => [
                'envios.index',
                'envios.create',
                'inventario.vehiculos.index',
                'inventario.vehiculos.create',
            ],
            'proformas' => [
                'proformas.index',
            ],
            'cajas' => [
                'cajas.index',
            ],
            'reportes' => [
                'reportes.precios.index',
                'reportes.ganancias.index',
                'reportes.inventario.stock-actual',
                'reportes.inventario.movimientos',
                'reportes.inventario.rotacion',
                'reportes.inventario.vencimientos',
            ],
            'maestros' => [
                'almacenes.manage',
                'proveedores.manage',
                'clientes.manage',
                'localidades.manage',
                'monedas.manage',
                'tipos-pago.manage',
            ],
            'admin_usuarios' => [
                'usuarios.index',
            ],
            'admin_roles' => [
                'roles.index',
            ],
            'admin_config' => [
                'permissions.index',
            ],
            'admin_system' => [
                'admin.image-backup.manage',
            ],
            'contabilidad' => [],
        ];

        // Definir roles con sus capacidades (de CapabilityTemplatesSeeder)
        $roles = [
            'vendedor-basico' => ['ventas'],
            'vendedor-avanzado' => ['ventas', 'clientes'],
            'preventista' => ['ventas', 'clientes', 'reportes', 'cajas'],
            'comprador' => ['compras', 'maestros'],
            'gestor-inventario' => ['inventario', 'reportes'],
            'gestor-almacen' => ['inventario', 'logistica', 'maestros'],
            'chofer' => ['logistica'],
            'cajero' => ['cajas', 'ventas'],
            'contador' => ['contabilidad', 'reportes'],
            'gerente' => ['ventas', 'compras', 'empleados', 'inventario', 'logistica', 'cajas', 'reportes'],
            'admin-operaciones' => ['ventas', 'compras', 'productos', 'empleados', 'inventario', 'logistica', 'cajas', 'reportes', 'maestros'],
            'admin-sistema' => ['ventas', 'compras', 'productos', 'empleados', 'inventario', 'logistica', 'cajas', 'reportes', 'maestros', 'admin_usuarios', 'admin_roles', 'admin_config', 'admin_system'],
            'analista-reportes' => ['reportes', 'ventas', 'inventario'],
        ];

        foreach ($roles as $nombreRol => $capacidades) {
            $rol = Role::firstOrCreate(
                ['name' => $nombreRol],
                ['guard_name' => 'web']
            );

            // Recolectar permisos de las capacidades
            $permisosNombres = [];
            foreach ($capacidades as $capacidad) {
                if (isset($capacidadAPermisos[$capacidad])) {
                    $permisosNombres = array_merge($permisosNombres, $capacidadAPermisos[$capacidad]);
                }
            }

            // Remover duplicados
            $permisosNombres = array_unique($permisosNombres);

            // Obtener objetos Permission
            $permisosObjetos = Permission::whereIn('name', $permisosNombres)->get();

            // Asignar permisos al rol
            $rol->syncPermissions($permisosObjetos);

            $this->command->info("✅ Rol '{$nombreRol}' configurado con " . count($permisosObjetos) . " permisos");
        }

        $this->command->info('✅ Mapeo de capacidades a permisos completado.');
    }
}
