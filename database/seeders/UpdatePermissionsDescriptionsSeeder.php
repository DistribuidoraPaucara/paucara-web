<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class UpdatePermissionsDescriptionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()['cache.store']->forget('spatie.permission.cache');

        $descriptions = $this->getPermissionDescriptions();

        foreach ($descriptions as $permissionName => $description) {
            try {
                $permission = Permission::where('name', $permissionName)->first();
                if ($permission) {
                    $permission->update(['description' => $description]);
                    $this->command->line("✓ {$permissionName}");
                } else {
                    $this->command->warn("⚠ Permiso no encontrado: {$permissionName}");
                }
            } catch (\Exception $e) {
                $this->command->error("✗ Error actualizando {$permissionName}: " . $e->getMessage());
            }
        }

        $this->command->info('✅ Descripciones de permisos actualizadas');
    }

    private function getPermissionDescriptions(): array
    {
        return [
            // ===============================================
            // TIPOS-PRECIO
            // ===============================================
            'tipos-precio.index' => 'Ver listado de tipos de precio',
            'tipos-precio.create' => 'Crear nuevo tipo de precio',
            'tipos-precio.show' => 'Ver detalles de tipo de precio',
            'tipos-precio.edit' => 'Editar tipo de precio',
            'tipos-precio.delete' => 'Eliminar tipo de precio',
            'tipos-precio.toggle-activo' => 'Activar/desactivar tipo de precio',

            // ===============================================
            // PRODUCTOS
            // ===============================================
            'productos.precios.gestionar' => 'Gestionar precios de productos',
            'productos.precios.calcular-ganancias' => 'Calcular ganancias de productos',
            'productos.configuracion-ganancias' => 'Configurar ganancias de productos',
            'productos.index' => 'Ver listado de productos',
            'productos.create' => 'Crear nuevo producto',
            'productos.show' => 'Ver detalles de producto',
            'productos.edit' => 'Editar producto',
            'productos.delete' => 'Eliminar producto',

            // ===============================================
            // USUARIOS
            // ===============================================
            'usuarios.index' => 'Ver listado de usuarios',
            'usuarios.create' => 'Crear nuevo usuario',
            'usuarios.show' => 'Ver detalles de usuario',
            'usuarios.edit' => 'Editar usuario',
            'usuarios.delete' => 'Eliminar usuario',
            'usuarios.toggle-status' => 'Activar/desactivar usuario',
            'usuarios.manage-roles' => 'Asignar roles a usuarios',
            'usuarios.manage-permissions' => 'Asignar permisos a usuarios',

            // ===============================================
            // ROLES
            // ===============================================
            'roles.index' => 'Ver listado de roles',
            'roles.create' => 'Crear nuevo rol',
            'roles.show' => 'Ver detalles de rol',
            'roles.edit' => 'Editar rol',
            'roles.delete' => 'Eliminar rol',
            'roles.manage-permissions' => 'Asignar permisos a roles',

            // ===============================================
            // PERMISOS
            // ===============================================
            'permissions.create' => 'Crear nuevo permiso',
            'permissions.show' => 'Ver detalles de permiso',
            'permissions.edit' => 'Editar permiso',
            'permissions.delete' => 'Eliminar permiso',

            // ===============================================
            // CLIENTES
            // ===============================================
            'clientes.view' => 'Ver clientes',
            'clientes.view-all' => 'Ver todos los clientes',
            'clientes.create' => 'Crear cliente',
            'clientes.edit' => 'Editar cliente',
            'clientes.edit-own' => 'Editar propios clientes',
            'clientes.delete' => 'Eliminar cliente',
            'clientes.delete-own' => 'Eliminar propios clientes',
            'clientes.block' => 'Bloquear cliente',
            'clientes.block-own' => 'Bloquear propios clientes',
            'clientes.audit' => 'Ver auditoría de clientes',
            'clientes.audit-own' => 'Ver auditoría de propios clientes',
            'clientes.manage' => 'Gestionar clientes',
            'clientes.direcciones.create' => 'Crear direcciones de cliente',
            'clientes.direcciones.store' => 'Guardar direcciones de cliente',
            'clientes.direcciones.edit' => 'Editar direcciones de cliente',
            'clientes.direcciones.update' => 'Actualizar direcciones de cliente',
            'clientes.ventanas-entrega.index' => 'Ver ventanas de entrega del cliente',
            'clientes.ventanas-entrega.create' => 'Crear ventanas de entrega',
            'clientes.ventanas-entrega.store' => 'Guardar ventanas de entrega',
            'clientes.ventanas-entrega.edit' => 'Editar ventanas de entrega',
            'clientes.ventanas-entrega.destroy' => 'Eliminar ventanas de entrega',
            'clientes.fotos.index' => 'Ver fotos del cliente',
            'clientes.fotos.store' => 'Guardar fotos del cliente',
            'clientes.fotos.destroy' => 'Eliminar fotos del cliente',
            'clientes.cuentas-por-cobrar.index' => 'Ver cuentas por cobrar del cliente',

            // ===============================================
            // EMPRESAS
            // ===============================================
            'empresas.index' => 'Ver listado de empresas',
            'empresas.create' => 'Crear empresa',
            'empresas.show' => 'Ver detalles de empresa',
            'empresas.edit' => 'Editar empresa',
            'empresas.update' => 'Actualizar empresa',
            'empresas.delete' => 'Eliminar empresa',
            'empresas.manage' => 'Gestionar empresas',

            // ===============================================
            // VENTAS
            // ===============================================
            'ventas.store' => 'Crear venta',
            'ventas.show' => 'Ver detalles de venta',
            'ventas.edit' => 'Editar venta',
            'ventas.update' => 'Actualizar venta',
            'ventas.destroy' => 'Eliminar venta',
            'ventas.detalles.index' => 'Ver detalles de ventas',
            'ventas.detalles.update' => 'Actualizar detalles de venta',
            'ventas.detalles.destroy' => 'Eliminar detalles de venta',
            'ventas.verificar-stock' => 'Verificar stock en ventas',
            'ventas.stock.bajo' => 'Ver stock bajo',
            'ventas.stock.producto' => 'Ver stock de producto',
            'ventas.stock.verificar' => 'Verificar stock',

            // ===============================================
            // PROFORMAS
            // ===============================================
            'proformas.index' => 'Ver listado de proformas',
            'proformas.show' => 'Ver detalles de proforma',
            'proformas.aprobar' => 'Aprobar proforma',
            'proformas.rechazar' => 'Rechazar proforma',

            // ===============================================
            // COMPRAS
            // ===============================================
            'compras.index' => 'Ver listado de compras',
            'compras.create' => 'Crear compra',
            'compras.store' => 'Guardar compra',
            'compras.show' => 'Ver detalles de compra',
            'compras.edit' => 'Editar compra',
            'compras.update' => 'Actualizar compra',
            'compras.destroy' => 'Eliminar compra',
            'compras.detalles.store' => 'Guardar detalles de compra',
            'compras.detalles.update' => 'Actualizar detalles de compra',
            'compras.detalles.destroy' => 'Eliminar detalles de compra',
            'compras.cuentas-por-pagar.index' => 'Ver cuentas por pagar',

            // ===============================================
            // REPORTES
            // ===============================================
            'reportes.precios.index' => 'Ver reporte de precios',
            'reportes.precios.export' => 'Exportar reporte de precios',
            'reportes.ganancias.index' => 'Ver reporte de ganancias',
            'reportes.ganancias.export' => 'Exportar reporte de ganancias',

            // ===============================================
            // ENVÍOS
            // ===============================================
            'envios.index' => 'Ver listado de envíos',
            'envios.create' => 'Crear envío',
            'envios.store' => 'Guardar envío',
            'envios.show' => 'Ver detalles de envío',
            'envios.edit' => 'Editar envío',
            'envios.update' => 'Actualizar envío',
            'envios.destroy' => 'Eliminar envío',
            'envios.programar' => 'Programar envío',
            'envios.cancelar' => 'Cancelar envío',
            'envios.confirmar-entrega' => 'Confirmar entrega',
            'envios.confirmar-salida' => 'Confirmar salida',

            // ===============================================
            // CAJAS
            // ===============================================
            'cajas.index' => 'Ver listado de cajas',
            'cajas.crear' => 'Crear caja',
            'cajas.aperturar' => 'Abrir caja',
            'cajas.cerrar' => 'Cerrar caja',
            'cajas.movimientos' => 'Ver movimientos de caja',
            'cajas.arqueo' => 'Realizar arqueo de caja',

            // ===============================================
            // INVENTARIO
            // ===============================================
            'inventario.index' => 'Ver inventario',
            'inventario.ajuste' => 'Realizar ajustes de inventario',
            'inventario.reporte' => 'Ver reporte de inventario',

            // ===============================================
            // LOGÍSTICA
            // ===============================================
            'logistica.entregas.index' => 'Ver entregas',
            'logistica.entregas.crear' => 'Crear entrega',
            'logistica.entregas.editar' => 'Editar entrega',
            'logistica.entregas.eliminar' => 'Eliminar entrega',
            'logistica.rutas.index' => 'Ver rutas',
            'logistica.rutas.crear' => 'Crear ruta',

            // ===============================================
            // ADMIN
            // ===============================================
            'admin.system' => 'Acceso a configuración de sistema',
            'admin.dashboard' => 'Ver dashboard administrativo',

            // ===============================================
            // EMPLEADOS
            // ===============================================
            'empleados.index' => 'Ver listado de empleados',
            'empleados.create' => 'Crear empleado',
            'empleados.show' => 'Ver detalles de empleado',
            'empleados.edit' => 'Editar empleado',
            'empleados.delete' => 'Eliminar empleado',
            'empleados.toggle-estado' => 'Cambiar estado de empleado',
            'empleados.toggle-acceso-sistema' => 'Habilitar/deshabilitar acceso al sistema',
        ];
    }
}
