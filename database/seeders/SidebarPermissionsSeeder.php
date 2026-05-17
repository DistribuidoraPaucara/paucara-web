<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

/**
 * ============================================
 * SIDEBAR PERMISSIONS SEEDER
 * Crea todos los permisos necesarios para el sidebar
 * ============================================
 */
class SidebarPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Definir TODOS los permisos necesarios para el sidebar
        $permisos = [
            // ===== PRODUCTOS =====
            'productos.manage',
            'categorias.manage',
            'marcas.manage',
            'unidades.manage',
            'tipos-precio.manage',

            // ===== INVENTARIO =====
            'inventario.dashboard',
            'inventario.stock-bajo',
            'inventario.proximos-vencer',
            'inventario.vencidos',
            'inventario.movimientos',
            'inventario.transferencias.index',
            'inventario.mermas.index',
            'inventario.ajuste.form',
            'inventario.tipos-ajuste.index',

            // ===== VENTAS =====
            'ventas.index',
            'ventas.create',

            // ===== COMPRAS =====
            'compras.index',
            'compras.create',
            'compras.cuentas-por-pagar.index',
            'compras.pagos.index',
            'compras.lotes-vencimientos.index',
            'compras.reportes.index',

            // ===== EMPLEADOS =====
            'empleados.index',
            'empleados.create',

            // ===== LOGÍSTICA =====
            'envios.index',
            'envios.create',
            'inventario.vehiculos.index',
            'inventario.vehiculos.create',

            // ===== PROFORMAS =====
            'proformas.index',

            // ===== REPORTES =====
            'reportes.precios.index',
            'reportes.ganancias.index',
            'reportes.inventario.stock-actual',
            'reportes.inventario.movimientos',
            'reportes.inventario.rotacion',
            'reportes.inventario.vencimientos',

            // ===== FINANZAS =====
            'cajas.index',

            // ===== MAESTROS =====
            'almacenes.manage',
            'proveedores.manage',
            'clientes.manage',
            'localidades.manage',
            'monedas.manage',
            'tipos-pago.manage',

            // ===== ADMINISTRACIÓN =====
            'usuarios.index',
            'roles.index',
            'permissions.index',
            'admin.image-backup.manage',
        ];

        foreach ($permisos as $nombre) {
            Permission::firstOrCreate(
                ['name' => $nombre],
                ['guard_name' => 'web']
            );
        }

        $this->command->info('✅ ' . count($permisos) . ' permisos del sidebar creados correctamente.');
    }
}
